"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ResultApiClient } from "../lib/resultApiClient";

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
        const res = await ResultApiClient.getHistory(token);
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

function getConditionStyle(condition: string) {
  switch (condition) {
    case "HSV":
      return {
        iconBg: "bg-blue-100/70",
        iconText: "text-[#1559C1]",
        badgeBg: "bg-blue-100",
        badgeText: "text-[#1559C1]",
      };

    case "HPV":
      return {
        iconBg: "bg-violet-50",
        iconText: "text-violet-600",
        badgeBg: "bg-violet-100",
        badgeText: "text-violet-600",
      };

    case "Syphilis":
      return {
        iconBg: "bg-amber-50",
        iconText: "text-amber-600",
        badgeBg: "bg-amber-100",
        badgeText: "text-amber-700",
      };

    default:
      return {
        iconBg: "bg-slate-100",
        iconText: "text-slate-600",
        badgeBg: "bg-slate-100",
        badgeText: "text-slate-600",
      };
  }
}
  return (
    <main className="min-h-screen bg-white">
      <nav className="bg-[#0A306D] px-47 py-4 flex items-center">
        <Link href="/dashboard" className="flex items-center gap-3 w-full">
        <Image src="/logo.png" alt="Confide" width={100} height={100} />
        <span className="text-white font-bold text-lg">
          Confide - Private STI Screening for Men
        </span>
      </Link>
      </nav>

      <div className="max-w-4xl mx-auto px-8 py-10">
        <div className="flex items-center gap-5 mb-8">
  <div className="w-14 h-14 rounded-2xl bg-blue-100/70 flex items-center justify-center flex-shrink-0">
    <i className="ti ti-history text-[#1559C1] text-3xl" />
  </div>

  <div>
    <h1 className="text-3xl font-bold text-[#0A306D]">
      Your history
    </h1>

    <p className="text-slate-500 text-sm mt-2">
      View your previously saved screening results.
    </p>
  </div>
</div>

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
           {results.map((r) => {
  const style = getConditionStyle(r.predicted_condition);

  return (
    <div
      key={r._id}
      className=" bg-[#F8FBFF] border border-blue-100 rounded-2xl px-6 py-4 flex items-center justify-between ">
      <div className="flex items-center gap-5">
        <div
          className={`w-14 h-14 rounded-xl ${style.iconBg} flex items-center justify-center flex-shrink-0`}
        >
          <i
            className={`ti ti-file-check ${style.iconText} text-3xl`}
          />
        </div>
        <div>
          <p className="font-bold text-[#0A306D] text-base">
            {r.predicted_condition}
          </p>

          <div className="flex items-center gap-2 mt-2 text-slate-500 text-xs">
            <i className="ti ti-calendar text-sm" />
            <span>{formatDate(r.created_at)}</span>
          </div>
        </div>
      </div>

      {/* Confidence */}
      <div className="text-right">
        <p className="text-xs text-slate-500 mb-1">
          Model confidence
        </p>

        <div
          className={`${style.badgeBg} ${style.badgeText} px-4 py-2 rounded-xl text-lg font-bold`}
        >
          {(r.confidence_score * 100).toFixed(1)}%
        </div>
      </div>
    </div>
    );
   })}
          </div>
        )}
       <div className="flex justify-center mt-8">
         <Link
           href="/dashboard"
           className=" inline-flex items-center justify-center gap-2 border border-[#1559C1] text-[#1559C1] bg-white font-semibold text-sm px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors " 
          >
           <i className="ti ti-arrow-left text-lg" />
            Back to dashboard
        </Link>
      </div>
     </div>
    </main>
  );
}