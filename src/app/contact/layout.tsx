import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Connect with Chris Johnson on LinkedIn or via email.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
