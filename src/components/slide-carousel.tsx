"use client";

import { useState, useCallback, useRef, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Syne, JetBrains_Mono, Outfit } from "next/font/google";
import "./slide-carousel.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export interface SlideData {
  id: string;
  content: ReactNode;
}

interface SlideCarouselProps {
  slides: SlideData[];
}

export function SlideCarousel({ slides }: SlideCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const goNext = useCallback(() => {
    setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));
  }, [slides.length]);

  const goPrev = useCallback(() => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    },
    [goNext, goPrev]
  );

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStartX.current === null) return;
      const delta = touchStartX.current - e.changedTouches[0].clientX;
      if (Math.abs(delta) > 50) {
        if (delta > 0) goNext();
        else goPrev();
      }
      touchStartX.current = null;
    },
    [goNext, goPrev]
  );

  return (
    <div
      className={`slide-carousel-theme ${syne.variable} ${jetbrainsMono.variable} ${outfit.variable}`}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Slide carousel"
      aria-roledescription="carousel"
    >
      {/* Viewport */}
      <div className="w-full max-w-[540px] mx-auto">
        <div
          className="relative aspect-[1080/1350] overflow-hidden rounded-lg border border-[#1a2744]"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="flex h-full transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((slide) => (
              <div
                key={slide.id}
                className="w-full h-full flex-shrink-0"
                role="group"
                aria-roledescription="slide"
                aria-label={slide.id}
              >
                {slide.content}
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mt-4">
          <Button
            variant="outline"
            size="icon"
            onClick={goPrev}
            disabled={currentSlide === 0}
            aria-label="Previous slide"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Button>

          <span className="text-sm text-muted-foreground mono">
            {currentSlide + 1} / {slides.length}
          </span>

          <Button
            variant="outline"
            size="icon"
            onClick={goNext}
            disabled={currentSlide === slides.length - 1}
            aria-label="Next slide"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}
