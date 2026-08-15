"use client";
import { useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import Toast from "../components/Toast";

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showToast, setShowToast] = useState(false);

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

      <div className="max-w-md mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-[#0A306D] mb-8">Change password</h1>

        {success ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
            <p className="text-green-800 text-sm">Password changed successfully.</p>
            {/*<Link href="/dashboard" className="text-[#0B4DA2] text-sm hover:underline mt-3 inline-block">
              ← Back to dashboard
            </Link>*/}
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
                setError("New password must be at least 8 characters, with a letter, a number, and a symbol.");
                return;
              }
              if (newPassword !== confirmPassword) {
                setError("New passwords don't match.");
                return;
              }

              const token = localStorage.getItem("token");
              try {
                await axios.post(
                  "http://localhost:8000/auth/change-password",
                  { current_password: currentPassword, new_password: newPassword },
                  { headers: { Authorization: `Bearer ${token}` } }
                );
                setSuccess(true);
                 setShowToast(true);
              } catch (err) {
                setError(axios.isAxiosError(err) ? err.response?.data?.detail || "Something went wrong." : "Something went wrong.");
              }
            }}
          >
            <div>
              <label className="text-base text-slate-800 block mb-2">Current password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full h-14 px-4 border border-slate-300 rounded-md text-base focus:outline-none focus:border-[#0B4DA2] focus:ring-1 focus:ring-[#0B4DA2]"
              />
            </div>

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
              className="w-full h-14 rounded-full bg-[#0B4DA2] text-white font-bold text-base hover:brightness-90 transition-all"
            >
              Change password
            </button>
          </form>
        )}

        <Link href="/dashboard" className="block text-center text-[#0B4DA2] text-sm mt-8 hover:underline">
          ← Back to dashboard
        </Link>
      </div>
      {showToast && (
  <Toast message="Password changed successfully" onClose={() => setShowToast(false)} />
)}
    </main>
  );
}