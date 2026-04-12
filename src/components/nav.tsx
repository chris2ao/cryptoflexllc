"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";

const links = [
  { href: "/blog", label: "Blog" },
  { href: "/skills", label: "Skills" },
  { href: "/about", label: "About" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/resources", label: "Resources" },
  { href: "/guestbook", label: "Guestbook" },
  { href: "/contact", label: "Contact" },
];

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-background/85 backdrop-blur-md transition-all duration-200 border-b-2 ${
        scrolled
          ? "border-primary/70 shadow-[0_1px_12px_rgba(71,186,204,0.12)]"
          : "border-primary/30"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center">
          <Image
            src="/CFLogo.png"
            alt="CryptoFlex LLC"
            width={200}
            height={60}
            className="h-10 w-auto"
            sizes="160px"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`font-heading px-3 py-2 text-sm rounded-md transition-colors duration-150 ${
                  isActive
                    ? "text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-primary/5"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <ThemeToggle />
        </nav>

        {/* Mobile hamburger */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64 bg-background/95 backdrop-blur-md">
            <SheetTitle className="mb-4">
              <div className="flex items-center justify-between">
                <Image
                  src="/CFLogo.png"
                  alt="CryptoFlex LLC"
                  width={180}
                  height={54}
                  className="h-9 w-auto"
                />
                <ThemeToggle />
              </div>
            </SheetTitle>
            <nav className="flex flex-col gap-1">
              {links.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    aria-current={isActive ? "page" : undefined}
                    className={`font-heading px-3 py-2 text-sm rounded-md transition-colors duration-150 ${
                      isActive
                        ? "text-primary font-medium bg-primary/10 border-l-2 border-primary pl-[10px]"
                        : "text-muted-foreground hover:text-foreground hover:bg-primary/5"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
