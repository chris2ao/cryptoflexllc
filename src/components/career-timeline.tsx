"use client";

import { useEffect, useRef, useState } from "react";

interface TimelineEvent {
  title: string;
  period: string;
  description: string;
}

interface CareerTimelineProps {
  events: TimelineEvent[];
}

function TimelineItem({
  event,
  index,
  isLast,
}: {
  event: TimelineEvent;
  index: number;
  isLast: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`flex gap-4 transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="flex flex-col items-center">
        <div
          className={`h-3 w-3 rounded-full transition-colors duration-500 ${
            visible ? "bg-primary" : "bg-muted"
          }`}
        />
        {!isLast && <div className="mt-1 flex-1 w-px bg-border" />}
      </div>
      <div className={isLast ? "" : "pb-8"}>
        <p className="font-medium text-foreground">{event.title}</p>
        <p className="text-xs text-primary mt-0.5">{event.period}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {event.description}
        </p>
      </div>
    </div>
  );
}

export function CareerTimeline({ events }: CareerTimelineProps) {
  return (
    <div className="space-y-0">
      {events.map((event, i) => (
        <TimelineItem
          key={event.title}
          event={event}
          index={i}
          isLast={i === events.length - 1}
        />
      ))}
    </div>
  );
}
