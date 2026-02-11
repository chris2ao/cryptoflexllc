import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { AnalyticsTracker } from "@/components/analytics-tracker";
import { WebVitalsReporter } from "@/components/web-vitals-reporter";
import { WebsiteJsonLd, PersonJsonLd } from "@/components/json-ld";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = "https://cryptoflexllc.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "CryptoFlex LLC | Chris Johnson",
    template: "%s | CryptoFlex LLC",
  },
  description:
    "Personal tech blog and portfolio of Chris Johnson — veteran, engineer, and cybersecurity professional. Cybersecurity, AI-assisted development, and infrastructure.",
  keywords: [
    "cybersecurity",
    "Claude Code",
    "AI development",
    "Next.js",
    "web development",
    "security consulting",
    "Chris Johnson",
    "CryptoFlex",
    "vibe coding",
    "tech blog",
  ],
  authors: [{ name: "Chris Johnson", url: `${BASE_URL}/about` }],
  creator: "Chris Johnson",
  publisher: "CryptoFlex LLC",
  openGraph: {
    title: "CryptoFlex LLC | Chris Johnson",
    description:
      "Personal tech blog and portfolio of Chris Johnson — veteran, engineer, and cybersecurity professional.",
    url: BASE_URL,
    siteName: "CryptoFlex LLC",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/CFLogo.png",
        width: 512,
        height: 512,
        alt: "CryptoFlex LLC Logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "CryptoFlex LLC | Chris Johnson",
    description:
      "Cybersecurity professional writing about AI-assisted development, security, and infrastructure.",
    images: ["/CFLogo.png"],
  },
  alternates: {
    canonical: BASE_URL,
    types: {
      "application/rss+xml": [
        { url: "/feed.xml", title: "CryptoFlex LLC Blog RSS Feed" },
      ],
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
        <WebsiteJsonLd
          url={BASE_URL}
          name="CryptoFlex LLC"
          description="Personal tech blog and portfolio of Chris Johnson — veteran, engineer, and cybersecurity professional."
        />
        <PersonJsonLd
          name="Chris Johnson"
          url={BASE_URL}
          jobTitle="Cybersecurity Professional"
          description="Veteran turned cybersecurity professional. Writing about AI-assisted development, security, and infrastructure."
        />
        <AnalyticsTracker />
        <WebVitalsReporter />
        <Analytics />
        <SpeedInsights />
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
