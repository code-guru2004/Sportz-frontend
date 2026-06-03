// components/admin/OverviewTab.jsx
"use client";

import { Users, UserCheck, UserX, Calendar, TrendingUp } from "lucide-react";

export default function OverviewTab({ analytics }) {
  if (!analytics) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-[rgba(212,175,100,0.2)] border-t-[#d4af64] rounded-full animate-spin" />
      </div>
    );
  }

  const stats = [
    {
      title: "Total Users",
      value: analytics.totalUsers || 0,
      icon: Users,
      color: "from-[#d4af64] to-[#c49a40]",
    },
    {
      title: "Active Athletes",
      value: analytics.totalAthletes || 0,
      icon: UserCheck,
      color: "from-[#d4af64] to-[#c49a40]",
    },
    {
      title: "Active Coaches",
      value: analytics.totalCoaches || 0,
      icon: TrendingUp,
      color: "from-[#d4af64] to-[#c49a40]",
    },
    {
      title: "Pending Approvals",
      value: analytics.pendingApprovals || 0,
      icon: UserX,
      color: "from-[#d4af64] to-[#c49a40]",
    },
    {
      title: "Total Schedules",
      value: analytics.totalSchedules || 0,
      icon: Calendar,
      color: "from-[#d4af64] to-[#c49a40]",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-[#0f0f12] border border-[rgba(212,175,100,0.1)] rounded-xl p-5 hover:border-[rgba(212,175,100,0.25)] transition-all duration-300 group"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-body text-[rgba(240,230,200,0.5)] mb-1">
                  {stat.title}
                </p>
                <p className="font-display text-3xl font-light text-[#f0e6c8]">
                  {stat.value}
                </p>
              </div>
              <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color} bg-opacity-10 group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-5 h-5 text-[#0c0c0e]" />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Recent Activity placeholder */}
      <div className="bg-[#0f0f12] border border-[rgba(212,175,100,0.1)] rounded-xl p-6">
        <h3 className="font-display text-lg font-medium text-[#f0e6c8] mb-4">
          Recent Activity
        </h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 py-2 border-b border-[rgba(212,175,100,0.05)] last:border-0">
              <div className="w-2 h-2 rounded-full bg-[#d4af64]" />
              <p className="text-sm text-[rgba(240,230,200,0.5)] font-body">
                System activity log will appear here
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}