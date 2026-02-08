import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "About",
  description:
    "Chris Johnson — military veteran, cybersecurity professional, and lifelong tinkerer.",
};

const skills = [
  "Cybersecurity",
  "Security Engineering",
  "Network Infrastructure",
  "Systems Administration",
  "Python",
  "PowerShell",
  "Linux",
  "Windows Server",
  "Cloud Security",
  "SIEM/SOAR",
  "Incident Response",
  "Threat Detection",
];

export default function AboutPage() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <h1 className="text-3xl sm:text-4xl font-bold">About Me</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Veteran. Engineer. Defender.
        </p>

        <Separator className="my-10" />

        <div className="grid gap-12 md:grid-cols-3">
          {/* Main content */}
          <div className="md:col-span-2 space-y-6 text-muted-foreground leading-relaxed">
            <p>
              My name is Chris Johnson. I&apos;m a military veteran who served
              as an intelligence analyst before transitioning into IT. That
              background — analyzing information, identifying patterns, thinking
              about adversaries — turned out to be surprisingly useful in
              cybersecurity.
            </p>

            <p>
              My IT career has been a journey through multiple disciplines. I
              started in software development, moved into systems
              administration, then found my way to security engineering. Today I
              work in cybersecurity defense operations, focused on protecting
              organizations from threats.
            </p>

            <p>
              CryptoFlex LLC is my Florida-registered IT consulting company. I
              originally set it up for speaking engagements and R&D tax
              purposes, but I also take on select consulting projects —
              particularly around security assessments, infrastructure design,
              and IT strategy.
            </p>

            <p>
              Outside of work, I&apos;m a tinkerer. I build things, break
              things, and write about the process. This site is where I share
              those experiments — whether it&apos;s setting up a crypto mining
              rig, configuring AI-powered development tools, or diving into a
              new technology.
            </p>

            <h2 className="text-xl font-bold text-foreground pt-4">
              The Journey
            </h2>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-3 w-3 rounded-full bg-primary" />
                  <div className="flex-1 w-px bg-border" />
                </div>
                <div className="pb-6">
                  <p className="font-medium text-foreground">
                    Military Service
                  </p>
                  <p className="text-sm">
                    Intelligence analyst — learned to think like an adversary,
                    analyze complex information, and work under pressure.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-3 w-3 rounded-full bg-primary" />
                  <div className="flex-1 w-px bg-border" />
                </div>
                <div className="pb-6">
                  <p className="font-medium text-foreground">
                    Software Development
                  </p>
                  <p className="text-sm">
                    Built applications, learned to code, and discovered the
                    intersection of software and systems.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-3 w-3 rounded-full bg-primary" />
                  <div className="flex-1 w-px bg-border" />
                </div>
                <div className="pb-6">
                  <p className="font-medium text-foreground">
                    Systems Administration
                  </p>
                  <p className="text-sm">
                    Managed infrastructure, networks, and servers — the backbone
                    that everything runs on.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-3 w-3 rounded-full bg-primary" />
                  <div className="flex-1 w-px bg-border" />
                </div>
                <div className="pb-6">
                  <p className="font-medium text-foreground">
                    Security Engineering
                  </p>
                  <p className="text-sm">
                    Designed and implemented security controls, hardened
                    systems, and built defensive infrastructure.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-3 w-3 rounded-full bg-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    Cybersecurity Defense Operations
                  </p>
                  <p className="text-sm">
                    Where I am today — protecting organizations by detecting and
                    responding to threats in real time.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Photo placeholder */}
            <div className="aspect-square rounded-xl bg-muted flex items-center justify-center">
              <span className="text-muted-foreground text-sm">
                Photo coming soon
              </span>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Skills & Expertise
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
