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
