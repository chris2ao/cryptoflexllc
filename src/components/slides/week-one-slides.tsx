import type { SlideData } from "@/components/slide-carousel";

function SlideShell({
  children,
  page,
}: {
  children: React.ReactNode;
  page: number;
}) {
  return (
    <div className="slide">
      <div className="glow-top-right" />
      <div className="glow-bottom-left" />
      <div className="relative z-10 flex flex-col h-full">{children}</div>
      <div className="slide-footer">
        <span>
          Crypto<span className="brand-highlight">Flex</span> LLC
        </span>
        <span>Swipe</span>
        <span>{page} / 10</span>
      </div>
    </div>
  );
}

function Tags({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-1 mt-2">
      {items.map((t) => (
        <span key={t} className="timeline-tag">
          {t}
        </span>
      ))}
    </div>
  );
}

// Slide 1: Title
function TitleSlide() {
  return (
    <SlideShell page={1}>
      <div className="flex-1 flex flex-col justify-center">
        <p
          className="mono text-[clamp(0.5rem,1.5vw,0.7rem)] uppercase tracking-widest mb-[4%]"
          style={{ color: "var(--cyan)" }}
        >
          AI-Augmented Development
        </p>
        <h1
          className="heading-syne"
          style={{ fontSize: "clamp(1.4rem, 6vw, 3rem)" }}
        >
          <span style={{ color: "var(--cyan)" }}>7 Days.</span>
          <br />
          <span style={{ color: "var(--blue-bright)" }}>117 Commits.</span>
          <br />
          <span style={{ color: "var(--white)" }}>One Production</span>
          <br />
          <span style={{ color: "var(--white)" }}>Website.</span>
        </h1>
        <p
          className="mt-[4%]"
          style={{
            fontSize: "clamp(0.5rem, 1.6vw, 0.85rem)",
            color: "var(--text-dim)",
            lineHeight: 1.5,
          }}
        >
          From zero to production-grade with custom analytics, newsletters, 410
          tests, and a 4-agent security audit — all built with Claude Code.
        </p>
        <div
          className="mt-[6%] pt-[4%]"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <p
            className="mono"
            style={{
              fontSize: "clamp(0.5rem, 1.3vw, 0.7rem)",
              color: "var(--text-dim)",
            }}
          >
            Chris Johnson
          </p>
          <p
            className="mono"
            style={{
              fontSize: "clamp(0.45rem, 1.2vw, 0.6rem)",
              color: "var(--text-muted)",
            }}
          >
            CryptoFlex LLC &middot; Feb 7&ndash;14, 2026
          </p>
        </div>
      </div>
    </SlideShell>
  );
}

// Slide 2: Stats Grid
function StatsSlide() {
  const stats = [
    {
      value: "7",
      label: "Days",
      desc: "Feb 7 – Feb 14, 2026",
      color: "var(--cyan)",
    },
    {
      value: "117",
      label: "Git Commits",
      desc: "~16.7 per day average",
      color: "var(--blue-bright)",
    },
    {
      value: "410+",
      label: "Automated Tests",
      desc: "0→410 in a single day",
      color: "var(--green)",
    },
    {
      value: "98%",
      label: "Statement Coverage",
      desc: "Industry target: 80%",
      color: "var(--amber)",
    },
    {
      value: "24",
      label: "Pull Requests",
      desc: "17 blog posts published",
      color: "var(--purple)",
    },
    {
      value: "60",
      label: "Security Findings",
      desc: "4 AI agents in ~30 min",
      color: "var(--red)",
    },
  ];

  return (
    <SlideShell page={2}>
      <p
        className="mono text-[clamp(0.5rem,1.5vw,0.7rem)] uppercase tracking-widest mb-[2%]"
        style={{ color: "var(--cyan)" }}
      >
        By The Numbers
      </p>
      <h2
        className="heading-syne mb-[6%]"
        style={{ fontSize: "clamp(1rem, 4vw, 2rem)" }}
      >
        The Numbers
      </h2>
      <div className="stats-grid flex-1">
        {stats.map((s) => (
          <div key={s.label}>
            <div className="stat-number" style={{ color: s.color }}>
              {s.value}
            </div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-desc">{s.desc}</div>
          </div>
        ))}
      </div>
    </SlideShell>
  );
}

// Slide 3: Days 1-3
function Days1to3Slide() {
  return (
    <SlideShell page={3}>
      <p
        className="mono text-[clamp(0.5rem,1.5vw,0.7rem)] uppercase tracking-widest mb-[2%]"
        style={{ color: "var(--cyan)" }}
      >
        Timeline
      </p>
      <h2
        className="heading-syne mb-[4%]"
        style={{ fontSize: "clamp(0.9rem, 3.5vw, 1.6rem)" }}
      >
        From Zero to Live
      </h2>
      <div className="flex flex-col gap-[3%] flex-1">
        <div className="timeline-section">
          <p
            className="mono text-[clamp(0.45rem,1.2vw,0.6rem)]"
            style={{ color: "var(--cyan)" }}
          >
            Days 1&ndash;3 &middot; 7 commits
          </p>
          <p
            className="mt-1"
            style={{
              fontSize: "clamp(0.5rem, 1.4vw, 0.7rem)",
              color: "var(--text-dim)",
            }}
          >
            Friday night sprint. Scaffolded Next.js 16 + React 19, deployed to
            Vercel, published first blog post. Live on the internet in ~4 hours.
          </p>
          <Tags
            items={["Next.js", "TypeScript", "Tailwind v4", "Vercel", "MDX"]}
          />
        </div>
        <div className="timeline-section">
          <p
            className="mono text-[clamp(0.45rem,1.2vw,0.6rem)]"
            style={{ color: "var(--blue-bright)" }}
          >
            Analytics &amp; Paranoia &middot; 12 commits &middot; PRs #1&ndash;4
          </p>
          <p
            className="mt-1"
            style={{
              fontSize: "clamp(0.5rem, 1.4vw, 0.7rem)",
              color: "var(--text-dim)",
            }}
          >
            Built custom analytics dashboard, completely unauthenticated.
            Scrambled to add HMAC-SHA256 auth, rate limiting, input validation,
            and IP lookups.
          </p>
          <Tags items={["Neon Postgres", "HMAC-SHA256", "Rate Limiting"]} />
        </div>
        <div className="timeline-section">
          <p
            className="mono text-[clamp(0.45rem,1.2vw,0.6rem)]"
            style={{ color: "var(--green)" }}
          >
            Design System &middot; 22 commits &middot; PRs #5&ndash;7
          </p>
          <Tags
            items={[
              "Rules",
              "Routes",
              "MDX Components",
              "WAF Rules",
              "SVG Diagrams",
            ]}
          />
        </div>
      </div>
    </SlideShell>
  );
}

// Slide 4: Days 4-5
function Days4to5Slide() {
  return (
    <SlideShell page={4}>
      <p
        className="mono text-[clamp(0.5rem,1.5vw,0.7rem)] uppercase tracking-widest mb-[2%]"
        style={{ color: "var(--cyan)" }}
      >
        Timeline
      </p>
      <h2
        className="heading-syne mb-[4%]"
        style={{ fontSize: "clamp(0.9rem, 3.5vw, 1.6rem)" }}
      >
        Newsletter &amp; 10 PRs in One Day
      </h2>
      <div className="flex flex-col gap-[3%] flex-1">
        <div className="timeline-section">
          <p
            className="mono text-[clamp(0.45rem,1.2vw,0.6rem)]"
            style={{ color: "var(--amber)" }}
          >
            Days 4&ndash;5 &middot; 22 commits &middot; PRs #8&ndash;17
          </p>
          <Tags
            items={[
              "Email System",
              "Cron Jobs",
              "Double Opt-in",
              "SEO",
              "Em Dash Wars",
            ]}
          />
        </div>
        <div className="timeline-section">
          <p
            className="mono text-[clamp(0.45rem,1.2vw,0.6rem)]"
            style={{ color: "var(--red)" }}
          >
            The 5-PR Welcome Email &middot; 17 commits &middot; PRs
            #18&ndash;24
          </p>
          <p
            className="mt-1"
            style={{
              fontSize: "clamp(0.5rem, 1.4vw, 0.7rem)",
              color: "var(--text-dim)",
            }}
          >
            5 pull requests to send one email. WAF blocked POST, switched to
            GET, WAF blocked again, moved endpoint, WAF blocked again, fixed
            regex pattern. Also patched CVE-2024-56243 (XSS in
            next-mdx-remote).
          </p>
          <Tags items={["WAF Debugging", "CVE Patch", "GA4", "Comments"]} />
        </div>
        <div className="timeline-section">
          <p
            className="mono text-[clamp(0.45rem,1.2vw,0.6rem)] mb-2"
            style={{ color: "var(--text-dim)" }}
          >
            The 5-PR Timeline
          </p>
          <div className="flex flex-col gap-1">
            {[
              { pr: "#20", label: "Fix CVE", color: "var(--red)" },
              { pr: "#21", label: "Build Endpoint", color: "var(--amber)" },
              { pr: "#22", label: "POST→GET", color: "var(--amber)" },
              { pr: "#23", label: "WAF Blocks", color: "var(--red)" },
              { pr: "#24", label: "Fixed!", color: "var(--green)" },
            ].map((item) => (
              <div key={item.pr} className="flex items-center gap-2">
                <span
                  className="mono text-[clamp(0.4rem,1vw,0.55rem)]"
                  style={{ color: item.color }}
                >
                  PR {item.pr}
                </span>
                <div
                  className="h-px flex-1"
                  style={{ background: "var(--border)" }}
                />
                <span
                  className="text-[clamp(0.4rem,1vw,0.55rem)]"
                  style={{ color: "var(--text-dim)" }}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SlideShell>
  );
}

// Slide 5: Days 6-7
function Days6to7Slide() {
  return (
    <SlideShell page={5}>
      <p
        className="mono text-[clamp(0.5rem,1.5vw,0.7rem)] uppercase tracking-widest mb-[2%]"
        style={{ color: "var(--cyan)" }}
      >
        Timeline
      </p>
      <h2
        className="heading-syne mb-[4%]"
        style={{ fontSize: "clamp(0.9rem, 3.5vw, 1.6rem)" }}
      >
        The Reckoning: Testing &amp; Security
      </h2>
      <div className="flex flex-col gap-[3%] flex-1">
        <div className="timeline-section">
          <p
            className="mono text-[clamp(0.45rem,1.2vw,0.6rem)]"
            style={{ color: "var(--green)" }}
          >
            Days 6&ndash;7 &middot; 24 commits
          </p>
          <p
            className="mt-1"
            style={{
              fontSize: "clamp(0.5rem, 1.4vw, 0.7rem)",
              color: "var(--text-dim)",
            }}
          >
            Wrote 410+ tests in a single day. Ran a 4-agent security audit that
            found 60 issues in code that was &quot;working fine.&quot;
          </p>
          <Tags
            items={[
              "Vitest",
              "98% Coverage",
              "4-Agent Audit",
              "Anthropic SDK",
              "60 Findings",
            ]}
          />
        </div>
        <div className="timeline-section">
          <p
            className="mono text-[clamp(0.45rem,1.2vw,0.6rem)]"
            style={{ color: "var(--purple)" }}
          >
            Polish &amp; Ship &middot; 13 commits
          </p>
          <Tags
            items={[
              "RSS",
              "GA4 Events",
              "UTM Tracking",
              "Env Config",
              "SHIPPED",
            ]}
          />
        </div>
        <div className="timeline-section">
          <p
            className="mono text-[clamp(0.45rem,1.2vw,0.6rem)] mb-2"
            style={{ color: "var(--text-dim)" }}
          >
            Commits by Day
          </p>
          <div className="flex items-end gap-[4%] h-[60px]">
            {[
              { day: "F", pct: 6 },
              { day: "S", pct: 10 },
              { day: "S", pct: 19 },
              { day: "M", pct: 19 },
              { day: "T", pct: 15 },
              { day: "W", pct: 21 },
              { day: "T", pct: 11 },
            ].map((d, i) => (
              <div key={i} className="flex flex-col items-center flex-1">
                <div
                  className="w-full rounded-t"
                  style={{
                    height: `${d.pct * 3}px`,
                    background: `linear-gradient(to top, var(--cyan), var(--blue))`,
                    opacity: 0.8,
                  }}
                />
                <span
                  className="mono text-[clamp(0.35rem,0.9vw,0.5rem)] mt-1"
                  style={{ color: "var(--text-muted)" }}
                >
                  {d.day}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SlideShell>
  );
}

// Slide 6: Security Sprint
function SecuritySlide() {
  const agents = [
    {
      name: "Agent 01",
      label: "Input Validation",
      color: "var(--cyan)",
      findings: [
        "Unsanitized user input in query params",
        "Missing input length limits",
        "Unvalidated redirect URLs",
      ],
    },
    {
      name: "Agent 02",
      label: "Auth & Authorization",
      color: "var(--blue-bright)",
      findings: [
        "Unauthenticated API endpoints",
        "Missing CSRF protection",
        "Overly permissive CORS policy",
      ],
    },
    {
      name: "Agent 03",
      label: "Dependencies",
      color: "var(--green)",
      findings: [
        "CVE in next-mdx-remote v6.0.0",
        "Outdated packages with known issues",
        "Unpinned dependency versions",
      ],
    },
    {
      name: "Agent 04",
      label: "Info Disclosure",
      color: "var(--amber)",
      findings: [
        "DB queries leaked in error messages",
        "console.log in production code",
        "Verbose stack traces exposed",
      ],
    },
  ];

  return (
    <SlideShell page={6}>
      <p
        className="mono text-[clamp(0.5rem,1.5vw,0.7rem)] uppercase tracking-widest mb-[2%]"
        style={{ color: "var(--red)" }}
      >
        Security Audit
      </p>
      <h2
        className="heading-syne mb-[1%]"
        style={{ fontSize: "clamp(0.9rem, 3.5vw, 1.6rem)" }}
      >
        Security Findings
      </h2>
      <p
        className="mb-[4%]"
        style={{
          fontSize: "clamp(0.45rem, 1.3vw, 0.65rem)",
          color: "var(--text-dim)",
        }}
      >
        4 AI agents. 30 minutes. All in code that was &quot;working fine.&quot;
      </p>
      <div className="grid grid-cols-2 gap-[3%] flex-1">
        {agents.map((agent) => (
          <div key={agent.name} className="agent-card">
            <p
              className="mono text-[clamp(0.4rem,1vw,0.55rem)] mb-1"
              style={{ color: agent.color }}
            >
              {agent.name}: {agent.label}
            </p>
            {agent.findings.map((f) => (
              <p key={f} className="agent-finding">
                {f}
              </p>
            ))}
          </div>
        ))}
      </div>
      <div className="flex gap-[4%] mt-[3%]">
        {[
          { label: "Critical", cls: "severity-critical" },
          { label: "High", cls: "severity-high" },
          { label: "Medium", cls: "severity-medium" },
          { label: "Info", cls: "severity-info" },
        ].map((s) => (
          <span
            key={s.label}
            className={`mono text-[clamp(0.4rem,1vw,0.55rem)] ${s.cls}`}
          >
            ● {s.label}
          </span>
        ))}
      </div>
    </SlideShell>
  );
}

// Slide 7: WAF Saga
function WafSlide() {
  return (
    <SlideShell page={7}>
      <p
        className="mono text-[clamp(0.5rem,1.5vw,0.7rem)] uppercase tracking-widest mb-[2%]"
        style={{ color: "var(--amber)" }}
      >
        WAF Chronicles
      </p>
      <h2
        className="heading-syne mb-[1%]"
        style={{ fontSize: "clamp(0.9rem, 3.5vw, 1.6rem)" }}
      >
        Blocked YOU More Than Attackers
      </h2>
      <p
        className="mb-[4%] mono"
        style={{
          fontSize: "clamp(0.45rem, 1.3vw, 0.65rem)",
          color: "var(--text-dim)",
        }}
      >
        3 self-sabotage incidents &middot; 0 blocked attackers
      </p>
      <div className="flex flex-col gap-[3%] flex-1">
        <div className="timeline-section">
          <p
            className="mono text-[clamp(0.45rem,1.2vw,0.6rem)]"
            style={{ color: "var(--red)" }}
          >
            Day 3: Wrong Syntax Nukes the Site
          </p>
          <p
            className="mt-1"
            style={{
              fontSize: "clamp(0.5rem, 1.4vw, 0.7rem)",
              color: "var(--text-dim)",
            }}
          >
            Used &quot;rules&quot; instead of &quot;routes&quot; in
            vercel.json configuration. Result: SITE DOWN.
          </p>
        </div>
        <div className="timeline-section">
          <p
            className="mono text-[clamp(0.45rem,1.2vw,0.6rem)]"
            style={{ color: "var(--amber)" }}
          >
            Day 4: Newsletter API Blocked
          </p>
          <p
            className="mt-1"
            style={{
              fontSize: "clamp(0.5rem, 1.4vw, 0.7rem)",
              color: "var(--text-dim)",
            }}
          >
            Subscribe, confirm, and unsubscribe endpoints weren&apos;t
            whitelisted. Took 2 PRs to fix.
          </p>
        </div>
        <div className="timeline-section">
          <p
            className="mono text-[clamp(0.45rem,1.2vw,0.6rem)]"
            style={{ color: "var(--red)" }}
          >
            Day 5: The 5-PR Email
          </p>
          <p
            className="mt-1"
            style={{
              fontSize: "clamp(0.5rem, 1.4vw, 0.7rem)",
              color: "var(--text-dim)",
            }}
          >
            Welcome email endpoint blocked five times. POST→GET→path
            move→regex fix. The email finally sent on the 5th PR.
          </p>
        </div>
        <div
          className="p-[3%] rounded-lg"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--amber-dim)",
          }}
        >
          <p
            style={{
              fontSize: "clamp(0.5rem, 1.4vw, 0.7rem)",
              color: "var(--amber)",
              fontStyle: "italic",
            }}
          >
            &quot;It&apos;s easy to block everything. It&apos;s hard to block
            just the bad stuff while allowing legitimate traffic through.&quot;
          </p>
        </div>
      </div>
    </SlideShell>
  );
}

// Slide 8: Architecture
function ArchitectureSlide() {
  const categories = [
    {
      title: "MVP",
      color: "var(--cyan)",
      items: ["Next.js 16", "Vercel", "MDX Blog", "TypeScript", "Tailwind v4"],
    },
    {
      title: "Features",
      color: "var(--blue-bright)",
      items: [
        "Neon Postgres",
        "Analytics API",
        "Newsletter",
        "WAF Rules",
        "Auth (HMAC)",
        "Rate Limiting",
      ],
    },
    {
      title: "Hardened",
      color: "var(--green)",
      items: [
        "410 Tests",
        "Security Audit",
        "AI Intros",
        "Comments",
        "GA4",
        "CVE Patch",
      ],
    },
    {
      title: "Ship",
      color: "var(--amber)",
      items: [
        "RSS Feeds",
        "UTM Tracking",
        "Code Copy UX",
        "Env Config",
        "Production ✓",
      ],
    },
  ];

  const stack = [
    "Vercel: Host · Edge · CI/CD",
    "Next.js 16 + React 19",
    "Neon: Serverless DB",
    "Claude Code: AI Dev",
    "MDX: Content",
    "Tailwind: Styling",
    "Vitest: Testing",
    "GitHub: VCS · CI",
  ];

  return (
    <SlideShell page={8}>
      <p
        className="mono text-[clamp(0.5rem,1.5vw,0.7rem)] uppercase tracking-widest mb-[2%]"
        style={{ color: "var(--cyan)" }}
      >
        Tech Stack
      </p>
      <h2
        className="heading-syne mb-[4%]"
        style={{ fontSize: "clamp(0.9rem, 3.5vw, 1.6rem)" }}
      >
        Architecture
      </h2>
      <div className="grid grid-cols-2 gap-[3%] mb-[4%]">
        {categories.map((cat) => (
          <div key={cat.title} className="arch-category">
            <p
              className="mono text-[clamp(0.4rem,1vw,0.55rem)] mb-2"
              style={{ color: cat.color }}
            >
              {cat.title}
            </p>
            <div className="flex flex-wrap gap-1">
              {cat.items.map((item) => (
                <span key={item} className="arch-tag">
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div
        className="rounded-lg p-[3%]"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
        }}
      >
        <p
          className="mono text-[clamp(0.4rem,1vw,0.55rem)] mb-2"
          style={{ color: "var(--cyan)" }}
        >
          Full Stack — All Free Tier
        </p>
        <div className="grid grid-cols-2 gap-1">
          {stack.map((s) => (
            <span
              key={s}
              className="text-[clamp(0.4rem,1vw,0.55rem)]"
              style={{ color: "var(--text-dim)" }}
            >
              {s}
            </span>
          ))}
        </div>
        <p
          className="heading-syne mt-2 text-center"
          style={{
            fontSize: "clamp(0.7rem, 2.5vw, 1.2rem)",
            color: "var(--green)",
          }}
        >
          Total Monthly Cost: $0/mo
        </p>
      </div>
    </SlideShell>
  );
}

// Slide 9: Takeaways
function TakeawaysSlide() {
  const takeaways = [
    {
      title: "Free Infra Is Insanely Capable",
      desc: "Production site with DB, analytics, newsletters, and CI/CD. All on free tiers. What cost $20+/mo a decade ago is now $0.",
    },
    {
      title: "Your WAF Will Block YOU First",
      desc: "3 self-sabotage incidents, 0 blocked attackers. Finding the balance takes many failed deploys.",
    },
    {
      title: "Write Tests Before You Need Them",
      desc: "0→410 tests in one day. Immediately caught a race condition, bad user-agent handling, and template edge cases.",
    },
    {
      title: "AI Doesn't Replace Vision",
      desc: "Claude Code asked a dozen clarifying product questions. AI implements brilliantly, but you need to know what to build first.",
    },
    {
      title: "Devs Now Move Faster Than Security",
      desc: "AI-assisted shipping velocity is unprecedented. Guardrails need to be in place before the velocity kicks in.",
    },
    {
      title: "Sleep Is the Best Debugger",
      desc: "Multiple hour-long bugs solved in 5 minutes the next morning. Your brain does critical work while you rest.",
    },
  ];

  return (
    <SlideShell page={9}>
      <p
        className="mono text-[clamp(0.5rem,1.5vw,0.7rem)] uppercase tracking-widest mb-[2%]"
        style={{ color: "var(--cyan)" }}
      >
        Lessons Learned
      </p>
      <h2
        className="heading-syne mb-[4%]"
        style={{ fontSize: "clamp(0.9rem, 3.5vw, 1.6rem)" }}
      >
        6 Key Takeaways
      </h2>
      <div className="grid grid-cols-2 gap-[3%] flex-1">
        {takeaways.map((t, i) => (
          <div key={t.title} className="takeaway-card">
            <span className="takeaway-number">0{i + 1}</span>
            <p
              className="font-semibold mt-1"
              style={{
                fontSize: "clamp(0.5rem, 1.4vw, 0.7rem)",
                color: "var(--white)",
              }}
            >
              {t.title}
            </p>
            <p
              className="mt-1"
              style={{
                fontSize: "clamp(0.4rem, 1.1vw, 0.55rem)",
                color: "var(--text-dim)",
                lineHeight: 1.4,
              }}
            >
              {t.desc}
            </p>
          </div>
        ))}
      </div>
    </SlideShell>
  );
}

// Slide 10: CTA
function CtaSlide() {
  return (
    <SlideShell page={10}>
      <div className="flex-1 flex flex-col justify-center">
        <div className="cta-quote mb-[6%]">
          <p>
            &quot;If you&apos;re adopting AI-assisted development in your
            enterprise, your guardrails, alerting, and security automation need
            to be in place before the velocity kicks in, not after.&quot;
          </p>
        </div>
        <p
          className="mb-[4%]"
          style={{
            fontSize: "clamp(0.5rem, 1.5vw, 0.8rem)",
            color: "var(--text-dim)",
            lineHeight: 1.5,
          }}
        >
          The capability is real. The productivity gains are real. But so are the
          risks. Read the full story: every triumph, face-palm, and WAF
          incident.
        </p>
        <p className="cta-url mb-[6%]">cryptoflexllc.com</p>
        <div
          className="pt-[4%]"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <p
            className="mono"
            style={{
              fontSize: "clamp(0.5rem, 1.3vw, 0.7rem)",
              color: "var(--text-dim)",
            }}
          >
            Chris Johnson
          </p>
          <p
            className="mono"
            style={{
              fontSize: "clamp(0.45rem, 1.2vw, 0.6rem)",
              color: "var(--text-muted)",
            }}
          >
            CryptoFlex LLC
          </p>
          <p
            className="mt-2"
            style={{
              fontSize: "clamp(0.45rem, 1.2vw, 0.6rem)",
              color: "var(--text-muted)",
            }}
          >
            Open to feedback · Happy to share what I&apos;ve learned · Always
            down to help
          </p>
        </div>
      </div>
    </SlideShell>
  );
}

export const weekOneSlides: SlideData[] = [
  { id: "title", content: <TitleSlide /> },
  { id: "stats", content: <StatsSlide /> },
  { id: "days-1-3", content: <Days1to3Slide /> },
  { id: "days-4-5", content: <Days4to5Slide /> },
  { id: "days-6-7", content: <Days6to7Slide /> },
  { id: "security", content: <SecuritySlide /> },
  { id: "waf-saga", content: <WafSlide /> },
  { id: "architecture", content: <ArchitectureSlide /> },
  { id: "takeaways", content: <TakeawaysSlide /> },
  { id: "cta", content: <CtaSlide /> },
];
