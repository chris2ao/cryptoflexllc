import type { Metadata } from "next";
import { ProjectCard } from "@/components/project-card";
import { BASE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Projects and engineering work by Chris Johnson — cryptocurrency mining infrastructure, custom analytics dashboards, AI-assisted web development, and security tooling.",
  alternates: {
    canonical: `${BASE_URL}/portfolio`,
  },
  openGraph: {
    title: "Portfolio — Chris Johnson",
    description:
      "Engineering projects spanning infrastructure, security, and AI-assisted development.",
    url: `${BASE_URL}/portfolio`,
  },
};

const projects = [
  {
    title: "Cryptocurrency Mining Infrastructure",
    description:
      "Designed and built a multi-GPU mining operation from scratch — hardware selection, thermal management, power distribution, and monitoring. Learned a ton about Linux system administration and hardware optimization in the process.",
    tech: ["Linux", "Hardware", "Networking", "Monitoring"],
  },
  {
    title: "Claude Code Configuration & Automation",
    description:
      "Built a comprehensive configuration system for Anthropic's Claude Code CLI tool, including session logging hooks, automated activity tracking, and a plugin system. Documented the entire learning journey.",
    tech: ["TypeScript", "PowerShell", "Claude Code", "Git"],
  },
  {
    title: "IT Consulting Engagements",
    description:
      "Various IT consulting projects through CryptoFlex LLC — network infrastructure design, security assessments, and technology strategy for small and medium businesses.",
    tech: ["Networking", "Security", "Cloud", "Strategy"],
  },
];

export default function PortfolioPage() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold">Portfolio</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Projects I&apos;ve built, configured, and tinkered with.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
