import type { ReactNode } from "react";

interface ProductBadgeProps {
  children: ReactNode;
}

/** Vercel triangle logo */
function VercelLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 76 65" fill="currentColor" className={className}>
      <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
    </svg>
  );
}

/** Cloudflare logo */
function CloudflareLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 32" fill="currentColor" className={className}>
      <path d="M44.159 26.267l1.567-5.396c.341-1.175.223-2.257-.332-3.048-.514-.732-1.393-1.155-2.428-1.214l-24.222-.332a.492.492 0 01-.407-.238.537.537 0 01-.044-.473c.08-.237.31-.404.562-.417l24.439-.332c2.943-.142 6.137-2.566 7.193-5.467l1.337-3.672a.938.938 0 00.053-.343C49.555 2.727 46.884 0 43.604 0c-2.89 0-5.342 1.98-6.015 4.66-.935-.712-2.106-1.134-3.378-1.134-2.693 0-4.954 1.89-5.504 4.42a4.685 4.685 0 00-.92-.092c-2.596 0-4.701 2.104-4.701 4.701 0 .363.042.717.12 1.058C17.882 13.613 13.44 17.442 12.99 22.26c-.024.257.065.509.242.686a.752.752 0 00.539.228l29.32.005c.266-.014.505-.158.636-.391l.432-.521z" />
      <path d="M49.938 13.469l-.346.002c-.134 0-.258.079-.318.2l-1.076 2.181c-.341 1.175-.223 2.257.332 3.049.514.731 1.393 1.154 2.428 1.213l5.126.332a.493.493 0 01.408.238.537.537 0 01.043.473c-.08.238-.31.404-.562.418l-5.344.332c-2.949.142-6.143 2.566-7.198 5.467l-.375 1.031c-.071.196.078.4.286.4h17.72c.244 0 .457-.167.517-.404a11.772 11.772 0 00.37-2.966c0-6.124-4.965-11.089-11.089-11.089" />
    </svg>
  );
}

/** Next.js logo */
function NextjsLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 180 180" fill="currentColor" className={className}>
      <mask
        id="nextjs-mask"
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="180"
        height="180"
      >
        <circle cx="90" cy="90" r="90" fill="white" />
      </mask>
      <g mask="url(#nextjs-mask)">
        <circle cx="90" cy="90" r="90" />
        <path
          d="M149.508 157.52L69.142 54H54v71.97h12.114V69.384l73.885 95.461a90.304 90.304 0 009.509-7.325z"
          fill="url(#nextjs-grad-a)"
        />
        <rect x="115" y="54" width="12" height="72" fill="url(#nextjs-grad-b)" />
      </g>
      <defs>
        <linearGradient id="nextjs-grad-a" x1="109" y1="116.5" x2="144.5" y2="160.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="nextjs-grad-b" x1="121" y1="54" x2="120.799" y2="106.875" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/** Inline product badge with logo + name */
function ProductBadgeBase({
  logo,
  children,
}: {
  logo: ReactNode;
  children: ReactNode;
}) {
  return (
    <span className="not-prose inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-card px-2.5 py-1 text-sm font-medium text-foreground align-middle">
      {logo}
      {children}
    </span>
  );
}

export function Vercel({ children }: ProductBadgeProps) {
  return (
    <ProductBadgeBase logo={<VercelLogo className="h-3.5 w-3.5" />}>
      {children ?? "Vercel"}
    </ProductBadgeBase>
  );
}

export function Cloudflare({ children }: ProductBadgeProps) {
  return (
    <ProductBadgeBase logo={<CloudflareLogo className="h-3.5 w-5" />}>
      {children ?? "Cloudflare"}
    </ProductBadgeBase>
  );
}

export function Nextjs({ children }: ProductBadgeProps) {
  return (
    <ProductBadgeBase logo={<NextjsLogo className="h-4 w-4" />}>
      {children ?? "Next.js"}
    </ProductBadgeBase>
  );
}
