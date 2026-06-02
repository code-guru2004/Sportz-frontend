"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Eye, Trophy, BarChart, Briefcase, User, Ban, Trash2 } from "lucide-react";
import { MdNotificationAdd } from "react-icons/md";

export default function AthletesTab({ athletes, onViewUser, onBlockUser, onDeleteUser, onNotifyUser }) {
  if (athletes.length === 0) {
    return (
      <Card className="bg-[#0f0f12] border border-[rgba(212,175,100,0.1)] rounded-xl">
        <CardContent className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[rgba(212,175,100,0.1)] flex items-center justify-center">
            <Trophy className="w-8 h-8 text-[rgba(212,175,100,0.4)]" />
          </div>
          <p className="text-[rgba(240,230,200,0.5)] font-body">No athletes found</p>
          <p className="text-sm text-[rgba(240,230,200,0.3)] mt-1">All registered athletes will appear here</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#0f0f12] border border-[rgba(212,175,100,0.1)] rounded-xl overflow-hidden">
      <CardHeader className="px-4 sm:px-6 py-4 border-b border-[rgba(212,175,100,0.1)]">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <CardTitle className="font-display text-lg font-medium text-[#f0e6c8]">Athletes Directory</CardTitle>
            <div className="w-12 h-px bg-gradient-to-r from-[#d4af64] to-transparent mt-1.5" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-[rgba(240,230,200,0.4)] font-body">Total:</span>
            <span className="font-display text-xl text-[#d4af64]">{athletes.length}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-280px)] sm:h-[600px]">
          <div className="space-y-3 p-3 sm:p-4">
            {athletes.map((athlete) => (
              <div
                key={athlete._id}
                className="bg-[#1c1c1e] border border-[rgba(212,175,100,0.08)] rounded-xl p-4 hover:border-[rgba(212,175,100,0.25)] transition-all duration-300"
              >
                {/* Mobile: column layout, Tablet/Desktop: row layout */}
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  {/* Left: Avatar + Info */}
                  <div className="flex gap-3 flex-1 min-w-0">
                    <Avatar className="w-12 h-12 flex-shrink-0">
                      <AvatarFallback className="bg-gradient-to-br from-[rgba(212,175,100,0.2)] to-[rgba(212,175,100,0.05)] text-[#d4af64] text-lg font-display font-semibold">
                        {athlete.username?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-body font-semibold text-[#f0e6c8] truncate">{athlete.username}</h3>
                        {athlete.isBlocked && (
                          <span className="px-2 py-0.5 text-xs font-body rounded-full bg-[rgba(255,100,100,0.1)] text-[#fc8181] border border-[rgba(255,100,100,0.2)]">
                            Blocked
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[rgba(240,230,200,0.5)] truncate mt-0.5">{athlete.email}</p>
                      
                      {/* Profile details - responsive grid */}
                      {athlete.profile && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 mt-3">
                          {athlete.profile.sport && (
                            <div className="flex items-center gap-1.5">
                              <Trophy className="w-3.5 h-3.5 text-[rgba(212,175,100,0.5)]" />
                              <span className="text-xs text-[rgba(240,230,200,0.6)]">{athlete.profile.sport}</span>
                            </div>
                          )}
                          {athlete.profile.level && (
                            <div className="flex items-center gap-1.5">
                              <BarChart className="w-3.5 h-3.5 text-[rgba(212,175,100,0.5)]" />
                              <span className="text-xs text-[rgba(240,230,200,0.6)]">{athlete.profile.level}</span>
                            </div>
                          )}
                          {athlete.profile.club && (
                            <div className="flex items-center gap-1.5">
                              <Briefcase className="w-3.5 h-3.5 text-[rgba(212,175,100,0.5)]" />
                              <span className="text-xs text-[rgba(240,230,200,0.6)] truncate">{athlete.profile.club}</span>
                            </div>
                          )}
                          {athlete.profile.age && (
                            <div className="flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5 text-[rgba(212,175,100,0.5)]" />
                              <span className="text-xs text-[rgba(240,230,200,0.6)]">Age: {athlete.profile.age}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Action Buttons - wrap on small screens */}
                  <div className="flex flex-wrap gap-2 justify-end md:justify-start mt-3 md:mt-0">
                    <button
                      onClick={() => onViewUser(athlete._id)}
                      className="p-2 rounded-lg text-[rgba(240,230,200,0.7)] border border-[rgba(212,175,100,0.2)] hover:border-[rgba(212,175,100,0.4)] hover:text-[#d4af64] transition-all duration-200"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onNotifyUser(athlete._id)}
                      className="p-2 rounded-lg text-[rgba(240,230,200,0.7)] border border-[rgba(212,175,100,0.2)] hover:border-[rgba(212,175,100,0.4)] hover:text-[#d4af64] transition-all duration-200"
                      title="Send Notification"
                    >
                      <MdNotificationAdd className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onBlockUser(athlete._id)}
                      className={`p-2 rounded-lg transition-all duration-200 flex items-center justify-center ${
                        athlete.isBlocked
                          ? "bg-[rgba(52,199,89,0.1)] text-[#4ade80] border border-[rgba(52,199,89,0.2)] hover:bg-[rgba(52,199,89,0.15)]"
                          : "bg-[rgba(255,100,100,0.1)] text-[#fc8181] border border-[rgba(255,100,100,0.2)] hover:bg-[rgba(255,100,100,0.15)]"
                      }`}
                      title={athlete.isBlocked ? "Unblock" : "Block"}
                    >
                      <Ban className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteUser(athlete._id)}
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
      </CardContent>
    </Card>
  );
}