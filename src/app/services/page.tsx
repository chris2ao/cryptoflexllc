import type { Metadata } from "next";
import Link from "next/link";
import { Shield, Server, Lightbulb, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { EditorialPageHeader } from "@/components/editorial-page-header";
import { BASE_URL } from "@/lib/constants";

const serviceIcons: Record<string, React.ReactNode> = {
  "Security Consulting": <Shield className="h-8 w-8 text-primary mb-2" />,
  "IT Infrastructure": <Server className="h-8 w-8 text-primary mb-2" />,
  "IT Strategy & Support": <Lightbulb className="h-8 w-8 text-primary mb-2" />,
  "Web Development & Management": <Globe className="h-8 w-8 text-primary mb-2" />,
};

export const metadata: Metadata = {
  title: "Services",
  description:
    "IT consulting services from CryptoFlex LLC — cybersecurity assessments, infrastructure architecture, cloud strategy, and security engineering.",
  alternates: {
    canonical: `${BASE_URL}/services`,
  },
  openGraph: {
    title: "Consulting Services",
    description:
      "Cybersecurity assessments, infrastructure architecture, cloud strategy, and security engineering from CryptoFlex LLC.",
    url: `${BASE_URL}/services`,
    type: "website",
    images: [
      {
        url: `${BASE_URL}/api/og?title=Consulting+Services&author=CryptoFlex+LLC`,
        width: 1200,
        height: 630,
        alt: "CryptoFlex LLC Consulting Services",
      },
    ],
  },
};

const services = [
  {
    title: "Security Consulting",
    description:
      "Security assessments, vulnerability analysis, and security architecture review. I help organizations understand their risk posture and build practical defenses.",
    items: [
      "Security posture assessments",
      "Vulnerability analysis",
      "Security architecture review",
      "Incident response planning",
    ],
  },
  {
    title: "IT Infrastructure",
    description:
      "Network design, server infrastructure, and cloud architecture. From small office setups to complex hybrid environments.",
    items: [
      "Network design & implementation",
      "Server infrastructure",
      "Cloud migration & architecture",
      "Performance optimization",
    ],
  },
  {
    title: "IT Strategy & Support",
    description:
      "Technology strategy for small businesses and organizations. I help you make smart technology decisions without the vendor sales pressure.",
    items: [
      "Technology roadmapping",
      "Vendor-neutral recommendations",
      "IT budget planning",
      "Technical project management",
    ],
  },
  {
    title: "Web Development & Management",
    description:
      "Professional website creation and ongoing management for businesses. Modern, fast, and secure sites built with the latest technologies.",
    items: [
      "Custom website design & development",
      "Website hosting & maintenance",
      "Performance optimization & SEO",
      "Content updates & ongoing management",
    ],
  },
];

export default function ServicesPage() {
  return (
    <>
      <EditorialPageHeader
        sectionLabel="§ 04 / Consulting"
        overline="Services"
        title={<>Selective <em className="text-italic-serif" style={{ color: "var(--fg-2)" }}>engagements.</em></>}
        lede="I take on a small number of projects through CryptoFlex LLC each year. Cybersecurity, infrastructure, strategy, and web. Vendor-neutral, hands-on, accountable."
      />
      <section className="py-8 sm:py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Card key={service.title} className="bg-card border border-border/40 rounded-lg">
              <CardHeader>
                {serviceIcons[service.title]}
                <h2 className="text-xl font-heading font-semibold">{service.title}</h2>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-body text-muted-foreground mb-4">
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.items.map((item) => (
                    <li
                      key={item}
                      className="text-sm font-body text-muted-foreground flex gap-2"
                    >
                      <span className="text-primary mt-1 shrink-0">&#x2022;</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 max-w-2xl">
          <h2 className="text-2xl font-heading font-bold">Interested?</h2>
          <p className="mt-4 font-body text-muted-foreground">
            I&apos;m selective about the projects I take on — I want to make
            sure I can actually help. Drop me a message and let&apos;s see
            if it&apos;s a good fit.
          </p>
          <Button asChild className="mt-6">
            <Link href="/contact">Get in Touch</Link>
          </Button>
        </div>
      </div>
      </section>
    </>
  );
}
