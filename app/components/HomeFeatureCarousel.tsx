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
  artwork?: boolean;
  fillFrame?: boolean;
  imageAlt?: string;
  href?: string;
  linkAriaLabel?: string;
};

type HomeFeatureCarouselProps = {
  slides: HomeFeatureSlide[];
};

function externalLinkProps(url: string) {
  return url.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {};
}

export function HomeFeatureCarousel({ slides }: HomeFeatureCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [exitingIndex, setExitingIndex] = useState<number | null>(null);
  const [progressCycle, setProgressCycle] = useState(0);
  const [slideDirection, setSlideDirection] = useState<"next" | "previous" | "direct">("next");
  const touchStartX = useRef<number | null>(null);

  if (!slides.length) return null;

  const activeSlide = slides[activeIndex] ?? slides[0];
  const previousIndex = (activeIndex - 1 + slides.length) % slides.length;
  const nextIndex = (activeIndex + 1) % slides.length;
  const previousSlide = slides[previousIndex];
  const nextSlide = slides[nextIndex];
  const exitingSlide = exitingIndex !== null ? slides[exitingIndex] : null;

  function moveToSlide(index: number, direction: "next" | "previous" | "direct") {
    if (index === activeIndex) return;
    setSlideDirection(direction);
    setExitingIndex(activeIndex);
    setProgressCycle((current) => current + 1);
    setActiveIndex(index);
  }

  function showPrevious() {
    moveToSlide(previousIndex, "previous");
  }

  function showNext() {
    moveToSlide(nextIndex, "next");
  }

  function selectSlide(index: number) {
    if (index === activeIndex) return;
    moveToSlide(index, index > activeIndex ? "next" : "previous");
  }

  function renderSlideCard(slide: HomeFeatureSlide, className: string, key: string) {
    return (
      <article key={key} className={`feature-slide-card ${className} tone-${slide.tone}${slide.artwork ? " is-artwork" : ""}${slide.fillFrame ? " is-fill-frame" : ""}`}>
        <img src={slide.imageUrl} alt={slide.imageAlt || ""} loading="eager" />
        <div className="feature-slide-overlay" />
        {slide.title || slide.description ? (
          <div className="feature-slide-body">
            {slide.title ? <h2>{slide.title}</h2> : null}
            {slide.description ? <p>{slide.description}</p> : null}
          </div>
        ) : null}
        {slide.href ? (
          <a
            className="feature-slide-link"
            href={slide.href}
            aria-label={slide.linkAriaLabel || `${slide.imageAlt || slide.title || slide.label}を開く`}
            {...externalLinkProps(slide.href)}
          />
        ) : null}
      </article>
    );
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
    const timer = window.setTimeout(() => {
      moveToSlide((activeIndex + 1) % slides.length, "next");
    }, 15000);

    return () => window.clearTimeout(timer);
  }, [activeIndex, progressCycle, slides.length]);

  useEffect(() => {
    if (exitingIndex === null) return undefined;
    const timer = window.setTimeout(() => {
      setExitingIndex(null);
    }, 1250);

    return () => window.clearTimeout(timer);
  }, [exitingIndex]);

  return (
    <section
      className={`home-feature-carousel direction-${slideDirection}`}
      aria-label="注目コンテンツ"
      onTouchStart={(event) => {
        touchStartX.current = event.touches[0].clientX;
      }}
      onTouchEnd={handleTouchEnd}
    >
      <div className="feature-slide-grid" aria-live="polite">
        {slides.length > 1 ? (
          <button
            key={`previous-${previousIndex}-${activeIndex}`}
            type="button"
            className="feature-peek-slide is-previous"
            onClick={showPrevious}
            aria-label="前のスライドを表示"
          >
            <img src={previousSlide.imageUrl} alt="" loading="lazy" />
          </button>
        ) : null}
        <div className="feature-main-stage">
          {exitingSlide ? renderSlideCard(exitingSlide, "is-main is-exiting", `exit-${exitingIndex}-${activeIndex}`) : null}
          {renderSlideCard(activeSlide, "is-main is-entering", `enter-${activeIndex}-${progressCycle}`)}
        </div>
        <div className="feature-mobile-thumbnails" aria-label="スライド一覧">
          {slides.map((slide, index) => (
            <button
              key={`${slide.imageUrl}-${index}-mobile-thumb`}
              type="button"
              className={index === activeIndex ? "is-active" : ""}
              onClick={() => selectSlide(index)}
              aria-label={`${(slide.title || slide.label || `スライド${index + 1}`).replace(/\n/g, "")}を表示`}
              aria-current={index === activeIndex ? "true" : undefined}
            >
              <img src={slide.imageUrl} alt="" loading="lazy" />
            </button>
          ))}
        </div>
        {slides.length > 1 ? (
          <button
            key={`next-${nextIndex}-${activeIndex}`}
            type="button"
            className="feature-peek-slide is-next"
            onClick={showNext}
            aria-label="次のスライドを表示"
          >
            <img src={nextSlide.imageUrl} alt="" loading="lazy" />
          </button>
        ) : null}
        <div
          key={`${activeIndex}-${progressCycle}`}
          className="feature-dots"
          aria-label="スライドを選択"
        >
          {slides.map((slide, index) => (
            <button
              key={`${slide.imageUrl}-${index}-dot`}
              type="button"
              className={index === activeIndex ? "is-active" : ""}
              onClick={() => selectSlide(index)}
              aria-label={`${(slide.title || slide.label || `スライド${index + 1}`).replace(/\n/g, "")}を表示`}
              aria-current={index === activeIndex ? "true" : undefined}
            >
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <rect x="3" y="3" width="14" height="14" rx="2" />
              </svg>
              <span aria-hidden="true">{index + 1}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
