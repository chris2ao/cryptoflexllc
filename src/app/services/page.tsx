import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Services",
  description:
    "IT consulting services from CryptoFlex LLC — cybersecurity assessments, infrastructure architecture, cloud strategy, and security engineering.",
  alternates: {
    canonical: "https://cryptoflexllc.com/services",
  },
  openGraph: {
    title: "Consulting Services",
    description:
      "Cybersecurity assessments, infrastructure architecture, cloud strategy, and security engineering from CryptoFlex LLC.",
    url: "https://cryptoflexllc.com/services",
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
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold">Services</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            I take on select IT consulting projects through CryptoFlex LLC.
            If you need practical, vendor-neutral tech help, let&apos;s talk.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Card key={service.title} className="bg-card">
              <CardHeader>
                <h2 className="text-xl font-semibold">{service.title}</h2>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.items.map((item) => (
                    <li
                      key={item}
                      className="text-sm text-muted-foreground flex gap-2"
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
          <h2 className="text-2xl font-bold">Interested?</h2>
          <p className="mt-4 text-muted-foreground">
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
  );
}
