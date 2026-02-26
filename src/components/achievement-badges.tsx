"use client";

import { useEffect, useState } from "react";

interface Badge {
  id: string;
  label: string;
  description: string;
  icon: string;
  earned: boolean;
}

function getBadges(): Badge[] {
  if (typeof window === "undefined") return [];

  const readPosts: string[] = JSON.parse(
    localStorage.getItem("cf_read_posts") || "[]"
  );
  const subscribed = localStorage.getItem("cf_subscribed") === "true";
  const commented = localStorage.getItem("cf_commented") === "true";
  const visits = parseInt(localStorage.getItem("cf_visits") || "0", 10);

  return [
    {
      id: "first-visit",
      label: "First Steps",
      description: "Visited the site",
      icon: "\uD83D\uDC4B",
      earned: visits >= 1,
    },
    {
      id: "read-3",
      label: "Curious Mind",
      description: "Read 3 blog posts",
      icon: "\uD83D\uDCDA",
      earned: readPosts.length >= 3,
    },
    {
      id: "read-5",
      label: "Bookworm",
      description: "Read 5 blog posts",
      icon: "\uD83E\uDDD0",
      earned: readPosts.length >= 5,
    },
    {
      id: "read-10",
      label: "Deep Diver",
      description: "Read 10 blog posts",
      icon: "\uD83C\uDF0A",
      earned: readPosts.length >= 10,
    },
    {
      id: "subscribed",
      label: "Insider",
      description: "Subscribed to the newsletter",
      icon: "\u2709\uFE0F",
      earned: subscribed,
    },
    {
      id: "commented",
      label: "Contributor",
      description: "Left a comment",
      icon: "\uD83D\uDCAC",
      earned: commented,
    },
  ];
}

export function trackPostRead(slug: string) {
  if (typeof window === "undefined") return;
  const read: string[] = JSON.parse(
    localStorage.getItem("cf_read_posts") || "[]"
  );
  if (!read.includes(slug)) {
    read.push(slug);
    localStorage.setItem("cf_read_posts", JSON.stringify(read));
  }
}

export function trackSubscribed() {
  if (typeof window === "undefined") return;
  localStorage.setItem("cf_subscribed", "true");
}

export function trackCommented() {
  if (typeof window === "undefined") return;
  localStorage.setItem("cf_commented", "true");
}

export function trackVisit() {
  if (typeof window === "undefined") return;
  const visits = parseInt(localStorage.getItem("cf_visits") || "0", 10);
  localStorage.setItem("cf_visits", String(visits + 1));
}

export function AchievementBadges() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    trackVisit();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration: read localStorage then set initial state
    setBadges(getBadges());
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration guard
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const earned = badges.filter((b) => b.earned);
  const locked = badges.filter((b) => !b.earned);

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Achievements ({earned.length}/{badges.length})
      </h3>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={`flex flex-col items-center rounded-md p-2 text-center transition-all ${
              badge.earned
                ? "bg-primary/10"
                : "opacity-40 grayscale"
            }`}
            title={badge.earned ? badge.description : `Locked: ${badge.description}`}
          >
            <span className="text-2xl">{badge.icon}</span>
            <span className="mt-1 text-xs font-medium leading-tight">
              {badge.label}
            </span>
          </div>
        ))}
      </div>
      {locked.length > 0 && (
        <p className="mt-3 text-xs text-muted-foreground">
          {locked.length} badge{locked.length > 1 ? "s" : ""} left to unlock
        </p>
      )}
    </div>
  );
}
