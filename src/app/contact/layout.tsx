import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Chris Johnson for cybersecurity consulting, infrastructure projects, or collaboration. Connect on LinkedIn or via email.",
  alternates: {
    canonical: "https://cryptoflexllc.com/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
