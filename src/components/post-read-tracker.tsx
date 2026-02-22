"use client";

import { useEffect } from "react";
import { trackPostRead } from "@/components/achievement-badges";

export function PostReadTracker({ slug }: { slug: string }) {
  useEffect(() => {
    // Track after a short delay to count genuine reads
    const timer = setTimeout(() => trackPostRead(slug), 5000);
    return () => clearTimeout(timer);
  }, [slug]);

  return null;
}
