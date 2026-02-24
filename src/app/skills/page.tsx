import type { Metadata } from "next";
import { SkillsShowcase } from "@/components/skills-showcase";

export const metadata: Metadata = {
  title: "Skills & Tools Catalog",
  description:
    "Browse CryptoFlex LLC's full catalog of Claude Code skills, agents, hooks, commands, configurations, and MCP servers. Each item includes integration steps and code snippets.",
  alternates: {
    canonical: "https://www.cryptoflexllc.com/skills",
  },
  openGraph: {
    title: "Skills & Tools Catalog",
    description:
      "A comprehensive catalog of Claude Code skills, agents, hooks, commands, and configurations built by CryptoFlex LLC.",
    url: "https://www.cryptoflexllc.com/skills",
  },
};

export default function SkillsPage() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold">
            Skills & Tools Catalog
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            A production-ready collection of Claude Code skills, agents, hooks,
            commands, and configurations — built through hands-on exploration,
            not theory. Click any item to see integration steps and code.
          </p>
        </div>

        <SkillsShowcase />
      </div>
    </section>
  );
}
