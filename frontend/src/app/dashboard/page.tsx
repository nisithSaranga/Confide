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
    <main className="min-h-screen bg-blue-50">
      <div className="relative overflow-hidden">
        <svg width="100%" viewBox="0 0 480 70" className="block" preserveAspectRatio="none">
          <defs>
            <linearGradient id="ff1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0B4DA2" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#0C52B5" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="ff2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1D9E75" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#0F6E56" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="ff3" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#0E7490" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <rect width="480" height="70" fill="#071F4A" />
          <polygon points="0,0 260,0 130,70 0,50" fill="url(#ff1)" style={{ mixBlendMode: "screen" }} />
          <polygon points="480,0 220,0 380,70 480,35" fill="url(#ff2)" style={{ mixBlendMode: "screen" }} />
          <polygon points="150,0 330,0 260,70 60,70" fill="url(#ff3)" style={{ mixBlendMode: "screen" }} />
        </svg>

        <div className="absolute top-0 left-0 right-0 h-full flex items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3 w-full">
            <Image src="/logo.png" alt="Confide" width={100} height={100}/>
            <span className="text-white font-bold text-lg">
              Confide - Confidential Medical Screening for Men
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
              className="border border-white/60 rounded-b-lg px-2.5 py-1 text-white text-xs cursor-pointer"
            >
              Log out
            </button>
          </div>
        </div>
      </div>

      {/*<div className="max-w-lg mx-auto px-6 pt-6">
        <h1 className="text-2xl font-bold text-[#0A306D] mb-4">Welcome back</h1>
      </div>*/}

       <div className="px-6 pt-20 pb-2 grid grid-cols-2 gap-6 max-w-lg mx-auto">        <Link
          href="/classify"
          style={{ animation: "float-in 0.5s ease-out forwards", animationDelay: "0s", opacity: 0 }}
          className="bg-white border border-slate-200 rounded-xl p-3.5 block transition-all duration-200 hover:scale-105 hover:shadow-md"
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
          className="bg-white border border-slate-200 rounded-xl p-3.5 block transition-all duration-200 hover:scale-105 hover:shadow-md"
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
          className="bg-white border border-slate-200 rounded-xl p-3.5 block transition-all duration-200 hover:scale-105 hover:shadow-md"        >
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center mb-2">
            <span className="text-slate-500 text-lg">🔒</span>
          </div>
          <p className="text-sm font-medium text-slate-900 m-0 mb-0.5">Change password</p>
          <p className="text-xs text-slate-500 m-0">Update your login</p>
        </Link>

        <div
          style={{ animation: "float-in 0.5s ease-out forwards", animationDelay: "0.3s", opacity: 0 }}
          className="bg-blue-100 border border-blue-200 rounded-xl p-3.5 transition-all duration-200 hover:scale-105 hover:shadow-md"
        >
          <div className="w-8 h-8 rounded-lg bg-white/60 flex items-center justify-center mb-2">
            <span className="text-blue-700 text-lg">🕐</span>
          </div>
          {recent ? (
            <>
              <p className="text-xs text-blue-700 m-0 mb-0.5">Most recent</p>
              <p className="text-sm font-medium text-slate-900 m-0 mb-0.5">
                {recent.predicted_condition} — {(recent.confidence_score * 100).toFixed(0)}%
              </p>
              <p className="text-xs text-slate-500 m-0">{getRelativeTime(recent.created_at)}</p>
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