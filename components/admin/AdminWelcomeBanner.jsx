// components/admin/AdminWelcomeBanner.jsx
"use client";

export default function AdminWelcomeBanner() {
  return (
    <div className="mb-8 p-6 rounded-xl bg-gradient-to-r from-[rgba(212,175,100,0.05)] to-transparent border border-[rgba(212,175,100,0.1)]">
      <h1 className="font-display text-3xl text-[#f0e6c8] mb-2">
        Welcome back, <em className="text-[#d4af64] italic font-extralighta">Administrator</em>
      </h1>
      <p className="text-[rgba(240,230,200,0.5)] font-body text-sm">
        Manage users, monitor platform activity, and ensure operational excellence.
      </p>
      <div className="mt-4 w-12 h-px bg-gradient-to-r from-[#d4af64] to-transparent" />
    </div>
  );
}