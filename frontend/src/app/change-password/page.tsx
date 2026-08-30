"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Toast from "../components/Toast";
import { AuthApiClient, getErrorMessage } from "../lib/authApiClient";

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showToast, setShowToast] = useState(false);

  return (
    <main className="min-h-screen bg-[#F7FAFE]">
      <nav className="bg-[#0A306D] px-47 py-4 flex items-center">
        <Link href="/dashboard" className="flex items-center gap-3 w-full">
        <Image src="/logo.png" alt="Confide" width={100} height={100} />
        <span className="text-white font-bold text-lg">
          Confide - Private STI Screening for Men
        </span>
      </Link>
      </nav>

      <div className="min-h-[calc(100vh-88px)] flex items-center justify-center px-6 py-4">
        <div className="w-full max-w-lg bg-white border border-blue-100 rounded-2xl shadow-lg px-10 pt-6 pb-5">
          <div className="flex justify-center mb-2">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#0B4DA2"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="16" height="12" x="4" y="10" rx="2" />
                <path d="M8 10V7a4 4 0 0 1 8 0v3" />
              </svg>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-[#0A306D] text-center">
            Change password
          </h1>

          <p className="text-slate-500 text-sm text-center mt-2 mb-5">
            Update your password to keep your account secure.
          </p>

        {success ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
            <p className="text-green-800 text-sm">Password changed successfully.</p>
            {/*<Link href="/dashboard" className="text-[#0B4DA2] text-sm hover:underline mt-3 inline-block">
              ← Back to dashboard
            </Link>*/}
          </div>
        ) : (
          <form
            className="space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setError("");

              const hasMinLength = newPassword.length >= 8;
              const hasLetter = /[a-zA-Z]/.test(newPassword);
              const hasNumber = /[0-9]/.test(newPassword);
              const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

              if (!hasMinLength || !hasLetter || !hasNumber || !hasSymbol) {
                setError("New password must be at least 8 characters, with a letter, a number, and a symbol.");
                return;
              }
              if (newPassword !== confirmPassword) {
                setError("New passwords don't match.");
                return;
              }

              const token = localStorage.getItem("token");
              try {
                await AuthApiClient.changePassword(token!, currentPassword, newPassword);
                setShowToast(true);
                setTimeout(() => { window.location.href = "/dashboard"; }, 1500);
              } catch (err) {
                setError(getErrorMessage(err, "Something went wrong."));
            }}}
          >
            <div>
              <label className="text-base text-slate-800 block mb-2">Current password</label>
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
                    <rect width="16" height="12" x="4" y="10" rx="2" />
                    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                  </svg>

                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full h-14 pl-12 pr-4 bg-[#F8FBFF] border border-slate-300 rounded-xl text-base focus:outline-none focus:border-[#0B4DA2] focus:ring-1 focus:ring-[#0B4DA2]"
                  />
                </div>
            </div>

            <div>
              <label className="text-base text-slate-800 block mb-2">New password</label>
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
                    <rect width="16" height="12" x="4" y="10" rx="2" />
                    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                  </svg>

                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full h-14 pl-12 pr-4 bg-[#F8FBFF] border border-slate-300 rounded-xl text-base focus:outline-none focus:border-[#0B4DA2] focus:ring-1 focus:ring-[#0B4DA2]"
                  />
                </div>
            </div>

            <div>
              <label className="text-base text-slate-800 block mb-2">Confirm new password</label>
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
                    <rect width="16" height="12" x="4" y="10" rx="2" />
                    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                  </svg>

                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full h-14 pl-12 pr-4 bg-[#F8FBFF] border border-slate-300 rounded-xl text-base focus:outline-none focus:border-[#0B4DA2] focus:ring-1 focus:ring-[#0B4DA2]"
                  />
                </div>
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full h-14 rounded-xl bg-[#0B4DA2] text-white font-bold text-base hover:bg-[#093F86] transition-colors cursor-pointer"
            >
              Change password
            </button>
          </form>
        )}

        <div className="flex justify-center mt-5">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 border border-[#0B4DA2] text-[#0B4DA2] text-sm font-semibold px-4 py-2 rounded-xl hover:bg-blue-50 transition-colors"
          >
            <span className="leading-none">←</span>
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
      {showToast && (
          <Toast message="Password changed successfully" onClose={() => setShowToast(false)} />
        )}
    </main>
  );
}