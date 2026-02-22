import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ContactForm } from "@/components/contact-form";

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
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <h1 className="text-3xl sm:text-4xl font-bold">Let&apos;s Connect</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Whether you want to talk security, infrastructure, or just geek out
          about tech, I&apos;d love to hear from you.
        </p>

        {/* Contact Form */}
        <Card className="mt-10 bg-card">
          <CardHeader>
            <h2 className="text-xl font-semibold">Send a Message</h2>
          </CardHeader>
          <CardContent>
            <ContactForm />
          </CardContent>
        </Card>

        {/* LinkedIn */}
        <Card className="mt-6 bg-card">
          <CardHeader>
            <h2 className="text-xl font-semibold">Connect on LinkedIn</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              You can also reach me directly through LinkedIn. Drop me a
              connection request or send a message.
            </p>
            <a
              href="https://www.linkedin.com/in/chris-johnson-secops/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-md bg-[#0A66C2] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#004182]"
            >
              <LinkedInIcon className="h-5 w-5" />
              Connect on LinkedIn
            </a>
          </CardContent>
        </Card>

        {/* Email fallback */}
        <Card className="mt-6 bg-card">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <MailIcon className="mt-0.5 h-5 w-5 text-muted-foreground shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">
                  Prefer email? You can also reach me at{" "}
                  <a
                    href="mailto:Chris.Johnson@cryptoflexllc.com"
                    className="text-primary hover:underline"
                  >
                    Chris.Johnson@cryptoflexllc.com
                  </a>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
