import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { BackToTop } from "@/components/back-to-top";
import { AnalyticsTracker } from "@/components/analytics-tracker";
import { WebVitalsReporter } from "@/components/web-vitals-reporter";
import { ErrorReporter } from "@/components/error-reporter";
import { WebsiteJsonLd, PersonJsonLd } from "@/components/json-ld";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { BASE_URL } from "@/lib/constants";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
        url: "/api/og?title=CryptoFlex%20LLC&author=Chris%20Johnson",
        width: 1200,
        height: 630,
        alt: "CryptoFlex LLC",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CryptoFlex LLC | Chris Johnson",
    description:
      "Cybersecurity professional writing about AI-assisted development, security, and infrastructure.",
    images: ["/api/og?title=CryptoFlex%20LLC&author=Chris%20Johnson"],
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
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
        {/* Prevent flash of wrong theme on page load */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem("theme")==="light")document.documentElement.classList.remove("dark")}catch(e){}`,
          }}
        />
        <ThemeProvider>
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
          <ErrorReporter />
          <Analytics />
          <SpeedInsights />
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
          >
            Skip to main content
          </a>
          <Nav />
          <main id="main-content" className="flex-1">{children}</main>
          <Footer />
          <BackToTop />
        </ThemeProvider>
      </body>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
    </html>
  );
}
