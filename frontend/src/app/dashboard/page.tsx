"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";

export default function Dashboard() {
  const [checking, setChecking] = useState(true);

useEffect(() => {
  async function checkAuth() {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    try {
      await axios.get("http://localhost:8000/auth/verify", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setChecking(false);
    } catch {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  }
  checkAuth();
}, []);

if (checking) {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <p className="text-slate-400 text-sm">Checking session…</p>
    </main>
  );
}
  return (
    <main className="min-h-screen bg-white">
      <nav className="bg-[#0A306D] px-6 py-4 flex items-center">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="Confide" width={100} height={100} />
          <div>
            <div className="text-white font-bold text-lg leading-none">Confide</div>
            <div className="text-blue-200 text-xs">Skin Screening</div>
          </div>
        </Link>
      </nav>

      <div className="max-w-lg mx-auto px-6 py-16">
        <h1 className="text-2xl font-bold text-[#0A306D] mb-2">Welcome back</h1>
        <p className="text-slate-500 text-sm mb-10">What would you like to do?</p>

        <div className="space-y-3">
          <Link href="/classify">
            <button className="w-full h-14 rounded-full bg-[#FF2B34] text-white font-semibold text-sm hover:brightness-90 transition-all">
              Classify a photo
            </button>
          </Link>
          <Link href="/history">
            <button className="w-full h-14 rounded-full border-2 border-[#0B4DA2] text-[#0B4DA2] font-semibold text-sm hover:bg-blue-50 transition-colors">
              View history
            </button>
          </Link>
          <Link href="/change-password">
            <button className="w-full h-14 rounded-full border-2 border-slate-300 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors">
              Change password
            </button>
          </Link>
         <button
           onClick={() => {
             localStorage.removeItem("token");
             window.location.href = "/login";
            }}
  className="w-full h-14 rounded-full text-slate-400 font-medium text-sm hover:text-slate-600 transition-colors"
>
  Log out
</button>
        </div>
      </div>
    </main>
  );
}