"use client";

import { TerminalPromo } from "@/components/promos/TerminalPromo";

const stats = [
  { label: "Unit Types", value: "7" },
  { label: "Random Events", value: "8" },
  { label: "Difficulty Modes", value: "4" },
];

const links = [
  {
    href: "https://third-conflict.vercel.app/game/setup",
    label: "Play Now",
    primary: true,
  },
  {
    href: "https://github.com/chris2ao/Third-Conflict",
    label: "View Source",
  },
];

export function ThirdConflictPromo() {
  return (
    <TerminalPromo
      accentColor="green"
      filename="third-conflict.exe"
      headerText="INCOMING TRANSMISSION"
      subtitle="Build fleets. Wage war. Rule the galaxy."
      stats={stats}
      links={links}
    />
  );
}
