// app/coach/dashboard/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import axios from "axios";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";

const API_BASE_URL = "http://localhost:5000/api";

// ── Inline SVG Icons ──────────────────────────────────────────────────────────
const Icon = {
  User: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.25" />
      <path d="M2 14c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  ),
  Users: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <circle cx="6" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.25" />
      <path d="M1.5 14c0-2.761 2.015-4.5 4.5-4.5s4.5 1.739 4.5 4.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <path d="M11 7.5a2 2 0 000-4M14 14c0-2-1.343-3.5-3-3.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  ),
  Calendar: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <rect x="2" y="3" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.25" />
      <path d="M5 2v2M11 2v2M2 7h12" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  ),
  Email: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <rect x="2" y="4" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.25" />
      <path d="M2 5l6 5 6-5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Phone: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <rect x="4.5" y="1.5" width="7" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.25" />
      <circle cx="8" cy="12" r="0.75" fill="currentColor" />
    </svg>
  ),
  MapPin: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M8 1.5A4.5 4.5 0 0112.5 6c0 3-4.5 8.5-4.5 8.5S3.5 9 3.5 6A4.5 4.5 0 018 1.5z" stroke="currentColor" strokeWidth="1.25" />
      <circle cx="8" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  ),
  Star: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M8 2l1.8 3.6L14 6.5l-3 2.9.7 4.1L8 11.4l-3.7 2.1.7-4.1-3-2.9 4.2-.9L8 2z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
    </svg>
  ),
  Logout: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <path d="M10.5 11l3-3-3-3M13.5 8H6" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Refresh: ({ size = 16, spin }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={spin ? "animate-spin" : ""}>
      <path d="M13.5 8A5.5 5.5 0 012.5 8M2.5 8a5.5 5.5 0 0111 0" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <path d="M13.5 4.5V8H10" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Plus: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  Edit: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M11 2.5l2.5 2.5-8 8H3v-2.5l8-8z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
    </svg>
  ),
  Trash: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M3 4.5h10M6 4.5V3h4v1.5M5.5 4.5l.5 8h4l.5-8" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Clock: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.25" />
      <path d="M8 5v3l2 1.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Check: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Warning: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M8 2L1.5 13.5h13L8 2z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
      <path d="M8 7v3M8 11.5v.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  ),
  Search: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.25" />
      <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  ),
  Cap: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M10 3L2 8l8 5 8-5-8-5z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
      <path d="M5 10.5v4c0 1 2 2 5 2s5-1 5-2v-4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-[rgba(212,175,100,0.12)] bg-[rgba(212,175,100,0.03)] p-5">
      <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-[rgba(212,175,100,0.05)] blur-xl pointer-events-none" />
      <p className="text-[0.6875rem] font-medium tracking-[0.1em] uppercase text-[rgba(240,230,200,0.35)] mb-2">{label}</p>
      <p className="text-[2rem] font-light text-[#f0e6c8] leading-none mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{value ?? "—"}</p>
      {sub && <p className="text-[0.75rem] text-[rgba(240,230,200,0.3)] font-light">{sub}</p>}
    </div>
  );
}

// ── Status badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    SCHEDULED: { icon: <Icon.Check size={11} />, label: "Scheduled", cls: "bg-[rgba(52,199,89,0.08)] border-[rgba(52,199,89,0.2)] text-emerald-400" },
    COMPLETED: { icon: <Icon.Clock size={11} />, label: "Completed", cls: "bg-[rgba(212,175,100,0.08)] border-[rgba(212,175,100,0.2)] text-[#d4af64]" },
    CANCELLED: { icon: <Icon.Warning size={11} />, label: "Cancelled", cls: "bg-[rgba(255,100,100,0.08)] border-[rgba(255,100,100,0.2)] text-red-400" },
  };
  const s = map[status];
  if (!s) return null;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[0.7rem] font-medium ${s.cls}`}>
      {s.icon}{s.label}
    </span>
  );
}

// ── Profile detail row ────────────────────────────────────────────────────────
function DetailRow({ icon, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2.5">
      <span className="text-[rgba(240,230,200,0.25)] mt-0.5 flex-shrink-0">{icon}</span>
      <span className="text-[0.8125rem] text-[rgba(240,230,200,0.5)] font-light leading-relaxed break-all">{value}</span>
    </div>
  );
}

// ── Tab button ────────────────────────────────────────────────────────────────
function TabBtn({ active, onClick, icon, label, count }) {
  return (
    <button
      onClick={onClick}
      className={[
        "flex items-center gap-2 pb-3.5 px-1 text-[0.875rem] font-medium border-b-2 transition-all duration-200 whitespace-nowrap",
        active
          ? "border-[#d4af64] text-[#d4af64]"
          : "border-transparent text-[rgba(240,230,200,0.35)] hover:text-[rgba(240,230,200,0.6)]",
      ].join(" ")}
    >
      <span className="opacity-80">{icon}</span>
      {label}
      {count !== undefined && (
        <span className={`text-[0.7rem] px-1.5 py-0.5 rounded-full border font-medium ${active ? "border-[rgba(212,175,100,0.3)] bg-[rgba(212,175,100,0.08)] text-[#d4af64]" : "border-[rgba(240,230,200,0.1)] bg-white/[0.03] text-[rgba(240,230,200,0.3)]"}`}>
          {count}
        </span>
      )}
    </button>
  );
}

// ── Delete modal ──────────────────────────────────────────────────────────────
function DeleteModal({ schedule, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-sm bg-[#131316] border border-[rgba(212,175,100,0.15)] rounded-2xl p-7 shadow-2xl">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-[rgba(255,100,100,0.06)] blur-3xl pointer-events-none" />
        <div className="text-center relative">
          <div className="mx-auto mb-4 w-12 h-12 rounded-xl bg-[rgba(255,100,100,0.08)] border border-[rgba(255,100,100,0.2)] flex items-center justify-center text-red-400">
            <Icon.Trash size={20} />
          </div>
          <p className="text-[0.6875rem] font-medium tracking-[0.12em] uppercase text-red-400/60 mb-2">Confirm Delete</p>
          <h3 className="text-xl font-light text-[#f0e6c8] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Delete Schedule</h3>
          <p className="text-[0.8125rem] text-[rgba(240,230,200,0.4)] font-light leading-relaxed mb-6">
            Are you sure you want to delete <span className="text-[rgba(240,230,200,0.65)]">"{schedule.title}"</span>? This cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 py-2.5 rounded-[10px] text-[0.875rem] font-medium text-[rgba(240,230,200,0.45)] border border-[rgba(240,230,200,0.1)] bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-2.5 rounded-[10px] text-[0.875rem] font-medium text-white bg-red-500/80 hover:bg-red-500 border border-red-500/30 transition-all duration-200"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function CoachDashboard() {
  const router = useRouter();
  const { user, profile, getProfile, logout, loading, accessToken } = useAuth();

  const [activeTab, setActiveTab] = useState("personal");
  const [isFetchingProfile, setIsFetchingProfile] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [players, setPlayers] = useState([]);
  const [playerSearch, setPlayerSearch] = useState("");
  const [isLoadingSchedules, setIsLoadingSchedules] = useState(false);
  const [isLoadingPlayers, setIsLoadingPlayers] = useState(false);
  const [deleteModal, setDeleteModal] = useState(null);
  const [dashboardStats, setDashboardStats] = useState({ sport: "", activeSchedules: 0, totalSchedules: 0, totalPlayersOfSport: 0 });

  useEffect(() => {
    if (!loading && !user) router.push("/login");
    else if (!loading && user && !user.isApproved) router.push("/waiting-approval");
    else if (!loading && user && !user.profileCompleted) router.push("/complete-profile");
  }, [user, loading, router]);

  useEffect(() => {
    if (user?.profileCompleted) fetchUserProfile();
  }, [user]);

  useEffect(() => {
    if (profileData) fetchCoachDashboardStats();
  }, [profileData]);

  useEffect(() => {
    if (activeTab === "players" && user?.profileCompleted) fetchPlayers();
    if (activeTab === "schedules" && user?.profileCompleted) fetchSchedules();
  }, [activeTab, user]);

  const fetchUserProfile = async () => {
    setIsFetchingProfile(true);
    const result = await getProfile();
    if (result.success) setProfileData(result.data);
    setIsFetchingProfile(false);
  };

  const fetchCoachDashboardStats = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/users/coach/dashboard-stats`, { headers: { Authorization: `Bearer ${accessToken}` }, withCredentials: true });
      if (res.data.success) setDashboardStats(res.data.stats);
    } catch { }
  };

  const fetchSchedules = async () => {
    setIsLoadingSchedules(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/schedules`, { headers: { Authorization: `Bearer ${accessToken}` }, withCredentials: true });
      if (res.data.success) setSchedules(res.data.schedules);
    } catch { toast.error("Failed to fetch schedules"); }
    finally { setIsLoadingSchedules(false); }
  };

  const fetchPlayers = async () => {
    setIsLoadingPlayers(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/users/athletes`, { headers: { Authorization: `Bearer ${accessToken}` }, withCredentials: true, params: { sport: profileData?.sport } });
      if (res.data.success) setPlayers(res.data.athletes);
    } catch { toast.error("Failed to fetch players"); }
    finally { setIsLoadingPlayers(false); }
  };

  const handleDeleteSchedule = async (scheduleId) => {
    try {
      const res = await axios.delete(`${API_BASE_URL}/schedules/${scheduleId}`, { headers: { Authorization: `Bearer ${accessToken}` }, withCredentials: true });
      if (res.data.success) {
        setSchedules(s => s.filter(x => x._id !== scheduleId));
        setDeleteModal(null);
        fetchCoachDashboardStats();
        toast.success("Schedule deleted successfully!");
      }
    } catch { toast.error("Failed to delete schedule"); }
  };

  const displayProfile = profileData || profile;
  const filteredPlayers = players.filter(p =>
    !playerSearch || p.fullName?.toLowerCase().includes(playerSearch.toLowerCase()) || p.user?.email?.toLowerCase().includes(playerSearch.toLowerCase())
  );

  if (loading || isFetchingProfile) {
    return (
      <div className="min-h-screen bg-[#0c0c0e] flex items-center justify-center" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[rgba(212,175,100,0.15)] border-t-[#d4af64] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[0.875rem] text-[rgba(240,230,200,0.3)] font-light">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        body { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <div className="min-h-screen bg-[#0c0c0e]">

        {/* Delete Modal */}
        {deleteModal && (
          <DeleteModal
            schedule={deleteModal}
            onConfirm={() => handleDeleteSchedule(deleteModal.id)}
            onCancel={() => setDeleteModal(null)}
          />
        )}

        {/* ── Navbar ── */}
        <nav className="sticky top-0 z-40 bg-[#0f0f12] border-b border-[rgba(212,175,100,0.1)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#d4af64] to-[#c49a40] flex items-center justify-center shadow-md">
                  <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                    <path d="M9 2L11.5 7H16.5L12.5 10.5L14 15.5L9 12.5L4 15.5L5.5 10.5L1.5 7H6.5L9 2Z" fill="#0c0c0e" />
                  </svg>
                </div>
                <span className="text-[rgba(240,230,200,0.6)] text-[0.75rem] font-medium tracking-wider uppercase hidden sm:block" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Coach Portal
                </span>
              </div>

              {/* Right side */}
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[rgba(212,175,100,0.08)] border border-[rgba(212,175,100,0.15)] flex items-center justify-center text-[rgba(240,230,200,0.4)]">
                    <Icon.User size={14} />
                  </div>
                  <span className="text-[0.8125rem] text-[rgba(240,230,200,0.45)] font-light">
                    {displayProfile?.fullName || user?.username}
                  </span>
                </div>
                <div className="w-px h-5 bg-[rgba(240,230,200,0.08)]" />
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-[0.8125rem] text-[rgba(240,230,200,0.35)] hover:text-red-400 hover:bg-[rgba(255,100,100,0.06)] rounded-lg transition-all duration-200"
                >
                  <Icon.Logout size={14} />
                  <span className="hidden sm:block">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          {/* ── Welcome Banner ── */}
          <div className="relative overflow-hidden rounded-2xl border border-[rgba(212,175,100,0.15)] bg-[rgba(212,175,100,0.03)] p-8 mb-10">
            <div className="absolute -top-12 -right-12 w-56 h-56 rounded-full bg-[rgba(212,175,100,0.07)] blur-[60px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-[rgba(100,80,180,0.05)] blur-[50px] pointer-events-none" />
            {/* Decorative lines */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[rgba(212,175,100,0.3)] to-transparent" />
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <p className="text-[0.6875rem] font-medium tracking-[0.14em] uppercase text-[#d4af64] mb-2">Coach Dashboard</p>
                <h1 className="text-[2.25rem] font-light leading-[1.1] text-[#f0e6c8] mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Welcome back,{" "}
                  <em className="italic text-[#d4af64]">{displayProfile?.fullName?.split(" ")[0] || user?.username}</em>
                </h1>
                <p className="text-[0.875rem] text-[rgba(240,230,200,0.4)] font-light">
                  Manage your athletes, track progress, and build training schedules.
                </p>
              </div>
              
            </div>
          </div>

          {/* ── Tabs ── */}
          <div className="border-b border-[rgba(240,230,200,0.08)] mb-8">
            <div className="flex gap-6 overflow-x-auto">
              <TabBtn active={activeTab === "personal"} onClick={() => setActiveTab("personal")} icon={<Icon.User />} label="Personal Details" />
              <TabBtn active={activeTab === "players"} onClick={() => setActiveTab("players")} icon={<Icon.Users />} label="Players" count={players.length} />
              <TabBtn active={activeTab === "schedules"} onClick={() => setActiveTab("schedules")} icon={<Icon.Calendar />} label="Schedules" count={schedules.length} />
            </div>
          </div>

          {/* ── Personal Tab ── */}
          {activeTab === "personal" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile card */}
              <div className="lg:col-span-1">
                <div className="rounded-2xl border border-[rgba(240,230,200,0.08)] bg-[#0f0f12] p-6 sticky top-24">
                  {/* Avatar */}
                  <div className="text-center mb-5">
                    <div className="relative inline-block mb-4">
                      <div className="w-20 h-20 rounded-2xl bg-[rgba(212,175,100,0.07)] border border-[rgba(212,175,100,0.2)] flex items-center justify-center  text-[rgba(240,230,200,0.25)]">
                        <Image
                          src={profileData?.profilePictureUrl || "/default-avatar.png"}
                          alt="Avatar"
                          width={28}
                          height={28}
                          className="rounded-lg object-cover w-full h-full"
                        />
                      </div>
                      <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-lg bg-gradient-to-br from-[#d4af64] to-[#c49a40] flex items-center justify-center text-[#0c0c0e]">
                        <Icon.Cap size={14} />
                      </div>
                    </div>
                    <h2 className="text-[1.1rem] font-medium text-[#f0e6c8] leading-tight mb-0.5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      {displayProfile?.fullName || user?.username}
                    </h2>
                    <p className="text-[0.75rem] text-[rgba(240,230,200,0.3)] font-light mb-3">@{user?.username}</p>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[rgba(212,175,100,0.2)] bg-[rgba(212,175,100,0.08)] text-[0.7rem] text-[#d4af64] font-medium tracking-wide uppercase">
                      <Icon.Cap size={11} />
                      Coach
                    </span>
                  </div>

                  <div className="h-px bg-[rgba(240,230,200,0.06)] mb-4" />

                  <div className="flex flex-col gap-3">
                    <DetailRow icon={<Icon.Email />} value={user?.email} />
                    <DetailRow icon={<Icon.Phone />} value={user?.phone} />
                    <DetailRow icon={<Icon.Star />} value={displayProfile?.sport ? `Sport: ${displayProfile.sport}` : null} />
                    <DetailRow icon={<Icon.Star />} value={displayProfile?.club ? `Club: ${displayProfile.club}` : null} />
                    <DetailRow icon={<Icon.MapPin />} value={displayProfile?.address} />
                    <DetailRow icon={<Icon.Calendar />} value={displayProfile?.age ? `Age: ${displayProfile.age} years` : null} />
                  </div>

                  {displayProfile?.bio && (
                    <>
                      <div className="h-px bg-[rgba(240,230,200,0.06)] my-4" />
                      <p className="text-[0.8125rem] text-[rgba(240,230,200,0.35)] font-light italic leading-relaxed">
                        "{displayProfile.bio}"
                      </p>
                    </>
                  )}

                  <button
                    onClick={fetchUserProfile}
                    disabled={isFetchingProfile}
                    className="mt-5 w-full flex items-center justify-center gap-2 py-2.5 text-[0.8rem] text-[rgba(240,230,200,0.4)] border border-[rgba(240,230,200,0.08)] rounded-[10px] hover:border-[rgba(212,175,100,0.2)] hover:text-[rgba(212,175,100,0.6)] transition-all duration-200 disabled:opacity-40"
                  >
                    <Icon.Refresh size={13} spin={isFetchingProfile} />
                    Refresh Profile
                  </button>
                  <Link href="/edit-profile" className="mt-3 w-full inline-flex items-center justify-center gap-2 py-2.5 text-[0.8rem] text-[#d4af64] border border-[rgba(212,175,100,0.2)] rounded-[10px] hover:bg-[rgba(212,175,100,0.05)] transition-all duration-200">
                    <Icon.Edit size={13} />
                    Edit Profile
                  </Link>
                </div>
              </div>

              {/* Stats */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                <div className="rounded-2xl border border-[rgba(240,230,200,0.08)] bg-[#0f0f12] p-6">
                  <p className="text-[0.6875rem] font-medium tracking-[0.1em] uppercase text-[rgba(240,230,200,0.35)] mb-5">Coaching Statistics</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <StatCard label="Sport" value={dashboardStats.sport || displayProfile?.sport || "—"} />
                    <StatCard label="Active Schedules" value={dashboardStats.activeSchedules} sub="currently running" />
                    <StatCard label="Total Players" value={dashboardStats.totalPlayersOfSport} sub="in your sport" />
                  </div>
                </div>

                {/* Level badge if available */}
                {displayProfile?.level && (
                  <div className="rounded-2xl border border-[rgba(240,230,200,0.08)] bg-[#0f0f12] p-6">
                    <p className="text-[0.6875rem] font-medium tracking-[0.1em] uppercase text-[rgba(240,230,200,0.35)] mb-4">Certification Level</p>
                    <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[rgba(212,175,100,0.2)] bg-[rgba(212,175,100,0.05)]">
                      <span className="w-2 h-2 rounded-full bg-[#d4af64]" />
                      <span className="text-[0.9rem] text-[rgba(240,230,200,0.7)] font-light">{displayProfile.level}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Players Tab ── */}
          {activeTab === "players" && (
            <div>
              {/* Toolbar */}
              <div className="flex items-center justify-between gap-4 mb-6">
                <div className="relative flex-1 max-w-sm">
                  <span className="absolute top-1/2 left-3.5 -translate-y-1/2 text-[rgba(240,230,200,0.25)]">
                    <Icon.Search size={15} />
                  </span>
                  <input
                    type="text"
                    value={playerSearch}
                    onChange={e => setPlayerSearch(e.target.value)}
                    placeholder="Search players…"
                    className="w-full pl-9 pr-4 py-2.5 bg-white/[0.03] border border-[rgba(240,230,200,0.1)] rounded-[10px] outline-none text-[0.875rem] text-[#f0e6c8] font-light placeholder:text-[rgba(240,230,200,0.2)] focus:border-[rgba(212,175,100,0.35)] transition-all duration-200"
                  />
                </div>
                <button
                  onClick={fetchPlayers}
                  className="flex items-center gap-1.5 px-3 py-2.5 text-[0.8125rem] text-[rgba(240,230,200,0.4)] border border-[rgba(240,230,200,0.08)] rounded-[10px] hover:border-[rgba(212,175,100,0.2)] hover:text-[rgba(212,175,100,0.6)] transition-all duration-200"
                >
                  <Icon.Refresh size={14} spin={isLoadingPlayers} />
                  <span className="hidden sm:block">Refresh</span>
                </button>
              </div>

              {isLoadingPlayers ? (
                <div className="flex flex-col items-center justify-center py-24 gap-3">
                  <div className="w-8 h-8 border-2 border-[rgba(212,175,100,0.15)] border-t-[#d4af64] rounded-full animate-spin" />
                  <p className="text-[0.875rem] text-[rgba(240,230,200,0.3)] font-light">Loading players…</p>
                </div>
              ) : filteredPlayers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-[rgba(240,230,200,0.03)] border border-[rgba(240,230,200,0.07)] flex items-center justify-center text-[rgba(240,230,200,0.2)]">
                    <Icon.Users size={24} />
                  </div>
                  <p className="text-[0.875rem] text-[rgba(240,230,200,0.3)] font-light">No players found for your sport</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredPlayers.map(player => (
                    <div key={player._id} className="group rounded-xl border border-[rgba(240,230,200,0.08)] bg-[#0f0f12] p-5 hover:border-[rgba(212,175,100,0.2)] transition-all duration-200">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-[rgba(212,175,100,0.07)] border border-[rgba(212,175,100,0.15)] flex items-center justify-center text-[rgba(240,230,200,0.3)] flex-shrink-0">
                          <Icon.User size={16} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[0.875rem] font-medium text-[rgba(240,230,200,0.75)] leading-none mb-0.5 truncate">{player.fullName}</p>
                          <p className="text-[0.7375rem] text-[rgba(240,230,200,0.3)] font-light truncate">{player.user?.email}</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        {[["Sport", player.sport], ["Level", player.level], ["Age", player.age ? `${player.age} yrs` : null]].map(([k, v]) => v && (
                          <div key={k} className="flex justify-between items-center">
                            <span className="text-[0.7rem] text-[rgba(240,230,200,0.25)] uppercase tracking-wider">{k}</span>
                            <span className="text-[0.8rem] text-[rgba(240,230,200,0.5)] font-light">{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Schedules Tab ── */}
          {activeTab === "schedules" && (
            <div>
              {/* Toolbar */}
              <div className="flex items-center justify-between gap-4 mb-6">
                <p className="text-[0.6875rem] font-medium tracking-[0.1em] uppercase text-[rgba(240,230,200,0.35)]">
                  {schedules.length} {schedules.length === 1 ? "schedule" : "schedules"}
                </p>
                <button
                  onClick={() => router.push("/coach/schedule/create")}
                  className="flex items-center gap-2 px-4 py-2.5 text-[0.875rem] font-medium text-[#0c0c0e] rounded-[10px] transition-all duration-200 hover:-translate-y-px"
                  style={{ background: "linear-gradient(135deg,#c49a40,#d4af64)", boxShadow: "0 4px 16px rgba(212,175,100,0.2)" }}
                >
                  <Icon.Plus size={15} />
                  Create Schedule
                </button>
              </div>

              {isLoadingSchedules ? (
                <div className="flex flex-col items-center justify-center py-24 gap-3">
                  <div className="w-8 h-8 border-2 border-[rgba(212,175,100,0.15)] border-t-[#d4af64] rounded-full animate-spin" />
                  <p className="text-[0.875rem] text-[rgba(240,230,200,0.3)] font-light">Loading schedules…</p>
                </div>
              ) : schedules.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[rgba(240,230,200,0.03)] border border-[rgba(240,230,200,0.07)] flex items-center justify-center text-[rgba(240,230,200,0.2)]">
                    <Icon.Calendar size={24} />
                  </div>
                  <p className="text-[0.875rem] text-[rgba(240,230,200,0.3)] font-light">No schedules created yet</p>
                  <button
                    onClick={() => router.push("/coach/schedule/create")}
                    className="text-[0.875rem] text-[#d4af64] hover:opacity-70 transition-opacity"
                  >
                    Create your first schedule →
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {schedules.map(schedule => (
                    <div
                      key={schedule._id}
                      className="group rounded-xl border border-[rgba(240,230,200,0.08)] bg-[#0f0f12] p-5 hover:border-[rgba(212,175,100,0.18)] transition-all duration-200"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          {/* Title + badge */}
                          <div className="flex items-center gap-3 flex-wrap mb-3">
                            <h4 className="text-[1rem] font-medium text-[rgba(240,230,200,0.8)]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                              {schedule.title}
                            </h4>
                            <StatusBadge status={schedule.status} />
                          </div>
                          {/* Meta grid */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {[
                              { icon: <Icon.Calendar size={13} />, val: new Date(schedule.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) },
                              { icon: <Icon.Clock size={13} />, val: schedule.time },
                              { icon: <Icon.MapPin size={13} />, val: schedule.location },
                              { icon: <Icon.Users size={13} />, val: `${schedule.maxParticipants} max` },
                            ].map((item, i) => (
                              <div key={i} className="flex items-center gap-1.5 text-[0.7875rem] text-[rgba(240,230,200,0.38)] font-light">
                                <span className="text-[rgba(240,230,200,0.2)]">{item.icon}</span>
                                <span className="truncate">{item.val}</span>
                              </div>
                            ))}
                          </div>
                          {schedule.description && (
                            <p className="mt-2.5 text-[0.8rem] text-[rgba(240,230,200,0.3)] font-light leading-relaxed line-clamp-2">
                              {schedule.description}
                            </p>
                          )}
                        </div>
                        {/* Actions */}
                        <div className="flex gap-1.5 flex-shrink-0">
                          <button
                            onClick={() => router.push(`/coach/schedule/edit/${schedule._id}`)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-[rgba(240,230,200,0.3)] border border-[rgba(240,230,200,0.07)] hover:text-[rgba(212,175,100,0.7)] hover:border-[rgba(212,175,100,0.2)] hover:bg-[rgba(212,175,100,0.05)] transition-all duration-200"
                          >
                            <Icon.Edit size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteModal({ id: schedule._id, title: schedule.title })}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-[rgba(240,230,200,0.3)] border border-[rgba(240,230,200,0.07)] hover:text-red-400 hover:border-[rgba(255,100,100,0.2)] hover:bg-[rgba(255,100,100,0.05)] transition-all duration-200"
                          >
                            <Icon.Trash size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </>
  );
}