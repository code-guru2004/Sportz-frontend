// components/admin/PendingUsersTab.jsx
"use client";

import { User, Mail, Calendar, Check, X, Eye } from "lucide-react";

export default function PendingUsersTab({ pendingUsers, onViewUser, onApprove, onReject, isLoading }) {
  if (pendingUsers.length === 0) {
    return (
      <div className="bg-[#0f0f12] border border-[rgba(212,175,100,0.1)] rounded-xl p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[rgba(212,175,100,0.1)] flex items-center justify-center">
          <User className="w-8 h-8 text-[rgba(212,175,100,0.4)]" />
        </div>
        <p className="text-[rgba(240,230,200,0.5)] font-body">No pending user approvals</p>
        <p className="text-sm text-[rgba(240,230,200,0.3)] mt-1">All users have been reviewed</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
      {pendingUsers.map((user) => (
        <div
          key={user.id}
          className="bg-[#0f0f12] border border-[rgba(212,175,100,0.1)] rounded-xl p-5 hover:border-[rgba(212,175,100,0.25)] transition-all duration-300"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[rgba(212,175,100,0.15)] to-[rgba(212,175,100,0.05)] flex items-center justify-center border border-[rgba(212,175,100,0.2)]">
                <span className="text-[#d4af64] font-display text-xl font-semibold">
                  {user.username?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h4 className="font-body font-medium text-[#d4af64]">{user.username}</h4>
                <p className="text-xs text-[rgba(212,175,100,0.7)]">{user.role}</p>
              </div>
            </div>
            <span className="px-2 py-1 text-xs rounded-full bg-[rgba(212,175,100,0.1)] text-[#d4af64] font-body">
              Pending
            </span>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-[rgba(212,175,100,0.4)]" />
              <span className="text-[rgba(240,230,200,0.6)] font-body">{user.email}</span>
            </div>
            {user.phone && (
              <div className="flex items-center gap-2 text-sm">
                <svg className="w-4 h-4 text-[rgba(212,175,100,0.4)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-[rgba(240,230,200,0.6)] font-body">{user.phone}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-[rgba(212,175,100,0.4)]" />
              <span className="text-[rgba(240,230,200,0.6)] font-body">
                Joined {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onViewUser(user.id)}
              className="flex-1 px-3 py-2 text-sm font-body text-[rgba(240,230,200,0.7)] border border-[rgba(212,175,100,0.2)] rounded-lg hover:border-[rgba(212,175,100,0.4)] hover:text-[#d4af64] transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" />
              View
            </button>
            <button
              onClick={() => onApprove(user.id)}
              disabled={isLoading}
              className="flex-1 px-3 py-2 text-sm font-body bg-gradient-to-r from-[#d4af64] to-[#c49a40] text-[#0c0c0e] rounded-lg hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              Approve
            </button>
            <button
              onClick={() => onReject(user.id)}  // Now triggers the dialog in parent
              disabled={isLoading}
              className="px-3 py-2 text-sm font-body border border-[rgba(255,100,100,0.3)] text-[#fc8181] rounded-lg hover:bg-[rgba(255,100,100,0.1)] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}