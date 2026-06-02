// components/admin/AdminStatsCards.jsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Users, Trophy, GraduationCap, Clock, Calendar, CheckCircle, BarChart } from "lucide-react";

export default function AdminStatsCards({ analytics }) {
  const stats = [
    {
      title: "Total Users",
      value: analytics?.totalUsers || 0,
      icon: Users,
      color: "blue"
    },
    {
      title: "Athletes",
      value: analytics?.totalAthletes || 0,
      icon: Trophy,
      color: "blue"
    },
    {
      title: "Coaches",
      value: analytics?.totalCoaches || 0,
      icon: GraduationCap,
      color: "purple"
    },
    {
      title: "Pending Approvals",
      value: analytics?.pendingApprovals || 0,
      icon: Clock,
      color: "orange"
    }
  ];

  const scheduleStats = [
    {
      title: "Total Schedules",
      value: analytics?.totalSchedules || 0,
      icon: Calendar,
      color: "green"
    },
    {
      title: "Upcoming Schedules",
      value: analytics?.upcomingSchedules || 0,
      icon: CheckCircle,
      color: "green"
    },
    {
      title: "Cricket / Football",
      value: `${analytics?.schedulesBySport?.cricket || 0} / ${analytics?.schedulesBySport?.football || 0}`,
      icon: BarChart,
      color: "yellow"
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: "bg-blue-100 text-blue-600",
      purple: "bg-purple-100 text-purple-600",
      orange: "bg-orange-100 text-orange-600",
      green: "bg-green-100 text-green-600",
      yellow: "bg-yellow-100 text-yellow-600"
    };
    return colors[color];
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${getColorClasses(stat.color)} rounded-full flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {scheduleStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${getColorClasses(stat.color)} rounded-full flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}