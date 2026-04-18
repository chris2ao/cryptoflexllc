import type { Metadata } from "next";
import { GuestbookEntries } from "@/components/guestbook-entries";
import { AchievementBadges } from "@/components/achievement-badges";
import { EditorialPageHeader } from "@/components/editorial-page-header";
import { BASE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Guestbook",
  description:
    "Leave a message on the CryptoFlex LLC guestbook. Say hello, share thoughts, or just let me know you stopped by.",
  alternates: {
    canonical: `${BASE_URL}/guestbook`,
  },
};

export default function GuestbookPage() {
  return (
    <>
      <EditorialPageHeader
        sectionLabel="§ 09 / Guestbook"
        overline="Visitor log"
        title={<>Sign the <em className="text-italic-serif" style={{ color: "var(--fg-2)" }}>book.</em></>}
        lede="Leave a message, say hello, or share what you&apos;re working on. All entries are reviewed before appearing."
      />
      <section className="py-8 sm:py-12">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <AchievementBadges />
          <div className="mt-8">
            <GuestbookEntries />
          </div>
        </div>
      </section>
    </>
  );
}
