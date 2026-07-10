"use client";

import { useState, type CSSProperties } from "react";

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

const slideOffsetSeconds = 8.5;

function externalLinkProps(url: string) {
  return url.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {};
}

export function HomeFeatureCarousel({ slides }: HomeFeatureCarouselProps) {
  if (!slides.length) return null;

  const [animationCycle, setAnimationCycle] = useState(0);
  const [startIndex, setStartIndex] = useState(0);
  const animationStyle = {
    "--home-carousel-delay": `-${startIndex * slideOffsetSeconds}s`
  } as CSSProperties;
  const trackSlides = slides.length > 1 ? [slides[slides.length - 1], ...slides, slides[0]] : slides;

  function selectSlide(index: number) {
    setStartIndex(index);
    setAnimationCycle((cycle) => cycle + 1);
  }

  return (
    <section
      className="home-feature-carousel"
      aria-label="注目コンテンツ"
      style={animationStyle}
    >
      <p className="home-feature-carousel__eyebrow">PICK UP</p>
      <div key={animationCycle} className="home-feature-carousel__animation-layer">
        <div className="home-feature-carousel__viewport">
          <div className="home-feature-carousel__track">
            {trackSlides.map((slide, index) => (
              slide.href ? (
                <a
                  key={`${slide.imageUrl}-${index}`}
                  className={`home-feature-carousel__slide tone-${slide.tone}${slide.artwork ? " is-artwork" : ""}${slide.fillFrame ? " is-fill-frame" : ""}`}
                  href={slide.href}
                  aria-label={slide.linkAriaLabel || `${slide.imageAlt || slide.title || slide.label}を開く`}
                  {...externalLinkProps(slide.href)}
                >
                  <img src={slide.imageUrl} alt={slide.imageAlt || ""} loading={index <= 2 ? "eager" : "lazy"} />
                </a>
              ) : (
                <div
                  key={`${slide.imageUrl}-${index}`}
                  className={`home-feature-carousel__slide tone-${slide.tone}${slide.artwork ? " is-artwork" : ""}${slide.fillFrame ? " is-fill-frame" : ""}`}
                >
                  <img src={slide.imageUrl} alt={slide.imageAlt || ""} loading={index <= 2 ? "eager" : "lazy"} />
                </div>
              )
            ))}
          </div>
        </div>
        <div className="home-feature-carousel__indicators" aria-label="スライドを選択">
          {slides.map((slide, index) => (
            <button
              key={`${slide.imageUrl}-${index}-indicator`}
              type="button"
              aria-label={`${(slide.title || slide.label || `スライド${index + 1}`).replace(/\n/g, "")}を表示`}
              onClick={() => selectSlide(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
