"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AuthApiClient } from "../lib/authApiClient";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <main className="min-h-screen bg-[#F7FAFE]">
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

      <div className="min-h-[calc(100vh-88px)] flex items-center justify-center px-6 py-4">
        <div className="w-full max-w-lg bg-white border border-blue-100 rounded-2xl shadow-lg px-10 pt-6 pb-5">
        {!submitted ? (
          <>
            <div className="flex justify-center mb-2">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="38"
                  height="38"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#0B4DA2"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-10 5L2 7" />
                  <path d="M17 14v-1a2 2 0 0 0-4 0v1" />
                  <rect width="6" height="5" x="12" y="14" rx="1" />
                </svg>
              </div>
            </div>
          <h1 className="text-3xl font-bold text-[#0A306D] text-center">
            Reset your password
          </h1>

          <p className="text-slate-500 text-sm text-center mt-2 mb-6">
            Enter your email address and we&apos;ll send you a link to reset your password.
          </p>

            <form
              className="space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  await AuthApiClient.requestPasswordReset(email);
                } catch {
                  // still show the same neutral message either way
                }
                setSubmitted(true);
              }}
            >
              <div>
                <label className="text-base text-slate-800 block mb-2">Email</label>
                <div className="relative">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-10 5L2 7" />
                    </svg>

                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-14 pl-12 pr-4 bg-[#F8FBFF] border border-slate-300 rounded-xl text-base focus:outline-none focus:border-[#0B4DA2] focus:ring-1 focus:ring-[#0B4DA2]"
                    />
                  </div>
              </div>
              <button
                  type="submit"
                  className="w-full h-14 rounded-xl bg-[#0B4DA2] text-white font-bold text-base hover:bg-[#093F86] transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <i className="ti ti-send text-lg" />
                  Send reset link
                </button>
            </form>
          </>
        ) : (
         <div className="bg-blue-50 border border-blue-100 rounded-xl px-5 py-4 text-center">
            <div className="w-9 h-9 mx-auto mb-2 rounded-full bg-blue-100 flex items-center justify-center">
              <i className="ti ti-mail-check text-[#1559C1] text-xl" />
            </div>

            <p className="text-slate-700 text-sm">
              If an account exists for that email, a reset link has been sent.
            </p>
          </div>

        )}
        <div className="flex justify-center mt-5">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 border border-[#0B4DA2] text-[#0B4DA2] text-sm font-semibold px-4 py-2 rounded-xl hover:bg-blue-50 transition-colors"
          >
            <span className="leading-none">←</span>
            Back to log in
          </Link>
          </div>
        </div>
      </div>
    </main>
  );
}