import { Press_Start_2P, VT323 } from "next/font/google";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAnalyticsCookieName, verifyAuthToken } from "@/lib/analytics-auth";
import { SNESSidebar } from "./_components/snes-sidebar";
import "./_components/snes-theme.css";

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-snes-heading",
  display: "swap",
});

const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-snes-body",
  display: "swap",
});

const NAV_ITEMS = [
  { href: "/analytics/dashboard",           label: "WORLD MAP",  icon: "◆", shortcut: "W" },
  { href: "/analytics/dashboard/graph",     label: "KG GRAPH",   icon: "★", shortcut: "G" },
  { href: "/analytics/dashboard/memory",    label: "MEMORY",     icon: "♦", shortcut: "M" },
  { href: "/analytics/dashboard/instincts", label: "INSTINCTS",  icon: "♥", shortcut: "I" },
  { href: "/analytics/dashboard/hooks",     label: "HOOKS",      icon: "⊕", shortcut: "H" },
  { href: "/analytics/dashboard/metrics",   label: "METRICS",    icon: "▲", shortcut: "X" },
  { href: "/analytics/dashboard/search",    label: "SEARCH",     icon: "?", shortcut: "/" },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const authToken = cookieStore.get(getAnalyticsCookieName())?.value;
  if (!authToken || !verifyAuthToken(authToken)) {
    redirect("/analytics/login");
  }

  return (
    <div
      className={`snes-dashboard ${pressStart2P.variable} ${vt323.variable}`}
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      {/* Top bar */}
      <header
        aria-label="Dashboard header"
        style={{
          height: "48px",
          borderBottom: "2px solid var(--snes-border-outer)",
          display: "flex",
          alignItems: "center",
          padding: "0 var(--snes-space-4)",
          gap: "var(--snes-space-4)",
          position: "sticky",
          top: 0,
          zIndex: "var(--snes-z-sticky)",
          backgroundColor: "var(--snes-bg)",
        }}
      >
        <span
          style={{
            fontFamily: "var(--snes-font-heading)",
            fontSize: "var(--snes-text-h3)",
            color: "var(--snes-gold)",
            flexShrink: 0,
          }}
        >
          ▶ CLAUDE ENV
        </span>

        <div style={{ flex: 1 }} />

        <a
          href="/analytics/dashboard/search"
          aria-label="Search"
          style={{
            fontFamily: "var(--snes-font-heading)",
            fontSize: "var(--snes-text-xs)",
            color: "var(--snes-text-muted)",
            textDecoration: "none",
          }}
        >
          [?]
        </a>
      </header>

      {/* Body: sidebar + main */}
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        <SNESSidebar items={NAV_ITEMS} />
        <main
          id="main-content"
          style={{
            flex: 1,
            padding: "var(--snes-space-4)",
            overflowY: "auto",
            /* bottom padding for mobile bottom tab bar */
            paddingBottom: "calc(var(--snes-space-4) + env(safe-area-inset-bottom))",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
