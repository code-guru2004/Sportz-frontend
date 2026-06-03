// app/waiting-approval/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import axios from "axios";
import { Check, Lock, LogOut, Mails, RotateCw } from "lucide-react";
import { FcSportsMode } from "react-icons/fc";

const API_BASE_URL = "http://localhost:5000/api";


// ── Status card ───────────────────────────────────────────────────────────────
function StatusCard({ icon, title, body, accent }) {
  const accentStyles = {
    gold:  { border: "border-[rgba(212,175,100,0.2)]", bg: "bg-[rgba(212,175,100,0.04)]", icon: "bg-[rgba(212,175,100,0.12)] text-[#d4af64]" },
    muted: { border: "border-[rgba(240,230,200,0.08)]", bg: "bg-white/[0.02]", icon: "bg-white/[0.05] text-[rgba(240,230,200,0.4)]" },
  };
  const s = accentStyles[accent] || accentStyles.muted;
  return (
    <div className={`flex items-start gap-3.5 p-4 rounded-xl border ${s.border} ${s.bg}`}>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${s.icon}`}>
        {icon}
      </div>
      <div>
        <p className="text-[0.8125rem] font-medium text-[rgba(240,230,200,0.75)] leading-none mb-1">{title}</p>
        <p className="text-[0.7875rem] font-light text-[rgba(240,230,200,0.38)] leading-relaxed">{body}</p>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function WaitingApprovalPage() {
  const router = useRouter();
  const { user, logout, loading, accessToken } = useAuth();
  const [checking, setChecking] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null); // { type: 'error'|'info', text }

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  const handleCheckStatus = async () => {
    setChecking(true);
    setStatusMsg(null);
    try {
      const res = await axios.get(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
      });
      if (res.data.success && res.data.user.approvalStatus==="APPROVED") {
        router.push("/dashboard");
      } else {
        setStatusMsg({ type: "info", text: "Your account is still under review. We'll notify you by email." });
      }
    } catch {
      setStatusMsg({ type: "error", text: "Couldn't reach the server. Please try again shortly." });
    } finally {
      setChecking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0c0c0e] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[rgba(212,175,100,0.15)] border-t-[#d4af64] rounded-full animate-spin" />
      </div>
    );
  }

  const displayName = user?.username || user?.fullName || "there";

  return (
    <>

      <div className="font-body min-h-screen bg-[#0c0c0e] flex items-center justify-center px-5 relative overflow-hidden">

        {/* Background glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-[rgba(212,175,100,0.06)] blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-[rgba(100,80,180,0.05)] blur-[100px] pointer-events-none" />

        {/* Logo — top left */}
        <div className="absolute top-8 left-8 flex items-center gap-2.5 z-10">
          <div className="w-9 h-9 bg-gradient-to-br from-[#504a3d] to-[#6e5f40] rounded-lg flex items-center justify-center">
                      <FcSportsMode className="w-5 h-5" />
                    </div>
          <span className="font-display text-lg font-semibold text-[#f0e6c8] tracking-wide hidden sm:block">Sportz</span>
        </div>

        {/* Card */}
        <div className="relative z-10 w-full max-w-[420px] anim-fade-up mt-7">

          {/* Animated clock graphic */}
         

          {/* Eyebrow + heading */}
          <div className="text-center mb-7">
            <p className="text-[0.6875rem] font-medium tracking-[0.14em] uppercase text-[#d4af64] mb-2">
              Pending Review
            </p>
            <h1 className="font-display font-light text-[2.5rem] leading-[1.1] text-[#f0e6c8] mb-3">
              You're in the<br/><em className="italic text-[#d4af64]">queue</em>
            </h1>
            <p className="text-[0.875rem] font-light text-[rgba(240,230,200,0.4)] leading-relaxed">
              Welcome aboard,{" "}
              <span className="text-[rgba(240,230,200,0.65)]">{displayName}</span>.
              {" "}Your profile has been submitted and is awaiting admin approval.
            </p>
          </div>

          {/* Status cards */}
          <div className="flex flex-col gap-2.5 mb-7">
            <StatusCard
              accent="gold"
              icon={<Check />}
              title="Profile submitted"
              body="Your details and documents have been received successfully."
            />
            <StatusCard
              accent="muted"
              icon={<Lock />}
              title="Admin review in progress"
              body="Our team typically reviews applications within 24–48 hours."
            />
            <StatusCard
              accent="muted"
              icon={<Mails />}
              title="Email notification"
              body="We'll send a confirmation to your registered email address once approved."
            />
          </div>

          {/* Status message feedback */}
          {statusMsg && (
            <div className={[
              "mb-5 px-4 py-3 rounded-[10px] text-[0.8125rem] font-light leading-relaxed text-center",
              statusMsg.type === "error"
                ? "bg-[rgba(255,100,100,0.07)] border border-[rgba(255,100,100,0.18)] text-red-400"
                : "bg-[rgba(212,175,100,0.07)] border border-[rgba(212,175,100,0.2)] text-[rgba(240,230,200,0.6)]",
            ].join(" ")}>
              {statusMsg.text}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleCheckStatus}
              disabled={checking}
              className="w-full py-[0.9375rem] rounded-[10px] font-medium text-[0.9375rem] tracking-[0.02em] text-[#0c0c0e] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-px active:translate-y-0"
              style={{
                background: "linear-gradient(135deg,#c49a40 0%,#d4af64 50%,#c49a40 100%)",
                backgroundSize: "200% 100%",
                boxShadow: "0 4px 24px rgba(212,175,100,0.2)",
              }}
            >
              {checking ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-[rgba(12,12,14,0.25)] border-t-[#0c0c0e] rounded-full animate-spin" />
                  Checking…
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <RotateCw />
                  Check Approval Status
                </span>
              )}
            </button>

            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 py-3 text-[0.875rem] font-light text-[rgba(240,230,200,0.35)] hover:text-[rgba(240,230,200,0.6)] transition-colors duration-200"
            >
              <LogOut size={15}/>
              Sign out
            </button>
          </div>

          {/* Footer note */}
          <div className="mt-8 pt-6 border-t border-[rgba(212,175,100,0.08)] text-center">
            <p className="text-[0.75rem] text-[rgba(240,230,200,0.22)] font-light">
              Questions?{" "}
              <a
                href="mailto:support@sportz.com"
                className="text-[rgba(212,175,100,0.5)] hover:text-[#d4af64] transition-colors duration-200"
              >
                support@sportz.com
              </a>
            </p>
          </div>

        </div>
      </div>
    </>
  );
}