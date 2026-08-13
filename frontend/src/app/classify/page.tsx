"use client";
import Image from "next/image";
import Link from "next/link";

export default function Classify() {
  return (
    <main className="min-h-screen bg-white">
      <nav className="bg-[#0A306D] px-6 py-4 flex items-center gap-3">
        <Link href="/">
          <Image src="/logo.png" alt="Confide" width={100} height={100}/>
        </Link>
        <span className="text-white font-bold">Confide - Confidential Medical Screening for Men</span>
        
      </nav>

      <div className="max-w-lg mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold text-[#0A306D] mb-6">Let&apos;s check it</h1>

        <div className="bg-blue-50 rounded-xl p-4 mb-6">
          <p className="text-sm text-slate-700">
            Confide checks for three conditions: <strong>HPV, HSV & Syphilis</strong>.
            Images outside this scope may produce unreliable results.
          </p>
        </div>

        <div className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center mb-6 hover:border-[#0B4DA2] transition-colors cursor-pointer">
          <div className="text-4xl mb-3">📷</div>
          <p className="text-slate-600 text-sm">Tap to upload a photo</p>
        </div>

        <button className="w-full h-14 rounded-full bg-[#FF2B34] text-white font-bold text-base uppercase tracking-wide shadow-lg hover:brightness-90 transition-all">
          Submit
        </button>

       {/*<Link href="/" className="block text-center text-[#0B4DA2] text-sm mt-6 hover:underline">
          ← Back to home
        </Link>*/}
      </div>
    </main>
  );
}