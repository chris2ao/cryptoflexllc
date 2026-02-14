"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error.digest || error.message);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="text-center space-y-4 p-8">
        <h2 className="text-2xl font-bold text-white">Something went wrong</h2>
        <p className="text-gray-400">An unexpected error occurred. Please try again.</p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
