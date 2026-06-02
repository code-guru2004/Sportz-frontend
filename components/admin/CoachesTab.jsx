// components/admin/CoachesTab.jsx
"use client";

import { Eye, GraduationCap, Briefcase, Ban, Trash2, Mail, Calendar, Trophy } from "lucide-react";

export default function CoachesTab({ coaches, onViewUser, onBlockUser, onDeleteUser }) {
  if (coaches.length === 0) {
    return (
      <div className="bg-[#0f0f12] border border-[rgba(212,175,100,0.1)] rounded-xl p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[rgba(212,175,100,0.1)] flex items-center justify-center">
          <GraduationCap className="w-8 h-8 text-[rgba(212,175,100,0.4)]" />
        </div>
        <p className="text-[rgba(240,230,200,0.5)] font-body">No coaches found</p>
        <p className="text-sm text-[rgba(240,230,200,0.3)] mt-1">All registered coaches will appear here</p>
      </div>
    );
  }

  return (
    <div className="bg-[#0f0f12] border border-[rgba(212,175,100,0.1)] rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[rgba(212,175,100,0.1)]">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-medium text-[#f0e6c8]">Coaches Directory</h3>
            <p className="text-sm text-[rgba(240,230,200,0.4)] font-body mt-0.5">
              Manage and monitor all registered coaches
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-[rgba(240,230,200,0.4)] font-body">Total:</span>
            <span className="font-display text-xl text-[#d4af64]">{coaches.length}</span>
          </div>
        </div>
        <div className="mt-3 h-px w-12 bg-gradient-to-r from-[#d4af64] to-transparent" />
      </div>

      {/* Coaches Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
          {coaches.map((coach) => (
            <div
              key={coach._id}
              className="bg-[#0c0c0e] border border-[rgba(212,175,100,0.08)] rounded-xl p-5 hover:border-[rgba(212,175,100,0.25)] hover:shadow-[0_4px_20px_rgba(212,175,100,0.05)] transition-all duration-300 group"
            >
              {/* Header with Avatar */}
              <div className="flex items-start gap-4 mb-4">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[rgba(212,175,100,0.2)] to-[rgba(212,175,100,0.05)] flex items-center justify-center border border-[rgba(212,175,100,0.2)]">
                    <span className="text-xl text-[#d4af64] font-display font-semibold">
                      {coach.username?.[0]?.toUpperCase()}
                    </span>
                  </div>
                  {coach.isBlocked && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#fc8181] border-2 border-[#0c0c0e]"></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-body font-semibold text-[#f0e6c8] truncate">
                      {coach.username}
                    </h4>
                    {coach.isBlocked && (
                      <span className="px-2 py-0.5 text-xs font-body rounded-full bg-[rgba(255,100,100,0.1)] text-[#fc8181] border border-[rgba(255,100,100,0.2)]">
                        Blocked
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Mail className="w-3 h-3 text-[rgba(212,175,100,0.4)]" />
                    <p className="text-xs text-[rgba(240,230,200,0.5)] font-body truncate">
                      {coach.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Calendar className="w-3 h-3 text-[rgba(212,175,100,0.4)]" />
                    <p className="text-xs text-[rgba(240,230,200,0.4)] font-body">
                      Joined {new Date(coach.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Profile Details */}
              {coach.profile && (
                <div className="space-y-2 mb-4 pt-3 border-t border-[rgba(212,175,100,0.05)]">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-3.5 h-3.5 text-[rgba(212,175,100,0.5)]" />
                      <span className="text-[rgba(240,230,200,0.5)] font-body text-xs">Sport:</span>
                    </div>
                    <span className="text-[#d4af64] font-body text-sm font-medium">
                      {coach.profile.sport || "Not specified"}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-3.5 h-3.5 text-[rgba(212,175,100,0.5)]" />
                      <span className="text-[rgba(240,230,200,0.5)] font-body text-xs">Club/Org:</span>
                    </div>
                    <span className="text-[rgba(240,230,200,0.7)] font-body text-sm">
                      {coach.profile.club || "Independent"}
                    </span>
                  </div>
                  
                  {coach.profile.specialization && (
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-3.5 h-3.5 text-[rgba(212,175,100,0.5)]" />
                        <span className="text-[rgba(240,230,200,0.5)] font-body text-xs">Specialization:</span>
                      </div>
                      <span className="text-[rgba(240,230,200,0.7)] font-body text-sm">
                        {coach.profile.specialization}
                      </span>
                    </div>
                  )}
                  
                  {coach.profile.bio && (
                    <div className="mt-2 pt-2">
                      <p className="text-xs text-[rgba(240,230,200,0.4)] font-body italic line-clamp-2">
                        "{coach.profile.bio.substring(0, 80)}..."
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-3 border-t border-[rgba(212,175,100,0.05)]">
                <button
                  onClick={() => onViewUser(coach._id)}
                  className="flex-1 px-3 py-2 text-sm font-body text-[rgba(240,230,200,0.7)] border border-[rgba(212,175,100,0.2)] rounded-lg hover:border-[rgba(212,175,100,0.4)] hover:text-[#d4af64] hover:bg-[rgba(212,175,100,0.05)] transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>
                
                <button
                  onClick={() => onBlockUser(coach._id)}
                  className={`flex-1 px-3 py-2 text-sm font-body rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                    coach.isBlocked
                      ? "bg-[rgba(52,199,89,0.1)] text-[#4ade80] border border-[rgba(52,199,89,0.2)] hover:bg-[rgba(52,199,89,0.15)]"
                      : "bg-[rgba(255,100,100,0.1)] text-[#fc8181] border border-[rgba(255,100,100,0.2)] hover:bg-[rgba(255,100,100,0.15)]"
                  }`}
                >
                  <Ban className="w-4 h-4" />
                  {coach.isBlocked ? "Unblock" : "Block"}
                </button>
                
                <button
                  onClick={() => onDeleteUser(coach._id)}
                  className="px-3 py-2 text-sm font-body bg-[rgba(255,100,100,0.1)] text-[#fc8181] border border-[rgba(255,100,100,0.2)] rounded-lg hover:bg-[rgba(255,100,100,0.15)] transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
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