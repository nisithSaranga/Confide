"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";

interface Result {
  _id: string;
  predicted_condition: string;
  confidence_score: number;
  created_at: string;
}

export default function History() {
  const [checking, setChecking] = useState(true);
  const [results, setResults] = useState<Result[]>([]);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    async function load() {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login";
        return;
      }
      try {
        const res = await axios.get("http://localhost:8000/results/history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResults(res.data.results);
        setChecking(false);
      } catch {
        setLoadError(true);
        setChecking(false);
      }
    }
    load();
  }, []);

  function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
    timeZone: "Asia/Colombo",
  });
}

  return (
    <main className="min-h-screen bg-white">
      <nav className="bg-[#0A306D] px-6 py-4 flex items-center">
        <Link href="/" className="flex items-center gap-3 w-full">
        <Image src="/logo.png" alt="Confide" width={100} height={100} />
        <span className="text-white font-bold text-lg">
          Confide - Confidential Medical Screening for Men
        </span>
      </Link>
      </nav>

      <div className="max-w-lg mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold text-[#0A306D] mb-6">Your history</h1>

        {checking && (
          <div className="text-center py-8 text-slate-400 text-sm">Loading…</div>
        )}

        {loadError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-center">
            <p className="text-red-700 text-sm">Couldn&apos;t load your history. Try logging in again.</p>
          </div>
        )}

        {!checking && !loadError && results.length === 0 && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center">
            <p className="text-slate-500 text-sm">No saved results yet.</p>
          </div>
        )}

        {!checking && results.length > 0 && (
          <div className="space-y-3">
            {results.map((r) => (
              <div key={r._id} className="border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-[#0A306D] text-sm">{r.predicted_condition}</p>
                  <p className="text-slate-400 text-xs mt-1">{formatDate(r.created_at)}</p>
                </div>
                <span className="text-sm font-medium text-slate-600">
                  {(r.confidence_score * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        )}

        <Link href="/dashboard" className="block text-center text-[#0B4DA2] text-sm mt-8 hover:underline">
          ← Back to dashboard
        </Link>
      </div>
    </main>
  );
}