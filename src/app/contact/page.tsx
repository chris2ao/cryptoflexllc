import type { Metadata } from "next";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ContactForm } from "@/components/contact-form";
import { EditorialPageHeader } from "@/components/editorial-page-header";
import { BASE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Chris Johnson at CryptoFlex LLC. For consulting inquiries, speaking engagements, or just to say hello.",
  alternates: {
    canonical: `${BASE_URL}/contact`,
  },
  openGraph: {
    title: "Contact Chris Johnson",
    description:
      "Reach out about cybersecurity consulting, AI-assisted development, or infrastructure work.",
    url: `${BASE_URL}/contact`,
    type: "website",
    images: [
      {
        url: `${BASE_URL}/api/og?title=Contact&author=Chris+Johnson`,
        width: 1200,
        height: 630,
        alt: "Contact CryptoFlex LLC",
      },
    ],
  },
};

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

export default function ContactPage() {
  return (
    <>
      <EditorialPageHeader
        sectionLabel="§ 06 / Contact"
        overline="Get in touch"
        title={<>Let&apos;s <em className="text-italic-serif" style={{ color: "var(--fg-2)" }}>connect.</em></>}
        lede="Security, infrastructure, or just want to geek out about tech? I&apos;d love to hear from you."
      />
      <section className="py-8 sm:py-12">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">

        {/* Contact Form */}
        <Card className="mt-10 bg-card border border-border/40">
          <CardHeader>
            <h2 className="text-xl font-heading font-semibold">Send a Message</h2>
          </CardHeader>
          <CardContent>
            <ContactForm />
          </CardContent>
        </Card>

        {/* LinkedIn */}
        <Card className="mt-6 bg-card border border-border/40">
          <CardHeader>
            <h2 className="text-xl font-heading font-semibold">Connect on LinkedIn</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="font-body text-muted-foreground">
              You can also reach me directly through LinkedIn. Drop me a
              connection request or send a message.
            </p>
            <a
              href="https://www.linkedin.com/in/chris-johnson-secops/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-md bg-[var(--color-linkedin)] px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              <LinkedInIcon className="h-5 w-5" />
              Connect on LinkedIn
            </a>
          </CardContent>
        </Card>

        {/* Email fallback */}
        <Card className="mt-6 bg-card border border-border/40">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <MailIcon className="mt-0.5 h-5 w-5 text-primary shrink-0" />
              <div>
                <p className="text-sm font-body text-muted-foreground">
                  Prefer email? You can also reach me at{" "}
                  <a
                    href="mailto:chrisjohnson@cryptoflexllc.com"
                    className="text-primary hover:text-primary/80 transition-colors hover:underline"
                  >
                    chrisjohnson@cryptoflexllc.com
                  </a>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      </section>
    </>
  );
}
