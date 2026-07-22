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

/**
 * Static per-accent class maps. Tailwind only generates utilities it can
 * see as complete strings in source, so interpolated names like
 * `bg-${color}-600` are silently purged from the build. Add a new entry
 * here to support a new accent color.
 */
const ACCENTS = {
  amber: {
    cardBorder: "border-amber-500/30",
    dot: "bg-amber-500/70",
    filename: "text-amber-500/50",
    header: "text-amber-400",
    cursor: "bg-amber-400",
    subtitle: "text-amber-300/70",
    statChip: "border-amber-500/30 bg-amber-500/5 text-amber-400",
    statValue: "text-amber-300",
    primaryLink: "bg-amber-600 hover:bg-amber-500",
    secondaryLink: "border-amber-500/40 text-amber-400 hover:bg-amber-500/10",
    scanline: "rgba(255,165,0,0.03)",
  },
  green: {
    cardBorder: "border-green-500/30",
    dot: "bg-green-500/70",
    filename: "text-green-500/50",
    header: "text-green-400",
    cursor: "bg-green-400",
    subtitle: "text-green-300/70",
    statChip: "border-green-500/30 bg-green-500/5 text-green-400",
    statValue: "text-green-300",
    primaryLink: "bg-green-600 hover:bg-green-500",
    secondaryLink: "border-green-500/40 text-green-400 hover:bg-green-500/10",
    scanline: "rgba(0,255,0,0.03)",
  },
} as const;

export type TerminalPromoAccent = keyof typeof ACCENTS;

interface TerminalPromoProps {
  /** Accent color key, e.g. "amber", "green" */
  accentColor: TerminalPromoAccent;
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
  const accent = ACCENTS[accentColor];

  return (
    <div
      className={`relative overflow-hidden rounded-xl border ${accent.cardBorder} bg-black/80 p-6 sm:p-8`}
    >
      {/* Scanline overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `repeating-linear-gradient(0deg, transparent, transparent 2px, ${accent.scanline} 2px, ${accent.scanline} 4px)`,
        }}
      />

      <div className="relative">
        {/* Terminal header bar */}
        <div className="flex items-center gap-2 mb-1">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
            <span className={`h-2.5 w-2.5 rounded-full ${accent.dot}`} />
          </div>
          <span className={`text-xs ${accent.filename} font-mono ml-2`}>
            {filename}
          </span>
        </div>

        <div className="mt-4 mb-6">
          <h2 className={`text-lg sm:text-xl font-mono font-bold ${accent.header} tracking-wider`}>
            {">"} {typedHeader}
            <span
              className={`inline-block w-2 h-5 ${accent.cursor} ml-1 animate-pulse align-text-bottom`}
            />
          </h2>
          <p className={`mt-3 font-mono text-sm ${accent.subtitle}`}>
            {subtitle}
          </p>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-3 mb-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`rounded border ${accent.statChip} px-3 py-1.5 font-mono text-xs`}
            >
              <span className={`${accent.statValue} font-bold`}>{stat.value}</span>{" "}
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
                className={`inline-flex items-center rounded-md ${accent.primaryLink} px-5 py-2 text-sm font-medium text-white transition-colors`}
              >
                {link.label}
              </a>
            ) : (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center rounded-md border ${accent.secondaryLink} px-4 py-2 text-sm font-medium transition-colors`}
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
