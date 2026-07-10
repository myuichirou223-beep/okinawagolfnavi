"use client";

import { useState, type CSSProperties } from "react";

const slideOffsetSeconds = 8.5;

export function ShopsHeroCarousel() {
  const [animationCycle, setAnimationCycle] = useState(0);
  const [startIndex, setStartIndex] = useState(0);
  const animationStyle = {
    "--shops-carousel-delay": `-${startIndex * slideOffsetSeconds}s`
  } as CSSProperties;

  function selectSlide(index: number) {
    setStartIndex(index);
    setAnimationCycle((cycle) => cycle + 1);
  }

  function renderShopImage(
    desktopSrc: string,
    mobileSrc: string,
    className?: string
  ) {
    return (
      <picture>
        <source media="(max-width: 760px)" srcSet={mobileSrc} />
        <img className={className} src={desktopSrc} alt="" />
      </picture>
    );
  }

  return (
    <div className="shops-hero__media" style={animationStyle}>
      <div key={animationCycle} className="shops-hero__animation-layer">
        <div className="shops-hero__carousel">
          <div className="shops-hero__carousel-track">
            <a
              className="shops-hero__slide-link"
              href="https://www.okinawagolfclub.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="OKINAWA GOLF CLUBのページを開く"
            >
              {renderShopImage(
                "/assets/shops/okinawa-golf-club-2.png",
                "/assets/shops/okinawa-golf-club-mobile.png",
                "is-contain"
              )}
            </a>
            <a
              className="shops-hero__slide-link"
              href="https://www.supersports.co.jp/pgatour-superstore/store-okinawatoyosaki/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="PGA TOUR SUPERSTORE 沖縄豊崎店のページを開く"
            >
              {renderShopImage(
                "/assets/shops/PGASTORE.png",
                "/assets/shops/PGASTORE-mobile.png",
                "is-pga-store"
              )}
            </a>
            <a
              className="shops-hero__slide-link"
              href="https://mangasouko-okinawa.com/naha/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="マンガ倉庫 那覇店のページを開く"
            >
              {renderShopImage(
                "/assets/shops/manga-souko.png",
                "/assets/shops/manga-souko-mobile.png"
              )}
            </a>
            <a
              className="shops-hero__slide-link"
              href="https://www.okinawagolfclub.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="OKINAWA GOLF CLUBのページを開く"
            >
              {renderShopImage(
                "/assets/shops/okinawa-golf-club-2.png",
                "/assets/shops/okinawa-golf-club-mobile.png",
                "is-contain"
              )}
            </a>
            <a
              className="shops-hero__slide-link"
              href="https://www.supersports.co.jp/pgatour-superstore/store-okinawatoyosaki/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="PGA TOUR SUPERSTORE 沖縄豊崎店のページを開く"
            >
              {renderShopImage(
                "/assets/shops/PGASTORE.png",
                "/assets/shops/PGASTORE-mobile.png",
                "is-pga-store"
              )}
            </a>
            <a
              className="shops-hero__slide-link"
              href="https://mangasouko-okinawa.com/naha/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="マンガ倉庫 那覇店のページを開く"
            >
              {renderShopImage(
                "/assets/shops/manga-souko.png",
                "/assets/shops/manga-souko-mobile.png"
              )}
            </a>
          </div>
        </div>
        <div className="shops-hero__indicators" aria-label="スライドを選択">
          {[0, 1, 2].map((index) => (
            <button
              key={index}
              type="button"
              aria-label={`スライド${index + 1}を表示`}
              onClick={() => selectSlide(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
