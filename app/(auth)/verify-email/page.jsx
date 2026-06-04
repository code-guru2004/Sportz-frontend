// app/verify-email/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FcSportsMode } from "react-icons/fc";

// Inline icons (same as register page)
const IconEmail = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="2" y="4" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.25" />
    <path d="M2 5l6 5 6-5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconLock = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="3" y="7" width="10" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.25" />
    <path d="M5.5 7V5a2.5 2.5 0 015 0v2" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    <circle cx="8" cy="11" r="1" fill="currentColor" />
  </svg>
);

const IconAlert = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
    <circle cx="7" cy="7" r="6.5" stroke="#fc8181" strokeOpacity="0.5" />
    <path d="M7 4v3.5M7 9.5v.5" stroke="#fc8181" strokeWidth="1.25" strokeLinecap="round" />
  </svg>
);

const IconCheck = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function VerifyEmailPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("verifyEmail");
  
    if (storedEmail) {
      setEmail(storedEmail);
    }else{
      router.replace("/login")
    }
  }, []);
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("request"); // "request" or "verify"
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [countdown, setCountdown] = useState(0);

//   // Auto-focus email from query param
//   useEffect(() => {
//     if (prefillEmail) setEmail(prefillEmail);
//   }, [prefillEmail]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Email address is required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      
      // Endpoint: resend-otp (same as used in register)
      const res = await fetch( `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to send verification code. Please try again.");
        setIsLoading(false);
        return;
      }

      // OTP sent successfully
      setSuccessMsg(`Verification code sent to ${email}`);
      setStep("verify");
      setCountdown(60);
      setIsLoading(false);
    } catch (err) {
      setError("Network error. Please check your connection.");
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setError("Please enter the 6-digit code");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Invalid or expired code. Please request a new one.");
        setIsLoading(false);
        return;
      }

      // Success – redirect to login
      sessionStorage.removeItem("verifyEmail");
      setSuccessMsg("Email verified! Redirecting to login...");
      setTimeout(() => {
        router.push("/login?verified=true");
      }, 1500);
    } catch (err) {
      setError("Verification failed. Please try again.");
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    setError("");
    setSuccessMsg("");
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setSuccessMsg(`New code sent to ${email}`);
      setCountdown(60);
    } catch (err) {
      setError("Could not resend code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Google Fonts style (if not already in layout) */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
      `}</style>

      <div className="min-h-screen bg-[#0c0c0e] flex flex-col lg:flex-row font-['DM_Sans',sans-serif]">
        {/* Left decorative panel (same style as login/register) */}
        <aside className="hidden lg:flex lg:w-[44%] relative overflow-hidden bg-[#0f0f12] border-r border-[rgba(212,175,100,0.12)] flex-col justify-between p-12">
          <div className="absolute w-[420px] h-[420px] rounded-full blur-[90px] pointer-events-none bg-radial-gradient from-[rgba(212,175,100,0.14)] to-transparent top-[-80px] left-[-80px]" />
          <div className="absolute w-[320px] h-[320px] rounded-full blur-[90px] pointer-events-none bg-radial-gradient from-[rgba(150,120,200,0.10)] to-transparent bottom-[60px] right-[-60px]" />

          <div className="relative z-10 flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-[#504a3d] to-[#6e5f40] rounded-lg flex items-center justify-center">
              <FcSportsMode className="w-5 h-5" />
            </div>
            <span className="font-['Cormorant_Garamond',serif] text-xl font-semibold text-[#f0e6c8] tracking-wide">Sportz</span>
          </div>

          <div className="relative z-10">
            <h2 className="font-['Cormorant_Garamond',serif] text-[3.2rem] font-light leading-[1.15] text-[#f0e6c8] mb-5">
              Verify your<br /><em className="italic not-italic text-[#d4af64]">email address</em>
            </h2>
            <div className="w-12 h-px bg-gradient-to-r from-[#d4af64] to-transparent my-6" />
            <p className="text-sm leading-relaxed text-[rgba(240,230,200,0.45)] font-light">
              One last step to unlock your account. We'll send a 6‑digit code to your inbox.
            </p>
          </div>

          <div className="relative z-10 flex flex-col gap-4">
            {["Secure & encrypted", "Code expires in 10 minutes", "One‑click resend", "Instant verification"].map((f) => (
              <div className="flex items-center gap-3" key={f}>
                <div className="w-1.5 h-1.5 rounded-full bg-[#d4af64] flex-shrink-0" />
                <span className="text-[0.8125rem] text-[rgba(240,230,200,0.5)] font-light">{f}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* Right content – centered form */}
        <section className="flex-1 flex items-center justify-center p-8 lg:p-12 relative overflow-hidden">
          <div className="absolute w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none bg-radial-gradient from-[rgba(212,175,100,0.05)] to-transparent top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

          <div className="relative z-10 w-full max-w-[420px]">
            {/* Mobile logo */}
            <div className="flex items-center gap-2 mb-7 lg:hidden">
              <div className="w-9 h-9 bg-gradient-to-br from-[#504a3d] to-[#6e5f40] rounded-lg flex items-center justify-center">
                <FcSportsMode className="w-5 h-5" />
              </div>
              <span className="font-['Cormorant_Garamond',serif] text-base font-semibold text-[#f0e6c8] tracking-wide">Sportz</span>
            </div>

            {/* Header */}
            <div className="mb-9">
              <p className="text-[0.6875rem] font-medium tracking-[0.14em] uppercase text-[#d4af64] mb-2.5">Email Verification</p>
              <h1 className="font-['Cormorant_Garamond',serif] text-4xl font-light leading-[1.1] text-[#f0e6c8] mb-2">
                {step === "request" ? "Confirm your email" : "Enter the code"}
              </h1>
              <p className="text-sm text-[rgba(240,230,200,0.4)] font-light">
                {step === "request"
                  ? "We'll send a 6‑digit verification code to your address."
                  : `We sent a code to ${email}`}
              </p>
            </div>

            {/* Success / error banners */}
            {successMsg && (
              <div className="flex items-center gap-2.5 bg-[rgba(52,199,89,0.08)] border border-[rgba(52,199,89,0.2)] p-3 rounded-lg mb-6 animate-slideDown">
                <IconCheck className="text-[#4ade80]" style={{ width: 16, height: 16 }} />
                <span className="text-[0.8125rem] text-[#4ade80]">{successMsg}</span>
              </div>
            )}
            {error && (
              <div className="flex items-start gap-2.5 bg-[rgba(255,100,100,0.07)] border border-[rgba(255,100,100,0.18)] p-3 rounded-lg mb-6">
                <IconAlert />
                <span className="text-[0.8125rem] text-[#fc8181] leading-relaxed">{error}</span>
              </div>
            )}

            {/* Step 1: Request OTP */}
            {step === "request" && (
              <form onSubmit={handleSendOtp} noValidate>
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[0.75rem] font-medium tracking-[0.06em] uppercase text-[rgba(240,230,200,0.5)]">
                      Email address <em className="text-xs">(you can't change email address.)</em>
                    </label>
                    <div className="relative">
                      <span className="absolute top-1/2 left-4 -translate-y-1/2 pointer-events-none text-[rgba(240,230,200,0.25)]">
                        <IconEmail />
                      </span>
                      <input
                        type="email"
                        value={email}
                        disabled={true}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full py-3.5 px-4 pl-11 bg-[rgba(255,255,255,0.03)] border border-[rgba(240,230,200,0.1)] rounded-lg outline-none text-[#f0e6c8] text-[0.9375rem] font-light placeholder:text-[rgba(240,230,200,0.2)] focus:border-[rgba(212,175,100,0.45)] focus:bg-[rgba(212,175,100,0.04)] focus:shadow-[0_0_0_3px_rgba(212,175,100,0.07)] transition-all duration-200"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full relative overflow-hidden py-3.5 bg-gradient-to-r from-[#c49a40] via-[#d4af64] to-[#c49a40] bg-[length:200%_100%] bg-[position:100%_0] border-none rounded-lg cursor-pointer text-[#0c0c0e] font-medium text-[0.9375rem] tracking-[0.03em] transition-all duration-400 ease-out hover:bg-[position:0_0] hover:-translate-y-px hover:shadow-[0_8px_32px_rgba(212,175,100,0.3)] disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_4px_24px_rgba(212,175,100,0.2)]"
                  >
                    <div className="flex items-center justify-center gap-2">
                      {isLoading && <div className="w-[18px] h-[18px] border-2 border-[rgba(12,12,14,0.2)] border-t-[#0c0c0e] rounded-full animate-spin" />}
                      {isLoading ? "Sending code..." : "Send verification code"}
                    </div>
                  </button>
                </div>
              </form>
            )}

            {/* Step 2: Enter OTP */}
            {step === "verify" && (
              <form onSubmit={handleVerifyOtp} noValidate>
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[0.75rem] font-medium tracking-[0.06em] uppercase text-[rgba(240,230,200,0.5)]">
                      Verification code
                    </label>
                    <div className="relative">
                      <span className="absolute top-1/2 left-4 -translate-y-1/2 pointer-events-none text-[rgba(240,230,200,0.25)]">
                        <IconLock />
                      </span>
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                        placeholder="0 0 0 0 0 0"
                        className="w-full py-3.5 px-4 pl-11 bg-[rgba(255,255,255,0.03)] border border-[rgba(240,230,200,0.1)] rounded-lg outline-none text-[#f0e6c8] text-[0.9375rem] font-light placeholder:text-[rgba(240,230,200,0.2)] tracking-wider focus:border-[rgba(212,175,100,0.45)] focus:bg-[rgba(212,175,100,0.04)] focus:shadow-[0_0_0_3px_rgba(212,175,100,0.07)] transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={countdown > 0 || isLoading}
                      className="text-[0.8rem] text-[rgba(212,175,100,0.7)] hover:text-[#d4af64] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {countdown > 0 ? `Resend in ${countdown}s` : "Resend code"}
                    </button>
                    <Link href="/login" className="text-[0.8rem] text-[rgba(240,230,200,0.4)] hover:text-[rgba(240,230,200,0.7)] transition-colors">
                      Back to login
                    </Link>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full relative overflow-hidden py-3.5 bg-gradient-to-r from-[#c49a40] via-[#d4af64] to-[#c49a40] bg-[length:200%_100%] bg-[position:100%_0] border-none rounded-lg cursor-pointer text-[#0c0c0e] font-medium text-[0.9375rem] tracking-[0.03em] transition-all duration-400 ease-out hover:bg-[position:0_0] hover:-translate-y-px hover:shadow-[0_8px_32px_rgba(212,175,100,0.3)] disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_4px_24px_rgba(212,175,100,0.2)]"
                  >
                    <div className="flex items-center justify-center gap-2">
                      {isLoading && <div className="w-[18px] h-[18px] border-2 border-[rgba(12,12,14,0.2)] border-t-[#0c0c0e] rounded-full animate-spin" />}
                      {isLoading ? "Verifying..." : "Verify & continue"}
                    </div>
                  </button>
                </div>
              </form>
            )}

            {/* Footer link for manual email change */}
            {step === "verify" && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => {
                    setStep("request");
                    setOtp("");
                    setError("");
                    setSuccessMsg("");
                  }}
                  className="text-[0.8rem] text-[rgba(240,230,200,0.35)] hover:text-[rgba(240,230,200,0.6)] transition-colors"
                >
                  ← Use a different email address
                </button>
              </div>
            )}

            <div className="h-px my-7 bg-gradient-to-r from-transparent via-[rgba(212,175,100,0.15)] to-transparent" />

            <div className="text-center text-sm text-[rgba(240,230,200,0.35)]">
              Already verified?{" "}
              <Link href="/login" className="text-[#d4af64] hover:opacity-75 transition-opacity">
                Sign in
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}