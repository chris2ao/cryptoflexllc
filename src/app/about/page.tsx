import type { Metadata } from "next";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "About",
  description:
    "Chris Johnson — combat veteran turned cybersecurity professional. Security engineering, SOC operations, cloud architecture, and AI-assisted development.",
  alternates: {
    canonical: "https://cryptoflexllc.com/about",
  },
  openGraph: {
    title: "About Chris Johnson",
    description:
      "Combat veteran turned cybersecurity professional. Security engineering, SOC operations, and AI-assisted development.",
    url: "https://cryptoflexllc.com/about",
    type: "profile",
  },
};

const skills = [
  "Security Engineering",
  "SOC Operations",
  "Cloud Architecture",
  "Network Infrastructure",
  "Incident Response",
  "Threat Detection",
  "SIEM/SOAR",
  "Python",
  "PowerShell",
  "Automation",
  "AI/ML Tooling",
  "Infrastructure Design",
];

const consulting = [
  "Infrastructure and architecture design",
  "Automation and workflow engineering",
  "Security assessments and practical hardening",
  "SOC process improvement and operational tuning",
  "IT strategy and modernization support",
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
          {/* Main content - shows second on mobile, first on desktop */}
          <div className="order-2 md:order-1 md:col-span-2 space-y-6 text-muted-foreground leading-relaxed">
            <p>
              I&apos;m Chris Johnson, an engineer who uses this blog as a
              playground to explore technology and share what I learn as I build.
            </p>

            <p>
              Most of what you&apos;ll see here is practical, hands-on
              experimentation: AI tools for development, automation, cloud
              projects, homelab builds, and whatever else I&apos;m curious about
              that week. Sometimes it&apos;s security-related. Often it&apos;s
              not. The common thread is simple: ship things, learn fast, write it
              down, and help other builders do the same.
            </p>

            {/* What I'm building */}
            <h2 className="text-xl font-bold text-foreground pt-4">
              What I&apos;m Building (and Writing About)
            </h2>

            <p>
              This site is where I document real work-in-progress, ideas and
              projects from concept to implementation:
            </p>

            <ul className="space-y-2 text-sm">
              <li className="flex gap-2">
                <span className="text-primary mt-1 shrink-0">&#9654;</span>
                <span>
                  Using AI copilots and agent workflows to design, code, debug,
                  and refactor faster
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary mt-1 shrink-0">&#9654;</span>
                <span>
                  Building small tools, scripts, and prototypes that solve real
                  problems
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary mt-1 shrink-0">&#9654;</span>
                <span>
                  Infrastructure experiments: cloud, networks, automation, and
                  reliability
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary mt-1 shrink-0">&#9654;</span>
                <span>
                  &ldquo;How I built it&rdquo; breakdowns, architecture notes,
                  and lessons learned
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary mt-1 shrink-0">&#9654;</span>
                <span>
                  Occasional deep dives into security when it overlaps with
                  engineering reality
                </span>
              </li>
            </ul>

            <p>
              If you like engineering that&apos;s pragmatic, iterative, and a
              little experimental, you&apos;ll feel at home here.
            </p>

            {/* The Journey */}
            <h2 className="text-xl font-bold text-foreground pt-4">
              The Journey
            </h2>

            <p>
              My career has taken a few sharp turns, but each one added a useful
              layer.
            </p>

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
                    Intelligence analyst and combat veteran who served in Iraq
                    and Afghanistan. Learned to evaluate complex information,
                    identify patterns, and think in terms of adversaries and
                    systems.
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
                    Chem/Bio Defense
                  </p>
                  <p className="text-sm">
                    Supported mission-critical operations at the Pentagon and US
                    Capitol, environments where reliability and discipline
                    aren&apos;t optional.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-3 w-3 rounded-full bg-primary" />
                  <div className="flex-1 w-px bg-border" />
                </div>
                <div className="pb-6">
                  <p className="font-medium text-foreground">IT Operations</p>
                  <p className="text-sm">
                    Ran through multiple layers of the stack: service desk,
                    project management, and developer work. Built the
                    broad technical foundation that everything else sits on.
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
                    Security Engineer &amp; Cloud Architect
                  </p>
                  <p className="text-sm">
                    Designed and implemented security controls, hardened systems,
                    and built cloud infrastructure, bridging defense with
                    modern architecture.
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
                    Where I am today, working across security engineering and
                    SOC operations, helping teams improve detection, response,
                    and operational resilience.
                  </p>
                </div>
              </div>
            </div>

            <p>
              At a certain point, I made the jump that changed everything: left
              contracting, moved to Florida, and went all-in on building a
              stronger technical foundation at FIU, earning my B.S. in
              Information Technology (Magna Cum Laude).
            </p>

            <p className="text-sm italic">
              Security is part of my career, but this blog is broader than
              that. Think of it as an engineering lab notebook that occasionally
              crosses into defense work when it&apos;s relevant.
            </p>

            {/* Consulting */}
            <h2 className="text-xl font-bold text-foreground pt-4">
              Consulting
            </h2>

            <p>
              I run CryptoFlex LLC, my Florida-registered IT consulting company.
              I take on select projects, especially where engineering meets
              outcomes:
            </p>

            <ul className="space-y-2 text-sm">
              {consulting.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-primary mt-1 shrink-0">&#9654;</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <p>
              If you&apos;re trying to build something real (and you want it to
              work reliably), I can help.
            </p>

            {/* Why I write */}
            <h2 className="text-xl font-bold text-foreground pt-4">
              Why I Write
            </h2>

            <p>Because the fastest way to learn is to build in public.</p>

            <p>
              This blog is my space to explore engineering with curiosity, use
              modern AI tools responsibly, and share the wins, failures, and
              patterns that actually hold up in the real world.
            </p>

            <p className="font-medium text-foreground">
              Welcome to the playground.
            </p>
          </div>

          {/* Sidebar - shows first on mobile, second on desktop */}
          <div className="order-1 md:order-2 space-y-8">
            <Image
              src="/CJOutside.jpeg"
              alt="Chris Johnson"
              width={400}
              height={400}
              className="aspect-square rounded-xl object-cover"
              priority
            />

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

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Education
              </h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <span className="font-medium text-foreground">
                    B.S. Information Technology
                  </span>
                  <br />
                  Florida International University
                  <br />
                  Magna Cum Laude
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
