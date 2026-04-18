import type { Metadata } from "next";
import { SkillsShowcase } from "@/components/skills-showcase";
import { EditorialPageHeader } from "@/components/editorial-page-header";
import { BASE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Skills & Tools Catalog",
  description:
    "Browse 127 Claude Code skills, agents, hooks, commands, configurations, and MCP servers. Each item includes linked integration steps and copy-paste install commands.",
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
        lede="127 production-ready Claude Code skills, agents, hooks, commands, and configurations. Click any item to see integration steps with download links and copy-paste install commands."
      />
      <section className="py-8 sm:py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SkillsShowcase />
        </div>
      </section>
    </>
  );
}
