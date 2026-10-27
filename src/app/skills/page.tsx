import type { Metadata } from "next";
import { SkillsShowcase } from "@/components/skills-showcase";
import { EditorialPageHeader } from "@/components/editorial-page-header";
import { Info } from "@/components/mdx/callouts";
import { BASE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Skills & Tools Catalog",
  description:
    "An archived snapshot of 127 Claude Code skills, agents, hooks, commands, configurations, and MCP servers, with the integration steps and install commands they shipped with.",
  alternates: {
    canonical: `${BASE_URL}/skills`,
  },
  openGraph: {
    title: "Skills & Tools Catalog",
    description:
      "A comprehensive catalog of Claude Code skills, agents, hooks, commands, and configurations built by CryptoFlex LLC.",
    url: `${BASE_URL}/skills`,
    type: "website",
    images: [
      {
        url: `${BASE_URL}/api/og?title=Skills+%26+Tools+Catalog&author=Chris+Johnson`,
        width: 1200,
        height: 630,
        alt: "Claude Code Skills & Tools Catalog",
      },
    ],
  },
};

export default function SkillsPage() {
  return (
    <>
      <EditorialPageHeader
        sectionLabel="§ 08 / Skills & Tools"
        overline="Catalog"
        title={<>Skills &amp; <em className="text-italic-serif" style={{ color: "var(--fg-2)" }}>tools.</em></>}
        lede="127 Claude Code skills, agents, hooks, commands, and configurations, kept as an archived snapshot. Click any item to see its integration steps, download links, and install commands."
      />
      <section className="py-8 sm:py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Info title="Archived snapshot">
            Most of these items come from my claude-code-config repo, which I archived on October 26, 2026. The repo stays public and read-only, so the downloads and install commands still work, but this catalog is no longer updated, my own setup has moved on, and some links point to files I removed before archiving.
          </Info>
          <SkillsShowcase />
        </div>
      </section>
    </>
  );
}
