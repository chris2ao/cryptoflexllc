import type { Metadata } from "next";
import { GuestbookEntries } from "@/components/guestbook-entries";
import { AchievementBadges } from "@/components/achievement-badges";
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
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <h1 className="text-3xl sm:text-4xl font-bold">Guestbook</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Leave a message, say hello, or share what you&apos;re working on.
          All entries are reviewed before appearing.
        </p>

        {/* Achievement Badges */}
        <div className="mt-10">
          <AchievementBadges />
        </div>

        <div className="mt-8">
          <GuestbookEntries />
        </div>
      </div>
    </section>
  );
}
