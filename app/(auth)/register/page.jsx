// app/page.jsx (Register Page)
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { FcSportsMode } from "react-icons/fc";

// ── Inline SVG icons (no heroicons dependency) ──────────────────────────────
const IconUser = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.25"/>
    <path d="M2 14c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
  </svg>
);
const IconEmail = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="2" y="4" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.25"/>
    <path d="M2 5l6 5 6-5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconPhone = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="4.5" y="1.5" width="7" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.25"/>
    <circle cx="8" cy="12" r="0.75" fill="currentColor"/>
  </svg>
);
const IconLock = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="3" y="7" width="10" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.25"/>
    <path d="M5.5 7V5a2.5 2.5 0 015 0v2" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
    <circle cx="8" cy="11" r="1" fill="currentColor"/>
  </svg>
);
const IconEye = ({ slash }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M2 8s2.5-4.5 6-4.5S14 8 14 8s-2.5 4.5-6 4.5S2 8 2 8z" stroke="currentColor" strokeWidth="1.25"/>
    <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.25"/>
    {slash && <path d="M2 2l12 12" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>}
  </svg>
);
const IconCheck = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconAlert = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
    <circle cx="7" cy="7" r="6.5" stroke="#fc8181" strokeOpacity="0.5"/>
    <path d="M7 4v3.5M7 9.5v.5" stroke="#fc8181" strokeWidth="1.25" strokeLinecap="round"/>
  </svg>
);

// ── Field component ──────────────────────────────────────────────────────────
function Field({ label, optional, error, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[0.6875rem] font-medium tracking-[0.08em] uppercase text-[rgba(240,230,200,0.45)]">
        {label}{optional && <span className="ml-1.5 normal-case tracking-normal text-[rgba(240,230,200,0.25)]">(optional)</span>}
      </label>
      {children}
      {error && <span className="text-[0.75rem] text-red-400">{error}</span>}
    </div>
  );
}

function Input({ icon, action, error, ...props }) {
  return (
    <div className="relative">
      {icon && (
        <span className="absolute top-1/2 left-3.5 -translate-y-1/2 pointer-events-none text-[rgba(240,230,200,0.25)] transition-colors duration-200">
          {icon}
        </span>
      )}
      <input
        {...props}
        className={[
          "w-full py-[0.875rem] text-[0.9375rem] font-light rounded-[10px] outline-none transition-all duration-200",
          "bg-white/[0.03] border text-[#f0e6c8] placeholder:text-[rgba(240,230,200,0.2)]",
          "focus:bg-[rgba(212,175,100,0.04)] focus:border-[rgba(212,175,100,0.45)] focus:shadow-[0_0_0_3px_rgba(212,175,100,0.07)]",
          icon ? "pl-10 pr-4" : "px-4",
          action ? "pr-11" : "",
          error ? "border-[rgba(255,100,100,0.4)]" : "border-[rgba(240,230,200,0.1)]",
        ].join(" ")}
      />
      {action && (
        <button
          type="button"
          tabIndex={-1}
          onClick={action.onClick}
          className="absolute top-1/2 right-3.5 -translate-y-1/2 text-[rgba(240,230,200,0.3)] hover:text-[rgba(240,230,200,0.6)] transition-colors duration-200"
        >
          {action.icon}
        </button>
      )}
    </div>
  );
}

// ── OTP Modal ────────────────────────────────────────────────────────────────
function OtpModal({ email, otp, setOtp, otpError, setOtpError, isVerifying, onVerify, onResend, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        
      />
      <div className="relative w-full max-w-sm bg-[#131316] border border-[rgba(212,175,100,0.15)] rounded-2xl p-8 shadow-2xl animate-[fadeUp_0.25s_ease]">
        {/* Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-[rgba(212,175,100,0.07)] blur-3xl pointer-events-none" />

        <div className="relative text-center">
          {/* Icon */}
          <div className="mx-auto mb-5 w-14 h-14 rounded-2xl bg-[rgba(212,175,100,0.08)] border border-[rgba(212,175,100,0.15)] flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <rect x="2" y="6" width="18" height="13" rx="2" stroke="#d4af64" strokeWidth="1.5"/>
              <path d="M2 8l9 7 9-7" stroke="#d4af64" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <p className="text-[0.6875rem] font-medium tracking-[0.12em] uppercase text-[#d4af64] mb-2">
            Verify Email
          </p>
          <h3
            className="mb-1 font-light text-[#f0e6c8] text-2xl"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Check your inbox
          </h3>
          <p className="text-[0.8125rem] text-[rgba(240,230,200,0.4)] leading-relaxed font-light mb-6">
            We sent a 6-digit code to{" "}
            <span className="text-[rgba(240,230,200,0.7)]">{email}</span>
          </p>

          {/* OTP input */}
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={otp}
            onChange={(e) => { setOtp(e.target.value.replace(/\D/g, "")); setOtpError(""); }}
            placeholder="0  0  0  0  0  0"
            className={[
              "w-full text-center text-2xl tracking-[0.5em] py-3.5 rounded-[10px] outline-none transition-all duration-200 mb-1",
              "bg-white/[0.03] text-[#f0e6c8] placeholder:text-[rgba(240,230,200,0.15)] placeholder:tracking-[0.4em]",
              "focus:bg-[rgba(212,175,100,0.04)] focus:shadow-[0_0_0_3px_rgba(212,175,100,0.07)]",
              otpError
                ? "border border-[rgba(255,100,100,0.4)]"
                : "border border-[rgba(240,230,200,0.1)] focus:border-[rgba(212,175,100,0.45)]",
            ].join(" ")}
          />
          {otpError && <p className="text-red-400 text-[0.75rem] mb-4">{otpError}</p>}

          <button
            onClick={onVerify}
            disabled={isVerifying}
            className="w-full mt-4 py-[0.9rem] rounded-[10px] font-medium text-[0.9375rem] text-[#0c0c0e] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(135deg,#c49a40 0%,#d4af64 50%,#c49a40 100%)",
              backgroundSize: "200% 100%",
              boxShadow: "0 4px 24px rgba(212,175,100,0.2)",
            }}
          >
            {isVerifying ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-[rgba(12,12,14,0.2)] border-t-[#0c0c0e] rounded-full animate-spin" />
                Verifying…
              </span>
            ) : (
              "Confirm & Continue"
            )}
          </button>

          <p className="text-[0.8rem] text-[rgba(240,230,200,0.35)] mt-4">
            Didn't receive it?{" "}
            <button
              onClick={onResend}
              className="text-[#d4af64] hover:opacity-70 transition-opacity duration-200"
            >
              Resend code
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function RegisterPage() {
  const router = useRouter();
  const { register, verifyEmail } = useAuth();

  const [formData, setFormData] = useState({
    username: "", email: "", phone: "",
    role: "ATHLETE", password: "Nayan@2004", confirmPassword: "Nayan@2004",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");
  const [otpError, setOtpError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [selectedRole, setSelectedRole] = useState("ATHLETE");
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Password strength
  const pw = formData.password;
  const strength = [pw.length >= 6, /[A-Z]/.test(pw), /[a-z]/.test(pw), /\d/.test(pw)];
  const strengthCount = strength.filter(Boolean).length;
  const strengthColor = strengthCount <= 1 ? "bg-red-500" : strengthCount <= 2 ? "bg-amber-500" : strengthCount === 3 ? "bg-yellow-400" : "bg-emerald-500";
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strengthCount];

  const validateForm = () => {
    const e = {};
    if (!formData.username.trim()){
       e.username = "Username is required";
    }

    else if (formData.username.length < 3){
       e.username = "At least 3 characters";
    }
    else if (formData.username.length > 20){
       e.username = "Max 20 characters";
    }
    if (!formData.email){
       e.email = "Email is required";
    }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(formData.email)){
       e.email = "Enter a valid email";
    }
    if (formData.phone && !/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/.test(formData.phone)){
      e.phone = "Enter a valid phone number";
    }
    if (!formData.password){
      e.password = "Password is required";
    }
    else if (formData.password.length < 6){
      e.password = "At least 6 characters";
    }
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)){
       e.password = "Needs uppercase, lowercase & number";
    }
    if (formData.password !== formData.confirmPassword){
       e.confirmPassword = "Passwords do not match";
    }
    if (!termsAccepted){
       e.terms = "You must accept the terms";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]){
       setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setFormData(prev => ({ ...prev, role }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    const { confirmPassword, ...registerData } = formData;
    const result = await register(registerData);
    if (result.success) { 
      console.log("Reg",result)
      //verify email
      setPendingEmail(formData.email);
      setShowOtpModal(true); 
    }
    else{
      setErrors({ submit: result.error });
    }
    setIsLoading(false);
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) { setOtpError("Enter a valid 6-digit code"); return; }
    setIsVerifying(true); setOtpError("");
    const result = await verifyEmail(pendingEmail, otp);
    if (result.success) {
       setShowOtpModal(false); router.push("/login?verified=true");
       }
    else{
       setOtpError(result.error);
    }
    setIsVerifying(false);
  };

  const resendOtp = async () => {
    setOtpError("");
    try {
      const res = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/auth/resend-otp`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: pendingEmail }),
      });
      if (!res.ok) setOtpError("Failed to resend. Please try again.");
    } catch { setOtpError("Failed to resend. Please try again."); }
  };

  return (
    <>
      {/* Google Fonts */}
      <style>{`
       
      `}</style>

      <div className="font-body min-h-screen bg-[#0c0c0e] flex">

        {/* ── OTP Modal ── */}
        {showOtpModal && (
          <OtpModal
            email={pendingEmail} otp={otp} setOtp={setOtp}
            otpError={otpError} setOtpError={setOtpError}
            isVerifying={isVerifying} onVerify={handleVerifyOtp}
            onResend={resendOtp} onClose={() => setShowOtpModal(false)}
          />
        )}

        {/* ── Left sticky panel (desktop) ── */}
        <aside className="hidden lg:flex w-[42%] flex-col justify-between sticky top-0 h-screen overflow-hidden bg-[#0f0f12] border-r border-[rgba(212,175,100,0.1)] p-12">
          {/* Ambient glows */}
          <div className="absolute -top-20 -left-20 w-[380px] h-[380px] rounded-full bg-[rgba(212,175,100,0.1)] blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 -right-12 w-[280px] h-[280px] rounded-full bg-[rgba(120,90,180,0.08)] blur-[80px] pointer-events-none" />

          {/* Logo */}
          <div className="relative z-10 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#d4af64] to-[#c49a40] flex items-center justify-center shadow-lg">
              <div className="w-9 h-9 bg-gradient-to-br from-[#504a3d] to-[#6e5f40] rounded-lg flex items-center justify-center">
                  <FcSportsMode className="w-5 h-5" />
              </div>
            </div>
            <span className="font-display text-xl font-semibold text-[#f0e6c8] tracking-wide">Sportz</span>
          </div>

          {/* Headline */}
          <div className="relative z-10">
            <p className="text-[0.6875rem] font-medium tracking-[0.14em] uppercase text-[#d4af64] mb-4">
              {selectedRole === "ATHLETE" ? "Athlete Platform" : "Coach Platform"}
            </p>
            <h2 className="font-display font-light text-[3rem] leading-[1.1] text-[#f0e6c8] mb-5">
              {selectedRole === "ATHLETE" ? (
                <><em className="italic text-[#d4af64]">Train</em> harder.<br/>Compete <em className="italic text-[#d4af64]">smarter</em>.</>
              ) : (
                <><em className="italic text-[#d4af64]">Lead</em> teams.<br/>Build <em className="italic text-[#d4af64]">legacies</em>.</>
              )}
            </h2>
            <div className="w-12 h-px bg-gradient-to-r from-[#d4af64] to-transparent mb-5" />
            <p className="text-[0.875rem] leading-relaxed font-light text-[rgba(240,230,200,0.4)]">
              {selectedRole === "ATHLETE"
                ? "Access personalized training programs, track competition results, and unlock data-driven performance insights."
                : "Design training plans, manage your roster, track athlete milestones, and build a culture of excellence."}
            </p>
          </div>

          {/* Benefits list */}
          <div className="relative z-10 flex flex-col gap-3.5">
            {(selectedRole === "ATHLETE"
              ? ["Personalized training programs", "Competition history & stats", "Performance analytics dashboard", "Coach connection network"]
              : ["Team & roster management", "Custom training plan builder", "Athlete progress tracking", "Approval-based onboarding"]
            ).map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[rgba(212,175,100,0.12)] border border-[rgba(212,175,100,0.2)] flex items-center justify-center text-[#d4af64] flex-shrink-0">
                  <IconCheck />
                </div>
                <span className="text-[0.8125rem] text-[rgba(240,230,200,0.45)] font-light">{item}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* ── Right scrollable form ── */}
        <section className="flex-1 flex items-start justify-center overflow-y-auto py-12 px-5">
          {/* Subtle center glow */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
            <div className="w-[600px] h-[600px] rounded-full bg-[rgba(212,175,100,0.04)] blur-[140px]" />
          </div>

          <div className="relative z-10 w-full max-w-[420px]">

            {/* Mobile logo */}
            <div className="flex lg:hidden items-center gap-2 mb-8">
            <div className="w-9 h-9 bg-gradient-to-br from-[#504a3d] to-[#6e5f40] rounded-lg flex items-center justify-center">
            <FcSportsMode className="w-5 h-5" />
          </div>
              <span className="font-display text-lg font-semibold text-[#f0e6c8] tracking-wide">Sportz</span>
            </div>

            {/* Header */}
            <div className="mb-8">
              <p className="text-[0.6875rem] font-medium tracking-[0.14em] uppercase text-[#d4af64] mb-2">New Account</p>
              <h1 className="font-display font-light text-[2.5rem] leading-[1.1] text-[#f0e6c8] mb-2">
                Join the<br/>platform
              </h1>
              <p className="text-[0.875rem] text-[rgba(240,230,200,0.4)] font-light">
                Already a member?{" "}
                <Link href="/login" className="text-[#d4af64] hover:opacity-70 transition-opacity">Sign in</Link>
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

              {/* ── Role selector ── */}
              <div className="flex flex-col gap-2">
                <span className="text-[0.6875rem] font-medium tracking-[0.08em] uppercase text-[rgba(240,230,200,0.45)]">
                  I am joining as
                </span>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { role: "ATHLETE", label: "Athlete", sub: "Compete & train", icon: (
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M10 2l2.2 4.5L17 7.6l-3.5 3.4.83 4.84L10 13.5l-4.33 2.34L6.5 11 3 7.6l4.8-.1L10 2z"
                          stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round"/>
                      </svg>
                    )},
                    { role: "COACH", label: "Coach", sub: "Train & mentor", icon: (
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M10 2a4 4 0 100 8 4 4 0 000-8z" stroke="currentColor" strokeWidth="1.25"/>
                        <path d="M3 18c0-3.866 3.134-6 7-6" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
                        <path d="M15 13v5M12.5 15.5h5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
                      </svg>
                    )},
                  ].map(({ role, label, sub, icon }) => {
                    const active = selectedRole === role;
                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => handleRoleSelect(role)}
                        className={[
                          "relative p-4 rounded-xl border transition-all duration-200 text-left",
                          active
                            ? "border-[rgba(212,175,100,0.5)] bg-[rgba(212,175,100,0.06)] shadow-[0_0_0_1px_rgba(212,175,100,0.15)]"
                            : "border-[rgba(240,230,200,0.08)] bg-white/[0.02] hover:border-[rgba(240,230,200,0.15)]",
                        ].join(" ")}
                      >
                        <div className={[
                          "w-9 h-9 rounded-lg flex items-center justify-center mb-3 transition-colors duration-200",
                          active ? "bg-[rgba(212,175,100,0.15)] text-[#d4af64]" : "bg-white/[0.04] text-[rgba(240,230,200,0.3)]",
                        ].join(" ")}>
                          {icon}
                        </div>
                        <p className={`text-[0.9rem] font-medium leading-none mb-1 transition-colors duration-200 ${active ? "text-[#f0e6c8]" : "text-[rgba(240,230,200,0.5)]"}`}>
                          {label}
                        </p>
                        <p className="text-[0.75rem] text-[rgba(240,230,200,0.3)] font-light">{sub}</p>
                        {active && (
                          <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#d4af64]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── Text fields ── */}
              <Field label="Username" error={errors.username}>
                <Input
                  icon={<IconUser />}
                  type="text" name="username" value={formData.username}
                  onChange={handleChange} placeholder="johndoe"
                  error={errors.username}
                />
              </Field>

              <Field label="Email address" error={errors.email}>
                <Input
                  icon={<IconEmail />}
                  type="email" name="email" value={formData.email}
                  onChange={handleChange} placeholder="you@example.com"
                  error={errors.email}
                />
              </Field>

              <Field label="Phone number" optional error={errors.phone}>
                <Input
                  icon={<IconPhone />}
                  type="tel" name="phone" value={formData.phone}
                  onChange={handleChange} placeholder="+1 234 567 8900"
                  error={errors.phone}
                />
              </Field>

              {/* Password + strength bar */}
              <Field label="Password" error={errors.password}>
                <Input
                  icon={<IconLock />}
                  type={showPassword ? "text" : "password"}
                  name="password" value={formData.password}
                  onChange={handleChange} placeholder="••••••••"
                  error={errors.password}
                  action={{ onClick: () => setShowPassword(!showPassword), icon: <IconEye slash={showPassword} /> }}
                />
                {/* Strength bar */}
                {formData.password && (
                  <div className="mt-1.5">
                    <div className="flex gap-1 mb-1">
                      {[0,1,2,3].map(i => (
                        <div
                          key={i}
                          className={`h-0.5 flex-1 rounded-full transition-all duration-300 ${i < strengthCount ? strengthColor : "bg-[rgba(240,230,200,0.08)]"}`}
                        />
                      ))}
                    </div>
                    <p className="text-[0.7rem] text-[rgba(240,230,200,0.35)]">
                      {strengthLabel && <span className={`font-medium ${strengthCount === 4 ? "text-emerald-400" : "text-[rgba(240,230,200,0.5)]"}`}>{strengthLabel} · </span>}
                      Uppercase, lowercase & number required
                    </p>
                  </div>
                )}
              </Field>

              <Field label="Confirm password" error={errors.confirmPassword}>
                <Input
                  icon={<IconLock />}
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword" value={formData.confirmPassword}
                  onChange={handleChange} placeholder="••••••••"
                  error={errors.confirmPassword}
                  action={{ onClick: () => setShowConfirmPassword(!showConfirmPassword), icon: <IconEye slash={showConfirmPassword} /> }}
                />
                {formData.password && formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <span className="text-[0.75rem] text-emerald-400 flex items-center gap-1 mt-0.5">
                    <IconCheck /> Passwords match
                  </span>
                )}
              </Field>

              {/* Terms */}
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => { setTermsAccepted(!termsAccepted); if (errors.terms) setErrors(p => ({ ...p, terms: "" })); }}
                  className={[
                    "mt-0.5 w-5 h-5 rounded-[5px] border flex-shrink-0 flex items-center justify-center transition-all duration-200",
                    termsAccepted
                      ? "bg-[rgba(212,175,100,0.15)] border-[rgba(212,175,100,0.5)] text-[#d4af64]"
                      : "bg-white/[0.03] border-[rgba(240,230,200,0.12)] text-transparent",
                    errors.terms ? "border-[rgba(255,100,100,0.4)]" : "",
                  ].join(" ")}
                >
                  <IconCheck />
                </button>
                <p className="text-[0.8125rem] font-light text-[rgba(240,230,200,0.4)] leading-relaxed">
                  I agree to the{" "}
                  <a href="#" className="text-[#d4af64] hover:opacity-70 transition-opacity">Terms of Service</a>
                  {" "}and{" "}
                  <a href="#" className="text-[#d4af64] hover:opacity-70 transition-opacity">Privacy Policy</a>
                </p>
              </div>
              {errors.terms && <p className="text-red-400 text-[0.75rem] -mt-3">{errors.terms}</p>}

              {/* Submit error */}
              {errors.submit && (
                <div className="flex items-start gap-2.5 bg-[rgba(255,100,100,0.07)] border border-[rgba(255,100,100,0.18)] px-4 py-3 rounded-[10px] text-[0.8125rem] text-red-400 leading-relaxed">
                  <IconAlert />
                  {errors.submit}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-[0.9375rem] mt-1 rounded-[10px] font-medium text-[0.9375rem] tracking-[0.02em] text-[#0c0c0e] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-px active:translate-y-0"
                style={{
                  background: "linear-gradient(135deg,#c49a40 0%,#d4af64 50%,#c49a40 100%)",
                  backgroundSize: "200% 100%",
                  boxShadow: "0 4px 24px rgba(212,175,100,0.2)",
                }}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-[rgba(12,12,14,0.25)] border-t-[#0c0c0e] rounded-full animate-spin" />
                    Creating account…
                  </span>
                ) : (
                  "Create Account"
                )}
              </button>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-[rgba(212,175,100,0.15)] to-transparent" />

              {/* Footer */}
              <p className="text-center text-[0.875rem] text-[rgba(240,230,200,0.35)]">
                Already have an account?{" "}
                <Link href="/login" className="text-[#d4af64] hover:opacity-70 transition-opacity">Sign in</Link>
              </p>

            </form>
          </div>
        </section>
      </div>
    </>
  );
}