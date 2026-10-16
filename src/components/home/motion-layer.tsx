"use client";

import { useEffect } from "react";

export function MotionLayer() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) return;

    const staggerGroups: Array<[string, number]> = [
      [".ed-post-list .ed-post-row", 60],
      [".ed-paths .ed-path", 60],
      [".ed-work-grid .ed-work", 80],
    ];
    // A custom property, not transition-delay, so only the entrance is staggered.
    // The CSS applies --stagger to the reveal transitions; hover stays instant.
    staggerGroups.forEach(([selector, step]) => {
      document.querySelectorAll<HTMLElement>(selector).forEach((el, i) => {
        el.style.setProperty("--stagger", `${i * step}ms`);
      });
    });

    const revealTargets = document.querySelectorAll<HTMLElement>(".reveal");
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    revealTargets.forEach((el) => revealObserver.observe(el));

    const sectionTargets = document.querySelectorAll<HTMLElement>(".ed-section");
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("in", entry.isIntersecting);
        });
      },
      { threshold: 0.15 }
    );
    sectionTargets.forEach((el) => sectionObserver.observe(el));

    return () => {
      revealObserver.disconnect();
      sectionObserver.disconnect();
    };
  }, []);

  return null;
}
