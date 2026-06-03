// app/complete-profile/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { AlertCircle, Briefcase, Building, Calendar, Camera, Check, ChevronDown, FileText, Flag, MapPin, Shield, Trophy, Upload, User, X } from "lucide-react";
import { FcSportsMode } from "react-icons/fc";


// ── Reusable Field wrapper ───────────────────────────────────────────────────
function Field({ label, optional, error, hint, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[0.6875rem] font-medium tracking-[0.08em] uppercase text-[rgba(240,230,200,0.45)] flex items-center gap-1.5">
        {label}
        {optional && <span className="normal-case tracking-normal font-light text-[rgba(240,230,200,0.22)]">(optional)</span>}
      </label>
      {children}
      {error && <span className="text-[0.75rem] text-red-400 flex items-center gap-1"><span>·</span>{error}</span>}
      {hint && !error && <span className="text-[0.75rem] text-[rgba(240,230,200,0.3)] font-light">{hint}</span>}
    </div>
  );
}

// ── Input ────────────────────────────────────────────────────────────────────
function Input({ icon, error, className = "", ...props }) {
  return (
    <div className="relative">
      {icon && (
        <span className="absolute top-1/2 left-3.5 -translate-y-1/2 pointer-events-none text-[rgba(240,230,200,0.25)]">
          {icon}
        </span>
      )}
      <input
        {...props}
        className={[
          "w-full py-[0.875rem] text-[0.9rem] font-light rounded-[10px] outline-none transition-all duration-200",
          "bg-white/[0.03] border text-[#f0e6c8] placeholder:text-[rgba(240,230,200,0.18)]",
          "focus:bg-[rgba(212,175,100,0.04)] focus:border-[rgba(212,175,100,0.45)] focus:shadow-[0_0_0_3px_rgba(212,175,100,0.07)]",
          icon ? "pl-10 pr-4" : "px-4",
          error ? "border-[rgba(255,100,100,0.4)]" : "border-[rgba(240,230,200,0.1)]",
          className,
        ].join(" ")}
      />
    </div>
  );
}

// ── Textarea ─────────────────────────────────────────────────────────────────
function Textarea({ icon, error, ...props }) {
  return (
    <div className="relative">
      {icon && (
        <span className="absolute top-3.5 left-3.5 pointer-events-none text-[rgba(240,230,200,0.25)]">
          {icon}
        </span>
      )}
      <textarea
        {...props}
        className={[
          "w-full py-3 text-[0.9rem] font-light rounded-[10px] outline-none transition-all duration-200 resize-none",
          "bg-white/[0.03] border text-[#f0e6c8] placeholder:text-[rgba(240,230,200,0.18)]",
          "focus:bg-[rgba(212,175,100,0.04)] focus:border-[rgba(212,175,100,0.45)] focus:shadow-[0_0_0_3px_rgba(212,175,100,0.07)]",
          icon ? "pl-10 pr-4" : "px-4",
          error ? "border-[rgba(255,100,100,0.4)]" : "border-[rgba(240,230,200,0.1)]",
        ].join(" ")}
      />
    </div>
  );
}

// ── Select ───────────────────────────────────────────────────────────────────
function Select({ icon, error, children, ...props }) {
  return (
    <div className="relative">
      {icon && (
        <span className="absolute top-1/2 left-3.5 -translate-y-1/2 pointer-events-none text-[rgba(240,230,200,0.25)]">
          {icon}
        </span>
      )}
      <select
        {...props}
        className={[
          "w-full py-[0.875rem] text-[0.9rem] font-light rounded-[10px] outline-none transition-all duration-200 appearance-none cursor-pointer",
          "bg-[#131316] border text-[#f0e6c8]",
          "focus:bg-[rgba(212,175,100,0.04)] focus:border-[rgba(212,175,100,0.45)] focus:shadow-[0_0_0_3px_rgba(212,175,100,0.07)]",
          icon ? "pl-10 pr-9" : "px-4 pr-9",
          error ? "border-[rgba(255,100,100,0.4)]" : "border-[rgba(240,230,200,0.1)]",
        ].join(" ")}
      >
        {children}
      </select>
      <span className="absolute top-1/2 right-3 -translate-y-1/2 pointer-events-none text-[rgba(240,230,200,0.3)]">
        <ChevronDown />
      </span>
    </div>
  );
}

// ── Section divider ──────────────────────────────────────────────────────────
function SectionHeading({ step, label, sub }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-7 h-7 rounded-lg bg-[rgba(212,175,100,0.12)] border border-[rgba(212,175,100,0.2)] flex items-center justify-center flex-shrink-0">
        <span className="text-[0.6875rem] font-medium text-[#d4af64]">{step}</span>
      </div>
      <div>
        <p className="text-[0.9rem] font-medium text-[#f0e6c8] leading-none">{label}</p>
        {sub && <p className="text-[0.75rem] text-[rgba(240,230,200,0.35)] font-light mt-0.5">{sub}</p>}
      </div>
      <div className="flex-1 h-px bg-gradient-to-r from-[rgba(212,175,100,0.12)] to-transparent ml-2" />
    </div>
  );
}

// ── Document card ────────────────────────────────────────────────────────────
const DOC_LABELS = {
  AADHAR_CARD: "Aadhaar Card",
  PAN_CARD: "PAN Card",
  BIRTH_CERTIFICATE: "Birth Certificate",
  SCHOOL_CERTIFICATE: "School Certificate",
};

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function CompleteProfilePage() {
  const router = useRouter();
  const { user, completeProfile, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "", dateOfBirth: "", club: "",
    sport: "", address: "", level: "", bio: "",
  });

  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState("");
  const [documents, setDocuments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user?.profileCompleted) router.push("/waiting-approval");
  }, [user, authLoading, router]);

  const calculateAge = (dob) => {
    const today = new Date();
    const birth = new Date(dob);
    let age = today.getFullYear() - birth.getFullYear();
    if (today.getMonth() - birth.getMonth() < 0 ||
      (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) age--;
    return age;
  };

  const handleUpload = async (file, type) => {
    setIsUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) {
        if (type === "profile") setProfilePictureUrl(data.url);
        else return { url: data.url, public_id: data.public_id };
        return data.url;
      } else throw new Error(data.error || "Upload failed");
    } catch {
      setErrors(p => ({ ...p, upload: "Failed to upload. Please try again." }));
      return null;
    } finally { setIsUploading(false); }
  };

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setErrors(p => ({ ...p, profilePicture: "Please upload an image file" })); return; }
    if (file.size > 5 * 1024 * 1024) { setErrors(p => ({ ...p, profilePicture: "Max 5MB" })); return; }
    setProfilePicturePreview(URL.createObjectURL(file));
    await handleUpload(file, "profile");
  };

  const handleDocumentUpload = async (e, documentType) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowed = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
    if (!allowed.includes(file.type)) { setErrors(p => ({ ...p, documents: "JPEG, PNG, or PDF only" })); return; }
    if (file.size > 10 * 1024 * 1024) { setErrors(p => ({ ...p, documents: "Max 10MB per file" })); return; }
    const result = await handleUpload(file, "document");
    if (result) setDocuments(prev => [...prev, { documentType, documentUrl: result, documentName: file.name }]);
  };

  const removeDocument = (index) => setDocuments(d => d.filter((_, i) => i !== index));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const e = {};
    if (!formData.fullName?.trim()) e.fullName = "Full name is required";
    if (!formData.dateOfBirth) e.dateOfBirth = "Date of birth is required";
    else { const a = calculateAge(formData.dateOfBirth); if (a < 10) e.dateOfBirth = "Must be at least 10"; else if (a > 60) e.dateOfBirth = "Must be under 60"; }
    if (!formData.sport) e.sport = "Sport is required";
    else if (!["CRICKET", "FOOTBALL"].includes(formData.sport)) e.sport = "Select Cricket or Football";
    if (!formData.address?.trim()) e.address = "Address is required";
    if (!formData.level) e.level = "Level is required";
    else if (!["DISTRICT", "STATE", "NATIONAL"].includes(formData.level)) e.level = "Select a valid level";
    if (formData.bio?.length > 300) e.bio = "Max 300 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    const profileData = {
      fullName: formData.fullName,
      dateOfBirth: formData.dateOfBirth,
      profilePictureUrl: profilePictureUrl || "",
      documents: documents.map(d => ({ documentType: d.documentType, documentUrl: d.documentUrl.url })),
      club: formData.club || "",
      sport: formData.sport,
      address: formData.address,
      level: formData.level,
      bio: formData.bio || "",
    };
    const result = await completeProfile(profileData);
    if (!result.success) setErrors({ submit: result.error });
    setIsLoading(false);
  };

  const age = formData.dateOfBirth ? calculateAge(formData.dateOfBirth) : null;

  // Progress calculation
  const fields = [formData.fullName, formData.dateOfBirth, formData.sport, formData.level, formData.address];
  const filled = fields.filter(Boolean).length;
  const progress = Math.round((filled / fields.length) * 100);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0c0c0e] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[rgba(212,175,100,0.15)] border-t-[#d4af64] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="font-body min-h-screen bg-[#0c0c0e] flex">

        {/* ── Left sticky sidebar ── */}
        <aside className="hidden xl:flex w-[300px] flex-col sticky top-0 h-screen bg-[#0f0f12] border-r border-[rgba(212,175,100,0.1)] p-10 overflow-hidden">
          {/* Glows */}
          <div className="absolute -top-16 -left-16 w-72 h-72 rounded-full bg-[rgba(212,175,100,0.09)] blur-[90px] pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full bg-[rgba(100,80,160,0.07)] blur-[70px] pointer-events-none" />

          {/* Logo */}
          <div className="relative z-10 flex items-center gap-2.5 mb-12">
            <div className="w-9 h-9 bg-gradient-to-br from-[#504a3d] to-[#6e5f40] rounded-lg flex items-center justify-center">
              <FcSportsMode className="w-5 h-5" />
            </div>
            <span className="font-display text-xl font-semibold text-[#f0e6c8] tracking-wide">Sportz</span>
          </div>

          {/* Steps nav */}
          <div className="relative z-10 flex flex-col gap-0 flex-1">
            <p className="text-[0.6875rem] font-medium tracking-[0.14em] uppercase text-[#d4af64] mb-6">Profile Setup</p>
            {[
              { n: "01", label: "Personal Info", done: !!(formData.fullName && formData.dateOfBirth) },
              { n: "02", label: "Sport & Level", done: !!(formData.sport && formData.level) },
              { n: "03", label: "Location & Bio", done: !!formData.address },
              { n: "04", label: "Photo & Docs", done: !!(profilePictureUrl || documents.length > 0) },
            ].map(({ n, label, done }, i) => (
              <div key={n} className="flex items-start gap-3 mb-1">
                <div className="flex flex-col items-center">
                  <div className={[
                    "w-7 h-7 rounded-full border flex items-center justify-center text-[0.6875rem] font-medium transition-all duration-300 flex-shrink-0",
                    done
                      ? "bg-[rgba(212,175,100,0.15)] border-[rgba(212,175,100,0.4)] text-[#d4af64]"
                      : "bg-white/[0.03] border-[rgba(240,230,200,0.1)] text-[rgba(240,230,200,0.3)]",
                  ].join(" ")}>
                    {done ? <Check /> : n}
                  </div>
                  {i < 3 && <div className="w-px h-8 bg-gradient-to-b from-[rgba(212,175,100,0.15)] to-transparent mt-1 mb-1" />}
                </div>
                <span className={`text-[0.8125rem] font-light pt-1.5 transition-colors duration-300 ${done ? "text-[rgba(240,230,200,0.7)]" : "text-[rgba(240,230,200,0.3)]"}`}>
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="relative z-10 mt-auto">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[0.6875rem] text-[rgba(240,230,200,0.35)] uppercase tracking-wider">Completion</span>
              <span className="text-[0.75rem] font-medium text-[#d4af64]">{progress}%</span>
            </div>
            <div className="h-1 bg-[rgba(240,230,200,0.06)] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#c49a40] to-[#d4af64] rounded-full transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </aside>

        {/* ── Main scrollable form ── */}
        <div className="flex-1 overflow-y-auto">
          <div className="relative min-h-full">
            {/* Ambient glow */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[rgba(212,175,100,0.04)] blur-[140px] pointer-events-none" />

            <div className="relative z-10 max-w-[680px] mx-auto px-5 py-12">

              {/* Mobile logo */}
              <div className="flex xl:hidden items-center gap-2.5 mb-10">
              <div className="w-9 h-9 bg-gradient-to-br from-[#504a3d] to-[#6e5f40] rounded-lg flex items-center justify-center">
            <FcSportsMode className="w-5 h-5" />
          </div>
                <span className="font-display text-xl font-semibold text-[#f0e6c8] tracking-wide">Sportz</span>
              </div>

              {/* Page header */}
              <div className="mb-10">
                <p className="text-[0.6875rem] font-medium tracking-[0.14em] uppercase text-[#d4af64] mb-2">Step 3 of 4</p>
                <h1 className="font-display font-light text-[2.75rem] leading-[1.1] text-[#f0e6c8] mb-2">
                  Complete your<br /><em className="italic text-[#d4af64]">profile</em>
                </h1>
                <p className="text-[0.875rem] text-[rgba(240,230,200,0.4)] font-light">
                  Your profile will be reviewed by our team before approval.
                </p>
                {/* Mobile progress */}
                <div className="xl:hidden mt-4 flex items-center gap-3">
                  <div className="flex-1 h-1 bg-[rgba(240,230,200,0.06)] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#c49a40] to-[#d4af64] rounded-full transition-all duration-700" style={{ width: `${progress}%` }} />
                  </div>
                  <span className="text-[0.75rem] font-medium text-[#d4af64]">{progress}%</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-10">

                {/* ── § 1 Profile picture ── */}
                <div>
                  <SectionHeading step="01" label="Personal Information" sub="Your basic identity details" />
                  <div className="flex flex-col sm:flex-row gap-8 items-start">
                    {/* Avatar upload */}
                    <div className="flex flex-col items-center gap-3 flex-shrink-0">
                      <div className="relative">
                        <div className="w-24 h-24 rounded-2xl bg-[rgba(212,175,100,0.07)] border border-[rgba(212,175,100,0.15)] overflow-hidden flex items-center justify-center">
                          {profilePicturePreview ? (
                            <img src={profilePicturePreview} alt="Preview" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[rgba(240,230,200,0.2)]">
                              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                                <circle cx="16" cy="11" r="6" stroke="currentColor" strokeWidth="1.5" />
                                <path d="M4 28c0-6.627 5.373-10 12-10s12 3.373 12 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                              </svg>
                            </span>
                          )}
                        </div>
                        <label className="absolute -bottom-1.5 -right-1.5 w-8 h-8 rounded-xl bg-[#d4af64] flex items-center justify-center cursor-pointer hover:bg-[#c49a40] transition-colors duration-200 shadow-lg text-[#0c0c0e]">
                          <Camera />
                          <input type="file" accept="image/*" onChange={handleProfilePictureChange} className="hidden" />
                        </label>
                      </div>
                      <p className="text-[0.7rem] text-[rgba(240,230,200,0.3)] text-center font-light leading-snug">
                        Photo<br />max 5MB
                      </p>
                      {errors.profilePicture && <p className="text-[0.7rem] text-red-400 text-center">{errors.profilePicture}</p>}
                    </div>

                    {/* Name + DOB */}
                    <div className="flex-1 flex flex-col gap-4 w-full">
                      <Field label="Full Name" error={errors.fullName}>
                        <Input icon={<User />} type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="John Doe" error={errors.fullName} />
                      </Field>
                      <Field
                        label="Date of Birth"
                        error={errors.dateOfBirth}
                        hint={age && !errors.dateOfBirth ? `Age: ${age} years` : undefined}
                      >
                        <Input icon={<Calendar />} type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} error={errors.dateOfBirth} />
                      </Field>
                    </div>
                  </div>
                </div>

                {/* ── § 2 Sport & Level ── */}
                <div>
                  <SectionHeading step="02" label="Sport & Level" sub="Your competitive category" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Sport" error={errors.sport}>
                      <Select icon={<Trophy />} name="sport" value={formData.sport} onChange={handleChange} error={errors.sport}>
                        <option value="">Select sport</option>
                        <option value="CRICKET">Cricket</option>
                        <option value="FOOTBALL">Football</option>
                      </Select>
                    </Field>
                    <Field label="Player Level" error={errors.level}>
                      <Select icon={<Flag />} name="level" value={formData.level} onChange={handleChange} error={errors.level}>
                        <option value="">Select level</option>
                        <option value="DISTRICT">District</option>
                        <option value="STATE">State</option>
                        <option value="NATIONAL">National</option>
                      </Select>
                    </Field>
                    <Field label="Club / Sports Academy" optional>
                      <Input icon={<Building />} type="text" name="club" value={formData.club} onChange={handleChange} placeholder="Mumbai Cricket Academy" />
                    </Field>
                  </div>
                </div>

                {/* ── § 3 Location & Bio ── */}
                <div>
                  <SectionHeading step="03" label="Location & Bio" sub="Where you're based and your story" />
                  <div className="flex flex-col gap-4">
                    <Field label="Address" error={errors.address}>
                      <Textarea icon={<MapPin />} name="address" value={formData.address} onChange={handleChange} rows={2} placeholder="Enter your full address" error={errors.address} />
                    </Field>
                    <Field
                      label="Bio"
                      optional
                      error={errors.bio}
                      hint={!errors.bio ? "Tell us about your journey and achievements" : undefined}
                    >
                      <div className="relative">
                        <Textarea
                          icon={<Briefcase />}
                          name="bio" value={formData.bio}
                          onChange={handleChange} rows={4} maxLength={300}
                          placeholder="My sports journey started when…"
                          error={errors.bio}
                        />
                        <span className={`absolute bottom-3 right-3 text-[0.7rem] pointer-events-none ${(formData.bio?.length || 0) > 280 ? "text-amber-400" : "text-[rgba(240,230,200,0.2)]"}`}>
                          {formData.bio?.length || 0}/300
                        </span>
                      </div>
                    </Field>
                  </div>
                </div>

                {/* ── § 4 Documents ── */}
                <div>
                  <SectionHeading step="04" label="Documents" sub="Upload supporting documents for verification" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    {Object.entries(DOC_LABELS).map(([type, label]) => {
                      const uploaded = documents.find(d => d.documentType === type);
                      return (
                        <label
                          key={type}
                          className={[
                            "relative flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-200 group",
                            uploaded
                              ? "border-[rgba(212,175,100,0.3)] bg-[rgba(212,175,100,0.05)]"
                              : "border-[rgba(240,230,200,0.08)] bg-white/[0.02] hover:border-[rgba(240,230,200,0.15)] hover:bg-white/[0.03]",
                          ].join(" ")}
                        >
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-200 ${uploaded ? "bg-[rgba(212,175,100,0.12)] text-[#d4af64]" : "bg-white/[0.04] text-[rgba(240,230,200,0.3)] group-hover:text-[rgba(240,230,200,0.5)]"}`}>
                            {uploaded ? <Check /> : <Upload />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-[0.8125rem] font-medium leading-none mb-0.5 ${uploaded ? "text-[rgba(240,230,200,0.8)]" : "text-[rgba(240,230,200,0.45)]"}`}>{label}</p>
                            <p className="text-[0.7rem] text-[rgba(240,230,200,0.25)] font-light truncate">
                              {uploaded ? uploaded.documentName : "JPEG, PNG or PDF · max 10MB"}
                            </p>
                          </div>
                          <input type="file" accept="image/*,application/pdf" onChange={(e) => handleDocumentUpload(e, type)} className="hidden" />
                        </label>
                      );
                    })}
                  </div>

                  {/* Uploaded list with remove */}
                  {documents.length > 0 && (
                    <div className="flex flex-col gap-2">
                      {documents.map((doc, i) => (
                        <div key={i} className="flex items-center justify-between px-4 py-3 bg-[rgba(212,175,100,0.04)] border border-[rgba(212,175,100,0.12)] rounded-xl">
                          <div className="flex items-center gap-2.5">
                            <span className="text-[#d4af64]"><FileText /></span>
                            <div>
                              <p className="text-[0.8125rem] font-medium text-[rgba(240,230,200,0.7)] leading-none">{DOC_LABELS[doc.documentType] || doc.documentType}</p>
                              <p className="text-[0.7rem] text-[rgba(240,230,200,0.3)] font-light mt-0.5">{doc.documentName}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeDocument(i)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-[rgba(240,230,200,0.25)] hover:text-red-400 hover:bg-[rgba(255,100,100,0.08)] transition-all duration-200"
                          >
                            <X />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {errors.documents && <p className="text-[0.75rem] text-red-400 mt-2">{errors.documents}</p>}
                </div>

                {/* ── Profile summary card ── */}
                {(formData.fullName || formData.sport || formData.level) && (
                  <div className="rounded-xl border border-[rgba(212,175,100,0.15)] bg-[rgba(212,175,100,0.03)] p-5">
                    <p className="text-[0.6875rem] font-medium tracking-[0.1em] uppercase text-[#d4af64] mb-3">Profile Preview</p>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                      {[
                        ["Name", formData.fullName],
                        ["Age", age ? `${age} years` : "—"],
                        ["Sport", formData.sport || "—"],
                        ["Level", formData.level || "—"],
                        formData.club ? ["Club", formData.club] : null,
                        documents.length > 0 ? ["Docs", `${documents.length} uploaded`] : null,
                      ].filter(Boolean).map(([k, v]) => (
                        <div key={k} className="flex items-baseline gap-1.5">
                          <span className="text-[0.75rem] text-[rgba(240,230,200,0.3)] flex-shrink-0">{k}</span>
                          <span className="text-[0.8125rem] font-light text-[rgba(240,230,200,0.65)] truncate">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload indicator */}
                {isUploading && (
                  <div className="flex items-center gap-2.5 text-[0.8125rem] text-[rgba(212,175,100,0.7)]">
                    <span className="w-4 h-4 border-2 border-[rgba(212,175,100,0.2)] border-t-[#d4af64] rounded-full animate-spin flex-shrink-0" />
                    Uploading file…
                  </div>
                )}

                {/* Submit error */}
                {errors.submit && (
                  <div className="flex items-start gap-2.5 bg-[rgba(255,100,100,0.07)] border border-[rgba(255,100,100,0.18)] px-4 py-3 rounded-[10px] text-[0.8125rem] text-red-400 leading-relaxed">
                    <AlertCircle />
                    {errors.submit}
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading || isUploading}
                  className="w-full py-[0.9375rem] rounded-[10px] font-medium text-[0.9375rem] tracking-[0.02em] text-[#0c0c0e] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-px active:translate-y-0"
                  style={{
                    background: "linear-gradient(135deg,#c49a40 0%,#d4af64 50%,#c49a40 100%)",
                    backgroundSize: "200% 100%",
                    boxShadow: "0 4px 24px rgba(212,175,100,0.2)",
                  }}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-[rgba(12,12,14,0.25)] border-t-[#0c0c0e] rounded-full animate-spin" />
                      Saving profile…
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <span className="text-[#0c0c0e]/60"><Shield /></span>
                      Submit for Approval
                    </span>
                  )}
                </button>

                <p className="text-center text-[0.8rem] text-[rgba(240,230,200,0.25)] font-light -mt-4 pb-4">
                  Your profile is reviewed by our team within 24–48 hours.
                </p>

              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}