"use client";

import { useEffect, useRef, useState } from "react";

interface CounterItemProps {
  value: number;
  label: string;
  suffix?: string;
  duration?: number;
}

function CounterItem({
  value,
  label,
  suffix = "",
  duration = 2000,
}: CounterItemProps) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          if (reducedMotion) {
            setCount(value);
            return;
          }

          const startTime = performance.now();

          function animate(currentTime: number) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * value));

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          }

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value, duration, hasAnimated]);

  return (
    <div ref={ref} className="text-center">
      <p className="font-heading text-4xl font-bold text-primary sm:text-5xl tabular-nums">
        {count}
        {suffix}
      </p>
      <p className="mt-2 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

interface StatsItem {
  value: number;
  label: string;
  suffix?: string;
}

interface StatsSectionProps {
  stats: StatsItem[];
}

export function StatsSection({ stats }: StatsSectionProps) {
  return (
    <section className="texture-scanlines relative border-t border-border/40 py-16 sm:py-20">
      <div className="relative z-[2] mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {stats.map((stat) => (
            <CounterItem
              key={stat.label}
              value={stat.value}
              label={stat.label}
              suffix={stat.suffix}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
