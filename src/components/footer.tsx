import Image from "next/image";
import Link from "next/link";
import { Github, Linkedin, Rss } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border/40 bg-background">
      {/* Subtle cyber grid backdrop */}
      <div className="absolute inset-0 -z-10 bg-cyber-grid opacity-40" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {/* Brand */}
          <div>
            <Image
              src="/CFLogo.png"
              alt="CryptoFlex LLC"
              width={200}
              height={60}
              className="h-12 w-auto"
            />
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Tech blog and engineering portfolio based in Florida.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-heading text-xs font-semibold uppercase tracking-widest text-primary/80">
              Navigation
            </h4>
            <nav className="mt-3 flex flex-col gap-2">
              {[
                { href: "/blog", label: "Blog" },
                { href: "/skills", label: "Skills" },
                { href: "/about", label: "About" },
                { href: "/portfolio", label: "Portfolio" },
                { href: "/resources", label: "Resources" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors duration-150 hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-heading text-xs font-semibold uppercase tracking-widest text-primary/80">
              Connect
            </h4>
            <nav className="mt-3 flex flex-col gap-2">
              <a
                href="https://www.linkedin.com/in/chris-johnson-secops/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors duration-150 hover:text-primary"
              >
                <Linkedin className="h-4 w-4 shrink-0" />
                LinkedIn
              </a>
              <a
                href="https://github.com/chris2ao"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors duration-150 hover:text-primary"
              >
                <Github className="h-4 w-4 shrink-0" />
                GitHub
              </a>
              <a
                href="/feed.xml"
                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors duration-150 hover:text-primary"
              >
                <Rss className="h-4 w-4 shrink-0" />
                RSS Feed
              </a>
            </nav>
          </div>
        </div>

        <Separator className="my-8 bg-border/60" />

        <p className="text-center font-heading text-xs text-muted-foreground tracking-wide">
          &copy; {new Date().getFullYear()} CryptoFlex LLC. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
