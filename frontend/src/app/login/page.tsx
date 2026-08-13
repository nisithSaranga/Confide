"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

 return (
  <main className="min-h-screen bg-white">

    <nav className="bg-[#0A306D] px-6 py-4 flex items-center gap-3 w-full">
      <Link href="/">
        <Image
          src="/logo.png"
          alt="Confide"
          width={100}
          height={100}
        />
      </Link>

      <span className="text-white font-bold">
        Confide - Confidential Medical Screening for Men
      </span>
    </nav>

    <div className="min-h-[calc(100vh-88px)] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">

        <h1 className="text-4xl font-bold text-[#0A306D] mb-8">
          Log In
        </h1>

        <form className="space-y-6">
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
            className="w-full h-14 rounded-full bg-[#0B4DA2] text-white font-bold text-base hover:brightness-90 transition-all mt-4"
          >
            Log In
          </button>

          <p className="text-center text-slate-700 text-base pt-2">
            Not a member?
          </p>

          <Link href="/register">
            <button
              type="button"
              className="w-full h-14 rounded-full border-2 border-[#0B4DA2] text-[#0B4DA2] font-bold text-base hover:bg-blue-50 transition-colors"
            >
              Register
            </button>
          </Link>
        </form>

      </div>
    </div>

  </main>
);
}