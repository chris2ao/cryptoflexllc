"use client";

import { useTypingAnimation } from "@/hooks/use-typing-animation";

interface Stat {
  label: string;
  value: string;
}

interface PromoLink {
  href: string;
  label: string;
  primary?: boolean;
}

interface TerminalPromoProps {
  /** Accent color key (Tailwind color name, e.g. "amber", "green") */
  accentColor: string;
  /** Filename shown in the terminal title bar, e.g. "cann-cann.exe" */
  filename: string;
  /** Text typed out in the terminal header */
  headerText: string;
  /** Subtitle shown below the typed header */
  subtitle: string;
  /** Stats chips */
  stats: Stat[];
  /** Action links */
  links: PromoLink[];
}

export function TerminalPromo({
  accentColor,
  filename,
  headerText,
  subtitle,
  stats,
  links,
}: TerminalPromoProps) {
  const typedHeader = useTypingAnimation(headerText);

  // Derive scanline RGBA from accent color name
  const scanlineColors: Record<string, string> = {
    amber: "rgba(255,165,0,0.03)",
    green: "rgba(0,255,0,0.03)",
    blue: "rgba(0,100,255,0.03)",
    red: "rgba(255,0,0,0.03)",
    cyan: "rgba(0,255,255,0.03)",
    purple: "rgba(128,0,255,0.03)",
  };
  const scanlineColor = scanlineColors[accentColor] ?? "rgba(255,255,255,0.03)";

  const ac = accentColor;

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-${ac}-500/30 bg-black/80 p-6 sm:p-8`}
    >
      {/* Scanline overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `repeating-linear-gradient(0deg, transparent, transparent 2px, ${scanlineColor} 2px, ${scanlineColor} 4px)`,
        }}
      />

      <div className="relative">
        {/* Terminal header bar */}
        <div className="flex items-center gap-2 mb-1">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
            <span className={`h-2.5 w-2.5 rounded-full bg-${ac}-500/70`} />
          </div>
          <span className={`text-xs text-${ac}-500/50 font-mono ml-2`}>
            {filename}
          </span>
        </div>

        <div className="mt-4 mb-6">
          <h2 className={`text-lg sm:text-xl font-mono font-bold text-${ac}-400 tracking-wider`}>
            {">"} {typedHeader}
            <span
              className={`inline-block w-2 h-5 bg-${ac}-400 ml-1 animate-pulse align-text-bottom`}
            />
          </h2>
          <p className={`mt-3 font-mono text-sm text-${ac}-300/70`}>
            {subtitle}
          </p>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-3 mb-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`rounded border border-${ac}-500/30 bg-${ac}-500/5 px-3 py-1.5 font-mono text-xs text-${ac}-400`}
            >
              <span className={`text-${ac}-300 font-bold`}>{stat.value}</span>{" "}
              {stat.label}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3">
          {links.map((link) =>
            link.primary ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center rounded-md bg-${ac}-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-${ac}-500`}
              >
                {link.label}
              </a>
            ) : (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center rounded-md border border-${ac}-500/40 px-4 py-2 text-sm font-medium text-${ac}-400 transition-colors hover:bg-${ac}-500/10`}
              >
                {link.label}
              </a>
            )
          )}
        </div>
      </div>
    </div>
  );
}
