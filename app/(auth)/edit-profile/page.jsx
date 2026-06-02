// app/coach/profile/edit/page.jsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import {
  ArrowLeftIcon,
  UserIcon,
  PhoneIcon,
  MapPinIcon,
  TrophyIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  CameraIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

// Move InputField outside the main component
const InputField = ({ label, name, type = "text", icon: Icon, placeholder, required, options, value, error, onChange }) => {
  const isSelect = type === "select";
  
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[0.75rem] font-medium tracking-[0.06em] uppercase text-[rgba(240,230,200,0.5)]">
        {label} {required && <span className="text-[#d4af64]">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <span className="absolute top-1/2 left-4 -translate-y-1/2 pointer-events-none transition-colors duration-200 flex items-center text-[rgba(240,230,200,0.25)]">
            <Icon className="w-4 h-4" />
          </span>
        )}
        {isSelect ? (
          <select
            name={name}
            value={value}
            onChange={onChange}
            className={`w-full py-3.5 px-4 ${Icon ? 'pl-11' : 'pl-4'} pr-3 bg-[rgba(255,255,255,0.03)] border rounded-lg outline-none text-[#f0e6c8] text-[0.9375rem] font-['DM_Sans',sans-serif] font-light transition-all duration-200 box-border focus:border-[rgba(212,175,100,0.45)] focus:bg-[rgba(212,175,100,0.04)] focus:shadow-[0_0_0_3px_rgba(212,175,100,0.07)] ${error ? "border-[rgba(255,100,100,0.4)]" : "border-[rgba(240,230,200,0.1)]"} appearance-none`}
          >
            {options.map(opt => (
              <option key={opt.value} value={opt.value} className="bg-[#0f0f12] text-[#f0e6c8]">
                {opt.label}
              </option>
            ))}
          </select>
        ) : type === "textarea" ? (
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            rows={4}
            maxLength={500}
            placeholder={placeholder}
            className={`w-full py-3.5 px-4 ${Icon ? 'pl-11' : 'pl-4'} bg-[rgba(255,255,255,0.03)] border rounded-lg outline-none text-[#f0e6c8] text-[0.9375rem] font-['DM_Sans',sans-serif] font-light transition-all duration-200 box-border placeholder:text-[rgba(240,230,200,0.2)] focus:border-[rgba(212,175,100,0.45)] focus:bg-[rgba(212,175,100,0.04)] focus:shadow-[0_0_0_3px_rgba(212,175,100,0.07)] resize-none ${error ? "border-[rgba(255,100,100,0.4)]" : "border-[rgba(240,230,200,0.1)]"}`}
          />
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full py-3.5 px-4 ${Icon ? 'pl-11' : 'pl-4'} bg-[rgba(255,255,255,0.03)] border rounded-lg outline-none text-[#f0e6c8] text-[0.9375rem] font-['DM_Sans',sans-serif] font-light transition-all duration-200 box-border placeholder:text-[rgba(240,230,200,0.2)] focus:border-[rgba(212,175,100,0.45)] focus:bg-[rgba(212,175,100,0.04)] focus:shadow-[0_0_0_3px_rgba(212,175,100,0.07)] ${error ? "border-[rgba(255,100,100,0.4)]" : "border-[rgba(240,230,200,0.1)]"}`}
          />
        )}
      </div>
      {error && <span className="text-[0.75rem] text-[#fc8181] mt-0.5">{error}</span>}
    </div>
  );
};

export default function EditProfilePage() {
  const router = useRouter();
  const { user, accessToken, profile, getProfile } = useAuth();
  
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    sport: "",
    level: "",
    club: "",
    specialization: "",
    address: "",
    bio: "",
    phone: ""
  });
  
  const [originalData, setOriginalData] = useState({});
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  useEffect(() => {
    // Load user profile data
    if (profile) {
      const data = {
        fullName: profile.fullName || "",
        age: profile.age || "",
        sport: profile.sport || "",
        level: profile.level || "",
        club: profile.club || "",
        specialization: profile.specialization || "",
        address: profile.address || "",
        bio: profile.bio || "",
        phone: user?.phone || ""
      };
      setFormData(data);
      setOriginalData(data);
    }
  }, [profile, user]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    
    if (formData.fullName && formData.fullName.length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters";
    }
    
    if (formData.age && (formData.age < 16 || formData.age > 100)) {
      newErrors.age = "Age must be between 16 and 100";
    }
    
    if (formData.phone && !/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }
    
    if (formData.bio && formData.bio.length > 500) {
      newErrors.bio = "Bio must be less than 500 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  }, [errors]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors({ image: "Please select an image file" });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors({ image: "Image must be less than 5MB" });
      return;
    }

    setUploadingImage(true);
    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await axios.post(`/api/upload`, fd);
      setProfilePicture(res.data.url);
      setProfilePicturePreview(res.data.url);
      setErrors(prev => ({ ...prev, image: "" }));
    } catch (error) {
      console.error("Error uploading image:", error);
      setErrors({ image: "Failed to upload image" });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const updateData = {
        ...formData,
        profilePictureUrl: profilePicture || profile?.profilePictureUrl
      };
      
      const response = await axios.put(`${API_BASE_URL}/profile/me`, updateData, {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
      });
      
      if (response.data.success) {
        await getProfile();
        setShowSuccess(true);
        setTimeout(() => {
          router.push(`/${user?.role?.toLowerCase()}/dashboard`);
        }, 2000);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrors({ submit: error.response?.data?.message || "Failed to update profile" });
    } finally {
      setIsLoading(false);
    }
  };

  const hasChanges = useCallback(() => {
    return JSON.stringify(formData) !== JSON.stringify(originalData) || profilePicture !== null;
  }, [formData, originalData, profilePicture]);

  return (
    <div className="min-h-screen bg-[#0c0c0e] font-['DM_Sans',sans-serif]">
      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowSuccess(false)} />
          <div className="relative bg-[#0f0f12] border border-[rgba(212,175,100,0.15)] rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slideDown">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-[rgba(52,199,89,0.1)] flex items-center justify-center mb-4 border border-[rgba(52,199,89,0.2)]">
                <CheckCircleIcon className="w-6 h-6 text-[#4ade80]" />
              </div>
              <h3 className="font-display text-xl font-medium text-[#f0e6c8] mb-2">Profile Updated!</h3>
              <p className="text-[rgba(240,230,200,0.6)] font-body text-sm">Your profile has been updated successfully.</p>
              <p className="text-sm text-[rgba(240,230,200,0.35)] mt-3">Redirecting to dashboard...</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto py-12 px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[rgba(240,230,200,0.5)] hover:text-[#d4af64] transition-colors duration-200 mb-4 group"
          >
            <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-sm font-body">Back to Dashboard</span>
          </button>
          <h1 className="font-display text-4xl font-light text-[#f0e6c8]">
            Edit Profile
          </h1>
          <div className="w-12 h-px bg-gradient-to-r from-[#d4af64] to-transparent my-4" />
          <p className="text-[rgba(240,230,200,0.4)] font-body text-sm">
            Update your personal information and professional details
          </p>
        </div>

        {/* Profile Picture Section */}
        <div className="bg-[#0f0f12] rounded-2xl border border-[rgba(212,175,100,0.1)] p-8 mb-6">
          <div className="flex flex-col items-center">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[rgba(212,175,100,0.2)] to-[rgba(212,175,100,0.05)] flex items-center justify-center border-2 border-[rgba(212,175,100,0.3)] overflow-hidden">
                {profilePicturePreview || profile?.profilePictureUrl ? (
                  <img 
                    src={profilePicturePreview || profile?.profilePictureUrl} 
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl text-[#d4af64] font-display font-semibold">
                    {formData.fullName?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase()}
                  </span>
                )}
              </div>
              <label className="absolute bottom-0 right-0 p-2 bg-gradient-to-r from-[#d4af64] to-[#c49a40] rounded-full cursor-pointer shadow-lg hover:scale-110 transition-transform duration-200">
                <CameraIcon className="w-4 h-4 text-[#0c0c0e]" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
            {errors.image && (
              <p className="text-[0.75rem] text-[#fc8181] mt-2">{errors.image}</p>
            )}
            {uploadingImage && (
              <p className="text-[0.75rem] text-[#d4af64] mt-2">Uploading image...</p>
            )}
            <p className="text-xs text-[rgba(240,230,200,0.35)] mt-3">
              Click the camera icon to change profile picture (Max 5MB)
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-[#0f0f12] rounded-2xl border border-[rgba(212,175,100,0.1)] p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Personal Information Section */}
            <div className="mb-6">
              <h2 className="font-display text-lg font-medium text-[#f0e6c8] mb-2">Personal Information</h2>
              <div className="w-8 h-px bg-gradient-to-r from-[#d4af64] to-transparent mb-4" />
            </div>

            {/* Full Name */}
            <InputField
              label="Full Name"
              name="fullName"
              icon={UserIcon}
              placeholder="Your full name"
              value={formData.fullName}
              error={errors.fullName}
              onChange={handleChange}
            />

            {/* Age */}
            <InputField
              label="Age"
              name="age"
              type="number"
              icon={UserIcon}
              placeholder="Your age"
              value={formData.age}
              error={errors.age}
              onChange={handleChange}
            />

            {/* Phone */}
            <InputField
              label="Phone Number"
              name="phone"
              type="tel"
              icon={PhoneIcon}
              placeholder="+1 234 567 8900"
              value={formData.phone}
              error={errors.phone}
              onChange={handleChange}
            />

            {/* Address */}
            <InputField
              label="Address"
              name="address"
              icon={MapPinIcon}
              placeholder="Your location"
              value={formData.address}
              error={errors.address}
              onChange={handleChange}
            />

            {/* Professional Information Section */}
            <div className="mt-8 mb-6">
              <h2 className="font-display text-lg font-medium text-[#f0e6c8] mb-2">Professional Information</h2>
              <div className="w-8 h-px bg-gradient-to-r from-[#d4af64] to-transparent mb-4" />
            </div>

            {/* Sport */}
            <InputField
              label="Sport"
              name="sport"
              type="select"
              icon={TrophyIcon}
              options={[
                { value: "", label: "Select sport" },
                { value: "CRICKET", label: "Cricket" },
                { value: "FOOTBALL", label: "Football" },
              ]}
              value={formData.sport}
              error={errors.sport}
              onChange={handleChange}
            />

            {/* Level */}
            <InputField
              label="Level"
              name="level"
              type="select"
              icon={AcademicCapIcon}
              options={[
                { value: "", label: "Select level" },
                { value: "DISTRICT", label: "DISTRICT" },
                { value: "STATE", label: "STATE" },
                { value: "NATIONAL", label: "NATIONAL" },
              ]}
              value={formData.level}
              error={errors.level}
              onChange={handleChange}
            />

            {/* Club/Organization (for coaches) */}
            {user?.role === "COACH" && (
              <InputField
                label="Club/Organization"
                name="club"
                icon={BriefcaseIcon}
                placeholder="Your affiliated club or organization"
                value={formData.club}
                error={errors.club}
                onChange={handleChange}
              />
            )}

            {/* Bio Section */}
            <div className="mt-8 mb-6">
              <h2 className="font-display text-lg font-medium text-[#f0e6c8] mb-2">About You</h2>
              <div className="w-8 h-px bg-gradient-to-r from-[#d4af64] to-transparent mb-4" />
            </div>

            {/* Bio */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.75rem] font-medium tracking-[0.06em] uppercase text-[rgba(240,230,200,0.5)]">
                Bio
              </label>
              <div className="relative">
                <span className="absolute top-4 left-4 pointer-events-none transition-colors duration-200 flex items-start text-[rgba(240,230,200,0.25)]">
                  <DocumentTextIcon className="w-4 h-4" />
                </span>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={5}
                  maxLength={500}
                  placeholder="Tell us about yourself, your experience, coaching philosophy, achievements, etc."
                  className="w-full py-3.5 px-4 pl-11 bg-[rgba(255,255,255,0.03)] border border-[rgba(240,230,200,0.1)] rounded-lg outline-none text-[#f0e6c8] text-[0.9375rem] font-['DM_Sans',sans-serif] font-light transition-all duration-200 box-border placeholder:text-[rgba(240,230,200,0.2)] focus:border-[rgba(212,175,100,0.45)] focus:bg-[rgba(212,175,100,0.04)] focus:shadow-[0_0_0_3px_rgba(212,175,100,0.07)] resize-none"
                />
              </div>
              <div className="flex justify-between items-center">
                <p className="text-xs text-[rgba(240,230,200,0.35)]">
                  Share your background and expertise
                </p>
                <p className={`text-xs ${formData.bio?.length > 450 ? 'text-[#d4af64]' : 'text-[rgba(240,230,200,0.35)]'}`}>
                  {formData.bio?.length || 0}/500 characters
                </p>
              </div>
            </div>

            {/* Submit error */}
            {errors.submit && (
              <div className="flex items-start gap-2 bg-[rgba(255,100,100,0.07)] border border-[rgba(255,100,100,0.18)] p-3 rounded-lg text-[0.8125rem] text-[#fc8181] leading-relaxed">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="mt-px flex-shrink-0">
                  <circle cx="7" cy="7" r="6.5" stroke="#fc8181" strokeOpacity="0.5"/>
                  <path d="M7 4v3.5M7 9.5v.5" stroke="#fc8181" strokeWidth="1.25" strokeLinecap="round"/>
                </svg>
                {errors.submit}
              </div>
            )}

            {/* Form Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-4 py-3 text-sm font-body text-[rgba(240,230,200,0.7)] border border-[rgba(212,175,100,0.2)] rounded-lg hover:border-[rgba(212,175,100,0.4)] hover:text-[#d4af64] hover:bg-[rgba(212,175,100,0.05)] transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !hasChanges() || uploadingImage}
                className="flex-1 relative overflow-hidden py-3 bg-gradient-to-r from-[#c49a40] via-[#d4af64] to-[#c49a40] bg-[length:200%_100%] bg-[position:100%_0] border-none rounded-lg cursor-pointer text-[#0c0c0e] font-['DM_Sans',sans-serif] text-[0.9375rem] font-medium tracking-[0.03em] transition-all duration-400 ease-out hover:bg-[position:0_0] hover:-translate-y-px hover:shadow-[0_8px_32px_rgba(212,175,100,0.3)] active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <div className="flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <div className="w-[18px] h-[18px] border-2 border-[rgba(12,12,14,0.2)] border-t-[#0c0c0e] rounded-full animate-spin" />
                      Saving Changes...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </div>
              </button>
            </div>

            {/* Unsaved changes indicator */}
            {hasChanges() && !isLoading && (
              <p className="text-center text-xs text-[#d4af64] mt-3">
                You have unsaved changes
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}