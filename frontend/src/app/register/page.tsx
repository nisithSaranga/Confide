"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import Toast from "../components/Toast";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [showToast, setShowToast] = useState(false);

  return (
  <main className="min-h-screen bg-white">
    <div className="w-full bg-[#0A306D] px-6 py-4">
      <Link href="/" className="flex items-center gap-3 w-full">
        <Image src="/logo.png" alt="Confide" width={100} height={100} />
        <span className="text-white font-bold text-lg">
          Confide - Confidential Medical Screening for Men
        </span>
      </Link>
    </div>

    <div className="min-h-[calc(100vh-88px)] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">

        <h1 className="text-4xl font-bold text-[#0A306D] mb-8">Register</h1>

        <form
  className="space-y-6"
  onSubmit={async (e) => {
  e.preventDefault();

  const hasMinLength = password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (!hasMinLength || !hasLetter || !hasNumber || !hasSymbol) {
    setPasswordError(
      "Password must be at least 8 characters & include a letter, a number & a special symbol."
    );
    return;
  }

  if (!accepted) {
    setPasswordError("Please accept the Terms of Use and Privacy Policy to continue.");
    return;
  }

  if (password !== confirmPassword) {
    setPasswordError("Passwords don't match.");
    return;
  }

  setPasswordError("");

try {
  await axios.post("http://localhost:8000/auth/register", {
    email,
    password,
  });
  setShowToast(true);
setTimeout(() => { window.location.href = "/login"; }, 1200);
} catch (err) {
  if (axios.isAxiosError(err) && err.response) {
    setPasswordError(err.response.data.detail || "Registration failed.");
  } else {
    setPasswordError("Something went wrong. Please try again.");
  }
}
}}
>
          <div>
            <label className="text-base text-slate-800 block mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-14 px-4 border border-slate-300 rounded-md text-base focus:outline-none focus:border-[#0B4DA2] focus:ring-1 focus:ring-[#0B4DA2]"
            />
            <p className="text-sm text-slate-400 mt-2">
              Please provide a valid email address. An email with a registration confirmation link will be sent to it.
            </p>
          </div>

          <div>
            <label className="text-base text-slate-800 block mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) setPasswordError("");
              }}
              className="w-full h-14 px-4 border border-slate-300 rounded-md text-base focus:outline-none focus:border-[#0B4DA2] focus:ring-1 focus:ring-[#0B4DA2]"
            />
            {passwordError && (
              <p className="text-red-600 text-sm mt-2">{passwordError}</p>
            )}
          </div>

          <div>
            <label className="text-base text-slate-800 block mb-2">Confirm password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full h-14 px-4 border border-slate-300 rounded-md text-base focus:outline-none focus:border-[#0B4DA2] focus:ring-1 focus:ring-[#0B4DA2]"
            />
          </div>

          <label className="flex items-start gap-3 text-base text-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="mt-1 w-4 h-4"
            />
            <span>
              I accept the{" "}
              <Link href="/terms" className="text-[#0B4DA2] hover:underline">Terms of Use</Link>
              {" "}and{" "}
              <Link href="/privacy" className="text-[#0B4DA2] hover:underline">Privacy Policy</Link>
            </span>
          </label>

          <button
            type="submit"
            className="w-full h-14 rounded-full bg-[#0B4DA2] text-white font-bold text-base hover:brightness-90 transition-all mt-4"
          >
            Register
          </button>

          <Link href="/login">
            <button
              type="button"
              className="w-full h-14 rounded-full border-2 border-[#0B4DA2] text-[#0B4DA2] font-bold text-base hover:bg-blue-50 transition-colors"
            >
              I have an Account
            </button>
          </Link>
        </form>
      </div>
    </div>
    {showToast && (
  <Toast message="Registered successfully" onClose={() => setShowToast(false)} />
)}
  </main>
);
}