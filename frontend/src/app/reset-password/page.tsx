"use client";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Toast from "../components/Toast";
import { AuthApiClient, getErrorMessage } from "../lib/authApiClient";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showToast, setShowToast] = useState(false);

  if (!token) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-700 text-sm">This reset link is missing or invalid.</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-center mb-3">
                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
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

              <h1 className="text-2xl font-bold text-[#0A306D] text-center">
                Set a new password
              </h1>

              <p className="text-slate-500 text-sm text-center mt-2 mb-5">
                Create a secure new password for your Confide account.
              </p>

      {success ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-5 text-center">
          <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-emerald-100 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-emerald-700"
            >
              <path d="m5 12 4 4L19 6" />
            </svg>
          </div>

          <p className="text-emerald-800 text-sm font-medium mb-4">
            Password reset successfully.
          </p>

          <Link
            href="/login"
            className="inline-flex items-center gap-2 border border-[#0B4DA2] text-[#0B4DA2] text-sm font-semibold px-4 py-2 rounded-xl hover:bg-blue-50 transition-colors"
          >
            Log in with your new password
            <span>→</span>
          </Link>
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
              setError("Password must be at least 8 characters, with a letter, a number, and a symbol.");
              return;
            }
            if (newPassword !== confirmPassword) {
              setError("Passwords don't match.");
              return;
            }

            try {
              await AuthApiClient.resetPassword(token, newPassword);
              setSuccess(true);
              setShowToast(true);
            } catch (err) {
              setError(getErrorMessage(err, "Something went wrong."));
            }
          }}
        >
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
            Reset password
          </button>
        </form>
      )}
      {showToast && (
        <Toast message="Password reset successfully" onClose={() => setShowToast(false)} />
      )}
    </>
  );
}

export default function ResetPassword() {
  return (
    <main className="min-h-screen bg-[#F7FAFE]">
      <nav className="bg-[#0A306D] px-47 py-4 flex items-center">
        <div className="flex items-center gap-3 cursor-pointer">
          <Image src="/logo.png" alt="Confide" width={100} height={100} />
          <div>
            <div className="text-white font-bold text-lg leading-none">Confide - Private STI Screening for Men</div>
          </div>
        </div>
      </nav>

       <div className="min-h-[calc(100vh-88px)] flex items-center justify-center px-6 py-4">
        <div className="w-full max-w-md bg-white border border-blue-100 rounded-2xl shadow-lg px-8 pt-6 pb-6">
          <Suspense fallback={<p className="text-slate-400 text-sm">Loading…</p>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}