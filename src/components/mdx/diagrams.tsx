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
