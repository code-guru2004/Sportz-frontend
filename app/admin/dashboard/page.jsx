"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import AdminNavbar from "@/components/admin/AdminNavbar";
import AdminWelcomeBanner from "@/components/admin/AdminWelcomeBanner";
import OverviewTab from "@/components/admin/OverviewTab";
import PendingUsersTab from "@/components/admin/PendingUsersTab";
import AthletesTab from "@/components/admin/AthletesTab";
import CoachesTab from "@/components/admin/CoachesTab";
import SchedulesTab from "@/components/admin/SchedulesTab";
import UserDetailsDialog from "@/components/admin/UserDetailsDialog";
import { toast } from "sonner";
import NotificationDialog from "@/components/admin/NotificationDialog";

const API_BASE_URL = "http://localhost:5000/api";

export default function AdminDashboard() {
  const router = useRouter();
  const { user, logout, loading, accessToken } = useAuth();

  const [activeTab, setActiveTab] = useState("overview");
  const [analytics, setAnalytics] = useState(null);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [athletes, setAthletes] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notifyUserId, setNotifyUserId] = useState(null);


  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (!loading && user && user.role !== "ADMIN") {
      router.push(`/${user.role?.toLowerCase()}/dashboard`);
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user?.role === "ADMIN") {
      fetchAllData();
    }
  }, [user]);

  const fetchAllData = async () => {
    await Promise.all([
      fetchAnalytics(),
      fetchPendingUsers(),
      fetchAthletes(),
      fetchCoaches(),
      fetchSchedules()
    ]);
  };

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/analytics`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
      });
      if (response.data.success) {
        setAnalytics(response.data.analytics);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  };

  const fetchPendingUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/pending-users`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
      });
      if (response.data.success) {
        setPendingUsers(response.data.users);
      }
    } catch (error) {
      console.error("Error fetching pending users:", error);
    }
  };

  const fetchAthletes = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/users?role=ATHLETE&isApproved=true`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
      });
      if (response.data.success) {
        setAthletes(response.data.users);
      }
    } catch (error) {
      console.error("Error fetching athletes:", error);
    }
  };

  const fetchCoaches = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/users?role=COACH&isApproved=true`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
      });
      if (response.data.success) {
        setCoaches(response.data.users);
      }
    } catch (error) {
      console.error("Error fetching coaches:", error);
    }
  };

  const fetchSchedules = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/schedules?showPast=true`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
      });
      if (response.data.success) {
        setSchedules(response.data.schedules);
      }
    } catch (error) {
      console.error("Error fetching schedules:", error);
    }
  };

  const handleApproveUser = async (userId) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/approve/${userId}`, {}, {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
      });
      if (response.data.success) {
        toast.success("User approved successfully!");
        await fetchPendingUsers();
        await fetchAnalytics();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to approve user");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectUser = async (userId) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/reject/${userId}`, {}, {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
      });
      if (response.data.success) {
        toast.success("User rejected and removed!");
        await fetchPendingUsers();
        await fetchAnalytics();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reject user");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBlockUser = async (userId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/toggle-block/${userId}`, {}, {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
      });
      if (response.data.success) {
        toast.success(`User ${response.data.isBlocked ? 'blocked' : 'unblocked'} successfully!`);
        await fetchAthletes();
        await fetchCoaches();
      }
    } catch (error) {
      toast.error("Failed to toggle user status");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;

    try {
      const response = await axios.delete(`${API_BASE_URL}/admin/user/${userId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
      });
      if (response.data.success) {
        toast.success("User deleted successfully!");
        await fetchAthletes();
        await fetchCoaches();
        await fetchAnalytics();
      }
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  const handleViewUser = async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
      });
      if (response.data.success) {
        setSelectedUser(response.data.userDetails || response.data.user);
        setIsUserDialogOpen(true);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch user details");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0c0c0e] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-[rgba(212,175,100,0.2)] border-t-[#d4af64] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[rgba(240,230,200,0.5)] font-body text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen w-full bg-[#0c0c0e]">
      <AdminNavbar user={user} logout={logout} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <AdminWelcomeBanner />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 sm:space-y-8">
          {/* Responsive tabs with horizontal scroll on mobile */}
          <div className="relative h-16 lg:h-auto">
            <TabsList className="bg-[#0f0f12]  rounded-lg p-1 grid grid-cols-3 lg:grid-cols-6  gap-1 sm:gap-2 ">
              <TabsTrigger
                value="overview"
                className="font-body text-xs sm:text-sm text-[rgba(240,230,200,0.6)] data-[state=active]:bg-[rgba(212,175,100,0.1)] data-[state=active]:text-[#d4af64] data-[state=active]:shadow-none transition-all duration-200 hover:text-[#d4af64] whitespace-nowrap px-3 sm:px-4 py-1.5 sm:py-2"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="pending"
                className="font-body text-xs sm:text-sm text-[rgba(240,230,200,0.6)] data-[state=active]:bg-[rgba(212,175,100,0.1)] data-[state=active]:text-[#d4af64] data-[state=active]:shadow-none transition-all duration-200 hover:text-[#d4af64] whitespace-nowrap px-3 sm:px-4 py-1.5 sm:py-2"
              >
                Pending Approvals
                {pendingUsers.length > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-[#d4af64] text-[#0c0c0e] rounded-full">
                    {pendingUsers.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="athletes"
                className="font-body text-xs sm:text-sm text-[rgba(240,230,200,0.6)] data-[state=active]:bg-[rgba(212,175,100,0.1)] data-[state=active]:text-[#d4af64] data-[state=active]:shadow-none transition-all duration-200 hover:text-[#d4af64] whitespace-nowrap px-3 sm:px-4 py-1.5 sm:py-2"
              >
                Athletes ({athletes.length})
              </TabsTrigger>
              <TabsTrigger
                value="coaches"
                className="font-body text-xs sm:text-sm text-[rgba(240,230,200,0.6)] data-[state=active]:bg-[rgba(212,175,100,0.1)] data-[state=active]:text-[#d4af64] data-[state=active]:shadow-none transition-all duration-200 hover:text-[#d4af64] whitespace-nowrap px-3 sm:px-4 py-1.5 sm:py-2"
              >
                Coaches ({coaches.length})
              </TabsTrigger>
              <TabsTrigger
                value="schedules"
                className="font-body text-xs sm:text-sm text-[rgba(240,230,200,0.6)] data-[state=active]:bg-[rgba(212,175,100,0.1)] data-[state=active]:text-[#d4af64] data-[state=active]:shadow-none transition-all duration-200 hover:text-[#d4af64] whitespace-nowrap px-3 sm:px-4 py-1.5 sm:py-2"
              >
                Schedules
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="anim-fade-up">
            <OverviewTab analytics={analytics} />
          </TabsContent>

          <TabsContent value="pending" className="anim-fade-up">
            <PendingUsersTab
              pendingUsers={pendingUsers}
              onViewUser={handleViewUser}
              onApprove={handleApproveUser}
              onReject={handleRejectUser}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="athletes" className="anim-fade-up">
            <AthletesTab
              athletes={athletes}
              onViewUser={handleViewUser}
              onBlockUser={handleBlockUser}
              onDeleteUser={handleDeleteUser}
              onNotifyUser={(userId) => setNotifyUserId(userId)}
            />
          </TabsContent>

          <TabsContent value="coaches" className="anim-fade-up">
            <CoachesTab
              coaches={coaches}
              onViewUser={handleViewUser}
              onBlockUser={handleBlockUser}
              onDeleteUser={handleDeleteUser}
            />
          </TabsContent>

          <TabsContent value="schedules" className="anim-fade-up">
            <SchedulesTab
              schedules={schedules}
              accessToken={accessToken}
              onRefresh={fetchSchedules}
            />
          </TabsContent>
        </Tabs>
      </div>

      <UserDetailsDialog
        open={isUserDialogOpen}
        onOpenChange={setIsUserDialogOpen}
        user={selectedUser}
      />
      <NotificationDialog
        open={!!notifyUserId}
        userId={notifyUserId}
        accessToken={accessToken}
        onOpenChange={(open) => {
          if (!open) setNotifyUserId(null);
        }}
      />
    </div>
  );
}