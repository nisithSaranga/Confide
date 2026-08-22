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
      <h1 className="text-3xl font-bold text-[#0A306D] mb-8">Set a new password</h1>

      {success ? (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
          <p className="text-green-800 text-sm mb-3">Password reset successfully.</p>
          <Link href="/login" className="text-[#0B4DA2] text-sm hover:underline">
            Log in with your new password →
          </Link>
        </div>
      ) : (
        <form
          className="space-y-6"
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
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full h-14 px-4 border border-slate-300 rounded-md text-base focus:outline-none focus:border-[#0B4DA2] focus:ring-1 focus:ring-[#0B4DA2]"
            />
          </div>

          <div>
            <label className="text-base text-slate-800 block mb-2">Confirm new password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full h-14 px-4 border border-slate-300 rounded-md text-base focus:outline-none focus:border-[#0B4DA2] focus:ring-1 focus:ring-[#0B4DA2]"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full h-14 rounded-full bg-[#0B4DA2] text-white font-bold text-base hover:brightness-90 transition-all cursor-pointer"
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
    <main className="min-h-screen bg-white">
      <nav className="bg-[#0A306D] px-47 py-4 flex items-center">
        <div className="flex items-center gap-3 cursor-pointer">
          <Image src="/logo.png" alt="Confide" width={100} height={100} />
          <div>
            <div className="text-white font-bold text-lg leading-none">Confide - Private STI Screening for Men</div>
          </div>
        </div>
      </nav>

      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Suspense fallback={<p className="text-slate-400 text-sm">Loading…</p>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}