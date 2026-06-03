// components/admin/SchedulesTab.jsx
"use client";

import { useState } from "react";
import { Calendar, Clock, MapPin, Trophy, Send, Loader2, User, ChevronRight } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const API_BASE_URL = "http://localhost:5000/api";

export default function SchedulesTab({ schedules, accessToken, onRefresh }) {
  const [sendingId, setSendingId] = useState(null);

  const getStatusBadge = (status) => {
    switch(status) {
      case "SCHEDULED":
        return <span className="px-2.5 py-1 text-xs font-body rounded-full bg-[rgba(52,199,89,0.1)] text-[#4ade80] border border-[rgba(52,199,89,0.2)]">Scheduled</span>;
      case "COMPLETED":
        return <span className="px-2.5 py-1 text-xs font-body rounded-full bg-[rgba(212,175,100,0.15)] text-[#d4af64] border border-[rgba(212,175,100,0.2)]">Completed</span>;
      case "CANCELLED":
        return <span className="px-2.5 py-1 text-xs font-body rounded-full bg-[rgba(255,100,100,0.1)] text-[#fc8181] border border-[rgba(255,100,100,0.2)]">Cancelled</span>;
      default:
        return null;
    }
  };

  const handleSendNotification = async (schedule) => {
    setSendingId(schedule.id);
    
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/users?role=ATHLETE&approvelStatus=PENDING&sport=${schedule.sport}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
      });
      
      const athletes = response.data.users;
      
      const notifications = athletes.map(athlete => ({
        userId: athlete.id,
        title: "New Training Schedule Available",
        message: `A new ${schedule.sport.toLowerCase()} training session "${schedule.title}" has been scheduled on ${new Date(schedule.date).toLocaleDateString()} at ${schedule.time}. Location: ${schedule.location}`,
        type: "SCHEDULE",
        metadata: { scheduleId: schedule.id }
      }));
      
      for (const notification of notifications) {
        await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/notifications/send`, notification, {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        });
      }
      
      toast.success(`Notifications sent to ${athletes.length} athletes!`);
    } catch (error) {
      console.error("Error sending notifications:", error);
      toast.error("Failed to send notifications");
    } finally {
      setSendingId(null);
    }
  };

  if (schedules.length === 0) {
    return (
      <div className="bg-[#0f0f12] border border-[rgba(212,175,100,0.1)] rounded-xl p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[rgba(212,175,100,0.1)] flex items-center justify-center">
          <Calendar className="w-8 h-8 text-[rgba(212,175,100,0.4)]" />
        </div>
        <p className="text-[rgba(240,230,200,0.5)] font-body">No schedules found</p>
        <p className="text-sm text-[rgba(240,230,200,0.3)] mt-1">Training schedules will appear here</p>
      </div>
    );
  }

  return (
    <div className="bg-[#0f0f12] border border-[rgba(212,175,100,0.1)] rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[rgba(212,175,100,0.1)]">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-medium text-[#f0e6c8]">Training Schedules</h3>
            <p className="text-sm text-[rgba(240,230,200,0.4)] font-body mt-0.5">
              Manage and monitor all training sessions
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-[rgba(240,230,200,0.4)] font-body">Total:</span>
            <span className="font-display text-xl text-[#d4af64]">{schedules.length}</span>
          </div>
        </div>
        <div className="mt-3 h-px w-12 bg-gradient-to-r from-[#d4af64] to-transparent" />
      </div>

      {/* Schedules List */}
      <div className="p-6">
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
          {schedules.map((schedule) => (
            <div
              key={schedule.id}
              className="bg-[#0c0c0e] border border-[rgba(212,175,100,0.08)] rounded-xl p-5 hover:border-[rgba(212,175,100,0.25)] hover:shadow-[0_4px_20px_rgba(212,175,100,0.05)] transition-all duration-300 group"
            >
              <div className="flex flex-col lg:flex-row justify-between gap-4">
                {/* Left Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[rgba(212,175,100,0.15)] to-[rgba(212,175,100,0.05)] flex items-center justify-center border border-[rgba(212,175,100,0.2)]">
                      <Trophy className="w-5 h-5 text-[#d4af64]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-body font-semibold text-[#f0e6c8] text-base">
                          {schedule.title}
                        </h4>
                        {getStatusBadge(schedule.status)}
                      </div>
                      <p className="text-xs text-[rgba(212,175,100,0.6)] font-body mt-0.5">
                        ID: {schedule.id.slice(-8)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-3.5 h-3.5 text-[rgba(212,175,100,0.5)]" />
                      <span className="text-[rgba(240,230,200,0.6)] font-body text-sm">{schedule.sport}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[rgba(212,175,100,0.5)]" />
                      <span className="text-[rgba(240,230,200,0.6)] font-body text-sm">
                        {new Date(schedule.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[rgba(212,175,100,0.5)]" />
                      <span className="text-[rgba(240,230,200,0.6)] font-body text-sm">{schedule.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[rgba(212,175,100,0.5)]" />
                      <span className="text-[rgba(240,230,200,0.6)] font-body text-sm truncate">{schedule.location}</span>
                    </div>
                  </div>
                  
                  {schedule.description && (
                    <div className="mb-3 p-3 bg-[rgba(255,255,255,0.02)] rounded-lg border border-[rgba(212,175,100,0.05)]">
                      <p className="text-sm text-[rgba(240,230,200,0.5)] font-body italic">
                        {schedule.description}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-xs">
                    <User className="w-3 h-3 text-[rgba(212,175,100,0.4)]" />
                    <span className="text-[rgba(240,230,200,0.4)] font-body">Coach:</span>
                    <span className="text-[rgba(240,230,200,0.6)] font-body">{schedule.coach?.username || "Unknown"}</span>
                  </div>
                </div>
                
                {/* Right Actions */}
                <div className="flex lg:flex-col gap-2 lg:justify-center">
                  <button
                    onClick={() => handleSendNotification(schedule)}
                    disabled={sendingId === schedule.id}
                    className="px-4 py-2 text-sm font-body bg-gradient-to-r from-[#d4af64] to-[#c49a40] text-[#0c0c0e] rounded-lg hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {sendingId === schedule.id ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Notify Athletes
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={() => onRefresh?.()}
                    className="px-4 py-2 text-sm font-body text-[rgba(240,230,200,0.6)] border border-[rgba(212,175,100,0.2)] rounded-lg hover:border-[rgba(212,175,100,0.4)] hover:text-[#d4af64] transition-all duration-200 flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    <ChevronRight className="w-4 h-4" />
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(212, 175, 100, 0.05);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(212, 175, 100, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(212, 175, 100, 0.5);
        }
      `}</style>
    </div>
  );
}