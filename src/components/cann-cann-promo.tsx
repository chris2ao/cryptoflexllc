"use client";

import { TerminalPromo } from "@/components/promos/TerminalPromo";

const stats = [
  { label: "Weapons", value: "6" },
  { label: "Biomes", value: "4" },
  { label: "Game Modes", value: "3" },
];

const links = [
  { href: "https://cann-cann.vercel.app", label: "Play Now", primary: true },
  { href: "https://github.com/chris2ao/Cann-Cann", label: "View Source" },
];

export function CannCannPromo() {
  return (
    <TerminalPromo
      accentColor="amber"
      filename="cann-cann.exe"
      headerText="FIRE MISSION READY"
      subtitle="Aim. Fire. Adjust. The classic artillery duel."
      stats={stats}
      links={links}
    />
  );
}
