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
  const [progressCycle, setProgressCycle] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const thumbnailStripRef = useRef<HTMLDivElement | null>(null);
  const thumbnailRefs = useRef<Array<HTMLButtonElement | null>>([]);

  if (!slides.length) return null;

  const activeSlide = slides[activeIndex] ?? slides[0];
  const sideSlides = Array.from({ length: Math.min(3, Math.max(slides.length - 1, 0)) }, (_, index) => {
    const slideIndex = (activeIndex + index + 1) % slides.length;
    return slides[slideIndex];
  });

  function showPrevious() {
    setProgressCycle((current) => current + 1);
    setActiveIndex((current) => (current - 1 + slides.length) % slides.length);
  }

  function showNext() {
    setProgressCycle((current) => current + 1);
    setActiveIndex((current) => (current + 1) % slides.length);
  }

  function selectSlide(index: number) {
    setProgressCycle((current) => current + 1);
    setActiveIndex(index);
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
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 5000);

    return () => window.clearTimeout(timer);
  }, [activeIndex, progressCycle, slides.length]);

  useEffect(() => {
    const strip = thumbnailStripRef.current;
    const thumbnail = thumbnailRefs.current[activeIndex];
    if (!strip || !thumbnail || strip.scrollWidth <= strip.clientWidth) return;

    const centeredLeft = thumbnail.offsetLeft - (strip.clientWidth - thumbnail.offsetWidth) / 2;
    strip.scrollTo({
      left: Math.max(0, centeredLeft),
      behavior: "smooth"
    });
  }, [activeIndex]);

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
        <article className={`feature-slide-card is-main tone-${activeSlide.tone}${activeSlide.artwork ? " is-artwork" : ""}${activeSlide.fillFrame ? " is-fill-frame" : ""}`}>
          <img src={activeSlide.imageUrl} alt={activeSlide.imageAlt || ""} loading="eager" />
          <div className="feature-slide-overlay" />
          {activeSlide.title || activeSlide.description ? (
            <div className="feature-slide-body">
              {activeSlide.title ? <h2>{activeSlide.title}</h2> : null}
              {activeSlide.description ? <p>{activeSlide.description}</p> : null}
            </div>
          ) : null}
          {activeSlide.href ? (
            <a
              className="feature-slide-link"
              href={activeSlide.href}
              aria-label={activeSlide.linkAriaLabel || `${activeSlide.imageAlt || activeSlide.title || activeSlide.label}を開く`}
              {...externalLinkProps(activeSlide.href)}
            />
          ) : null}
          <div
            key={`${activeIndex}-${progressCycle}`}
            className="feature-dots"
            aria-label="次のスライドへ"
          >
            <button
              type="button"
              className="is-active"
              onClick={showNext}
              aria-label="次の画像を表示"
            >
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <circle cx="10" cy="10" r="8" />
              </svg>
              <span aria-hidden="true">{activeIndex + 1}</span>
            </button>
          </div>
        </article>
        <div className="feature-side-stack" aria-label="注目カード">
          {sideSlides.map((slide, index) => (
            <article key={`${slide.title}-${index}`} className={`feature-slide-card is-sub tone-${slide.tone}${slide.artwork ? " is-artwork" : ""}${slide.fillFrame ? " is-fill-frame" : ""}`}>
              <img src={slide.imageUrl} alt={slide.imageAlt || ""} loading="lazy" />
              <div className="feature-slide-overlay" />
              <div className="feature-slide-body">
                <span className="feature-label">{slide.label}</span>
                {slide.title ? <h2>{slide.title}</h2> : null}
                {slide.description ? <p>{slide.description}</p> : null}
                <div className="feature-slide-actions">
                  {slide.actions.map((action) => (
                    <a key={action.label} href={action.href} {...externalLinkProps(action.href)}>
                      {action.label}
                    </a>
                  ))}
                </div>
              </div>
              {slide.href ? (
                <a
                  className="feature-slide-link"
                  href={slide.href}
                  aria-label={slide.linkAriaLabel || `${slide.imageAlt || slide.title || slide.label}を開く`}
                  {...externalLinkProps(slide.href)}
                />
              ) : null}
            </article>
          ))}
        </div>
      </div>
      <div ref={thumbnailStripRef} className="feature-thumbnail-strip" aria-label="注目コンテンツ一覧">
        {slides.map((slide, index) => (
          <button
            key={`${slide.label}-${slide.title}-thumb`}
            ref={(element) => {
              thumbnailRefs.current[index] = element;
            }}
            type="button"
            className={index === activeIndex ? "is-active" : ""}
            onClick={() => selectSlide(index)}
            aria-label={`${(slide.title || slide.label).replace(/\n/g, "")}を表示`}
            aria-current={index === activeIndex ? "true" : undefined}
          >
            <img src={slide.imageUrl} alt="" loading="lazy" />
            <svg className="feature-thumbnail-progress" viewBox="0 0 40 40" aria-hidden="true">
              <circle className="feature-thumbnail-progress-track" cx="20" cy="20" r="17" />
              <circle className="feature-thumbnail-progress-value" cx="20" cy="20" r="17" />
            </svg>
            <span>{slide.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
