"use client";

import { useEffect, useState } from "react";

const HEADER_TEXT = "INCOMING TRANSMISSION";

function useTypingAnimation(text: string, speed = 80) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return displayed;
}

const stats = [
  { label: "Unit Types", value: "7" },
  { label: "Random Events", value: "8" },
  { label: "Difficulty Modes", value: "4" },
];

export function ThirdConflictPromo() {
  const headerText = useTypingAnimation(HEADER_TEXT);

  return (
    <section className="py-16 sm:py-20 border-t border-border/40">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-xl border border-green-500/30 bg-black/80 p-6 sm:p-8">
          {/* Scanline overlay */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.03) 2px, rgba(0,255,0,0.03) 4px)",
            }}
          />

          <div className="relative">
            {/* Terminal header */}
            <div className="flex items-center gap-2 mb-1">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
              </div>
              <span className="text-xs text-green-500/50 font-mono ml-2">
                third-conflict.exe
              </span>
            </div>

            <div className="mt-4 mb-6">
              <h2 className="text-lg sm:text-xl font-mono font-bold text-green-400 tracking-wider">
                {">"} {headerText}
                <span className="inline-block w-2 h-5 bg-green-400 ml-1 animate-pulse align-text-bottom" />
              </h2>
              <p className="mt-3 font-mono text-sm text-green-300/70">
                Build fleets. Wage war. Rule the galaxy.
              </p>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-3 mb-6">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded border border-green-500/30 bg-green-500/5 px-3 py-1.5 font-mono text-xs text-green-400"
                >
                  <span className="text-green-300 font-bold">
                    {stat.value}
                  </span>{" "}
                  {stat.label}
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="https://second-conflict.vercel.app/game/setup"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-md bg-green-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-green-500"
              >
                Play Now
              </a>
              <a
                href="https://github.com/chris2ao/Third-Conflict"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-md border border-green-500/40 px-4 py-2 text-sm font-medium text-green-400 transition-colors hover:bg-green-500/10"
              >
                View Source
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
