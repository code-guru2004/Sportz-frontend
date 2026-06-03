// app/athlete/dashboard/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import {
  User,
  Trophy,
  Calendar,
  MapPin,
  Briefcase,
  Mail,
  Phone,
  LogOut,
  BarChart3,
  Clock,
  BadgeCheck,
  RefreshCw,
  Dumbbell,
  Target,
  Award,
  ChevronRight,
  Edit
} from "lucide-react";
import axios from "axios";
import Link from "next/link";
import { RiNotification2Fill } from "react-icons/ri";
import NotificationSheet from "@/components/athlete/NotificationBar";

const API_BASE_URL = "http://localhost:5000/api";

export default function AthleteDashboard() {
  const router = useRouter();
  const { user, profile, getProfile, logout, loading, accessToken } = useAuth();
  const [stats, setStats] = useState({
    totalMatches: 12,
    wins: 8,
    losses: 4,
    averageScore: 85.5
  });
  const [isFetchingProfile, setIsFetchingProfile] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [scheduleEvents, setScheduleEvents] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [openNotification, setOpenNotification] = useState(false);


  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (!loading && user && user.approvelStatus === "PENDING") {
      router.push("/waiting-approval");
    } else if (!loading && user && !user.profileCompleted) {
      router.push("/complete-profile");
    } else if (!loading && user && user.profileCompleted && !profile) {
      fetchUserProfile();
    } else if (profile) {
      setProfileData(profile);
      fetchScheduleEvents(profile.sport);
    }
  }, [user, profile, loading, router]);

  const fetchUserProfile = async () => {
    setIsFetchingProfile(true);
    const result = await getProfile();
    if (result.success) {
      setProfileData(result.data);
    }
    setIsFetchingProfile(false);
  };

  const fetchScheduleEvents = async (sport) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/schedules`, {
        params: { sport },
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
      });

      if (response.data.success) {
        // Filter only upcoming schedules (not completed or cancelled)
        const upcoming = response.data.schedules.filter(
          schedule => schedule.status === "SCHEDULED"
        );
        setScheduleEvents(upcoming);
        
        // Also update upcoming matches for the separate section
        setUpcomingMatches(upcoming.slice(0, 3));
      }
    } catch (error) {
      console.error("Error fetching schedule:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysLeft = (dateString) => {
    const eventDate = new Date(dateString);
    const today = new Date();
    const diffTime = eventDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading || isFetchingProfile) {
    return (
      <div className="min-h-screen bg-[#0c0c0e] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-[rgba(212,175,100,0.2)] border-t-[#d4af64] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[rgba(240,230,200,0.5)] font-body text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const displayProfile = profileData || profile;

  return (
    <div className="min-h-screen bg-[#0c0c0e] font-['DM_Sans',sans-serif]">
      {/* Navbar */}
      <nav className="bg-[#0f0f12] border-b border-[rgba(212,175,100,0.12)] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-gradient-to-br from-[#d4af64] to-[#c49a40] rounded-lg flex items-center justify-center">
                <Trophy className="w-4 h-4 text-[#0c0c0e]" />
              </div>
              <span className="font-display text-xl font-semibold text-[#f0e6c8] tracking-wide">
                Athlete Portal
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div>
                <button onClick={() => setOpenNotification(true)} className="relative p-2 rounded-lg bg-[rgba(212,175,100,0.1)] text-[rgba(212,175,100,0.6)] hover:text-[#d4af64] transition-colors">
                  <RiNotification2Fill className="w-5 h-5 text-[rgba(212,175,100,0.6)] hover:text-[#d4af64] transition-colors" />
                </button>
              </div>
              <span className="text-sm text-[rgba(240,230,200,0.6)] font-body hidden md:inline">
                Welcome, {displayProfile?.fullName || user?.username}
              </span>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-body text-[#fc8181] hover:bg-[rgba(255,100,100,0.1)] rounded-lg transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Controlled Sheet */}
      <NotificationSheet open={openNotification} setOpen={setOpenNotification} />
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-[rgba(212,175,100,0.1)] to-[rgba(212,175,100,0.02)] rounded-2xl p-8 mb-8 border border-[rgba(212,175,100,0.15)]">
          <h1 className="font-display text-3xl font-light text-[#f0e6c8] mb-2">
            Welcome back, <span className="text-[#d4af64]">{displayProfile?.fullName || user?.username}</span>!
          </h1>
          <div className="w-12 h-px bg-gradient-to-r from-[#d4af64] to-transparent my-3" />
          <p className="text-[rgba(240,230,200,0.5)] font-body">
            Track your performance, view upcoming matches, and connect with coaches.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="lg:col-span-1">
            <div className="bg-[#0f0f12] rounded-2xl border border-[rgba(212,175,100,0.1)] p-6 sticky top-24">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-[rgba(212,175,100,0.2)] to-[rgba(212,175,100,0.05)] rounded-full flex items-center justify-center mb-4 border-2 border-[rgba(212,175,100,0.2)]">
                  {displayProfile?.profilePictureUrl ? (
                    <img 
                      src={displayProfile.profilePictureUrl} 
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10 text-[#d4af64]" />
                  )}
                </div>
                <h2 className="font-display text-xl font-medium text-[#f0e6c8]">
                  {displayProfile?.fullName || user?.username}
                </h2>
                <p className="text-[rgba(240,230,200,0.4)] text-sm mb-2">@{user?.username}</p>
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-body bg-[rgba(212,175,100,0.1)] text-[#d4af64] border border-[rgba(212,175,100,0.2)] mb-4">
                  <BadgeCheck className="w-3.5 h-3.5" />
                  Athlete
                </div>
              </div>

              <div className="border-t border-[rgba(212,175,100,0.08)] pt-4 space-y-3">
                <div className="flex items-center gap-3 text-[rgba(240,230,200,0.6)]">
                  <Mail className="w-4 h-4 text-[rgba(212,175,100,0.4)]" />
                  <span className="text-sm font-body break-all">{user?.email}</span>
                </div>
                {user?.phone && (
                  <div className="flex items-center gap-3 text-[rgba(240,230,200,0.6)]">
                    <Phone className="w-4 h-4 text-[rgba(212,175,100,0.4)]" />
                    <span className="text-sm font-body">{user?.phone}</span>
                  </div>
                )}
                {displayProfile?.sport && (
                  <div className="flex items-center gap-3 text-[rgba(240,230,200,0.6)]">
                    <Trophy className="w-4 h-4 text-[rgba(212,175,100,0.4)]" />
                    <span className="text-sm font-body">Sport: {displayProfile?.sport}</span>
                  </div>
                )}
                {displayProfile?.level && (
                  <div className="flex items-center gap-3 text-[rgba(240,230,200,0.6)]">
                    <Target className="w-4 h-4 text-[rgba(212,175,100,0.4)]" />
                    <span className="text-sm font-body">Level: {displayProfile?.level}</span>
                  </div>
                )}
                {displayProfile?.club && (
                  <div className="flex items-center gap-3 text-[rgba(240,230,200,0.6)]">
                    <Briefcase className="w-4 h-4 text-[rgba(212,175,100,0.4)]" />
                    <span className="text-sm font-body">Club: {displayProfile?.club}</span>
                  </div>
                )}
                {displayProfile?.address && (
                  <div className="flex items-center gap-3 text-[rgba(240,230,200,0.6)]">
                    <MapPin className="w-4 h-4 text-[rgba(212,175,100,0.4)]" />
                    <span className="text-sm font-body">{displayProfile?.address}</span>
                  </div>
                )}
                {displayProfile?.age && (
                  <div className="flex items-center gap-3 text-[rgba(240,230,200,0.6)]">
                    <Calendar className="w-4 h-4 text-[rgba(212,175,100,0.4)]" />
                    <span className="text-sm font-body">Age: {displayProfile?.age} years</span>
                  </div>
                )}
              </div>

              {displayProfile?.bio && (
                <div className="border-t border-[rgba(212,175,100,0.08)] mt-4 pt-4">
                  <p className="text-sm text-[rgba(240,230,200,0.5)] font-body italic leading-relaxed">
                    "{displayProfile?.bio}"
                  </p>
                </div>
              )}

              {/* Refresh Profile Button */}
              <button
                onClick={fetchUserProfile}
                disabled={isFetchingProfile}
                className="mt-5 w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-body text-[#d4af64] border border-[rgba(212,175,100,0.2)] rounded-lg hover:bg-[rgba(212,175,100,0.05)] hover:border-[rgba(212,175,100,0.4)] transition-all duration-200 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isFetchingProfile ? 'animate-spin' : ''}`} />
                Refresh Profile
              </button>
              <Link href="/edit-profile" className="mt-3 w-full inline-flex items-center justify-center gap-2 py-2.5 text-[0.8rem] text-[#d4af64] border border-[rgba(212,175,100,0.2)] rounded-[10px] hover:bg-[rgba(212,175,100,0.05)] transition-all duration-200">
                    <Edit size={13} />
                    Edit Profile
                  </Link>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#0f0f12] rounded-xl border border-[rgba(212,175,100,0.1)] p-5 hover:border-[rgba(212,175,100,0.25)] transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[rgba(240,230,200,0.4)] text-xs font-body uppercase tracking-wider">Total Matches</p>
                    <p className="font-display text-3xl font-light text-[#f0e6c8] mt-1">{stats.totalMatches}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[rgba(212,175,100,0.1)] flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-[#d4af64]" />
                  </div>
                </div>
              </div>
              <div className="bg-[#0f0f12] rounded-xl border border-[rgba(212,175,100,0.1)] p-5 hover:border-[rgba(212,175,100,0.25)] transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[rgba(240,230,200,0.4)] text-xs font-body uppercase tracking-wider">Win Rate</p>
                    <p className="font-display text-3xl font-light text-[#4ade80] mt-1">
                      {((stats.wins / stats.totalMatches) * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[rgba(74,222,128,0.1)] flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-[#4ade80]" />
                  </div>
                </div>
              </div>
              <div className="bg-[#0f0f12] rounded-xl border border-[rgba(212,175,100,0.1)] p-5 hover:border-[rgba(212,175,100,0.25)] transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[rgba(240,230,200,0.4)] text-xs font-body uppercase tracking-wider">Average Score</p>
                    <p className="font-display text-3xl font-light text-[#d4af64] mt-1">{stats.averageScore}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[rgba(212,175,100,0.1)] flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-[#d4af64]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity / Upcoming Schedules */}
            <div className="bg-[#0f0f12] rounded-2xl border border-[rgba(212,175,100,0.1)] overflow-hidden">
              <div className="px-6 py-4 border-b border-[rgba(212,175,100,0.08)]">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display text-lg font-medium text-[#f0e6c8]">Upcoming Schedules</h3>
                    <div className="w-8 h-px bg-gradient-to-r from-[#d4af64] to-transparent mt-1.5" />
                  </div>
                  <span className="text-xs text-[rgba(240,230,200,0.4)] font-body">
                    {scheduleEvents.length} upcoming
                  </span>
                </div>
              </div>
              <div className="p-6">
                {scheduleEvents.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[rgba(212,175,100,0.1)] flex items-center justify-center">
                      <Dumbbell className="w-6 h-6 text-[rgba(212,175,100,0.4)]" />
                    </div>
                    <p className="text-[rgba(240,230,200,0.4)] font-body">No upcoming schedules</p>
                    <p className="text-xs text-[rgba(240,230,200,0.3)] mt-1">Check back later for training sessions</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {scheduleEvents.map((event) => {
                      const daysLeft = getDaysLeft(event.date);
                      return (
                        <div 
                          key={event._id} 
                          className="flex items-start gap-4 p-4 bg-[rgba(255,255,255,0.02)] rounded-xl border border-[rgba(212,175,100,0.05)] hover:border-[rgba(212,175,100,0.15)] transition-all duration-300"
                        >
                          <div className="w-10 h-10 rounded-lg bg-[rgba(212,175,100,0.1)] flex items-center justify-center flex-shrink-0">
                            <Clock className="w-5 h-5 text-[#d4af64]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                              <h4 className="font-body font-medium text-[#f0e6c8] text-base">
                                {event.title}
                              </h4>
                              <span className="text-xs px-2 py-0.5 rounded-full bg-[rgba(212,175,100,0.1)] text-[#d4af64] font-body">
                                {event.sport}
                              </span>
                            </div>
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2 text-sm">
                                <Calendar className="w-3.5 h-3.5 text-[rgba(212,175,100,0.4)]" />
                                <span className="text-[rgba(240,230,200,0.6)] font-body text-xs">
                                  {formatDate(event.date)} at {event.time}
                                </span>
                                <span className="text-xs text-[#d4af64]">
                                  • {daysLeft} days left
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <MapPin className="w-3.5 h-3.5 text-[rgba(212,175,100,0.4)]" />
                                <span className="text-[rgba(240,230,200,0.5)] font-body text-xs truncate">
                                  {event.location}
                                </span>
                              </div>
                              {event.duration && (
                                <div className="flex items-center gap-2 text-sm">
                                  <Clock className="w-3.5 h-3.5 text-[rgba(212,175,100,0.4)]" />
                                  <span className="text-[rgba(240,230,200,0.5)] font-body text-xs">
                                    Duration: {event.duration} minutes
                                  </span>
                                </div>
                              )}
                            </div>
                            {event.description && (
                              <p className="text-xs text-[rgba(240,230,200,0.4)] mt-2 line-clamp-2">
                                {event.description}
                              </p>
                            )}
                          </div>
                          <ChevronRight className="w-4 h-4 text-[rgba(212,175,100,0.3)] flex-shrink-0 mt-2" />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Performance Highlights */}
            <div className="bg-[#0f0f12] rounded-2xl border border-[rgba(212,175,100,0.1)] p-6">
              <h3 className="font-display text-lg font-medium text-[#f0e6c8] mb-4">Performance Highlights</h3>
              <div className="w-8 h-px bg-gradient-to-r from-[#d4af64] to-transparent mb-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-[rgba(255,255,255,0.02)] rounded-lg border border-[rgba(212,175,100,0.05)]">
                  <div className="w-8 h-8 rounded-full bg-[rgba(212,175,100,0.1)] flex items-center justify-center">
                    <Award className="w-4 h-4 text-[#d4af64]" />
                  </div>
                  <div>
                    <p className="text-xs text-[rgba(240,230,200,0.4)] font-body">Best Performance</p>
                    <p className="text-sm font-body text-[#f0e6c8]">98 runs vs Mumbai Tigers</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-[rgba(255,255,255,0.02)] rounded-lg border border-[rgba(212,175,100,0.05)]">
                  <div className="w-8 h-8 rounded-full bg-[rgba(212,175,100,0.1)] flex items-center justify-center">
                    <Trophy className="w-4 h-4 text-[#d4af64]" />
                  </div>
                  <div>
                    <p className="text-xs text-[rgba(240,230,200,0.4)] font-body">Recent Achievement</p>
                    <p className="text-sm font-body text-[#f0e6c8]">Player of the Match (3 times)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}