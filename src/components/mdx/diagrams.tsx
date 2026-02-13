/** Architecture diagrams for blog posts — SVG-based, themed to site colors */

interface DiagramProps {
  caption?: string;
}

function DiagramWrapper({
  caption,
  children,
}: DiagramProps & { children: React.ReactNode }) {
  return (
    <figure className="not-prose my-8">
      <div className="rounded-lg border border-border/60 bg-card/50 p-6 overflow-x-auto">
        {children}
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-xs text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/** Shows the double-hop problem with Cloudflare proxy in front of Vercel */
export function CloudflareDoubleHop({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "Cloudflare proxy mode adds a second edge hop, increasing latency and creating SSL/cache conflicts"
      }
    >
      <svg
        viewBox="0 0 800 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-2xl mx-auto"
      >
        {/* Browser */}
        <rect x="10" y="60" width="120" height="80" rx="8" className="stroke-foreground/60" strokeWidth="1.5" />
        <text x="70" y="95" textAnchor="middle" className="fill-foreground text-[13px] font-medium">Browser</text>
        <text x="70" y="115" textAnchor="middle" className="fill-muted-foreground text-[10px]">HTTPS request</text>

        {/* Arrow 1 */}
        <line x1="130" y1="100" x2="225" y2="100" className="stroke-amber-500" strokeWidth="2" markerEnd="url(#arrowAmber)" />
        <text x="177" y="90" textAnchor="middle" className="fill-amber-500 text-[9px]">TLS 1</text>

        {/* Cloudflare Edge */}
        <rect x="225" y="45" width="140" height="110" rx="8" className="stroke-amber-500" strokeWidth="1.5" strokeDasharray="4 3" />
        <text x="295" y="75" textAnchor="middle" className="fill-amber-500 text-[12px] font-semibold">Cloudflare</text>
        <text x="295" y="95" textAnchor="middle" className="fill-muted-foreground text-[10px]">Edge Network</text>
        <text x="295" y="110" textAnchor="middle" className="fill-muted-foreground text-[10px]">TLS terminate</text>
        <text x="295" y="125" textAnchor="middle" className="fill-muted-foreground text-[10px]">WAF rules</text>
        <text x="295" y="140" textAnchor="middle" className="fill-muted-foreground text-[10px]">Re-encrypt</text>

        {/* Arrow 2 */}
        <line x1="365" y1="100" x2="460" y2="100" className="stroke-red-500" strokeWidth="2" markerEnd="url(#arrowRed)" />
        <text x="412" y="90" textAnchor="middle" className="fill-red-500 text-[9px] font-medium">TLS 2</text>
        <text x="412" y="78" textAnchor="middle" className="fill-red-500/70 text-[8px]">extra hop</text>

        {/* Vercel Edge */}
        <rect x="460" y="45" width="140" height="110" rx="8" className="stroke-foreground/40" strokeWidth="1.5" />
        <text x="530" y="75" textAnchor="middle" className="fill-foreground text-[12px] font-semibold">Vercel</text>
        <text x="530" y="95" textAnchor="middle" className="fill-muted-foreground text-[10px]">Edge Network</text>
        <text x="530" y="110" textAnchor="middle" className="fill-muted-foreground text-[10px]">TLS terminate</text>
        <text x="530" y="125" textAnchor="middle" className="fill-muted-foreground text-[10px]">(again)</text>
        <text x="530" y="140" textAnchor="middle" className="fill-muted-foreground text-[10px]">Serve response</text>

        {/* Arrow 3 */}
        <line x1="600" y1="100" x2="690" y2="100" className="stroke-foreground/40" strokeWidth="2" markerEnd="url(#arrowGray)" />

        {/* Origin */}
        <rect x="690" y="65" width="100" height="70" rx="8" className="stroke-foreground/40" strokeWidth="1.5" />
        <text x="740" y="96" textAnchor="middle" className="fill-foreground text-[12px] font-medium">Origin</text>
        <text x="740" y="114" textAnchor="middle" className="fill-muted-foreground text-[10px]">Next.js App</text>

        {/* Warning badge */}
        <rect x="280" y="168" width="240" height="24" rx="4" className="fill-red-500/15" />
        <text x="400" y="185" textAnchor="middle" className="fill-red-500 text-[10px] font-medium">SSL conflicts + cache issues + added latency</text>

        {/* Arrow markers */}
        <defs>
          <marker id="arrowAmber" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="8" markerHeight="6" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" className="fill-amber-500" />
          </marker>
          <marker id="arrowRed" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="8" markerHeight="6" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" className="fill-red-500" />
          </marker>
          <marker id="arrowGray" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="8" markerHeight="6" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" className="fill-foreground/40" />
          </marker>
        </defs>
      </svg>
    </DiagramWrapper>
  );
}

/** Shows the clean single-hop flow with Vercel native WAF */
export function VercelNativeWAF({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "Vercel's native WAF runs at the edge — single TLS termination, zero extra hops"
      }
    >
      <svg
        viewBox="0 0 700 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-xl mx-auto"
      >
        {/* Browser */}
        <rect x="10" y="60" width="120" height="80" rx="8" className="stroke-foreground/60" strokeWidth="1.5" />
        <text x="70" y="95" textAnchor="middle" className="fill-foreground text-[13px] font-medium">Browser</text>
        <text x="70" y="115" textAnchor="middle" className="fill-muted-foreground text-[10px]">HTTPS request</text>

        {/* Arrow 1 */}
        <line x1="130" y1="100" x2="230" y2="100" className="stroke-emerald-500" strokeWidth="2" markerEnd="url(#arrowGreen)" />
        <text x="180" y="90" textAnchor="middle" className="fill-emerald-500 text-[9px]">TLS</text>

        {/* Vercel Edge with WAF */}
        <rect x="230" y="30" width="260" height="150" rx="8" className="stroke-primary" strokeWidth="2" />
        <text x="360" y="58" textAnchor="middle" className="fill-primary text-[13px] font-semibold">Vercel Edge Network</text>

        {/* WAF sub-box */}
        <rect x="250" y="70" width="100" height="90" rx="6" className="stroke-emerald-500/60" strokeWidth="1" fill="none" />
        <text x="300" y="92" textAnchor="middle" className="fill-emerald-500 text-[10px] font-semibold">WAF</text>
        <text x="300" y="108" textAnchor="middle" className="fill-muted-foreground text-[9px]">DDoS filter</text>
        <text x="300" y="121" textAnchor="middle" className="fill-muted-foreground text-[9px]">Custom rules</text>
        <text x="300" y="134" textAnchor="middle" className="fill-muted-foreground text-[9px]">Bot detection</text>
        <text x="300" y="147" textAnchor="middle" className="fill-muted-foreground text-[9px]">Challenge</text>

        {/* Arrow WAF to SSR */}
        <line x1="350" y1="115" x2="370" y2="115" className="stroke-foreground/30" strokeWidth="1.5" markerEnd="url(#arrowSmall)" />

        {/* SSR/Static sub-box */}
        <rect x="370" y="70" width="100" height="90" rx="6" className="stroke-foreground/30" strokeWidth="1" fill="none" />
        <text x="420" y="92" textAnchor="middle" className="fill-foreground text-[10px] font-semibold">Serve</text>
        <text x="420" y="108" textAnchor="middle" className="fill-muted-foreground text-[9px]">TLS terminate</text>
        <text x="420" y="121" textAnchor="middle" className="fill-muted-foreground text-[9px]">Edge cache</text>
        <text x="420" y="134" textAnchor="middle" className="fill-muted-foreground text-[9px]">SSR / Static</text>
        <text x="420" y="147" textAnchor="middle" className="fill-muted-foreground text-[9px]">Compress</text>

        {/* Arrow to origin */}
        <line x1="490" y1="100" x2="570" y2="100" className="stroke-foreground/40" strokeWidth="2" markerEnd="url(#arrowGray2)" />

        {/* Origin */}
        <rect x="570" y="65" width="110" height="70" rx="8" className="stroke-foreground/40" strokeWidth="1.5" />
        <text x="625" y="96" textAnchor="middle" className="fill-foreground text-[12px] font-medium">Origin</text>
        <text x="625" y="114" textAnchor="middle" className="fill-muted-foreground text-[10px]">Next.js App</text>

        {/* Success badge */}
        <rect x="270" y="185" width="180" height="22" rx="4" className="fill-emerald-500/15" />
        <text x="360" y="200" textAnchor="middle" className="fill-emerald-500 text-[10px] font-medium">Single hop, zero conflicts</text>

        {/* Arrow markers */}
        <defs>
          <marker id="arrowGreen" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="8" markerHeight="6" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" className="fill-emerald-500" />
          </marker>
          <marker id="arrowGray2" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="8" markerHeight="6" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" className="fill-foreground/40" />
          </marker>
          <marker id="arrowSmall" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="6" markerHeight="5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" className="fill-foreground/30" />
          </marker>
        </defs>
      </svg>
    </DiagramWrapper>
  );
}

/** Compares old-school Apache hosting with modern Vercel/Next.js stack */
export function OldVsNewStack({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "From manually FTP-ing HTML files to an Apache server, to git push and automatic everything"
      }
    >
      <svg
        viewBox="0 0 820 340"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-3xl mx-auto"
      >
        {/* === LEFT SIDE: Old School === */}
        <text x="190" y="24" textAnchor="middle" className="fill-amber-500 text-[14px] font-bold">The Old Way</text>
        <text x="190" y="42" textAnchor="middle" className="fill-muted-foreground text-[10px]">Apache + HTML + FTP</text>

        {/* Developer */}
        <rect x="130" y="58" width="120" height="50" rx="8" className="stroke-amber-500/60" strokeWidth="1.5" />
        <text x="150" y="80" className="fill-foreground text-[11px]">You</text>
        <text x="150" y="95" className="fill-muted-foreground text-[9px]">Notepad / vim</text>
        {/* Code icon */}
        <text x="228" y="88" textAnchor="middle" className="fill-amber-500/60 text-[18px]">&lt;/&gt;</text>

        {/* Arrow down */}
        <line x1="190" y1="108" x2="190" y2="128" className="stroke-amber-500/50" strokeWidth="1.5" markerEnd="url(#arrowOldDown)" />
        <text x="210" y="123" className="fill-amber-500/60 text-[8px]">FTP upload</text>

        {/* HTML Files */}
        <rect x="130" y="130" width="120" height="44" rx="6" className="stroke-amber-500/40" strokeWidth="1" />
        <text x="190" y="150" textAnchor="middle" className="fill-foreground text-[10px] font-medium">index.html</text>
        <text x="190" y="165" textAnchor="middle" className="fill-muted-foreground text-[8px]">style.css + script.js</text>

        {/* Arrow down */}
        <line x1="190" y1="174" x2="190" y2="194" className="stroke-amber-500/50" strokeWidth="1.5" markerEnd="url(#arrowOldDown2)" />

        {/* Apache Server */}
        <rect x="110" y="196" width="160" height="75" rx="8" className="stroke-amber-500" strokeWidth="1.5" />
        <text x="190" y="218" textAnchor="middle" className="fill-amber-500 text-[12px] font-semibold">Apache httpd</text>
        <text x="190" y="236" textAnchor="middle" className="fill-muted-foreground text-[9px]">.htaccess rewrites</text>
        <text x="190" y="249" textAnchor="middle" className="fill-muted-foreground text-[9px]">mod_ssl (manual cert)</text>
        <text x="190" y="262" textAnchor="middle" className="fill-muted-foreground text-[9px]">Shared hosting / VPS</text>

        {/* Pain points */}
        <rect x="110" y="284" width="160" height="50" rx="6" className="fill-red-500/10" />
        <text x="190" y="300" textAnchor="middle" className="fill-red-500/80 text-[9px]">Manual SSL renewal</text>
        <text x="190" y="313" textAnchor="middle" className="fill-red-500/80 text-[9px]">No CDN. No build step.</text>
        <text x="190" y="326" textAnchor="middle" className="fill-red-500/80 text-[9px]">FTP = no version control</text>

        {/* === DIVIDER === */}
        <line x1="400" y1="15" x2="400" y2="335" className="stroke-border" strokeWidth="1" strokeDasharray="6 4" />
        <rect x="383" y="155" width="34" height="24" rx="4" className="fill-background" />
        <text x="400" y="172" textAnchor="middle" className="fill-primary text-[14px] font-bold">vs</text>

        {/* === RIGHT SIDE: Modern Stack === */}
        <text x="620" y="24" textAnchor="middle" className="fill-primary text-[14px] font-bold">The New Way</text>
        <text x="620" y="42" textAnchor="middle" className="fill-muted-foreground text-[10px]">Next.js + Vercel + Git</text>

        {/* Developer */}
        <rect x="560" y="58" width="120" height="50" rx="8" className="stroke-primary/60" strokeWidth="1.5" />
        <text x="580" y="80" className="fill-foreground text-[11px]">You</text>
        <text x="580" y="95" className="fill-muted-foreground text-[9px]">Claude Code CLI</text>
        {/* Terminal icon */}
        <text x="658" y="88" textAnchor="middle" className="fill-primary/60 text-[16px]">&gt;_</text>

        {/* Arrow down */}
        <line x1="620" y1="108" x2="620" y2="128" className="stroke-emerald-500" strokeWidth="1.5" markerEnd="url(#arrowNewDown)" />
        <text x="646" y="123" className="fill-emerald-500 text-[8px]">git push</text>

        {/* GitHub */}
        <rect x="560" y="130" width="120" height="44" rx="6" className="stroke-foreground/40" strokeWidth="1" />
        <text x="620" y="150" textAnchor="middle" className="fill-foreground text-[10px] font-medium">GitHub</text>
        <text x="620" y="165" textAnchor="middle" className="fill-muted-foreground text-[8px]">Version control + trigger</text>

        {/* Arrow down */}
        <line x1="620" y1="174" x2="620" y2="194" className="stroke-emerald-500" strokeWidth="1.5" markerEnd="url(#arrowNewDown2)" />
        <text x="646" y="189" className="fill-emerald-500 text-[8px]">auto-build</text>

        {/* Vercel + Next.js */}
        <rect x="530" y="196" width="180" height="75" rx="8" className="stroke-primary" strokeWidth="2" />
        <text x="620" y="218" textAnchor="middle" className="fill-primary text-[12px] font-semibold">Vercel + Next.js</text>
        <text x="620" y="236" textAnchor="middle" className="fill-muted-foreground text-[9px]">Auto SSL (Let&apos;s Encrypt)</text>
        <text x="620" y="249" textAnchor="middle" className="fill-muted-foreground text-[9px]">Global CDN + Edge</text>
        <text x="620" y="262" textAnchor="middle" className="fill-muted-foreground text-[9px]">SSR + Static Generation</text>

        {/* Win points */}
        <rect x="530" y="284" width="180" height="50" rx="6" className="fill-emerald-500/10" />
        <text x="620" y="300" textAnchor="middle" className="fill-emerald-500 text-[9px]">Free tier. Auto-deploys.</text>
        <text x="620" y="313" textAnchor="middle" className="fill-emerald-500 text-[9px]">Global CDN. Auto SSL.</text>
        <text x="620" y="326" textAnchor="middle" className="fill-emerald-500 text-[9px]">Git = full version history</text>

        {/* Arrow markers */}
        <defs>
          <marker id="arrowOldDown" viewBox="0 0 10 7" refX="5" refY="7" markerWidth="7" markerHeight="5" orient="auto">
            <polygon points="0 0, 10 0, 5 7" className="fill-amber-500/50" />
          </marker>
          <marker id="arrowOldDown2" viewBox="0 0 10 7" refX="5" refY="7" markerWidth="7" markerHeight="5" orient="auto">
            <polygon points="0 0, 10 0, 5 7" className="fill-amber-500/50" />
          </marker>
          <marker id="arrowNewDown" viewBox="0 0 10 7" refX="5" refY="7" markerWidth="7" markerHeight="5" orient="auto">
            <polygon points="0 0, 10 0, 5 7" className="fill-emerald-500" />
          </marker>
          <marker id="arrowNewDown2" viewBox="0 0 10 7" refX="5" refY="7" markerWidth="7" markerHeight="5" orient="auto">
            <polygon points="0 0, 10 0, 5 7" className="fill-emerald-500" />
          </marker>
        </defs>
      </svg>
    </DiagramWrapper>
  );
}

/** Shows the full site architecture stack from browser to content layer */
export function SiteArchitectureDiagram({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "Complete site architecture — every layer from the browser to the content files, all running on free-tier services"
      }
    >
      <svg
        viewBox="0 0 700 420"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-2xl mx-auto"
      >
        {/* === LAYER 1: Browser === */}
        <rect x="200" y="10" width="300" height="45" rx="8" className="stroke-foreground/60" strokeWidth="1.5" />
        <text x="230" y="30" className="fill-foreground text-[18px]">&#x1F310;</text>
        <text x="350" y="30" textAnchor="middle" className="fill-foreground text-[12px] font-semibold">Browser</text>
        <text x="350" y="46" textAnchor="middle" className="fill-muted-foreground text-[9px]">cryptoflexllc.com</text>

        {/* Arrow */}
        <line x1="350" y1="55" x2="350" y2="75" className="stroke-primary" strokeWidth="2" markerEnd="url(#archDown1)" />
        <text x="370" y="69" className="fill-primary text-[8px]">HTTPS</text>

        {/* === LAYER 2: Vercel Edge === */}
        <rect x="120" y="77" width="460" height="55" rx="8" className="stroke-primary" strokeWidth="2" />
        <text x="150" y="102" className="fill-primary text-[16px]">&#x26A1;</text>
        <text x="350" y="100" textAnchor="middle" className="fill-primary text-[12px] font-semibold">Vercel Edge Network</text>
        <text x="350" y="118" textAnchor="middle" className="fill-muted-foreground text-[9px]">Global CDN | Auto SSL | WAF | Analytics | Speed Insights</text>
        <rect x="555" y="89" width="20" height="14" rx="3" className="fill-emerald-500/20" />
        <text x="565" y="100" textAnchor="middle" className="fill-emerald-500 text-[8px] font-bold">$0</text>

        {/* Arrow */}
        <line x1="350" y1="132" x2="350" y2="152" className="stroke-primary" strokeWidth="2" markerEnd="url(#archDown2)" />

        {/* === LAYER 3: Next.js Runtime === */}
        <rect x="140" y="154" width="420" height="55" rx="8" className="stroke-foreground/50" strokeWidth="1.5" />
        <text x="170" y="180" className="fill-foreground text-[16px]">&#x25B2;</text>
        <text x="350" y="177" textAnchor="middle" className="fill-foreground text-[12px] font-semibold">Next.js 15 App Router</text>
        <text x="350" y="197" textAnchor="middle" className="fill-muted-foreground text-[9px]">Server Components | File-based Routing | Static Generation | SEO Metadata API</text>

        {/* Arrow */}
        <line x1="350" y1="209" x2="350" y2="229" className="stroke-foreground/40" strokeWidth="1.5" markerEnd="url(#archDown3)" />

        {/* === LAYER 4: UI Layer (split into 3 boxes) === */}
        {/* React */}
        <rect x="50" y="231" width="180" height="55" rx="6" className="stroke-foreground/30" strokeWidth="1" />
        <text x="70" y="254" className="fill-foreground text-[14px]">&#x269B;&#xFE0F;</text>
        <text x="140" y="254" textAnchor="middle" className="fill-foreground text-[11px] font-medium">React 19</text>
        <text x="140" y="272" textAnchor="middle" className="fill-muted-foreground text-[8px]">Server + Client Components</text>

        {/* Tailwind */}
        <rect x="250" y="231" width="190" height="55" rx="6" className="stroke-foreground/30" strokeWidth="1" />
        <text x="270" y="254" className="fill-foreground text-[14px]">&#x1F3A8;</text>
        <text x="345" y="254" textAnchor="middle" className="fill-foreground text-[11px] font-medium">Tailwind CSS v4</text>
        <text x="345" y="272" textAnchor="middle" className="fill-muted-foreground text-[8px]">OKLCH Dark Theme | @theme CSS config</text>

        {/* shadcn/ui */}
        <rect x="460" y="231" width="190" height="55" rx="6" className="stroke-foreground/30" strokeWidth="1" />
        <text x="480" y="254" className="fill-foreground text-[14px]">&#x1F9F1;</text>
        <text x="555" y="254" textAnchor="middle" className="fill-foreground text-[11px] font-medium">shadcn/ui + Radix</text>
        <text x="555" y="272" textAnchor="middle" className="fill-muted-foreground text-[8px]">Button | Card | Badge | Sheet</text>

        {/* Arrow */}
        <line x1="350" y1="286" x2="350" y2="306" className="stroke-foreground/40" strokeWidth="1.5" markerEnd="url(#archDown4)" />

        {/* === LAYER 5: Content Layer (split into 2 boxes) === */}
        {/* MDX Blog */}
        <rect x="100" y="308" width="250" height="55" rx="6" className="stroke-emerald-500/60" strokeWidth="1.5" />
        <text x="120" y="332" className="fill-foreground text-[14px]">&#x1F4DD;</text>
        <text x="225" y="332" textAnchor="middle" className="fill-foreground text-[11px] font-medium">MDX Blog System</text>
        <text x="225" y="350" textAnchor="middle" className="fill-muted-foreground text-[8px]">gray-matter | next-mdx-remote | rehype-pretty-code | shiki</text>

        {/* Static Assets */}
        <rect x="370" y="308" width="230" height="55" rx="6" className="stroke-foreground/30" strokeWidth="1" />
        <text x="390" y="332" className="fill-foreground text-[14px]">&#x1F4C1;</text>
        <text x="485" y="332" textAnchor="middle" className="fill-foreground text-[11px] font-medium">Static Assets</text>
        <text x="485" y="350" textAnchor="middle" className="fill-muted-foreground text-[8px]">Images | Fonts (Geist) | Favicon</text>

        {/* === Bottom: Git === */}
        <rect x="220" y="378" width="260" height="35" rx="6" className="stroke-foreground/20" strokeWidth="1" strokeDasharray="4 3" />
        <text x="240" y="400" className="fill-foreground text-[12px]">&#x1F4E6;</text>
        <text x="350" y="400" textAnchor="middle" className="fill-muted-foreground text-[10px]">Git Repository (GitHub) — everything is version-controlled</text>

        {/* Arrow markers */}
        <defs>
          <marker id="archDown1" viewBox="0 0 10 7" refX="5" refY="7" markerWidth="7" markerHeight="5" orient="auto">
            <polygon points="0 0, 10 0, 5 7" className="fill-primary" />
          </marker>
          <marker id="archDown2" viewBox="0 0 10 7" refX="5" refY="7" markerWidth="7" markerHeight="5" orient="auto">
            <polygon points="0 0, 10 0, 5 7" className="fill-primary" />
          </marker>
          <marker id="archDown3" viewBox="0 0 10 7" refX="5" refY="7" markerWidth="7" markerHeight="5" orient="auto">
            <polygon points="0 0, 10 0, 5 7" className="fill-foreground/40" />
          </marker>
          <marker id="archDown4" viewBox="0 0 10 7" refX="5" refY="7" markerWidth="7" markerHeight="5" orient="auto">
            <polygon points="0 0, 10 0, 5 7" className="fill-foreground/40" />
          </marker>
        </defs>
      </svg>
    </DiagramWrapper>
  );
}

/** Shows how an MDX file becomes a rendered blog post */
export function MDXPipelineDiagram({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "How a blog post goes from a Markdown file in your repo to a fully rendered page on the internet"
      }
    >
      <svg
        viewBox="0 0 820 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-3xl mx-auto"
      >
        {/* Step 1: MDX File */}
        <rect x="5" y="40" width="120" height="80" rx="8" className="stroke-emerald-500" strokeWidth="1.5" />
        <text x="25" y="65" className="fill-foreground text-[14px]">&#x1F4C4;</text>
        <text x="65" y="80" textAnchor="middle" className="fill-foreground text-[10px] font-semibold">.mdx File</text>
        <text x="65" y="96" textAnchor="middle" className="fill-muted-foreground text-[8px]">YAML frontmatter</text>
        <text x="65" y="108" textAnchor="middle" className="fill-muted-foreground text-[8px]">+ Markdown body</text>

        {/* Arrow */}
        <line x1="125" y1="80" x2="160" y2="80" className="stroke-primary" strokeWidth="1.5" markerEnd="url(#mdxRight1)" />

        {/* Step 2: gray-matter */}
        <rect x="162" y="40" width="110" height="80" rx="8" className="stroke-primary/60" strokeWidth="1.5" />
        <text x="182" y="64" className="fill-foreground text-[12px]">&#x2702;&#xFE0F;</text>
        <text x="217" y="80" textAnchor="middle" className="fill-primary text-[10px] font-semibold">gray-matter</text>
        <text x="217" y="96" textAnchor="middle" className="fill-muted-foreground text-[8px]">Splits frontmatter</text>
        <text x="217" y="108" textAnchor="middle" className="fill-muted-foreground text-[8px]">from content</text>

        {/* Arrow */}
        <line x1="272" y1="80" x2="307" y2="80" className="stroke-primary" strokeWidth="1.5" markerEnd="url(#mdxRight2)" />

        {/* Step 3: MDXRemote */}
        <rect x="309" y="28" width="130" height="104" rx="8" className="stroke-primary" strokeWidth="2" />
        <text x="329" y="54" className="fill-foreground text-[12px]">&#x2699;&#xFE0F;</text>
        <text x="374" y="56" textAnchor="middle" className="fill-primary text-[10px] font-bold">MDXRemote</text>
        <text x="374" y="74" textAnchor="middle" className="fill-muted-foreground text-[8px]">remark-gfm</text>
        <text x="374" y="86" textAnchor="middle" className="fill-muted-foreground text-[8px]">rehype-pretty-code</text>
        <text x="374" y="98" textAnchor="middle" className="fill-muted-foreground text-[8px]">shiki (syntax HL)</text>
        <text x="374" y="110" textAnchor="middle" className="fill-muted-foreground text-[8px]">Custom components</text>
        <text x="374" y="122" textAnchor="middle" className="fill-muted-foreground text-[8px]">Server-side render</text>

        {/* Arrow */}
        <line x1="439" y1="80" x2="474" y2="80" className="stroke-primary" strokeWidth="1.5" markerEnd="url(#mdxRight3)" />

        {/* Step 4: React Components */}
        <rect x="476" y="40" width="120" height="80" rx="8" className="stroke-foreground/50" strokeWidth="1.5" />
        <text x="496" y="64" className="fill-foreground text-[12px]">&#x269B;&#xFE0F;</text>
        <text x="536" y="80" textAnchor="middle" className="fill-foreground text-[10px] font-semibold">React Tree</text>
        <text x="536" y="96" textAnchor="middle" className="fill-muted-foreground text-[8px]">Tailwind prose</text>
        <text x="536" y="108" textAnchor="middle" className="fill-muted-foreground text-[8px]">classes applied</text>

        {/* Arrow */}
        <line x1="596" y1="80" x2="631" y2="80" className="stroke-emerald-500" strokeWidth="1.5" markerEnd="url(#mdxRight4)" />

        {/* Step 5: Static HTML */}
        <rect x="633" y="40" width="120" height="80" rx="8" className="stroke-emerald-500" strokeWidth="2" />
        <text x="653" y="64" className="fill-foreground text-[12px]">&#x1F310;</text>
        <text x="693" y="80" textAnchor="middle" className="fill-emerald-500 text-[10px] font-bold">Static HTML</text>
        <text x="693" y="96" textAnchor="middle" className="fill-muted-foreground text-[8px]">Pre-built at</text>
        <text x="693" y="108" textAnchor="middle" className="fill-muted-foreground text-[8px]">compile time</text>

        {/* Build time badge */}
        <rect x="295" y="145" width="230" height="22" rx="4" className="fill-primary/10" />
        <text x="410" y="160" textAnchor="middle" className="fill-primary text-[9px] font-medium">All happens at build time — zero runtime cost to visitors</text>

        {/* Arrow markers */}
        <defs>
          <marker id="mdxRight1" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="7" markerHeight="5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" className="fill-primary" />
          </marker>
          <marker id="mdxRight2" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="7" markerHeight="5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" className="fill-primary" />
          </marker>
          <marker id="mdxRight3" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="7" markerHeight="5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" className="fill-primary" />
          </marker>
          <marker id="mdxRight4" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="7" markerHeight="5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" className="fill-emerald-500" />
          </marker>
        </defs>
      </svg>
    </DiagramWrapper>
  );
}

/** Shows the deployment pipeline from code to production */
export function DeploymentFlowDiagram({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "The deployment pipeline — from git push to globally distributed production site in under 60 seconds"
      }
    >
      <svg
        viewBox="0 0 820 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-3xl mx-auto"
      >
        {/* Step 1: Developer */}
        <rect x="5" y="50" width="120" height="80" rx="8" className="stroke-foreground/60" strokeWidth="1.5" />
        <text x="25" y="78" className="fill-foreground text-[16px]">&#x1F468;&#x200D;&#x1F4BB;</text>
        <text x="65" y="95" textAnchor="middle" className="fill-foreground text-[10px] font-semibold">Developer</text>
        <text x="65" y="112" textAnchor="middle" className="fill-muted-foreground text-[8px]">Claude Code CLI</text>
        <text x="65" y="123" textAnchor="middle" className="fill-muted-foreground text-[8px]">or any terminal</text>

        {/* Arrow */}
        <line x1="125" y1="90" x2="170" y2="90" className="stroke-primary" strokeWidth="2" markerEnd="url(#deployRight1)" />
        <text x="147" y="82" textAnchor="middle" className="fill-primary text-[8px] font-medium">git push</text>

        {/* Step 2: GitHub */}
        <rect x="172" y="50" width="120" height="80" rx="8" className="stroke-foreground/50" strokeWidth="1.5" />
        <text x="192" y="78" className="fill-foreground text-[16px]">&#x1F4E6;</text>
        <text x="232" y="95" textAnchor="middle" className="fill-foreground text-[10px] font-semibold">GitHub</text>
        <text x="232" y="112" textAnchor="middle" className="fill-muted-foreground text-[8px]">Source code</text>
        <text x="232" y="123" textAnchor="middle" className="fill-muted-foreground text-[8px]">Webhook trigger</text>

        {/* Arrow */}
        <line x1="292" y1="90" x2="337" y2="90" className="stroke-primary" strokeWidth="2" markerEnd="url(#deployRight2)" />
        <text x="314" y="82" textAnchor="middle" className="fill-primary text-[8px] font-medium">webhook</text>

        {/* Step 3: Vercel Build */}
        <rect x="339" y="35" width="150" height="110" rx="8" className="stroke-primary" strokeWidth="2" />
        <text x="359" y="63" className="fill-foreground text-[16px]">&#x2699;&#xFE0F;</text>
        <text x="414" y="64" textAnchor="middle" className="fill-primary text-[11px] font-bold">Vercel Build</text>
        <text x="414" y="82" textAnchor="middle" className="fill-muted-foreground text-[9px]">npm install</text>
        <text x="414" y="95" textAnchor="middle" className="fill-muted-foreground text-[9px]">next build</text>
        <text x="414" y="108" textAnchor="middle" className="fill-muted-foreground text-[9px]">Static generation</text>
        <text x="414" y="121" textAnchor="middle" className="fill-muted-foreground text-[9px]">Optimize + compress</text>
        <text x="414" y="134" textAnchor="middle" className="fill-muted-foreground text-[9px]">Deploy to edge</text>

        {/* Arrow */}
        <line x1="489" y1="90" x2="534" y2="90" className="stroke-emerald-500" strokeWidth="2" markerEnd="url(#deployRight3)" />
        <text x="511" y="82" textAnchor="middle" className="fill-emerald-500 text-[8px] font-medium">deploy</text>

        {/* Step 4: CDN Edge */}
        <rect x="536" y="50" width="130" height="80" rx="8" className="stroke-emerald-500" strokeWidth="1.5" />
        <text x="556" y="78" className="fill-foreground text-[16px]">&#x1F30D;</text>
        <text x="601" y="95" textAnchor="middle" className="fill-emerald-500 text-[10px] font-semibold">Global CDN</text>
        <text x="601" y="112" textAnchor="middle" className="fill-muted-foreground text-[8px]">Edge locations</text>
        <text x="601" y="123" textAnchor="middle" className="fill-muted-foreground text-[8px]">worldwide</text>

        {/* Arrow */}
        <line x1="666" y1="90" x2="711" y2="90" className="stroke-emerald-500" strokeWidth="2" markerEnd="url(#deployRight4)" />
        <text x="688" y="82" textAnchor="middle" className="fill-emerald-500 text-[8px] font-medium">HTTPS</text>

        {/* Step 5: Users */}
        <rect x="713" y="50" width="100" height="80" rx="8" className="stroke-foreground/60" strokeWidth="1.5" />
        <text x="733" y="78" className="fill-foreground text-[16px]">&#x1F465;</text>
        <text x="763" y="95" textAnchor="middle" className="fill-foreground text-[10px] font-semibold">Visitors</text>
        <text x="763" y="112" textAnchor="middle" className="fill-muted-foreground text-[8px]">Fast loads from</text>
        <text x="763" y="123" textAnchor="middle" className="fill-muted-foreground text-[8px]">nearest edge</text>

        {/* Cost badge */}
        <rect x="285" y="160" width="260" height="28" rx="4" className="fill-emerald-500/10" />
        <text x="415" y="178" textAnchor="middle" className="fill-emerald-500 text-[10px] font-medium">Total cost: $0 — GitHub free + Vercel free tier</text>

        {/* Arrow markers */}
        <defs>
          <marker id="deployRight1" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="7" markerHeight="5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" className="fill-primary" />
          </marker>
          <marker id="deployRight2" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="7" markerHeight="5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" className="fill-primary" />
          </marker>
          <marker id="deployRight3" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="7" markerHeight="5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" className="fill-emerald-500" />
          </marker>
          <marker id="deployRight4" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="7" markerHeight="5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" className="fill-emerald-500" />
          </marker>
        </defs>
      </svg>
    </DiagramWrapper>
  );
}

/** Shows the full SEO stack — layers of optimization from technical to distribution */
export function SEOStackDiagram({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "The four layers of SEO implemented on this site — from technical foundation to content distribution"
      }
    >
      <svg
        viewBox="0 0 720 420"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-2xl mx-auto"
      >
        {/* Title */}
        <text x="360" y="20" textAnchor="middle" className="fill-foreground text-[14px] font-bold">SEO Optimization Stack</text>

        {/* === Layer 1: Technical Foundation === */}
        <rect x="60" y="38" width="600" height="80" rx="8" className="stroke-primary" strokeWidth="2" />
        <text x="80" y="60" className="fill-primary text-[16px]">&#x2699;&#xFE0F;</text>
        <text x="360" y="60" textAnchor="middle" className="fill-primary text-[12px] font-semibold">Layer 1: Technical SEO Foundation</text>

        {/* Sub-items */}
        <rect x="80" y="72" width="120" height="36" rx="4" className="fill-primary/10" />
        <text x="140" y="88" textAnchor="middle" className="fill-primary text-[9px] font-medium">robots.txt</text>
        <text x="140" y="100" textAnchor="middle" className="fill-muted-foreground text-[8px]">Crawl directives</text>

        <rect x="215" y="72" width="120" height="36" rx="4" className="fill-primary/10" />
        <text x="275" y="88" textAnchor="middle" className="fill-primary text-[9px] font-medium">sitemap.xml</text>
        <text x="275" y="100" textAnchor="middle" className="fill-muted-foreground text-[8px]">Page discovery</text>

        <rect x="350" y="72" width="120" height="36" rx="4" className="fill-primary/10" />
        <text x="410" y="88" textAnchor="middle" className="fill-primary text-[9px] font-medium">Canonical URLs</text>
        <text x="410" y="100" textAnchor="middle" className="fill-muted-foreground text-[8px]">Duplicate prevention</text>

        <rect x="485" y="72" width="155" height="36" rx="4" className="fill-primary/10" />
        <text x="562" y="88" textAnchor="middle" className="fill-primary text-[9px] font-medium">metadataBase</text>
        <text x="562" y="100" textAnchor="middle" className="fill-muted-foreground text-[8px]">Absolute URL resolution</text>

        {/* Arrow down */}
        <line x1="360" y1="118" x2="360" y2="138" className="stroke-emerald-500" strokeWidth="1.5" markerEnd="url(#seoDown1)" />

        {/* === Layer 2: Structured Data === */}
        <rect x="60" y="140" width="600" height="80" rx="8" className="stroke-emerald-500" strokeWidth="2" />
        <text x="80" y="162" className="fill-emerald-500 text-[16px]">&#x1F4CA;</text>
        <text x="360" y="162" textAnchor="middle" className="fill-emerald-500 text-[12px] font-semibold">Layer 2: Structured Data (JSON-LD)</text>

        <rect x="80" y="174" width="120" height="36" rx="4" className="fill-emerald-500/10" />
        <text x="140" y="190" textAnchor="middle" className="fill-emerald-500 text-[9px] font-medium">WebSite</text>
        <text x="140" y="202" textAnchor="middle" className="fill-muted-foreground text-[8px]">Sitelinks + search</text>

        <rect x="215" y="174" width="120" height="36" rx="4" className="fill-emerald-500/10" />
        <text x="275" y="190" textAnchor="middle" className="fill-emerald-500 text-[9px] font-medium">Person</text>
        <text x="275" y="202" textAnchor="middle" className="fill-muted-foreground text-[8px]">Author identity</text>

        <rect x="350" y="174" width="120" height="36" rx="4" className="fill-emerald-500/10" />
        <text x="410" y="190" textAnchor="middle" className="fill-emerald-500 text-[9px] font-medium">Article</text>
        <text x="410" y="202" textAnchor="middle" className="fill-muted-foreground text-[8px]">Rich snippets</text>

        <rect x="485" y="174" width="155" height="36" rx="4" className="fill-emerald-500/10" />
        <text x="562" y="190" textAnchor="middle" className="fill-emerald-500 text-[9px] font-medium">BreadcrumbList</text>
        <text x="562" y="202" textAnchor="middle" className="fill-muted-foreground text-[8px]">Navigation hierarchy</text>

        {/* Arrow down */}
        <line x1="360" y1="220" x2="360" y2="240" className="stroke-amber-500" strokeWidth="1.5" markerEnd="url(#seoDown2)" />

        {/* === Layer 3: Social & Preview === */}
        <rect x="60" y="242" width="600" height="80" rx="8" className="stroke-amber-500" strokeWidth="2" />
        <text x="80" y="264" className="fill-amber-500 text-[16px]">&#x1F4F1;</text>
        <text x="360" y="264" textAnchor="middle" className="fill-amber-500 text-[12px] font-semibold">Layer 3: Social &amp; Preview Optimization</text>

        <rect x="80" y="276" width="145" height="36" rx="4" className="fill-amber-500/10" />
        <text x="152" y="292" textAnchor="middle" className="fill-amber-500 text-[9px] font-medium">OpenGraph</text>
        <text x="152" y="304" textAnchor="middle" className="fill-muted-foreground text-[8px]">LinkedIn / Facebook cards</text>

        <rect x="240" y="276" width="145" height="36" rx="4" className="fill-amber-500/10" />
        <text x="312" y="292" textAnchor="middle" className="fill-amber-500 text-[9px] font-medium">Twitter Cards</text>
        <text x="312" y="304" textAnchor="middle" className="fill-muted-foreground text-[8px]">X / Twitter previews</text>

        <rect x="400" y="276" width="120" height="36" rx="4" className="fill-amber-500/10" />
        <text x="460" y="292" textAnchor="middle" className="fill-amber-500 text-[9px] font-medium">googleBot</text>
        <text x="460" y="304" textAnchor="middle" className="fill-muted-foreground text-[8px]">Preview directives</text>

        <rect x="535" y="276" width="105" height="36" rx="4" className="fill-amber-500/10" />
        <text x="587" y="292" textAnchor="middle" className="fill-amber-500 text-[9px] font-medium">manifest</text>
        <text x="587" y="304" textAnchor="middle" className="fill-muted-foreground text-[8px]">PWA metadata</text>

        {/* Arrow down */}
        <line x1="360" y1="322" x2="360" y2="342" className="stroke-foreground/50" strokeWidth="1.5" markerEnd="url(#seoDown3)" />

        {/* === Layer 4: Distribution === */}
        <rect x="60" y="344" width="600" height="65" rx="8" className="stroke-foreground/50" strokeWidth="1.5" />
        <text x="80" y="368" className="fill-foreground text-[16px]">&#x1F4E1;</text>
        <text x="360" y="368" textAnchor="middle" className="fill-foreground text-[12px] font-semibold">Layer 4: Distribution &amp; Discovery</text>

        <rect x="130" y="380" width="130" height="22" rx="4" className="fill-foreground/10" />
        <text x="195" y="395" textAnchor="middle" className="fill-muted-foreground text-[9px]">RSS Feed (/feed.xml)</text>

        <rect x="280" y="380" width="160" height="22" rx="4" className="fill-foreground/10" />
        <text x="360" y="395" textAnchor="middle" className="fill-muted-foreground text-[9px]">Google Search Console</text>

        <rect x="460" y="380" width="150" height="22" rx="4" className="fill-foreground/10" />
        <text x="535" y="395" textAnchor="middle" className="fill-muted-foreground text-[9px]">Per-page keywords</text>

        <defs>
          <marker id="seoDown1" viewBox="0 0 10 7" refX="5" refY="7" markerWidth="7" markerHeight="5" orient="auto">
            <polygon points="0 0, 10 0, 5 7" className="fill-emerald-500" />
          </marker>
          <marker id="seoDown2" viewBox="0 0 10 7" refX="5" refY="7" markerWidth="7" markerHeight="5" orient="auto">
            <polygon points="0 0, 10 0, 5 7" className="fill-amber-500" />
          </marker>
          <marker id="seoDown3" viewBox="0 0 10 7" refX="5" refY="7" markerWidth="7" markerHeight="5" orient="auto">
            <polygon points="0 0, 10 0, 5 7" className="fill-foreground/50" />
          </marker>
        </defs>
      </svg>
    </DiagramWrapper>
  );
}

/** Shows how Googlebot discovers and indexes a page through the SEO pipeline */
export function GoogleCrawlFlowDiagram({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "How Googlebot discovers, crawls, and indexes your pages — each SEO component feeds a different stage"
      }
    >
      <svg
        viewBox="0 0 820 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-3xl mx-auto"
      >
        {/* Step 1: Discovery */}
        <rect x="5" y="40" width="120" height="90" rx="8" className="stroke-primary" strokeWidth="1.5" />
        <text x="25" y="65" className="fill-primary text-[16px]">&#x1F50D;</text>
        <text x="65" y="68" textAnchor="middle" className="fill-primary text-[10px] font-semibold">Discovery</text>
        <text x="65" y="85" textAnchor="middle" className="fill-muted-foreground text-[8px]">robots.txt checked</text>
        <text x="65" y="97" textAnchor="middle" className="fill-muted-foreground text-[8px]">sitemap.xml parsed</text>
        <text x="65" y="109" textAnchor="middle" className="fill-muted-foreground text-[8px]">URLs queued</text>
        <text x="65" y="121" textAnchor="middle" className="fill-primary text-[8px] font-medium">16 pages found</text>

        {/* Arrow */}
        <line x1="125" y1="85" x2="168" y2="85" className="stroke-primary" strokeWidth="2" markerEnd="url(#crawlRight1)" />

        {/* Step 2: Crawl */}
        <rect x="170" y="40" width="120" height="90" rx="8" className="stroke-primary" strokeWidth="1.5" />
        <text x="190" y="65" className="fill-primary text-[16px]">&#x1F577;&#xFE0F;</text>
        <text x="230" y="68" textAnchor="middle" className="fill-primary text-[10px] font-semibold">Crawl</text>
        <text x="230" y="85" textAnchor="middle" className="fill-muted-foreground text-[8px]">Fetch HTML</text>
        <text x="230" y="97" textAnchor="middle" className="fill-muted-foreground text-[8px]">Follow canonicals</text>
        <text x="230" y="109" textAnchor="middle" className="fill-muted-foreground text-[8px]">Respect googleBot</text>
        <text x="230" y="121" textAnchor="middle" className="fill-muted-foreground text-[8px]">directives</text>

        {/* Arrow */}
        <line x1="290" y1="85" x2="333" y2="85" className="stroke-emerald-500" strokeWidth="2" markerEnd="url(#crawlRight2)" />

        {/* Step 3: Parse */}
        <rect x="335" y="28" width="140" height="114" rx="8" className="stroke-emerald-500" strokeWidth="2" />
        <text x="355" y="53" className="fill-emerald-500 text-[16px]">&#x1F9E0;</text>
        <text x="405" y="56" textAnchor="middle" className="fill-emerald-500 text-[10px] font-bold">Parse &amp; Extract</text>
        <text x="405" y="74" textAnchor="middle" className="fill-muted-foreground text-[8px]">JSON-LD schemas</text>
        <text x="405" y="86" textAnchor="middle" className="fill-muted-foreground text-[8px]">OpenGraph tags</text>
        <text x="405" y="98" textAnchor="middle" className="fill-muted-foreground text-[8px]">Meta descriptions</text>
        <text x="405" y="110" textAnchor="middle" className="fill-muted-foreground text-[8px]">Heading hierarchy</text>
        <text x="405" y="122" textAnchor="middle" className="fill-muted-foreground text-[8px]">Breadcrumbs</text>
        <text x="405" y="134" textAnchor="middle" className="fill-muted-foreground text-[8px]">Keywords</text>

        {/* Arrow */}
        <line x1="475" y1="85" x2="518" y2="85" className="stroke-emerald-500" strokeWidth="2" markerEnd="url(#crawlRight3)" />

        {/* Step 4: Index */}
        <rect x="520" y="40" width="120" height="90" rx="8" className="stroke-emerald-500" strokeWidth="1.5" />
        <text x="540" y="65" className="fill-emerald-500 text-[16px]">&#x1F4BE;</text>
        <text x="580" y="68" textAnchor="middle" className="fill-emerald-500 text-[10px] font-semibold">Index</text>
        <text x="580" y="85" textAnchor="middle" className="fill-muted-foreground text-[8px]">Store in search DB</text>
        <text x="580" y="97" textAnchor="middle" className="fill-muted-foreground text-[8px]">Assign relevance</text>
        <text x="580" y="109" textAnchor="middle" className="fill-muted-foreground text-[8px]">E-E-A-T signals</text>
        <text x="580" y="121" textAnchor="middle" className="fill-muted-foreground text-[8px]">Rich result eligible</text>

        {/* Arrow */}
        <line x1="640" y1="85" x2="683" y2="85" className="stroke-foreground/50" strokeWidth="2" markerEnd="url(#crawlRight4)" />

        {/* Step 5: Rank */}
        <rect x="685" y="40" width="120" height="90" rx="8" className="stroke-foreground/60" strokeWidth="1.5" />
        <text x="705" y="65" className="fill-foreground text-[16px]">&#x1F3C6;</text>
        <text x="745" y="68" textAnchor="middle" className="fill-foreground text-[10px] font-semibold">Rank</text>
        <text x="745" y="85" textAnchor="middle" className="fill-muted-foreground text-[8px]">Search results</text>
        <text x="745" y="97" textAnchor="middle" className="fill-muted-foreground text-[8px]">Rich snippets</text>
        <text x="745" y="109" textAnchor="middle" className="fill-muted-foreground text-[8px]">Breadcrumb trails</text>
        <text x="745" y="121" textAnchor="middle" className="fill-muted-foreground text-[8px]">Knowledge panel</text>

        {/* E-E-A-T badge */}
        <rect x="250" y="155" width="320" height="28" rx="4" className="fill-emerald-500/10" />
        <text x="410" y="174" textAnchor="middle" className="fill-emerald-500 text-[10px] font-medium">Every layer feeds Google&apos;s E-E-A-T ranking signals</text>

        <defs>
          <marker id="crawlRight1" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="7" markerHeight="5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" className="fill-primary" />
          </marker>
          <marker id="crawlRight2" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="7" markerHeight="5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" className="fill-emerald-500" />
          </marker>
          <marker id="crawlRight3" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="7" markerHeight="5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" className="fill-emerald-500" />
          </marker>
          <marker id="crawlRight4" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="7" markerHeight="5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" className="fill-foreground/50" />
          </marker>
        </defs>
      </svg>
    </DiagramWrapper>
  );
}

/** Shows how Next.js Metadata API generates the actual HTML tags for SEO */
export function MetadataFlowDiagram({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "How the Next.js Metadata API transforms your TypeScript config into the HTML tags that Google and social platforms read"
      }
    >
      <svg
        viewBox="0 0 820 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-3xl mx-auto"
      >
        {/* === Left: Source (Next.js code) === */}
        <rect x="5" y="10" width="260" height="260" rx="8" className="stroke-primary" strokeWidth="2" />
        <text x="135" y="34" textAnchor="middle" className="fill-primary text-[12px] font-bold">Next.js Metadata API</text>
        <text x="135" y="48" textAnchor="middle" className="fill-muted-foreground text-[9px]">TypeScript objects in layout.tsx / page.tsx</text>

        {/* Sub-boxes */}
        <rect x="18" y="58" width="108" height="40" rx="4" className="fill-primary/10" />
        <text x="72" y="76" textAnchor="middle" className="fill-primary text-[9px] font-medium">title</text>
        <text x="72" y="90" textAnchor="middle" className="fill-muted-foreground text-[7px]">template: %s | Site</text>

        <rect x="140" y="58" width="115" height="40" rx="4" className="fill-primary/10" />
        <text x="197" y="76" textAnchor="middle" className="fill-primary text-[9px] font-medium">description</text>
        <text x="197" y="90" textAnchor="middle" className="fill-muted-foreground text-[7px]">per-page descriptions</text>

        <rect x="18" y="106" width="108" height="40" rx="4" className="fill-primary/10" />
        <text x="72" y="124" textAnchor="middle" className="fill-primary text-[9px] font-medium">openGraph</text>
        <text x="72" y="138" textAnchor="middle" className="fill-muted-foreground text-[7px]">images, type, locale</text>

        <rect x="140" y="106" width="115" height="40" rx="4" className="fill-primary/10" />
        <text x="197" y="124" textAnchor="middle" className="fill-primary text-[9px] font-medium">twitter</text>
        <text x="197" y="138" textAnchor="middle" className="fill-muted-foreground text-[7px]">card, title, images</text>

        <rect x="18" y="154" width="108" height="40" rx="4" className="fill-primary/10" />
        <text x="72" y="172" textAnchor="middle" className="fill-primary text-[9px] font-medium">alternates</text>
        <text x="72" y="186" textAnchor="middle" className="fill-muted-foreground text-[7px]">canonical + RSS</text>

        <rect x="140" y="154" width="115" height="40" rx="4" className="fill-primary/10" />
        <text x="197" y="172" textAnchor="middle" className="fill-primary text-[9px] font-medium">robots</text>
        <text x="197" y="186" textAnchor="middle" className="fill-muted-foreground text-[7px]">googleBot directives</text>

        <rect x="18" y="202" width="108" height="40" rx="4" className="fill-primary/10" />
        <text x="72" y="220" textAnchor="middle" className="fill-primary text-[9px] font-medium">keywords</text>
        <text x="72" y="234" textAnchor="middle" className="fill-muted-foreground text-[7px]">topic signals</text>

        <rect x="140" y="202" width="115" height="40" rx="4" className="fill-primary/10" />
        <text x="197" y="220" textAnchor="middle" className="fill-primary text-[9px] font-medium">metadataBase</text>
        <text x="197" y="234" textAnchor="middle" className="fill-muted-foreground text-[7px]">absolute URL root</text>

        {/* === Arrow === */}
        <line x1="265" y1="140" x2="320" y2="140" className="stroke-emerald-500" strokeWidth="2" markerEnd="url(#metaRight)" />
        <text x="292" y="132" textAnchor="middle" className="fill-emerald-500 text-[8px] font-medium">build</text>

        {/* === Right: Output (HTML head) === */}
        <rect x="322" y="10" width="490" height="260" rx="8" className="stroke-emerald-500" strokeWidth="2" />
        <text x="567" y="34" textAnchor="middle" className="fill-emerald-500 text-[12px] font-bold">Rendered HTML &lt;head&gt;</text>
        <text x="567" y="48" textAnchor="middle" className="fill-muted-foreground text-[9px]">What Google, Twitter, LinkedIn, and browsers actually see</text>

        {/* Output items */}
        <rect x="335" y="58" width="225" height="28" rx="4" className="fill-emerald-500/10" />
        <text x="345" y="76" className="fill-emerald-500 text-[8px] font-mono">&lt;title&gt;Post Title | CryptoFlex LLC&lt;/title&gt;</text>

        <rect x="335" y="92" width="225" height="28" rx="4" className="fill-emerald-500/10" />
        <text x="345" y="110" className="fill-emerald-500 text-[8px] font-mono">&lt;meta name=&quot;description&quot; content=&quot;...&quot;&gt;</text>

        <rect x="335" y="126" width="225" height="28" rx="4" className="fill-emerald-500/10" />
        <text x="345" y="144" className="fill-emerald-500 text-[8px] font-mono">&lt;meta property=&quot;og:title&quot; content=&quot;...&quot;&gt;</text>

        <rect x="335" y="160" width="225" height="28" rx="4" className="fill-emerald-500/10" />
        <text x="345" y="178" className="fill-emerald-500 text-[8px] font-mono">&lt;meta name=&quot;twitter:card&quot; content=&quot;...&quot;&gt;</text>

        <rect x="335" y="194" width="225" height="28" rx="4" className="fill-emerald-500/10" />
        <text x="345" y="212" className="fill-emerald-500 text-[8px] font-mono">&lt;link rel=&quot;canonical&quot; href=&quot;...&quot;&gt;</text>

        <rect x="335" y="228" width="225" height="28" rx="4" className="fill-emerald-500/10" />
        <text x="345" y="246" className="fill-emerald-500 text-[8px] font-mono">&lt;link rel=&quot;alternate&quot; type=&quot;rss+xml&quot;&gt;</text>

        {/* Right column - consumers */}
        <rect x="575" y="58" width="225" height="56" rx="6" className="stroke-foreground/30" strokeWidth="1" />
        <text x="595" y="78" className="fill-foreground text-[12px]">&#x1F50D;</text>
        <text x="687" y="80" textAnchor="middle" className="fill-foreground text-[9px] font-medium">Google / Bing</text>
        <text x="687" y="96" textAnchor="middle" className="fill-muted-foreground text-[8px]">Reads title, description, JSON-LD, canonical</text>

        <rect x="575" y="122" width="225" height="56" rx="6" className="stroke-foreground/30" strokeWidth="1" />
        <text x="595" y="142" className="fill-foreground text-[12px]">&#x1F4F1;</text>
        <text x="687" y="144" textAnchor="middle" className="fill-foreground text-[9px] font-medium">Social Platforms</text>
        <text x="687" y="160" textAnchor="middle" className="fill-muted-foreground text-[8px]">Reads og:title, og:image, twitter:card</text>

        <rect x="575" y="186" width="225" height="56" rx="6" className="stroke-foreground/30" strokeWidth="1" />
        <text x="595" y="206" className="fill-foreground text-[12px]">&#x1F4E1;</text>
        <text x="687" y="208" textAnchor="middle" className="fill-foreground text-[9px] font-medium">RSS Readers</text>
        <text x="687" y="224" textAnchor="middle" className="fill-muted-foreground text-[8px]">Reads alternate link to /feed.xml</text>

        <defs>
          <marker id="metaRight" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="7" markerHeight="5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" className="fill-emerald-500" />
          </marker>
        </defs>
      </svg>
    </DiagramWrapper>
  );
}

/** Before/after comparison of what Google sees without vs with SEO optimization */
export function SEOBeforeAfterDiagram({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "What Google sees before and after SEO optimization — from a mystery site to a rich, structured presence"
      }
    >
      <svg
        viewBox="0 0 820 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-3xl mx-auto"
      >
        {/* === LEFT: Before === */}
        <text x="190" y="22" textAnchor="middle" className="fill-red-500 text-[14px] font-bold">Before SEO</text>
        <text x="190" y="38" textAnchor="middle" className="fill-muted-foreground text-[10px]">What Google saw</text>

        {/* Search result mockup - bare */}
        <rect x="30" y="50" width="320" height="100" rx="8" className="stroke-red-500/40" strokeWidth="1.5" />
        <text x="50" y="72" className="fill-primary text-[11px]">cryptoflexllc.com</text>
        <text x="50" y="90" className="fill-foreground text-[13px] font-medium">CryptoFlex LLC | Chris Johnson</text>
        <text x="50" y="108" className="fill-muted-foreground text-[10px]">No description provided</text>
        <text x="50" y="123" className="fill-red-500/60 text-[9px]">No rich snippets. No author. No dates.</text>
        <text x="50" y="138" className="fill-red-500/60 text-[9px]">Generic site — nothing to differentiate it.</text>

        {/* Signals missing */}
        <rect x="30" y="160" width="320" height="150" rx="8" className="fill-red-500/10" />
        <text x="190" y="182" textAnchor="middle" className="fill-red-500 text-[10px] font-semibold">Missing Signals</text>

        <text x="50" y="200" className="fill-red-500/80 text-[9px]">&#x2717; No sitemap — Google guesses what pages exist</text>
        <text x="50" y="215" className="fill-red-500/80 text-[9px]">&#x2717; No robots.txt — crawl budget wasted on /api/</text>
        <text x="50" y="230" className="fill-red-500/80 text-[9px]">&#x2717; No JSON-LD — no structured data for rich results</text>
        <text x="50" y="245" className="fill-red-500/80 text-[9px]">&#x2717; No OpenGraph — blank cards when shared</text>
        <text x="50" y="260" className="fill-red-500/80 text-[9px]">&#x2717; No canonical URLs — duplicate content risk</text>
        <text x="50" y="275" className="fill-red-500/80 text-[9px]">&#x2717; No RSS feed — no syndication channel</text>
        <text x="50" y="290" className="fill-red-500/80 text-[9px]">&#x2717; No keywords — Google infers topic poorly</text>
        <text x="50" y="305" className="fill-red-500/80 text-[9px]">&#x2717; No author metadata — no E-E-A-T signals</text>

        {/* === DIVIDER === */}
        <line x1="400" y1="12" x2="400" y2="315" className="stroke-border" strokeWidth="1" strokeDasharray="6 4" />
        <rect x="383" y="145" width="34" height="24" rx="4" className="fill-background" />
        <text x="400" y="162" textAnchor="middle" className="fill-primary text-[14px] font-bold">vs</text>

        {/* === RIGHT: After === */}
        <text x="620" y="22" textAnchor="middle" className="fill-emerald-500 text-[14px] font-bold">After SEO</text>
        <text x="620" y="38" textAnchor="middle" className="fill-muted-foreground text-[10px]">What Google sees now</text>

        {/* Search result mockup - rich */}
        <rect x="460" y="50" width="340" height="100" rx="8" className="stroke-emerald-500/60" strokeWidth="1.5" />
        <text x="480" y="68" className="fill-muted-foreground text-[8px]">Home &gt; Blog &gt; Building This Site...</text>
        <text x="480" y="82" className="fill-primary text-[11px]">cryptoflexllc.com &gt; blog</text>
        <text x="480" y="98" className="fill-foreground text-[13px] font-medium">Building This Site with Claude Code</text>
        <text x="480" y="113" className="fill-muted-foreground text-[10px]">Chris Johnson · Feb 7, 2026 · 25 min read</text>
        <text x="480" y="128" className="fill-muted-foreground text-[9px]">A step-by-step guide to vibe coding a production website...</text>
        <text x="480" y="141" className="fill-emerald-500/60 text-[9px]">Rich snippet with author, date, breadcrumbs</text>

        {/* Signals present */}
        <rect x="460" y="160" width="340" height="150" rx="8" className="fill-emerald-500/10" />
        <text x="630" y="182" textAnchor="middle" className="fill-emerald-500 text-[10px] font-semibold">Active Signals</text>

        <text x="480" y="200" className="fill-emerald-500 text-[9px]">&#x2713; Dynamic sitemap — 16 pages submitted</text>
        <text x="480" y="215" className="fill-emerald-500 text-[9px]">&#x2713; robots.txt — crawl focused on content</text>
        <text x="480" y="230" className="fill-emerald-500 text-[9px]">&#x2713; 4 JSON-LD schemas — rich results eligible</text>
        <text x="480" y="245" className="fill-emerald-500 text-[9px]">&#x2713; OpenGraph + Twitter — rich preview cards</text>
        <text x="480" y="260" className="fill-emerald-500 text-[9px]">&#x2713; Canonical URLs — no duplicate dilution</text>
        <text x="480" y="275" className="fill-emerald-500 text-[9px]">&#x2713; RSS feed — syndication &amp; backlink channel</text>
        <text x="480" y="290" className="fill-emerald-500 text-[9px]">&#x2713; 10 targeted keywords per page</text>
        <text x="480" y="305" className="fill-emerald-500 text-[9px]">&#x2713; Person + Article schemas — full E-E-A-T</text>

        <defs />
      </svg>
    </DiagramWrapper>
  );
}

/** Shows the comment system architecture from browser to database */
export function CommentSystemDiagram({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "Comment system architecture — subscriber-gated comments with admin moderation via the analytics dashboard"
      }
    >
      <svg
        viewBox="0 0 820 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-3xl mx-auto"
      >
        {/* Step 1: Reader */}
        <rect x="5" y="60" width="120" height="90" rx="8" className="stroke-foreground/60" strokeWidth="1.5" />
        <text x="25" y="88" className="fill-foreground text-[16px]">&#x1F464;</text>
        <text x="65" y="90" textAnchor="middle" className="fill-foreground text-[10px] font-semibold">Reader</text>
        <text x="65" y="107" textAnchor="middle" className="fill-muted-foreground text-[8px]">Types comment</text>
        <text x="65" y="119" textAnchor="middle" className="fill-muted-foreground text-[8px]">Selects reaction</text>
        <text x="65" y="131" textAnchor="middle" className="fill-muted-foreground text-[8px]">Enters email</text>

        {/* Arrow */}
        <line x1="125" y1="105" x2="170" y2="105" className="stroke-primary" strokeWidth="2" markerEnd="url(#commentRight1)" />
        <text x="147" y="97" textAnchor="middle" className="fill-primary text-[8px] font-medium">POST</text>

        {/* Step 2: API Route */}
        <rect x="172" y="40" width="140" height="130" rx="8" className="stroke-primary" strokeWidth="2" />
        <text x="192" y="68" className="fill-primary text-[16px]">&#x2699;&#xFE0F;</text>
        <text x="242" y="68" textAnchor="middle" className="fill-primary text-[10px] font-bold">/api/comments</text>
        <text x="242" y="86" textAnchor="middle" className="fill-muted-foreground text-[8px]">Validate input</text>
        <text x="242" y="98" textAnchor="middle" className="fill-muted-foreground text-[8px]">Length check (2-2000)</text>
        <text x="242" y="110" textAnchor="middle" className="fill-muted-foreground text-[8px]">Email format check</text>
        <text x="242" y="122" textAnchor="middle" className="fill-emerald-500 text-[8px] font-medium">Subscriber lookup</text>
        <text x="242" y="134" textAnchor="middle" className="fill-muted-foreground text-[8px]">SQL parameterized</text>
        <text x="242" y="146" textAnchor="middle" className="fill-muted-foreground text-[8px]">Generic errors</text>

        {/* Gate badge */}
        <rect x="188" y="155" width="108" height="18" rx="4" className="fill-amber-500/15" />
        <text x="242" y="168" textAnchor="middle" className="fill-amber-500 text-[8px] font-medium">403 if not subscriber</text>

        {/* Arrow to DB */}
        <line x1="312" y1="105" x2="360" y2="105" className="stroke-emerald-500" strokeWidth="2" markerEnd="url(#commentRight2)" />
        <text x="336" y="97" textAnchor="middle" className="fill-emerald-500 text-[8px] font-medium">INSERT</text>

        {/* Step 3: Database */}
        <rect x="362" y="50" width="130" height="110" rx="8" className="stroke-emerald-500" strokeWidth="1.5" />
        <text x="382" y="78" className="fill-emerald-500 text-[16px]">&#x1F4BE;</text>
        <text x="427" y="80" textAnchor="middle" className="fill-emerald-500 text-[10px] font-semibold">Neon Postgres</text>
        <text x="427" y="98" textAnchor="middle" className="fill-muted-foreground text-[8px]">blog_comments table</text>
        <text x="427" y="110" textAnchor="middle" className="fill-muted-foreground text-[8px]">slug, comment,</text>
        <text x="427" y="122" textAnchor="middle" className="fill-muted-foreground text-[8px]">reaction, email</text>
        <text x="427" y="134" textAnchor="middle" className="fill-muted-foreground text-[8px]">subscribers table</text>
        <text x="427" y="146" textAnchor="middle" className="fill-muted-foreground text-[8px]">(subscriber check)</text>

        {/* Admin flow */}
        <rect x="555" y="50" width="130" height="110" rx="8" className="stroke-amber-500" strokeWidth="1.5" />
        <text x="575" y="78" className="fill-amber-500 text-[16px]">&#x1F6E1;&#xFE0F;</text>
        <text x="620" y="80" textAnchor="middle" className="fill-amber-500 text-[10px] font-semibold">Admin Panel</text>
        <text x="620" y="98" textAnchor="middle" className="fill-muted-foreground text-[8px]">/analytics dashboard</text>
        <text x="620" y="110" textAnchor="middle" className="fill-muted-foreground text-[8px]">Cookie auth required</text>
        <text x="620" y="122" textAnchor="middle" className="fill-muted-foreground text-[8px]">DELETE /api/comments/:id</text>
        <text x="620" y="134" textAnchor="middle" className="fill-muted-foreground text-[8px]">verifyApiAuth() check</text>
        <text x="620" y="146" textAnchor="middle" className="fill-muted-foreground text-[8px]">Moderation control</text>

        {/* Arrow from DB to Admin */}
        <line x1="492" y1="105" x2="555" y2="105" className="stroke-amber-500" strokeWidth="1.5" markerEnd="url(#commentRight3)" />

        {/* Email masking note */}
        <rect x="172" y="195" width="523" height="45" rx="6" className="fill-primary/10" />
        <text x="433" y="212" textAnchor="middle" className="fill-primary text-[9px] font-medium">Security: Emails masked in display (ch***@domain.com) | Parameterized SQL | Generic error messages</text>
        <text x="433" y="228" textAnchor="middle" className="fill-primary text-[9px] font-medium">Subscriber gate prevents anonymous spam | Admin delete requires HMAC cookie auth</text>

        <defs>
          <marker id="commentRight1" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="7" markerHeight="5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" className="fill-primary" />
          </marker>
          <marker id="commentRight2" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="7" markerHeight="5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" className="fill-emerald-500" />
          </marker>
          <marker id="commentRight3" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="7" markerHeight="5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" className="fill-amber-500" />
          </marker>
        </defs>
      </svg>
    </DiagramWrapper>
  );
}

/** Shows the welcome email blast troubleshooting flow */
export function WelcomeBlastTroubleshootDiagram({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "The troubleshooting journey — from 403 Forbidden to successful delivery to all 12 subscribers"
      }
    >
      <svg
        viewBox="0 0 820 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-3xl mx-auto"
      >
        {/* Step 1: Initial attempt */}
        <rect x="5" y="30" width="140" height="70" rx="8" className="stroke-foreground/60" strokeWidth="1.5" />
        <text x="25" y="58" className="fill-foreground text-[14px]">&#x1F468;&#x200D;&#x1F4BB;</text>
        <text x="75" y="60" textAnchor="middle" className="fill-foreground text-[10px] font-semibold">curl POST</text>
        <text x="75" y="78" textAnchor="middle" className="fill-muted-foreground text-[8px]">/api/send-welcome-blast</text>
        <text x="75" y="90" textAnchor="middle" className="fill-muted-foreground text-[8px]">+ Bearer token</text>

        {/* Arrow */}
        <line x1="145" y1="65" x2="185" y2="65" className="stroke-red-500" strokeWidth="2" markerEnd="url(#blastRight1)" />

        {/* Problem 1: PowerShell */}
        <rect x="187" y="20" width="140" height="90" rx="8" className="stroke-red-500" strokeWidth="1.5" />
        <text x="207" y="44" className="fill-red-500 text-[14px]">&#x274C;</text>
        <text x="257" y="46" textAnchor="middle" className="fill-red-500 text-[10px] font-semibold">PowerShell</text>
        <text x="257" y="62" textAnchor="middle" className="fill-muted-foreground text-[8px]">curl = Invoke-WebRequest</text>
        <text x="257" y="74" textAnchor="middle" className="fill-muted-foreground text-[8px]">$ = variable prefix</text>
        <text x="257" y="86" textAnchor="middle" className="fill-red-500/80 text-[8px] font-medium">Token mangled</text>
        <text x="257" y="98" textAnchor="middle" className="fill-emerald-500 text-[8px]">Fix: curl.exe + single quotes</text>

        {/* Arrow */}
        <line x1="327" y1="65" x2="367" y2="65" className="stroke-red-500" strokeWidth="2" markerEnd="url(#blastRight2)" />

        {/* Problem 2: POST blocked */}
        <rect x="369" y="20" width="140" height="90" rx="8" className="stroke-red-500" strokeWidth="1.5" />
        <text x="389" y="44" className="fill-red-500 text-[14px]">&#x274C;</text>
        <text x="439" y="46" textAnchor="middle" className="fill-red-500 text-[10px] font-semibold">POST Blocked</text>
        <text x="439" y="62" textAnchor="middle" className="fill-muted-foreground text-[8px]">Vercel edge returned 403</text>
        <text x="439" y="74" textAnchor="middle" className="fill-muted-foreground text-[8px]">before reaching app</text>
        <text x="439" y="86" textAnchor="middle" className="fill-red-500/80 text-[8px] font-medium">POST → edge firewall</text>
        <text x="439" y="98" textAnchor="middle" className="fill-emerald-500 text-[8px]">Fix: Switch to GET</text>

        {/* Arrow */}
        <line x1="509" y1="65" x2="549" y2="65" className="stroke-red-500" strokeWidth="2" markerEnd="url(#blastRight3)" />

        {/* Problem 3: WAF deny */}
        <rect x="551" y="20" width="140" height="90" rx="8" className="stroke-red-500" strokeWidth="1.5" />
        <text x="571" y="44" className="fill-red-500 text-[14px]">&#x274C;</text>
        <text x="621" y="46" textAnchor="middle" className="fill-red-500 text-[10px] font-semibold">WAF Deny Rule</text>
        <text x="621" y="62" textAnchor="middle" className="fill-muted-foreground text-[8px]">vercel.json allowlist</text>
        <text x="621" y="74" textAnchor="middle" className="fill-muted-foreground text-[8px]">didn&apos;t include new path</text>
        <text x="621" y="86" textAnchor="middle" className="fill-red-500/80 text-[8px] font-medium">x-vercel-mitigated: deny</text>
        <text x="621" y="98" textAnchor="middle" className="fill-emerald-500 text-[8px]">Fix: Move under /api/subscribers/</text>

        {/* Arrow down to solution */}
        <line x1="621" y1="110" x2="621" y2="140" className="stroke-emerald-500" strokeWidth="2" markerEnd="url(#blastDown1)" />

        {/* Solution */}
        <rect x="460" y="142" width="320" height="70" rx="8" className="stroke-emerald-500" strokeWidth="2" />
        <text x="480" y="168" className="fill-emerald-500 text-[16px]">&#x2705;</text>
        <text x="620" y="168" textAnchor="middle" className="fill-emerald-500 text-[11px] font-bold">Success!</text>
        <text x="620" y="185" textAnchor="middle" className="fill-muted-foreground text-[9px]">/api/subscribers/send-welcome-blast</text>
        <text x="620" y="200" textAnchor="middle" className="fill-emerald-500 text-[9px] font-medium">12 sent, 0 errors — all subscribers received</text>

        {/* Lesson learned box */}
        <rect x="5" y="140" width="430" height="70" rx="8" className="fill-primary/10" />
        <text x="220" y="162" textAnchor="middle" className="fill-primary text-[10px] font-semibold">Key Insight: The Regex Negative Lookahead</text>
        <text x="220" y="178" textAnchor="middle" className="fill-muted-foreground text-[9px]">/api/(?!analytics|subscribe|...subscribers)(.*)  →  deny</text>
        <text x="220" y="194" textAnchor="middle" className="fill-muted-foreground text-[9px]">/api/subscribers/* already passes the allowlist — no deploy needed</text>

        {/* Cleanup note */}
        <rect x="5" y="230" width="775" height="50" rx="6" className="fill-amber-500/10" />
        <text x="400" y="250" textAnchor="middle" className="fill-amber-500 text-[10px] font-semibold">Post-Send Cleanup</text>
        <text x="400" y="266" textAnchor="middle" className="fill-muted-foreground text-[9px]">One-time endpoint deleted after successful send — attack surface stays minimal, vercel.json allowlist unchanged</text>

        <defs>
          <marker id="blastRight1" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="7" markerHeight="5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" className="fill-red-500" />
          </marker>
          <marker id="blastRight2" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="7" markerHeight="5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" className="fill-red-500" />
          </marker>
          <marker id="blastRight3" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="7" markerHeight="5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" className="fill-red-500" />
          </marker>
          <marker id="blastDown1" viewBox="0 0 10 7" refX="5" refY="7" markerWidth="8" markerHeight="6" orient="auto">
            <polygon points="0 0, 10 0, 5 7" className="fill-emerald-500" />
          </marker>
        </defs>
      </svg>
    </DiagramWrapper>
  );
}

/** Shows the two-layer WAF implementation (vercel.json + dashboard rules) */
export function TwoLayerWAF({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "Two layers of WAF protection: code-level rules in vercel.json and dashboard rules in the Vercel UI"
      }
    >
      <svg
        viewBox="0 0 600 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-lg mx-auto"
      >
        {/* Incoming traffic */}
        <text x="30" y="30" className="fill-foreground text-[12px] font-semibold">Incoming Request</text>
        <line x1="30" y1="40" x2="30" y2="70" className="stroke-foreground/50" strokeWidth="2" markerEnd="url(#arrowDown)" />

        {/* Layer 1 */}
        <rect x="10" y="70" width="280" height="80" rx="8" className="stroke-primary" strokeWidth="2" />
        <text x="150" y="93" textAnchor="middle" className="fill-primary text-[11px] font-semibold">Layer 1: Code-Level Rules (vercel.json)</text>
        <text x="150" y="110" textAnchor="middle" className="fill-muted-foreground text-[9px]">Host header injection  |  Dotfile access</text>
        <text x="150" y="124" textAnchor="middle" className="fill-muted-foreground text-[9px]">WordPress probes  |  DB admin panels</text>
        <text x="150" y="138" textAnchor="middle" className="fill-muted-foreground text-[9px]">Version-controlled  |  Unlimited rules</text>

        {/* Blocked arrow 1 */}
        <line x1="290" y1="110" x2="380" y2="110" className="stroke-red-500" strokeWidth="1.5" markerEnd="url(#arrowRedDown)" />
        <rect x="385" y="95" width="90" height="30" rx="6" className="fill-red-500/15" />
        <text x="430" y="114" textAnchor="middle" className="fill-red-500 text-[10px] font-medium">403 Denied</text>

        {/* Arrow between layers */}
        <line x1="30" y1="150" x2="30" y2="175" className="stroke-emerald-500" strokeWidth="2" markerEnd="url(#arrowDownGreen)" />
        <text x="45" y="167" className="fill-emerald-500 text-[9px]">passed</text>

        {/* Layer 2 */}
        <rect x="10" y="175" width="280" height="80" rx="8" className="stroke-amber-500" strokeWidth="2" />
        <text x="150" y="198" textAnchor="middle" className="fill-amber-500 text-[11px] font-semibold">Layer 2: Dashboard Rules (Vercel UI)</text>
        <text x="150" y="215" textAnchor="middle" className="fill-muted-foreground text-[9px]">Scanner UA blocking  |  Suspicious bot challenge</text>
        <text x="150" y="229" textAnchor="middle" className="fill-muted-foreground text-[9px]">Geo-blocking  |  Rate limiting (Pro)</text>
        <text x="150" y="243" textAnchor="middle" className="fill-muted-foreground text-[9px]">Point-and-click  |  3 rules (free)</text>

        {/* Blocked arrow 2 */}
        <line x1="290" y1="215" x2="380" y2="215" className="stroke-red-500" strokeWidth="1.5" markerEnd="url(#arrowRedDown2)" />
        <rect x="385" y="200" width="90" height="30" rx="6" className="fill-red-500/15" />
        <text x="430" y="219" textAnchor="middle" className="fill-red-500 text-[10px] font-medium">403 Denied</text>

        {/* Arrow to app */}
        <line x1="30" y1="255" x2="30" y2="275" className="stroke-emerald-500" strokeWidth="2" markerEnd="url(#arrowDownGreen2)" />

        {/* App layer */}
        <text x="45" y="273" className="fill-emerald-500 text-[10px] font-medium">Clean traffic reaches Next.js app</text>

        {/* Arrow markers */}
        <defs>
          <marker id="arrowDown" viewBox="0 0 10 7" refX="5" refY="7" markerWidth="8" markerHeight="6" orient="auto">
            <polygon points="0 0, 10 0, 5 7" className="fill-foreground/50" />
          </marker>
          <marker id="arrowRedDown" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="8" markerHeight="6" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" className="fill-red-500" />
          </marker>
          <marker id="arrowRedDown2" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="8" markerHeight="6" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" className="fill-red-500" />
          </marker>
          <marker id="arrowDownGreen" viewBox="0 0 10 7" refX="5" refY="7" markerWidth="8" markerHeight="6" orient="auto">
            <polygon points="0 0, 10 0, 5 7" className="fill-emerald-500" />
          </marker>
          <marker id="arrowDownGreen2" viewBox="0 0 10 7" refX="5" refY="7" markerWidth="8" markerHeight="6" orient="auto">
            <polygon points="0 0, 10 0, 5 7" className="fill-emerald-500" />
          </marker>
        </defs>
      </svg>
    </DiagramWrapper>
  );
}
