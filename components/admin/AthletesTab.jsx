"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Eye, Trophy, BarChart, Briefcase, User, Ban, Trash2, Search, X, Download } from "lucide-react";
import { MdNotificationAdd } from "react-icons/md";
import { toast } from "sonner";

const API_BASE_URL = "http://localhost:5000/api";

export default function AthletesTab({ accessToken, onViewUser, onBlockUser, onDeleteUser, onNotifyUser }) {
  const [athletes, setAthletes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sport, setSport] = useState("ALL");
  const [isVerified, setIsVerified] = useState("ALL");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch athletes whenever filters change
  useEffect(() => {
    fetchAthletes();
  }, [debouncedSearch, sport, isVerified]);

  const fetchAthletes = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("role", "ATHLETE");
      params.append("approvalStatus", "APPROVED");
      if (debouncedSearch) params.append("search", debouncedSearch);
      if (sport && sport !== "ALL") params.append("sport", sport);
      if (isVerified && isVerified !== "ALL") {
        const verifiedBool = isVerified === "VERIFIED";
        params.append("isVerified", verifiedBool);
      }

      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/users?${params.toString()}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
      });
      if (response.data.success) {
        setAthletes(response.data.users);
      } else {
        toast.error("Failed to load athletes");
      }
    } catch (error) {
      console.error("Error fetching athletes:", error);
      toast.error("Error loading athletes");
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setSport("ALL");
    setIsVerified("ALL");
  };

  // Export to Excel
  const exportToExcel = () => {
    if (athletes.length === 0) {
      toast.error("No data to export");
      return;
    }

    // Transform athletes array into flat rows
    const exportData = athletes.map((athlete) => ({
      Username: athlete.username,
      Email: athlete.email,
      Phone: athlete.phone || "",
      Role: athlete.role,
      Verified: athlete.isVerified ? "Yes" : "No",
      "Approval Status": athlete.approvalStatus,
      Blocked: athlete.isBlocked ? "Yes" : "No",
      "Profile Completed": athlete.profileCompleted ? "Yes" : "No",
      "Full Name": athlete.profile?.fullName || "",
      "Date of Birth": athlete.profile?.dateOfBirth
        ? new Date(athlete.profile.dateOfBirth).toLocaleDateString()
        : "",
      Sport: athlete.profile?.sport || "",
      Level: athlete.profile?.level || "",
      Club: athlete.profile?.club || "",
      Address: athlete.profile?.address || "",
      Bio: athlete.profile?.bio || "",
      "Joined On": new Date(athlete.createdAt).toLocaleDateString(),
    }));

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(exportData);
    // Adjust column widths (optional)
    ws["!cols"] = [
      { wch: 20 }, { wch: 30 }, { wch: 15 }, { wch: 10 },
      { wch: 10 }, { wch: 15 }, { wch: 10 }, { wch: 15 },
      { wch: 25 }, { wch: 12 }, { wch: 12 }, { wch: 10 },
      { wch: 20 }, { wch: 30 }, { wch: 40 }, { wch: 12 },
    ];

    // Create workbook and save
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Athletes");
    XLSX.writeFile(wb, `athletes_${new Date().toISOString().slice(0, 19)}.xlsx`);
    toast.success("Export started");
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-2 border-[rgba(212,175,100,0.2)] border-t-[#d4af64] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[rgba(240,230,200,0.5)] font-body">Loading athletes...</p>
        </div>
      );
    }

    if (athletes.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[rgba(212,175,100,0.1)] flex items-center justify-center">
            <Trophy className="w-8 h-8 text-[rgba(212,175,100,0.4)]" />
          </div>
          <p className="text-[rgba(240,230,200,0.5)] font-body">No athletes found</p>
          <p className="text-sm text-[rgba(240,230,200,0.3)] mt-1">
            Try adjusting your search or filters
          </p>
        </div>
      );
    }

    return (
      <ScrollArea className="h-[calc(100vh-420px)] sm:h-[600px]">
        <div className="space-y-3 p-3 sm:p-4">
          {athletes.map((athlete) => (
            <div
              key={athlete.id}
              className="bg-[#1c1c1e] border border-[rgba(212,175,100,0.08)] rounded-xl p-4 hover:border-[rgba(212,175,100,0.25)] transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <div className="flex gap-3 flex-1 min-w-0">
                  <Avatar className="w-12 h-12 flex-shrink-0">
                    <AvatarFallback className="bg-gradient-to-br from-[rgba(212,175,100,0.2)] to-[rgba(212,175,100,0.05)] text-[#d4af64] text-lg font-display font-semibold">
                      {athlete.username?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-body font-semibold text-[#f0e6c8] truncate">
                        {athlete.username}
                      </h3>
                      {athlete.isBlocked && (
                        <span className="px-2 py-0.5 text-xs font-body rounded-full bg-[rgba(255,100,100,0.1)] text-[#fc8181] border border-[rgba(255,100,100,0.2)]">
                          Blocked
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[rgba(240,230,200,0.5)] truncate mt-0.5">
                      {athlete.email}
                    </p>

                    {athlete.profile && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 mt-3">
                        {athlete.profile.sport && (
                          <div className="flex items-center gap-1.5">
                            <Trophy className="w-3.5 h-3.5 text-[rgba(212,175,100,0.5)]" />
                            <span className="text-xs text-[rgba(240,230,200,0.6)]">
                              {athlete.profile.sport}
                            </span>
                          </div>
                        )}
                        {athlete.profile.level && (
                          <div className="flex items-center gap-1.5">
                            <BarChart className="w-3.5 h-3.5 text-[rgba(212,175,100,0.5)]" />
                            <span className="text-xs text-[rgba(240,230,200,0.6)]">
                              {athlete.profile.level}
                            </span>
                          </div>
                        )}
                        {athlete.profile.club && (
                          <div className="flex items-center gap-1.5">
                            <Briefcase className="w-3.5 h-3.5 text-[rgba(212,175,100,0.5)]" />
                            <span className="text-xs text-[rgba(240,230,200,0.6)] truncate">
                              {athlete.profile.club}
                            </span>
                          </div>
                        )}
                        {athlete.profile.dateOfBirth && (
                          <div className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-[rgba(212,175,100,0.5)]" />
                            <span className="text-xs text-[rgba(240,230,200,0.6)]">
                              Age:{" "}
                              {new Date().getFullYear() -
                                new Date(athlete.profile.dateOfBirth).getFullYear()}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 justify-end md:justify-start mt-3 md:mt-0">
                  <button
                    onClick={() => onViewUser(athlete.id)}
                    className="p-2 rounded-lg text-[rgba(240,230,200,0.7)] border border-[rgba(212,175,100,0.2)] hover:border-[rgba(212,175,100,0.4)] hover:text-[#d4af64] transition-all duration-200"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onNotifyUser(athlete.id)}
                    className="p-2 rounded-lg text-[rgba(240,230,200,0.7)] border border-[rgba(212,175,100,0.2)] hover:border-[rgba(212,175,100,0.4)] hover:text-[#d4af64] transition-all duration-200"
                    title="Send Notification"
                  >
                    <MdNotificationAdd className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onBlockUser(athlete.id)}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      athlete.isBlocked
                        ? "bg-[rgba(52,199,89,0.1)] text-[#4ade80] border border-[rgba(52,199,89,0.2)] hover:bg-[rgba(52,199,89,0.15)]"
                        : "bg-[rgba(255,100,100,0.1)] text-[#fc8181] border border-[rgba(255,100,100,0.2)] hover:bg-[rgba(255,100,100,0.15)]"
                    }`}
                    title={athlete.isBlocked ? "Unblock" : "Block"}
                  >
                    <Ban className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteUser(athlete.id)}
                    className="p-2 rounded-lg bg-[rgba(255,100,100,0.1)] text-[#fc8181] border border-[rgba(255,100,100,0.2)] hover:bg-[rgba(255,100,100,0.15)] transition-all duration-200"
                    title="Delete User"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    );
  };

  return (
    <Card className="bg-[#0f0f12] border border-[rgba(212,175,100,0.1)] rounded-xl overflow-hidden">
      <CardHeader className="px-4 sm:px-6 py-4 border-b border-[rgba(212,175,100,0.1)] space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <CardTitle className="font-display text-lg font-medium text-[#f0e6c8]">
              Athletes Directory
            </CardTitle>
            <div className="w-12 h-px bg-gradient-to-r from-[#d4af64] to-transparent mt-1.5" />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-[rgba(240,230,200,0.4)] font-body">Total:</span>
              <span className="font-display text-xl text-[#d4af64]">{athletes.length}</span>
            </div>
            <Button
              
              onClick={exportToExcel}
              disabled={athletes.length === 0}
              className="border-[rgba(212,175,100,0.3)] text-[#d4af64] hover:bg-[rgba(116,100,67,0.5)]"
            >
              <Download className="w-4 h-4 mr-2" /> Export
            </Button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgba(240,230,200,0.4)]" />
            <Input
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-[#0c0c0e] border-[rgba(212,175,100,0.2)] focus:border-[#d4af64] text-[#f0e6c8]"
            />
          </div>

          <Select value={sport} onValueChange={setSport}>
            <SelectTrigger className="w-full sm:w-[150px] bg-[#0c0c0e] border-[rgba(212,175,100,0.2)] text-[#f0e6c8]">
              <SelectValue placeholder="All Sports" />
            </SelectTrigger>
            <SelectContent className="bg-[#0f0f12] border-[rgba(212,175,100,0.2)] text-[#f0e6c8]">
              <SelectItem value="ALL">All Sports</SelectItem>
              <SelectItem value="CRICKET">Cricket</SelectItem>
              <SelectItem value="FOOTBALL">Football</SelectItem>
            </SelectContent>
          </Select>

          <Select value={isVerified} onValueChange={setIsVerified}>
            <SelectTrigger className="w-full sm:w-[150px] bg-[#0c0c0e] border-[rgba(212,175,100,0.2)] text-[#f0e6c8]">
              <SelectValue placeholder="Verification" />
            </SelectTrigger>
            <SelectContent className="bg-[#0f0f12] border-[rgba(212,175,100,0.2)] text-[#f0e6c8]">
              <SelectItem value="ALL">All</SelectItem>
              <SelectItem value="VERIFIED">Verified</SelectItem>
              <SelectItem value="NOT_VERIFIED">Not Verified</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={clearFilters}
            className="border-[rgba(212,175,100,0.3)] text-[rgba(240,230,200,0.7)] hover:bg-[rgba(212,175,100,0.1)]"
          >
            <X className="w-4 h-4 mr-1" /> Clear
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">{renderContent()}</CardContent>
    </Card>
  );
}