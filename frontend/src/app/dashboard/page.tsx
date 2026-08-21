"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";

interface RecentResult {
  predicted_condition: string;
  confidence_score: number;
  created_at: string;
}

function getRelativeTime(dateString: string): string {
  const colombo = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Colombo",
    year: "numeric", month: "2-digit", day: "2-digit",
  });
  const resultDay = colombo.format(new Date(dateString));
  const todayDay = colombo.format(new Date());

  if (resultDay === todayDay) return "Today";

  const diffDays = Math.round(
    (new Date(todayDay).getTime() - new Date(resultDay).getTime()) / 86400000
  );
  return diffDays === 1 ? "Yesterday" : `${diffDays} days ago`;
}

export default function Dashboard() {
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState("");
  const [recent, setRecent] = useState<RecentResult | null>(null);

  useEffect(() => {
    async function load() {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login";
        return;
      }
      try {
        const verifyRes = await axios.get("http://localhost:8000/auth/verify", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmail(verifyRes.data.email || "");

        const historyRes = await axios.get("http://localhost:8000/results/history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (historyRes.data.results.length > 0) {
          setRecent(historyRes.data.results[0]);
        }

        setChecking(false);
      } catch {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
    load();
  }, []);

  if (checking) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-slate-400 text-sm">Checking session…</p>
      </main>
    );
  }

  const initial = email ? email[0].toUpperCase() : "?";

  return (
    <main className="min-h-screen bg-white">
      <nav className="bg-[#0A306D] px-47 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-3">
        <Image
          src="/logo.png"
          alt="Confide"
          width={100}
          height={100}
        />
      <span className="text-white font-bold text-lg">
        Confide - Private STI Screening for Men
      </span>
          </Link>

        <div className="flex items-center gap-10 mr-30">
          <div className="flex items-center gap-1.5 bg-white/15 rounded-full py-0.5 pl-0.5 pr-2.5">
            <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-[10px] font-medium text-[#0A306D]">
              {initial}
            </div>
            <span className="text-white text-xs">{email}</span>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
            className="text-white text-sm font-medium border border-transparent rounded-lg px-4 py-2 hover:border-white/40 hover:bg-white/10 transition-all duration-300 cursor-pointer"
          >
            Log out
          </button>
        </div>
      </nav>

      <div className="px-6 pt-20 pb-2 grid grid-cols-2 gap-6 max-w-lg mx-auto">
        <Link
          href="/classify"
          style={{ animation: "float-in 0.5s ease-out forwards", animationDelay: "0s", opacity: 0 }}
          className="bg-blue-50 border-2 border-blue-100 rounded-xl p-10 block transition-all duration-200 hover:scale-105 hover:shadow-md"
        >
          <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center mb-2">
            <span className="text-red-600 text-lg">📷</span>
          </div>
          <p className="text-sm font-medium text-slate-900 m-0 mb-0.5">Get your skin checked</p>
          <p className="text-xs text-slate-500 m-0">Start a new check</p>
        </Link>

        <Link
          href="/history"
          style={{ animation: "float-in 0.5s ease-out forwards", animationDelay: "0.1s", opacity: 0 }}
          className="bg-blue-50 border-2 border-blue-100 rounded-xl p-10 block transition-all duration-200 hover:scale-105 hover:shadow-md"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center mb-2">
            <span className="text-emerald-700 text-lg">🕘</span>
          </div>
          <p className="text-sm font-medium text-slate-900 m-0 mb-0.5">View history</p>
          <p className="text-xs text-slate-500 m-0">Your saved results</p>
        </Link>

        <Link
          href="/change-password"
          style={{ animation: "float-in 0.5s ease-out forwards", animationDelay: "0.2s", opacity: 0 }}
          className="bg-blue-50 border-2 border-blue-100 rounded-xl p-10 block transition-all duration-200 hover:scale-105 hover:shadow-md"        >
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center mb-2">
            <span className="text-slate-500 text-lg">🔒</span>
          </div>
          <p className="text-sm font-medium text-slate-900 m-0 mb-0.5">Change password</p>
          <p className="text-xs text-slate-500 m-0">Update your login</p>
        </Link>

        <div
          style={{ animation: "float-in 0.5s ease-out forwards", animationDelay: "0.3s", opacity: 0 }}
          className="bg-blue-50 border-2 border-blue-100 rounded-xl p-10 transition-all duration-200 hover:scale-105 hover:shadow-md"
        >
          <div className="w-8 h-8 rounded-lg bg-white/60 flex items-center justify-center mb-2">
            <span className="text-blue-700 text-lg">🕐</span>
          </div>
          {recent ? (
            <>
              <p className="text-xs text-blue-700 m-0 mb-0.5 cursor-pointer">Most recent</p>
              <p className="text-sm font-medium text-slate-900 m-0 mb-0.5 cursor-pointer">
                {recent.predicted_condition} — {(recent.confidence_score * 100).toFixed(0)}%
              </p>
              <p className="text-xs text-slate-500 m-0 cursor-pointer">{getRelativeTime(recent.created_at)}</p>
            </>
          ) : (
            <>
              <p className="text-xs text-blue-700 m-0 mb-0.5">No results yet</p>
              <p className="text-sm text-slate-600 m-0">Classify a photo to get started</p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}