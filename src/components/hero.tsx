import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      {/* Cyber grid background - intentionally visible */}
      <div className="absolute inset-0 -z-10 bg-cyber-grid">
        {/* Teal radial glow at top-center - strong enough to see */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[1000px] rounded-full bg-primary/15 blur-3xl" />
        {/* Teal gradient sweep from top-left */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-primary/3 to-transparent" />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-10 md:gap-16">
          {/* Text content */}
          <div className="max-w-3xl flex-1">
            <p className="text-overline text-primary tracking-widest">
              CryptoFlex LLC
            </p>
            <h1 className="mt-4 text-display font-heading font-bold tracking-tight">
              Hi, I&apos;m{" "}
              <span className="text-primary">Chris Johnson</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl font-body text-muted-foreground leading-relaxed">
              Veteran turned cybersecurity professional. I write about tech
              projects, security, infrastructure, and the things I&apos;m
              learning along the way.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button
                asChild
                size="lg"
                className="transition-shadow duration-200 hover:shadow-[0_0_16px_rgba(71,186,204,0.25)]"
              >
                <Link href="/blog">Read the Blog</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="transition-colors duration-200 hover:border-primary/60 hover:text-primary"
              >
                <Link href="/about">About Me</Link>
              </Button>
            </div>
          </div>

          {/* Portrait */}
          <div className="shrink-0">
            <Image
              src="/hero-portrait.png"
              alt="Chris Johnson"
              width={320}
              height={320}
              className="hero-portrait-frame aspect-square w-56 sm:w-64 md:w-72 lg:w-80 object-cover"
              sizes="(max-width: 640px) 224px, (max-width: 768px) 256px, (max-width: 1024px) 288px, 320px"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
