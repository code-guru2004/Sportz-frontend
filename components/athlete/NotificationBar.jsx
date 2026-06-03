"use client";

import { useAuth } from "@/app/context/AuthContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { Bell, Calendar, Trophy, Users, X, CheckCircle, Clock } from "lucide-react";

export default function NotificationSheet({ open, setOpen }) {
  const [notifications, setNotifications] = useState([]);
  const [markingAsRead, setMarkingAsRead] = useState(null);
  const { user, accessToken } = useAuth();

  const fetchNotifications = useCallback(async () => {
    if (!user || !accessToken) return;
    try {
      const resp = await axios.get("http://localhost:5000/api/notifications", {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setNotifications(resp.data.notifications || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }, [user, accessToken]);

  useEffect(() => {
    if (open) {
      fetchNotifications();
    }
  }, [open, fetchNotifications]);

  const markAsRead = async (notificationId) => {
    setMarkingAsRead(notificationId);
    try {
      await axios.put(`http://localhost:5000/api/notifications/${notificationId}/read`, {}, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    } finally {
      setMarkingAsRead(null);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put(`http://localhost:5000/api/notifications/read-all`, {}, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "SCHEDULE":
        return <Calendar className="w-4 h-4 text-[#d4af64]" />;
      case "ACHIEVEMENT":
        return <Trophy className="w-4 h-4 text-[#d4af64]" />;
      case "TEAM":
        return <Users className="w-4 h-4 text-[#d4af64]" />;
      default:
        return <Bell className="w-4 h-4 text-[#d4af64]" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side="right"
        className="w-full sm:w-[420px] bg-[#0c0c0e] border-l border-[rgba(212,175,100,0.15)] p-0 flex flex-col"
      >
        <SheetHeader className="px-6 py-4 border-b border-[rgba(212,175,100,0.1)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#d4af64]" />
              <SheetTitle className="font-display text-xl font-medium text-[#f0e6c8]">
                Notifications
              </SheetTitle>
              {unreadCount > 0 && (
                <span className="ml-2 px-1.5 py-0.5 text-xs font-body rounded-full bg-[#d4af64] text-[#0c0c0e]">
                  {unreadCount}
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs font-body text-[rgba(240,230,200,0.5)] hover:text-[#d4af64] transition-colors"
              >
                Mark all as read
              </button>
            )}
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="w-16 h-16 rounded-full bg-[rgba(212,175,100,0.1)] flex items-center justify-center mb-4">
                <Bell className="w-8 h-8 text-[rgba(212,175,100,0.3)]" />
              </div>
              <p className="text-[rgba(240,230,200,0.4)] font-body">No notifications yet</p>
              <p className="text-xs text-[rgba(240,230,200,0.3)] mt-1">
                We'll notify you when something important happens
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[rgba(212,175,100,0.05)]">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`relative p-4 hover:bg-[rgba(212,175,100,0.03)] transition-all duration-200 ${
                    !notification.read ? "bg-[rgba(212,175,100,0.02)]" : ""
                  }`}
                >
                  <div className="flex gap-3">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-8 h-8 rounded-lg bg-[rgba(212,175,100,0.1)] flex items-center justify-center">
                        {getNotificationIcon(notification.type)}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className={`font-body text-sm font-medium ${
                          !notification.read ? "text-[#f0e6c8]" : "text-[rgba(240,230,200,0.6)]"
                        }`}>
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            disabled={markingAsRead === notification.id}
                            className="flex-shrink-0 p-1 rounded text-[rgba(212,175,100,0.4)] hover:text-[#d4af64] hover:bg-[rgba(212,175,100,0.1)] transition-all"
                            title="Mark as read"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-[rgba(240,230,200,0.5)] mt-1 leading-relaxed">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-1.5 mt-2">
                        <Clock className="w-3 h-3 text-[rgba(212,175,100,0.3)]" />
                        <span className="text-xs text-[rgba(240,230,200,0.35)]">
                          {formatDate(notification.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Unread indicator dot */}
                  {!notification.read && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full bg-[#d4af64]" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(212, 175, 100, 0.05);
            border-radius: 2px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(212, 175, 100, 0.3);
            border-radius: 2px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(212, 175, 100, 0.5);
          }
        `}</style>
      </SheetContent>
    </Sheet>
  );
}