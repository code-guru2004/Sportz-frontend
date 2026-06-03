// app/coach/schedule/edit/[id]/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import {
  ArrowLeftIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  TrophyIcon,
  UsersIcon,
  DocumentTextIcon,
  CheckCircleIcon
} from "@heroicons/react/24/outline";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

// Move InputField outside the component to prevent recreation
const InputField = ({ 
  label, name, type = "text", icon: Icon, placeholder, required, options, 
  value, error, onChange, onFocus, onBlur, focused 
}) => {
  const isSelect = type === "select";
  
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[0.75rem] font-medium tracking-[0.06em] uppercase text-[rgba(240,230,200,0.5)]">
        {label} {required && <span className="text-[#d4af64]">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <span className={`absolute top-1/2 left-4 -translate-y-1/2 pointer-events-none transition-colors duration-200 flex items-center ${focused === name ? "text-[#d4af64]" : "text-[rgba(240,230,200,0.25)]"}`}>
            <Icon className="w-4 h-4" />
          </span>
        )}
        {isSelect ? (
          <select
            name={name}
            value={value}
            onChange={onChange}
            onFocus={() => onFocus(name)}
            onBlur={() => onBlur("")}
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
            onFocus={() => onFocus(name)}
            onBlur={() => onBlur("")}
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
            onFocus={() => onFocus(name)}
            onBlur={() => onBlur("")}
            placeholder={placeholder}
            className={`w-full py-3.5 px-4 ${Icon ? 'pl-11' : 'pl-4'} bg-[rgba(255,255,255,0.03)] border rounded-lg outline-none text-[#f0e6c8] text-[0.9375rem] font-['DM_Sans',sans-serif] font-light transition-all duration-200 box-border placeholder:text-[rgba(240,230,200,0.2)] focus:border-[rgba(212,175,100,0.45)] focus:bg-[rgba(212,175,100,0.04)] focus:shadow-[0_0_0_3px_rgba(212,175,100,0.07)] ${error ? "border-[rgba(255,100,100,0.4)]" : "border-[rgba(240,230,200,0.1)]"}`}
          />
        )}
      </div>
      {error && <span className="text-[0.75rem] text-[#fc8181] mt-0.5">{error}</span>}
      {name === "duration" && !error && (
        <p className="text-[0.7rem] text-[rgba(240,230,200,0.35)] mt-0.5">Minimum 15 minutes</p>
      )}
      {name === "maxParticipants" && !error && (
        <p className="text-[0.7rem] text-[rgba(240,230,200,0.35)] mt-0.5">Maximum number of athletes</p>
      )}
    </div>
  );
};

export default function EditSchedulePage() {
  const params = useParams();
  const router = useRouter();
  const { user, accessToken, profile } = useAuth();
  const scheduleId = params.id;
  
  const [formData, setFormData] = useState({
    title: "",
    sport: "",
    date: "",
    time: "",
    location: "",
    description: "",
    duration: 60,
    maxParticipants: 50,
    status: "SCHEDULED"
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [focused, setFocused] = useState("");

  useEffect(() => {
    fetchSchedule();
  }, [scheduleId]);

  const fetchSchedule = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/schedules/${scheduleId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
      });
      console.log("Fetched schedules:", response.data);
      
      if (response.data.success) {
        
        const schedule = response.data.schedule
        if (schedule) {
          setFormData({
            title: schedule.title,
            sport: schedule.sport,
            date: schedule.date ? schedule.date.split('T')[0] : "",
            time: schedule.time,
            location: schedule.location,
            description: schedule.description || "",
            duration: schedule.duration,
            maxParticipants: schedule.maxParticipants,
            status: schedule.status
          });
        } else {
          console.error("Schedule not found");
        }
      }
    } catch (error) {
      console.error("Error fetching schedule:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.sport) newErrors.sport = "Sport is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.time) newErrors.time = "Time is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (formData.duration < 15) newErrors.duration = "Duration must be at least 15 minutes";
    if (formData.maxParticipants < 1) newErrors.maxParticipants = "Max participants must be at least 1";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const response = await axios.put(`${API_BASE_URL}/schedules/${scheduleId}`, formData, {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
      });
      
      if (response.data.success) {
        setShowSuccess(true);
        setTimeout(() => {
          router.push("/coach/dashboard?tab=schedules");
        }, 2000);
      }
    } catch (error) {
      console.error("Error updating schedule:", error);
      setErrors({ submit: error.response?.data?.message || "Failed to update schedule" });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusOptions = () => {
    const options = [
      { value: "SCHEDULED", label: "Scheduled" },
      { value: "COMPLETED", label: "Completed" },
      { value: "CANCELLED", label: "Cancelled" }
    ];
    
    const getStatusColor = (status) => {
      switch(status) {
        case "SCHEDULED": return "text-[#4ade80]";
        case "COMPLETED": return "text-[#d4af64]";
        case "CANCELLED": return "text-[#fc8181]";
        default: return "text-[rgba(240,230,200,0.6)]";
      }
    };
    
    return { options, getStatusColor };
  };

  const { options: statusOptions, getStatusColor } = getStatusOptions();

  if (isFetching) {
    return (
      <div className="min-h-screen bg-[#0c0c0e] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-[rgba(212,175,100,0.2)] border-t-[#d4af64] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[rgba(240,230,200,0.5)] font-body text-sm">Loading schedule...</p>
        </div>
      </div>
    );
  }

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
              <h3 className="font-display text-xl font-medium text-[#f0e6c8] mb-2">Schedule Updated!</h3>
              <p className="text-[rgba(240,230,200,0.6)] font-body text-sm">Your training schedule has been updated successfully.</p>
              <p className="text-sm text-[rgba(240,230,200,0.35)] mt-3">Redirecting to dashboard...</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto py-12 px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[rgba(240,230,200,0.5)] hover:text-[#d4af64] transition-colors duration-200 mb-4 group"
          >
            <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-sm font-body">Back</span>
          </button>
          <h1 className="font-display text-4xl font-light text-[#f0e6c8]">
            Edit Training Schedule
          </h1>
          <div className="w-12 h-px bg-gradient-to-r from-[#d4af64] to-transparent my-4" />
          <p className="text-[rgba(240,230,200,0.4)] font-body text-sm">
            Update your training session details
          </p>
        </div>

        {/* Form */}
        <div className="bg-[#0f0f12] rounded-2xl border border-[rgba(212,175,100,0.1)] p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <InputField
              label="Schedule Title"
              name="title"
              icon={DocumentTextIcon}
              placeholder="e.g., Morning Cricket Practice"
              required
              value={formData.title}
              error={errors.title}
              onChange={handleChange}
              onFocus={setFocused}
              onBlur={setFocused}
              focused={focused}
            />

            {/* Sport */}
            <InputField
              label="Sport"
              name="sport"
              type="select"
              icon={TrophyIcon}
              required
              options={[
                { value: "CRICKET", label: "Cricket" },
                { value: "FOOTBALL", label: "Football" }
              ]}
              value={formData.sport}
              error={errors.sport}
              onChange={handleChange}
              onFocus={setFocused}
              onBlur={setFocused}
              focused={focused}
            />

            {/* Status */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.75rem] font-medium tracking-[0.06em] uppercase text-[rgba(240,230,200,0.5)]">
                Status
              </label>
              <div className="relative">
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full py-3.5 px-4 bg-[rgba(255,255,255,0.03)] border border-[rgba(240,230,200,0.1)] rounded-lg outline-none text-[#f0e6c8] text-[0.9375rem] font-['DM_Sans',sans-serif] font-light transition-all duration-200 box-border focus:border-[rgba(212,175,100,0.45)] focus:bg-[rgba(212,175,100,0.04)] focus:shadow-[0_0_0_3px_rgba(212,175,100,0.07)] appearance-none"
                >
                  {statusOptions.map(opt => (
                    <option key={opt.value} value={opt.value} className="bg-[#0f0f12] text-[#f0e6c8]">
                      {opt.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-[rgba(240,230,200,0.3)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <p className={`text-[0.7rem] mt-0.5 ${getStatusColor(formData.status)}`}>
                Current status: {statusOptions.find(opt => opt.value === formData.status)?.label}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Date */}
              <InputField
                label="Date"
                name="date"
                type="date"
                icon={CalendarIcon}
                required
                value={formData.date}
                error={errors.date}
                onChange={handleChange}
                onFocus={setFocused}
                onBlur={setFocused}
                focused={focused}
              />

              {/* Time */}
              <InputField
                label="Time"
                name="time"
                type="time"
                icon={ClockIcon}
                required
                value={formData.time}
                error={errors.time}
                onChange={handleChange}
                onFocus={setFocused}
                onBlur={setFocused}
                focused={focused}
              />
            </div>

            {/* Location */}
            <InputField
              label="Location"
              name="location"
              icon={MapPinIcon}
              placeholder="e.g., City Sports Complex, Ground A"
              required
              value={formData.location}
              error={errors.location}
              onChange={handleChange}
              onFocus={setFocused}
              onBlur={setFocused}
              focused={focused}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Duration */}
              <InputField
                label="Duration"
                name="duration"
                type="number"
                icon={ClockIcon}
                placeholder="60"
                value={formData.duration}
                error={errors.duration}
                onChange={handleChange}
                onFocus={setFocused}
                onBlur={setFocused}
                focused={focused}
              />

              {/* Max Participants */}
              <InputField
                label="Max Participants"
                name="maxParticipants"
                type="number"
                icon={UsersIcon}
                placeholder="50"
                value={formData.maxParticipants}
                error={errors.maxParticipants}
                onChange={handleChange}
                onFocus={setFocused}
                onBlur={setFocused}
                focused={focused}
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.75rem] font-medium tracking-[0.06em] uppercase text-[rgba(240,230,200,0.5)]">
                Description
              </label>
              <div className="relative">
                <span className="absolute top-4 left-4 pointer-events-none transition-colors duration-200 flex items-start text-[rgba(240,230,200,0.25)]">
                  <DocumentTextIcon className="w-4 h-4" />
                </span>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  maxLength={500}
                  placeholder="Provide additional details about the training session..."
                  className="w-full py-3.5 px-4 pl-11 bg-[rgba(255,255,255,0.03)] border border-[rgba(240,230,200,0.1)] rounded-lg outline-none text-[#f0e6c8] text-[0.9375rem] font-['DM_Sans',sans-serif] font-light transition-all duration-200 box-border placeholder:text-[rgba(240,230,200,0.2)] focus:border-[rgba(212,175,100,0.45)] focus:bg-[rgba(212,175,100,0.04)] focus:shadow-[0_0_0_3px_rgba(212,175,100,0.07)] resize-none"
                />
              </div>
              <div className="flex justify-end">
                <p className={`text-xs mt-1 ${formData.description?.length > 450 ? 'text-[#d4af64]' : 'text-[rgba(240,230,200,0.35)]'}`}>
                  {formData.description?.length || 0}/500 characters
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
                disabled={isLoading}
                className="flex-1 relative overflow-hidden py-3 bg-gradient-to-r from-[#c49a40] via-[#d4af64] to-[#c49a40] bg-[length:200%_100%] bg-[position:100%_0] border-none rounded-lg cursor-pointer text-[#0c0c0e] font-['DM_Sans',sans-serif] text-[0.9375rem] font-medium tracking-[0.03em] transition-all duration-400 ease-out hover:bg-[position:0_0] hover:-translate-y-px hover:shadow-[0_8px_32px_rgba(212,175,100,0.3)] active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <div className="flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <div className="w-[18px] h-[18px] border-2 border-[rgba(12,12,14,0.2)] border-t-[#0c0c0e] rounded-full animate-spin" />
                      Updating Schedule...
                    </>
                  ) : (
                    "Update Schedule"
                  )}
                </div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}