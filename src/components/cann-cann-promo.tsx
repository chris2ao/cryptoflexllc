"use client";

import { TerminalPromo } from "@/components/promos/TerminalPromo";

const stats = [
  { label: "Weapons", value: "12" },
  { label: "Biomes", value: "7" },
  { label: "Multiplayer", value: "Online" },
];

const links = [
  { href: "https://cann-cann.vercel.app", label: "Play Now", primary: true },
];

export function CannCannPromo() {
  return (
    <TerminalPromo
      accentColor="amber"
      filename="cann-cann.exe"
      headerText="FIRE MISSION READY"
      subtitle="Aim. Fire. Adjust. Now online: send a friend the invite link."
      stats={stats}
      links={links}
    />
  );
}
