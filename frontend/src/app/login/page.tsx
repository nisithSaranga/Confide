"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Toast from "../components/Toast";
import { AuthApiClient, getErrorMessage, isRateLimited } from "../lib/authApiClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [error, setError] = useState("");

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

    <div className="min-h-[calc(100vh-88px)] flex items-center justify-center px-6 py-6">
      <div className="w-full max-w-lg bg-white border border-blue-100 rounded-2xl shadow-lg px-10 py-7">
        <div className="flex justify-center mb-3">
           <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0B4DA2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
                <rect width="16" height="12" x="4" y="10" rx="2" />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3" />
              </svg>
           </div>
        </div>
        <h1 className="text-3xl font-bold text-[#0A306D] text-center">
             Log In
        </h1>
 
        <p className="text-slate-500 text-sm text-center mt-2 mb-6">
            Access your Confide account.
        </p>
        <form
  className="space-y-4"
  onSubmit={async (e) => {
  e.preventDefault();
  try {
    const res = await AuthApiClient.login(email, password);
    localStorage.setItem("token", res.data.token);
    setShowToast(true);
    setTimeout(() => { window.location.href = "/dashboard"; }, 1200);
     } catch (err) {
  if (isRateLimited(err)) {
    setError("Too many login attempts. Please wait a minute and try again.");
  } else {
    setError("Invalid email or password.");
  }
}
}}
>
          <div>
            <label className="text-base text-slate-800 block mb-2">
              Email
            </label>
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
    onChange={(e) => {
      setEmail(e.target.value);
      if (error) setError("");
    }}
    className="w-full h-14 pl-12 pr-4 bg-[#F8FBFF] border border-slate-300 rounded-xl text-base focus:outline-none focus:border-[#0B4DA2] focus:ring-1 focus:ring-[#0B4DA2]"
  />
</div>
          </div>

          <div>
            <label className="text-base text-slate-800 block mb-2">
              Password
            </label>
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
      if (error) setError("");
    }}
    className="w-full h-14 pl-12 pr-4 bg-[#F8FBFF] border border-slate-300 rounded-xl text-base focus:outline-none focus:border-[#0B4DA2] focus:ring-1 focus:ring-[#0B4DA2]"
  />
</div>
            {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
          </div>

          <Link
            href="/forgot-password"
            className="block text-right text-[#0B4DA2] hover:underline text-sm font-medium"
          >
            Forgot password?
          </Link>

          <button
            type="submit"
            className="w-full h-14 rounded-xl bg-[#0B4DA2] text-white font-bold text-base hover:bg-[#093F86] transition-colors cursor-pointer"
          >
            Log In
          </button>
        <p className="text-center text-slate-600 text-sm">
            Not a member?{" "}
          <Link
            href="/register"
            className="text-[#053a7f] font-semibold hover:underline"
            >
             &nbsp;Register
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