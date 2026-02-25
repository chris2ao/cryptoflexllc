"use client";

import { useEffect, useState } from "react";

const HEADER_TEXT = "FIRE MISSION READY";

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
  { label: "Weapons", value: "6" },
  { label: "Biomes", value: "4" },
  { label: "Game Modes", value: "3" },
];

export function CannCannPromo() {
  const headerText = useTypingAnimation(HEADER_TEXT);

  return (
    <div className="relative overflow-hidden rounded-xl border border-amber-500/30 bg-black/80 p-6 sm:p-8">
          {/* Scanline overlay */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,165,0,0.03) 2px, rgba(255,165,0,0.03) 4px)",
            }}
          />

          <div className="relative">
            {/* Terminal header */}
            <div className="flex items-center gap-2 mb-1">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
              </div>
              <span className="text-xs text-amber-500/50 font-mono ml-2">
                cann-cann.exe
              </span>
            </div>

            <div className="mt-4 mb-6">
              <h2 className="text-lg sm:text-xl font-mono font-bold text-amber-400 tracking-wider">
                {">"} {headerText}
                <span className="inline-block w-2 h-5 bg-amber-400 ml-1 animate-pulse align-text-bottom" />
              </h2>
              <p className="mt-3 font-mono text-sm text-amber-300/70">
                Aim. Fire. Adjust. The classic artillery duel.
              </p>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-3 mb-6">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded border border-amber-500/30 bg-amber-500/5 px-3 py-1.5 font-mono text-xs text-amber-400"
                >
                  <span className="text-amber-300 font-bold">
                    {stat.value}
                  </span>{" "}
                  {stat.label}
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="https://cann-cann.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-md bg-amber-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-500"
              >
                Play Now
              </a>
              <a
                href="https://github.com/chris2ao/Cann-Cann"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-md border border-amber-500/40 px-4 py-2 text-sm font-medium text-amber-400 transition-colors hover:bg-amber-500/10"
              >
                View Source
              </a>
            </div>
          </div>
    </div>
  );
}
