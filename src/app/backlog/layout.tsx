import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog Backlog",
  robots: { index: false, follow: false },
};

export default function BacklogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
