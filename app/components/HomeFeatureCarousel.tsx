"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";

type FeatureAction = {
  label: string;
  href: string;
};

export type HomeFeatureSlide = {
  label: string;
  title: string;
  description: string;
  imageUrl: string;
  tone: "green" | "orange" | "blue" | "dark";
  actions: FeatureAction[];
};

type HomeFeatureCarouselProps = {
  slides: HomeFeatureSlide[];
};

export function HomeFeatureCarousel({ slides }: HomeFeatureCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  if (!slides.length) return null;

  const activeSlide = slides[activeIndex] ?? slides[0];
  const sideSlides = Array.from({ length: Math.min(3, Math.max(slides.length - 1, 0)) }, (_, index) => {
    const slideIndex = (activeIndex + index + 1) % slides.length;
    return slides[slideIndex];
  });

  function showPrevious() {
    setActiveIndex((current) => (current - 1 + slides.length) % slides.length);
  }

  function showNext() {
    setActiveIndex((current) => (current + 1) % slides.length);
  }

  function handleTouchEnd(event: React.TouchEvent<HTMLElement>) {
    if (touchStartX.current === null) return;
    const delta = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 42) return;
    if (delta > 0) showPrevious();
    else showNext();
  }

  useEffect(() => {
    if (slides.length < 2) return undefined;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  return (
    <section
      className="home-feature-carousel"
      aria-label="注目コンテンツ"
      onTouchStart={(event) => {
        touchStartX.current = event.touches[0].clientX;
      }}
      onTouchEnd={handleTouchEnd}
    >
      <div className="feature-slide-grid" aria-live="polite">
        <article className={`feature-slide-card is-main tone-${activeSlide.tone}`}>
          <img src={activeSlide.imageUrl} alt="" loading="eager" />
          <div className="feature-slide-overlay" />
          <div className="feature-slide-body">
            <h2>{activeSlide.title}</h2>
            <p>{activeSlide.description}</p>
          </div>
        </article>
        <div className="feature-side-stack" aria-label="注目カード">
          {sideSlides.map((slide, index) => (
            <article key={`${slide.title}-${index}`} className={`feature-slide-card is-sub tone-${slide.tone}`}>
              <img src={slide.imageUrl} alt="" loading="lazy" />
              <div className="feature-slide-overlay" />
              <div className="feature-slide-body">
                <span className="feature-label">{slide.label}</span>
                <h2>{slide.title}</h2>
                <p>{slide.description}</p>
                <div className="feature-slide-actions">
                  {slide.actions.map((action) => (
                    <a key={action.label} href={action.href}>
                      {action.label}
                    </a>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
      <div className="feature-dots" aria-label="スライドを選択">
        {slides.map((slide, index) => (
          <button
            key={slide.title}
            type="button"
            className={index === activeIndex ? "is-active" : ""}
            onClick={() => setActiveIndex(index)}
            aria-label={`${index + 1}枚目を表示`}
            aria-current={index === activeIndex ? "true" : undefined}
          />
        ))}
      </div>
    </section>
  );
}
