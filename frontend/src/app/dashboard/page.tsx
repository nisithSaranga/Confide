"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AuthApiClient } from "../lib/authApiClient";
import { ResultApiClient } from "../lib/resultApiClient";

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
        const verifyRes = await AuthApiClient.verify(token);
        setEmail(verifyRes.data.email || "");

        const historyRes = await ResultApiClient.getHistory(token);
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
          <div className="flex items-center gap-2 bg-white/10 border border-blue-400/40 rounded-full py-1.5 pl-1.5 pr-4">
            <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-xs font-medium text-[#0A306D]">
              {initial}
            </div>
            <span className="text-white text-xs">{email}</span>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
            className="text-white text-sm font-medium border border-white/50 rounded-lg px-5 py-2.5 hover:bg-white/10 transition-all duration-300 cursor-pointer ">
             <i className="ti ti-logout mr-2" />
                Log out
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-8 pt-6 pb-8">
        <div className="mb-7">
         {/* <p className="text-[#1E4B86] text-sm font-medium mb-2">
           👋 Welcome back!
          </p>*/}

          <h1 className="text-3xl font-bold text-[#0A306D] mb-2">
            Dashboard
          </h1>

         <p className="text-slate-500 text-base">
            Your private space within Confide
         </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/classify"
          style={{ animation: "float-in 0.5s ease-out forwards", animationDelay: "0s", opacity: 0 }}
          className="bg-[#F8FBFF] border border-blue-200 rounded-2xl p-6 min-h-[150px] flex items-center gap-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ">
          <div className="w-20 h-20 flex-shrink-0 rounded-2xl bg-blue-100/70 flex items-center justify-center">
          <i className="ti ti-camera text-[#1559C1] text-4xl" />
          </div>
          <div>
            <p className="text-xl font-bold text-[#0A306D]">
              Start a new check
            </p>

            <p className="text-sm text-slate-500 mt-2">
              Assess an anogenital image
            </p>

            {/*<span className="inline-flex items-center gap-3 mt-5 bg-[#1559C1] text-white text-sm font-semibold px-5 py-2.5 rounded-lg">
              Start check
            <span>→</span>
         </span>*/}
      </div>
        </Link>

        <Link
          href="/history"
          style={{ animation: "float-in 0.5s ease-out forwards", animationDelay: "0.1s", opacity: 0 }}
          className="bg-[#F8FBFF] border border-blue-200 rounded-2xl p-6 min-h-[150px] flex items-center gap-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ">
          <div className="w-20 h-20 flex-shrink-0 rounded-2xl bg-emerald-50 flex items-center justify-center">
            <i className="ti ti-history text-emerald-600 text-4xl" />
         </div>
          <div>
            <p className="text-xl font-bold text-[#0A306D]">
               View history
            </p>

            <p className="text-sm text-slate-500 mt-2">
                Your saved results
            </p>

         {/*}   <span className="inline-flex items-center gap-3 mt-5 bg-emerald-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg">
               View history
            <span>→</span>
            </span>*/}
         </div>
        </Link>

        <Link
          href="/change-password"
          style={{ animation: "float-in 0.5s ease-out forwards", animationDelay: "0.2s", opacity: 0 }}
          className="bg-[#F8FBFF] border border-blue-200 rounded-2xl p-6 min-h-[150px] flex items-center gap-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg "        >
          <div className="w-20 h-20 flex-shrink-0 rounded-2xl bg-violet-50 flex items-center justify-center">
            <i className="ti ti-lock text-violet-700 text-4xl" />
          </div>
          <div>
            <p className="text-xl font-bold text-[#0A306D]">
               Change password
            </p>

            <p className="text-sm text-slate-500 mt-2">
               Update your login
            </p>

          {/* <span className="inline-flex items-center gap-3 mt-5 bg-violet-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg">
               Update password
            <span>→</span>
            </span>*/}
          </div>
        </Link>

        <div
          style={{ animation: "float-in 0.5s ease-out forwards", animationDelay: "0.3s", opacity: 0 }}
          className="bg-[#F8FBFF] border border-blue-200 rounded-2xl p-6 min-h-[150px] flex items-center gap-6 "
        >
          <div className="w-20 h-20 flex-shrink-0 rounded-2xl bg-blue-100/70 flex items-center justify-center">
            <i className="ti ti-file-check text-[#1559C1] text-4xl" />
          </div>
          {recent ? (
            <>
             <div>
               <p className="text-sm text-[#1559C1] font-medium mb-2">
                 Most recent result
              </p>

               <p className="text-2xl font-bold text-[#0A306D] mb-2">
                {recent.predicted_condition}
               </p>

               <div className="flex items-center gap-3">
                    <p className="text-sm text-slate-500">
                      Model confidence:{" "}
                      <span className="font-semibold text-slate-700">
                        {(recent.confidence_score * 100).toFixed(1)}%
                      </span>
                    </p>

                    <span className="inline-flex items-center gap-1.5 bg-blue-100 text-[#1559C1] text-xs font-medium px-2.5 py-1 rounded-full">
                      <i className="ti ti-calendar text-sm" />
                      {getRelativeTime(recent.created_at)}
                    </span>
               </div>
            </div>
           </>
          ) : (
            <>
              <div>
                <p className="text-sm text-[#1559C1] font-medium mb-2">
                  No results yet
               </p>

               <p className="text-lg font-semibold text-[#0A306D]">
                  Start a new check to see your latest result here.
               </p>
               </div>
            </>
          )}
        </div>
      </div>
      <div className="mt-6 bg-[#F8FBFF] border border-blue-200 rounded-2xl px-6 py-5 flex items-center gap-5">
        <div className="w-14 h-14 flex-shrink-0 rounded-2xl bg-blue-100/70 flex items-center justify-center">
           <i className="ti ti-shield-check text-[#1559C1] text-4xl" />
      </div>

      <div>
        <p className="text-sm font-semibold text-[#0A306D] mb-1">
          Your images stay on your device.
       </p>

        <p className="text-xs text-slate-500">
          Images are not uploaded. Only results you choose to save are stored as text.
        </p>
       </div>

       </div>
     </div>
    </main>
  );
}