"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export interface NavItem {
  href: string;
  label: string;
  icon: string;
  shortcut?: string;
}

interface SNESSidebarProps {
  items: NavItem[];
}

// Mobile tab bar shows only the 5 most important items
const MOBILE_ITEMS = ["WORLD MAP", "KG GRAPH", "MEMORY", "INSTINCTS", "SEARCH"];

export function SNESSidebar({ items }: SNESSidebarProps) {
  const pathname = usePathname();

  function isActive(href: string): boolean {
    if (href === "/analytics/dashboard") {
      return pathname === "/analytics/dashboard";
    }
    return pathname.startsWith(href);
  }

  return (
    <nav
      className="snes-sidebar"
      aria-label="Dashboard navigation"
    >
      {/* Desktop + tablet nav */}
      <ul
        className="snes-sidebar__nav"
        role="list"
        style={{ listStyle: "none", margin: 0, padding: 0 }}
      >
        {items.map((item) => {
          const active = isActive(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                prefetch={true}
                className={`snes-sidebar__item ${active ? "snes-sidebar__item--active" : ""}`}
                aria-current={active ? "page" : undefined}
              >
                <span className="snes-sidebar__icon" aria-hidden="true">
                  {active ? "▶" : item.icon}
                </span>
                <span className="snes-sidebar__label">
                  {active ? `${item.label}` : item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Footer: QUIT */}
      <div className="snes-sidebar__footer">
        <Link
          href="/analytics"
          className="snes-sidebar__item"
          style={{ padding: "var(--snes-space-2) 0" }}
        >
          <span className="snes-sidebar__icon" aria-hidden="true">✕</span>
          <span className="snes-sidebar__label">QUIT</span>
        </Link>
      </div>

      {/* Mobile bottom tab bar (CSS media query handles positioning) */}
      <style>{`
        @media (max-width: 639px) {
          .snes-sidebar .snes-sidebar__nav {
            display: none;
          }
          .snes-sidebar .snes-sidebar__footer {
            display: none;
          }
        }
      `}</style>
    </nav>
  );
}

export function SNESSidebarMobileTabs({ items }: SNESSidebarProps) {
  const pathname = usePathname();

  function isActive(href: string): boolean {
    if (href === "/analytics/dashboard") {
      return pathname === "/analytics/dashboard";
    }
    return pathname.startsWith(href);
  }

  const mobileItems = items.filter((item) =>
    MOBILE_ITEMS.includes(item.label)
  );

  return (
    <nav
      aria-label="Mobile tab navigation"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        display: "none",
        backgroundColor: "var(--snes-surface)",
        borderTop: "2px solid var(--snes-border-outer)",
        zIndex: "var(--snes-z-sticky)",
        paddingBottom: "calc(var(--snes-space-2) + env(safe-area-inset-bottom))",
      }}
    >
      <ul
        role="list"
        style={{
          display: "flex",
          margin: 0,
          padding: 0,
          listStyle: "none",
        }}
      >
        {mobileItems.map((item) => {
          const active = isActive(item.href);
          return (
            <li key={item.href} style={{ flex: 1 }}>
              <Link
                href={item.href}
                prefetch={true}
                aria-current={active ? "page" : undefined}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "2px",
                  padding: "var(--snes-space-2) var(--snes-space-1)",
                  fontFamily: "var(--snes-font-heading)",
                  fontSize: "6px",
                  color: active ? "var(--snes-gold)" : "var(--snes-text-muted)",
                  textDecoration: "none",
                  backgroundColor: active ? "var(--snes-surface-active)" : "transparent",
                }}
              >
                <span aria-hidden="true" style={{ fontSize: "16px" }}>
                  {item.icon}
                </span>
                <span>{item.label.split(" ")[0]}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
