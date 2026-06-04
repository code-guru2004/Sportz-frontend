// app/login/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { FcSportsMode } from "react-icons/fc";

export default function LoginPage() {
  const router = useRouter();
  const { login, user, loading } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [focused, setFocused] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("verified") === "true") {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    }
    if (!loading && user) {
      console.log("User status:", user);
      if (!user.profileCompleted) router.push("/complete-profile");
      else if (user?.approvalStatus==="PENDING") router.push("/waiting-approval");
    }
  }, [user, loading, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.email){
       newErrors.email = "Email is required";
    }
    if (!formData.password){
       newErrors.password = "Password is required";
    }
    if (Object.keys(newErrors).length > 0) { 
      setErrors(newErrors);
       return; 
    }
    setIsLoading(true);
    const result = await login(formData.email, formData.password);
    if (!result.success){
       setErrors({ submit: result.error });
       if(result.error ==='Email not verified'){
        sessionStorage.setItem("verifyEmail", formData.email);
        router.push("/verify-email");
       }
    }
    //console.log("Login",result)
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-var(--background)">
      {/* Left Panel - Hidden on mobile, shown on lg */}
      <aside className="hidden lg:flex lg:w-[44%] relative overflow-hidden bg-[#0f0f12] border-r border-[rgba(212,175,100,0.12)] flex-col justify-between p-12">
        {/* Glow effects */}
        <div className="absolute w-[420px] h-[420px] rounded-full blur-[90px] pointer-events-none bg-radial-gradient from-[rgba(212,175,100,0.14)] to-transparent top-[-80px] left-[-80px]" />
        <div className="absolute w-[320px] h-[320px] rounded-full blur-[90px] pointer-events-none bg-radial-gradient from-[rgba(150,120,200,0.10)] to-transparent bottom-[60px] right-[-60px]" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-[#504a3d] to-[#6e5f40] rounded-lg flex items-center justify-center">
            <FcSportsMode className="w-5 h-5" />
          </div>
          <span className="font-['Cormorant_Garamond',serif] text-xl font-semibold text-[#f0e6c8] tracking-wide">Sportz</span>
        </div>

        {/* Headline */}
        <div className="relative z-10">
          <h2 className="font-['Cormorant_Garamond',serif] text-[3.2rem] font-light leading-[1.15] text-[#f0e6c8] mb-5">
            Where trust<br/><em className="italic not-italic text-[#d4af64]">meets</em> clarity.
          </h2>
          <div className="w-12 h-px bg-gradient-to-r from-[#d4af64] to-transparent my-6" />
          <p className="text-sm leading-relaxed text-[rgba(240,230,200,0.45)] font-light">
            A secure platform built for professionals who value precision, integrity, and seamless collaboration.
          </p>
        </div>

        {/* Features */}
        <div className="relative z-10 flex flex-col gap-4">
          {["End-to-end encrypted sessions", "Real-time collaboration tools", "Role-based access control", "Audit logs & compliance ready"].map((f) => (
            <div className="flex items-center gap-3" key={f}>
              <div className="w-1.5 h-1.5 rounded-full bg-[#d4af64] flex-shrink-0" />
              <span className="text-[0.8125rem] text-[rgba(240,230,200,0.5)] font-light">{f}</span>
            </div>
          ))}
        </div>
      </aside>

      {/* Right Form Section */}
      <section className="flex-1 flex items-center justify-center p-8 lg:p-12 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none bg-radial-gradient from-[rgba(212,175,100,0.05)] to-transparent top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

        <div className="relative z-10 w-full max-w-[420px]">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-7 lg:hidden">
          <div className="w-9 h-9 bg-gradient-to-br from-[#504a3d] to-[#6e5f40] rounded-lg flex items-center justify-center">
            <FcSportsMode className="w-5 h-5" />
          </div>
            <span className="font-['Cormorant_Garamond',serif] text-base font-semibold text-[#f0e6c8] tracking-wide">Sportz</span>
          </div>

          {/* Success banner */}
          {showSuccess && (
            <div className="flex items-center gap-2.5 bg-[rgba(52,199,89,0.08)] border border-[rgba(52,199,89,0.2)] p-3 rounded-lg mb-7 animate-slideDown">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
                <circle cx="8" cy="8" r="7.5" stroke="#4ade80" strokeOpacity="0.5"/>
                <path d="M5 8l2 2 4-4" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-[0.8125rem] text-[#4ade80] font-normal">Email verified successfully. You may now sign in.</span>
            </div>
          )}

          {/* Card header */}
          <div className="mb-9">
            <p className="text-[0.6875rem] font-medium tracking-[0.14em] uppercase text-[#d4af64] mb-2.5">Secure Access</p>
            <h1 className="font-['Cormorant_Garamond',serif] text-4xl font-light leading-[1.1] text-[#f0e6c8] mb-2">
              Welcome<br/>back
            </h1>
            <p className="text-sm text-[rgba(240,230,200,0.4)] font-light">Sign in to continue to your workspace</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>
            <div className="flex flex-col gap-5">
              {/* Email field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[0.75rem] font-medium tracking-[0.06em] uppercase text-[rgba(240,230,200,0.5)]">
                  Email address
                </label>
                <div className="relative">
                  <span className={`absolute top-1/2 left-4 -translate-y-1/2 pointer-events-none transition-colors duration-200 flex items-center ${focused === "email" ? "text-[#d4af64]" : "text-[rgba(240,230,200,0.25)]"}`}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M2 4h12v8H2V4zm0 0l6 5 6-5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused("")}
                    placeholder="you@example.com"
                    className={`w-full py-3.5 px-4 pl-11 bg-[rgba(255,255,255,0.03)] border rounded-lg outline-none text-[#f0e6c8] text-[0.9375rem] font-['DM_Sans',sans-serif] font-light transition-all duration-200 box-border placeholder:text-[rgba(240,230,200,0.2)] focus:border-[rgba(212,175,100,0.45)] focus:bg-[rgba(212,175,100,0.04)] focus:shadow-[0_0_0_3px_rgba(212,175,100,0.07)] ${errors.email ? "border-[rgba(255,100,100,0.4)]" : "border-[rgba(240,230,200,0.1)]"}`}
                  />
                </div>
                {errors.email && <span className="text-[0.75rem] text-[#fc8181] mt-0.5">{errors.email}</span>}
              </div>

              {/* Password field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[0.75rem] font-medium tracking-[0.06em] uppercase text-[rgba(240,230,200,0.5)]">
                  Password
                </label>
                <div className="relative">
                  <span className={`absolute top-1/2 left-4 -translate-y-1/2 pointer-events-none transition-colors duration-200 flex items-center ${focused === "password" ? "text-[#d4af64]" : "text-[rgba(240,230,200,0.25)]"}`}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <rect x="3" y="7" width="10" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.25"/>
                      <path d="M5.5 7V5a2.5 2.5 0 015 0v2" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
                      <circle cx="8" cy="11" r="1" fill="currentColor"/>
                    </svg>
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocused("password")}
                    onBlur={() => setFocused("")}
                    placeholder="••••••••"
                    className={`w-full py-3.5 px-4 pl-11 pr-12 bg-[rgba(255,255,255,0.03)] border rounded-lg outline-none text-[#f0e6c8] text-[0.9375rem] font-['DM_Sans',sans-serif] font-light transition-all duration-200 box-border placeholder:text-[rgba(240,230,200,0.2)] focus:border-[rgba(212,175,100,0.45)] focus:bg-[rgba(212,175,100,0.04)] focus:shadow-[0_0_0_3px_rgba(212,175,100,0.07)] ${errors.password ? "border-[rgba(255,100,100,0.4)]" : "border-[rgba(240,230,200,0.1)]"}`}
                  />
                  <button
                    type="button"
                    className="absolute top-1/2 right-4 -translate-y-1/2 bg-none border-none cursor-pointer p-0 text-[rgba(240,230,200,0.3)] hover:text-[rgba(240,230,200,0.6)] transition-colors duration-200 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M2 8s2.5-4.5 6-4.5S14 8 14 8s-2.5 4.5-6 4.5S2 8 2 8z" stroke="currentColor" strokeWidth="1.25"/>
                        <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.25"/>
                        <path d="M2 2l12 12" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M2 8s2.5-4.5 6-4.5S14 8 14 8s-2.5 4.5-6 4.5S2 8 2 8z" stroke="currentColor" strokeWidth="1.25"/>
                        <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.25"/>
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && <span className="text-[0.75rem] text-[#fc8181] mt-0.5">{errors.password}</span>}
              </div>

              {/* Forgot password */}
              <div className="flex justify-end -mt-1">
                <Link href="/forgot-password" className="text-[0.8rem] text-[rgba(212,175,100,0.6)] hover:text-[#d4af64] transition-colors duration-200 no-underline">
                  Forgot password?
                </Link>
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

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full relative overflow-hidden py-3.5 bg-gradient-to-r from-[#c49a40] via-[#d4af64] to-[#c49a40] bg-[length:200%_100%] bg-[position:100%_0] border-none rounded-lg cursor-pointer text-[#0c0c0e] font-['DM_Sans',sans-serif] text-[0.9375rem] font-medium tracking-[0.03em] transition-all duration-400 ease-out hover:bg-[position:0_0] hover:-translate-y-px hover:shadow-[0_8px_32px_rgba(212,175,100,0.3)] active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_4px_24px_rgba(212,175,100,0.2)]"
              >
                <div className="flex items-center justify-center gap-2">
                  {isLoading && (
                    <div className="w-[18px] h-[18px] border-2 border-[rgba(12,12,14,0.2)] border-t-[#0c0c0e] rounded-full animate-spin" />
                  )}
                  {isLoading ? "Signing in…" : "Sign In"}
                </div>
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="h-px my-7 bg-gradient-to-r from-transparent via-[rgba(212,175,100,0.15)] to-transparent" />

          {/* Footer */}
          <div className="text-center text-sm text-[rgba(240,230,200,0.35)]">
            Don't have an account?{" "}
            <Link href="/register" className="text-[#d4af64] no-underline font-normal hover:opacity-75 transition-opacity duration-200">
              Create account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}