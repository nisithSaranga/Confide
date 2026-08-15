"use client";
import { useEffect } from "react";

interface ToastProps {
  message: string;
  onClose: () => void;
  bottomOffset?: string;
}

export default function Toast({ message, onClose, bottomOffset = "24px" }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed left-1/2 -translate-x-1/2 z-50" style={{ bottom: bottomOffset }}>
      <div className="bg-green-100 text-emerald-800 text-sm font-medium px-6 py-3 rounded-full shadow-lg">
        {message}
      </div>
    </div>
  );
}