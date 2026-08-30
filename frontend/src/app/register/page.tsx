"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Toast from "../components/Toast";
import { AuthApiClient, getErrorMessage } from "../lib/authApiClient";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [showToast, setShowToast] = useState(false);

  return (
  <main className="min-h-screen bg-[#F7FAFE]">
    <div className="w-full bg-[#0A306D] px-47 py-4">
      <Link href="/" className="flex items-center gap-3 w-full">
        <Image src="/logo.png" alt="Confide" width={100} height={100} />
        <span className="text-white font-bold text-lg">
          Confide - Private STI Screening for Men
        </span>
      </Link>
    </div>

    <div className="min-h-[calc(100vh-88px)] flex items-center justify-center px-6 py-4">
      <div className="w-full max-w-lg bg-white border border-blue-100 rounded-2xl shadow-lg px-10 pt-8 pb-4">
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
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="19" x2="19" y1="8" y2="14" />
      <line x1="22" x2="16" y1="11" y2="11" />
    </svg>
  </div>
</div>

<h1 className="text-3xl font-bold text-[#0A306D] text-center">
  Create your account
</h1>

<p className="text-slate-500 text-sm text-center mt-2 mb-5">
  Register for a better experience with Confide.
</p>
        <form
  className="space-y-4"
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
    await AuthApiClient.register(email, password);
    setShowToast(true);
    setTimeout(() => { window.location.href = "/login"; }, 1200);
  } catch (err) {
    setPasswordError(getErrorMessage(err, "Registration failed."));
  }
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
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className="w-full h-14 pl-12 pr-4 bg-[#F8FBFF] border border-slate-300 rounded-xl text-base focus:outline-none focus:border-[#0B4DA2] focus:ring-1 focus:ring-[#0B4DA2]"
  />
</div>
            {/*<p className="text-sm text-slate-400 mt-2">
              Please provide a valid email address. 
            </p>*/}
          </div>

          <div>
            <label className="text-base text-slate-800 block mb-2">Password</label>
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
    value={password}
    onChange={(e) => {
      setPassword(e.target.value);
      if (passwordError) setPasswordError("");
    }}
    className="w-full h-14 pl-12 pr-4 bg-[#F8FBFF] border border-slate-300 rounded-xl text-base focus:outline-none focus:border-[#0B4DA2] focus:ring-1 focus:ring-[#0B4DA2]"
  />
</div>
            {passwordError && (
              <p className="text-red-600 text-sm mt-2">{passwordError}</p>
            )}
          </div>

          <div>
          <label className="text-base text-slate-800 block mb-2">Confirm password</label>
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

          <label className="flex items-start gap-3 text-sm text-slate-800 cursor-pointer">
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
            className="w-full h-14 rounded-xl bg-[#0B4DA2] text-white font-bold text-base hover:bg-[#093F86] transition-colors cursor-pointer"
          >
            Register
          </button>
           <p className="text-center text-slate-600 text-sm">
             Already have an account?{" "}
           <Link
             href="/login"
             className="text-[#053a7f] font-semibold hover:underline"
             >
             &nbsp;Log in
           </Link>
           </p>
        </form>
      </div>
    </div>
     {showToast && (
           <Toast
             message="Logged in successfully"
             onClose={() => setShowToast(false)}
           />
     )}
  </main>
);
}