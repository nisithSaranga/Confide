"use client";
import { useEffect } from "react";

interface ToastProps {
  message: string;
  onClose: () => void;
}

export default function Toast({ message, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-green-100 text-emerald-800 text-sm font-medium px-6 py-3 rounded-full shadow-lg">
        {message}
      </div>
    </div>
  );
}