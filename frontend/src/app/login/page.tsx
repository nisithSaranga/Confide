"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import Toast from "../components/Toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showToast, setShowToast] = useState(false);

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

    <div className="min-h-[calc(100vh-88px)] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">

        <h1 className="text-4xl font-bold text-[#0A306D] mb-8">
          Log In
        </h1>

        <form
  className="space-y-6"
 onSubmit={async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post("http://localhost:8000/auth/login", {
      email,
      password,
    });
    localStorage.setItem("token", res.data.token);
    setShowToast(true);
setTimeout(() => { window.location.href = "/dashboard"; }, 1200);
  } catch (err) {
    alert("Invalid email or password.");
  }
}}
>
          <div>
            <label className="text-base text-slate-800 block mb-2">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-14 px-4 border border-slate-300 rounded-md text-base focus:outline-none focus:border-[#0B4DA2] focus:ring-1 focus:ring-[#0B4DA2]"
            />
          </div>

          <div>
            <label className="text-base text-slate-800 block mb-2">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-14 px-4 border border-slate-300 rounded-md text-base focus:outline-none focus:border-[#0B4DA2] focus:ring-1 focus:ring-[#0B4DA2]"
            />
          </div>

          <Link
            href="/forgot-password"
            className="block text-[#0B4DA2] hover:underline text-base"
          >
            Forgot password?
          </Link>

          <button
            type="submit"
            className="w-full h-14 rounded-full bg-[#0B4DA2] text-white font-bold text-base hover:brightness-90 transition-all mt-4 cursor-pointer"
          >
            Log In
          </button>

          <p className="text-center text-slate-700 text-base pt-2">
            Not a member?
          </p>

          <Link href="/register">
            <button
              type="button"
              className="w-full h-14 rounded-full border-2 border-[#0B4DA2] text-[#0B4DA2] font-bold text-base hover:bg-blue-50 transition-colors cursor-pointer"
            >
              Register
            </button>
          </Link>
        </form>

      </div>
    </div>
   {showToast && (
    <Toast message="Logged in successfully" onClose={() => setShowToast(false)} bottomOffset="110px" />
   )}
  </main>
);
}