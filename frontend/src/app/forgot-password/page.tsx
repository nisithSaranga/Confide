"use client";
import { useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <main className="min-h-screen bg-white">
      <nav className="bg-[#0A306D] px-47 py-4 flex items-center gap-3 w-full">
        <Link href="/" className="flex items-center gap-3">
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
      </nav>

      <div className="w-full max-w-md mx-auto px-6 py-12">
        {!submitted ? (
          <>
            <h1 className="text-4xl font-bold text-[#0A306D] mb-3">Reset password</h1>
            <p className="text-slate-500 text-sm mb-8">
              Enter your email and we&apos;ll send you a link to reset your password.
            </p>

            <form
              className="space-y-6"
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  await axios.post("http://localhost:8000/auth/forgot-password", { email });
                } catch {
                  // still show the same neutral message either way
                }
                setSubmitted(true);
              }}
            >
              <div>
                <label className="text-base text-slate-800 block mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-14 px-4 border border-slate-300 rounded-md text-base focus:outline-none focus:border-[#0B4DA2] focus:ring-1 focus:ring-[#0B4DA2]"
                />
              </div>

              <button
                type="submit"
                className="w-full h-14 rounded-full bg-[#0B4DA2] text-white font-bold text-base hover:brightness-90 transition-all cursor-pointer"
              >
                Send reset link
              </button>
            </form>
          </>
        ) : (
          <div className="bg-blue-50 rounded-xl p-6 text-center mt-[20px]">
  <p className="text-slate-700 text-sm">
    If an account exists for that email, a reset link has been sent.
  </p>
</div>

        )}

        <Link href="/login" className="block text-center text-[#0B4DA2] text-sm mt-6 hover:underline">
          ← Back to log in
        </Link>
      </div>
    </main>
  );
}