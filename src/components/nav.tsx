"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";

type NavLink = { href: string; label: string };

const links: NavLink[] = [
  { href: "/blog", label: "Journal" },
  { href: "/portfolio", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/#subscribe", label: "Subscribe" },
];

const mobileLinks: NavLink[] = [
  ...links,
  { href: "/skills", label: "Skills" },
  { href: "/resources", label: "Resources" },
  { href: "/guestbook", label: "Guestbook" },
  { href: "/contact", label: "Contact" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href.startsWith("/#")) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="masthead">
      <div className="masthead-inner">
        <Link href="/" className="masthead-brand" aria-label="CryptoFlex — home">
          <span className="masthead-brand-mark" aria-hidden="true">CF</span>
          <span>CryptoFlex</span>
          <span className="masthead-brand-kicker">// chris johnson</span>
        </Link>

        <nav className="masthead-nav" aria-label="Primary">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(pathname, link.href) ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="masthead-right">
          <span className="status-pill" aria-label="Currently shipping">
            <span className="status-dot" aria-hidden="true" />
            Shipping
          </span>
          <Link
            href="/#subscribe"
            className="btn-editorial btn-editorial--primary btn-editorial--sm hidden sm:inline-flex"
          >
            Subscribe
          </Link>
          <ThemeToggle />

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md text-fg-2 hover:text-fg"
              aria-label="Open menu"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-background/95 backdrop-blur-md">
              <SheetTitle className="mb-6">
                <div className="flex items-center gap-2 font-heading">
                  <span className="masthead-brand-mark">CF</span>
                  <span>CryptoFlex</span>
                </div>
              </SheetTitle>
              <nav className="flex flex-col gap-1" aria-label="Mobile">
                {mobileLinks.map((link) => {
                  const active = isActive(pathname, link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={`font-heading px-3 py-2 text-sm rounded-md transition-colors ${
                        active
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
      </div>
    </header>
  );
}
