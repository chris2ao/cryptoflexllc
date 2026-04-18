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
      [".ed-cv-list .ed-cv-row", 45],
      [".ed-work-grid .ed-work", 80],
      [".ed-services .ed-svc", 60],
    ];
    staggerGroups.forEach(([selector, step]) => {
      document.querySelectorAll<HTMLElement>(selector).forEach((el, i) => {
        el.style.transitionDelay = `${i * step}ms`;
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

    const workCards = document.querySelectorAll<HTMLElement>(".ed-work-feat");
    const handlers = new WeakMap<HTMLElement, {
      move: (e: MouseEvent) => void;
      leave: () => void;
    }>();
    workCards.forEach((card) => {
      const shot = card.querySelector<HTMLElement>(".shot");
      if (!shot) return;
      const move = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        shot.style.transform = `translate3d(${x * -6}px, ${y * -6}px, 0) scale(1.02)`;
      };
      const leave = () => {
        shot.style.transform = "";
      };
      card.addEventListener("mousemove", move);
      card.addEventListener("mouseleave", leave);
      handlers.set(card, { move, leave });
    });

    return () => {
      revealObserver.disconnect();
      sectionObserver.disconnect();
      workCards.forEach((card) => {
        const h = handlers.get(card);
        if (!h) return;
        card.removeEventListener("mousemove", h.move);
        card.removeEventListener("mouseleave", h.leave);
      });
    };
  }, []);

  return null;
}
