// components/admin/AdminNavbar.jsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminNavbar({ user, logout }) {
  const pathname = usePathname();

  return (
    <nav className="bg-[#0f0f12] border-b border-[rgba(212,175,100,0.12)] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/admin/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-gradient-to-br from-[#d4af64] to-[#c49a40] rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                <path d="M9 2L11.5 7H16.5L12.5 10.5L14 15.5L9 12.5L4 15.5L5.5 10.5L1.5 7H6.5L9 2Z" fill="#0c0c0e"/>
              </svg>
            </div>
            <span className="font-display text-xl font-semibold text-[#f0e6c8] tracking-wide">
              Veritas <span className="text-[#d4af64] text-sm font-body font-normal ml-1">Admin</span>
            </span>
          </Link>

          {/* User menu */}
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-[#f0e6c8] font-body">{user?.username}</p>
              <p className="text-xs text-[rgba(212,175,100,0.7)] font-body">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm font-body text-[rgba(240,230,200,0.7)] hover:text-[#d4af64] transition-colors duration-200 border border-[rgba(212,175,100,0.2)] rounded-lg hover:border-[rgba(212,175,100,0.4)] hover:bg-[rgba(212,175,100,0.05)]"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}