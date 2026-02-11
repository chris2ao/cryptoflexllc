import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { AnalyticsTracker } from "@/components/analytics-tracker";
import { WebVitalsReporter } from "@/components/web-vitals-reporter";
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

export const metadata: Metadata = {
  title: {
    default: "CryptoFlex LLC | Chris Johnson",
    template: "%s | CryptoFlex LLC",
  },
  description:
    "Personal tech blog and portfolio of Chris Johnson — veteran, engineer, and cybersecurity professional.",
  openGraph: {
    title: "CryptoFlex LLC | Chris Johnson",
    description:
      "Personal tech blog and portfolio of Chris Johnson — veteran, engineer, and cybersecurity professional.",
    url: "https://cryptoflexllc.com",
    siteName: "CryptoFlex LLC",
    locale: "en_US",
    type: "website",
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
