"use client";

import { useEffect } from "react";

interface ToastProps {
  message: string;
  onClose: () => void;
  bottomOffset?: string;
}

export default function Toast({
  message,
  onClose,
  bottomOffset = "40px",
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className="fixed left-1/2 -translate-x-1/2 z-50"
      style={{ bottom: bottomOffset }}
    >
      <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium px-5 py-2 rounded-xl shadow-md">
        <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m5 12 4 4L19 6" />
          </svg>
        </div>

        <span>{message}</span>
      </div>
    </div>
  );
}