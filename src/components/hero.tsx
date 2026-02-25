import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-10 md:gap-16">
          {/* Text content */}
          <div className="max-w-3xl flex-1">
            <p className="text-sm font-medium text-primary tracking-wide uppercase">
              CryptoFlex LLC
            </p>
            <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              Hi, I&apos;m{" "}
              <span className="text-primary">Chris Johnson</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground leading-relaxed">
              Veteran turned cybersecurity professional. I write about tech
              projects, security, infrastructure, and the things I&apos;m
              learning along the way.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link href="/blog">Read the Blog</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
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
              className="aspect-square w-56 sm:w-64 md:w-72 lg:w-80 rounded-2xl object-cover ring-1 ring-border shadow-xl"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
