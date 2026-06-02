"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Bell, Send, X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const API_BASE_URL = "http://localhost:5000/api";

function NotificationDialog({
  open,
  userId,
  accessToken,
  onOpenChange,
}) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("INFO");
  const [loading, setLoading] = useState(false);

  const handleSendNotification = async () => {
    if (!title.trim() || !message.trim()) {
      toast.error("Title and message are required");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_BASE_URL}/notifications`,
        {
          userId,
          title,
          message,
          type,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success("Notification sent!");
        setTitle("");
        setMessage("");
        setType("INFO");
        onOpenChange(false);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to send notification"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-[#0f0f12] border border-[rgba(212,175,100,0.15)] rounded-2xl p-0 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[rgba(212,175,100,0.1)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#d4af64]" />
            <DialogTitle className="font-display text-xl font-medium text-[#f0e6c8]">
              Send Notification
            </DialogTitle>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="p-1 rounded-lg text-[rgba(240,230,200,0.4)] hover:text-[#f0e6c8] hover:bg-[rgba(212,175,100,0.1)] transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.75rem] font-medium tracking-[0.06em] uppercase text-[rgba(240,230,200,0.5)]">
              Title
            </label>
            <input
              type="text"
              placeholder="Notification title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full py-3 px-4 bg-[rgba(255,255,255,0.03)] border border-[rgba(240,230,200,0.1)] rounded-lg outline-none text-[#f0e6c8] text-[0.9375rem] font-['DM_Sans',sans-serif] font-light transition-all duration-200 placeholder:text-[rgba(240,230,200,0.2)] focus:border-[rgba(212,175,100,0.45)] focus:bg-[rgba(212,175,100,0.04)] focus:shadow-[0_0_0_3px_rgba(212,175,100,0.07)]"
            />
          </div>

          {/* Message */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.75rem] font-medium tracking-[0.06em] uppercase text-[rgba(240,230,200,0.5)]">
              Message
            </label>
            <textarea
              rows={4}
              placeholder="Write your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full py-3 px-4 bg-[rgba(255,255,255,0.03)] border border-[rgba(240,230,200,0.1)] rounded-lg outline-none text-[#f0e6c8] text-[0.9375rem] font-['DM_Sans',sans-serif] font-light transition-all duration-200 placeholder:text-[rgba(240,230,200,0.2)] focus:border-[rgba(212,175,100,0.45)] focus:bg-[rgba(212,175,100,0.04)] focus:shadow-[0_0_0_3px_rgba(212,175,100,0.07)] resize-none"
            />
          </div>

          {/* Type Select */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.75rem] font-medium tracking-[0.06em] uppercase text-[rgba(240,230,200,0.5)]">
              Notification Type
            </label>
            <div className="relative">
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full py-3 px-4 bg-[rgba(255,255,255,0.03)] border border-[rgba(240,230,200,0.1)] rounded-lg outline-none text-[#f0e6c8] text-[0.9375rem] font-['DM_Sans',sans-serif] font-light transition-all duration-200 focus:border-[rgba(212,175,100,0.45)] focus:bg-[rgba(212,175,100,0.04)] appearance-none cursor-pointer"
              >
                <option value="INFO" className="bg-[#0f0f12] text-[#f0e6c8]">Info</option>
                <option value="SCHEDULE" className="bg-[#0f0f12] text-[#f0e6c8]">Schedule</option>
                <option value="APPROVAL" className="bg-[#0f0f12] text-[#f0e6c8]">Approval</option>
                <option value="REMINDER" className="bg-[#0f0f12] text-[#f0e6c8]">Reminder</option>
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-[rgba(240,230,200,0.3)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[rgba(212,175,100,0.1)] flex justify-end gap-3">
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 text-sm font-body text-[rgba(240,230,200,0.7)] border border-[rgba(212,175,100,0.2)] rounded-lg hover:border-[rgba(212,175,100,0.4)] hover:text-[#d4af64] hover:bg-[rgba(212,175,100,0.05)] transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSendNotification}
            disabled={loading}
            className="px-4 py-2 text-sm font-body bg-gradient-to-r from-[#d4af64] to-[#c49a40] text-[#0c0c0e] rounded-lg hover:shadow-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-[rgba(12,12,14,0.2)] border-t-[#0c0c0e] rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send Notification
              </>
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default NotificationDialog;