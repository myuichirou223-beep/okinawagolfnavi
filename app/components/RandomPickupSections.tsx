"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";

const advertisingContactUrl = "https://forms.gle/SKkamSAieuaUjuTW6";

export type PickupCourse = {
  id: string;
  title: string;
  href: string;
  imageUrl: string;
  area: string;
  city?: string;
  courseType?: string;
  tags: string[];
  isVisible?: boolean;
};

export type PickupPracticeRange = {
  id: string;
  title: string;
  href: string;
  imageUrl: string;
  area: string;
  city?: string;
  tags: string[];
  isVisible?: boolean;
};

type RandomPickupSectionsProps = {
  courses: PickupCourse[];
  practiceRanges: PickupPracticeRange[];
};

function pickRandomItems<T extends { isVisible?: boolean }>(items: T[], count = 4) {
  const visibleItems = items.filter((item) => item.isVisible !== false);
  return [...visibleItems].sort(() => Math.random() - 0.5).slice(0, count);
}

function isExternalUrl(url: string) {
  return url.startsWith("http");
}

type PickupItem = PickupCourse | PickupPracticeRange;

function PickupCarousel({
  items,
  label,
  layout = "feature",
  listHref,
  listLabel = "すべてのゴルフ場",
  itemLabel = "ゴルフ場"
}: {
  items: PickupItem[];
  label: string;
  layout?: "feature" | "showcase";
  listHref?: string;
  listLabel?: string;
  itemLabel?: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    setActiveIndex(0);
  }, [items]);

  useEffect(() => {
    if (items.length < 2) return undefined;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % items.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [items.length]);

  if (!items.length) return null;

  const activeItem = items[activeIndex] ?? items[0];
  const sideItems = Array.from({ length: Math.min(3, items.length - 1) }, (_, index) => {
    const itemIndex = (activeIndex + index + 1) % items.length;
    return { item: items[itemIndex], index: itemIndex };
  });
  const externalProps = isExternalUrl(activeItem.href) ? { target: "_blank", rel: "noreferrer" } : {};

  function changeSlide(direction: number) {
    setActiveIndex((current) => (current + direction + items.length) % items.length);
  }

  function handleTouchEnd(event: React.TouchEvent<HTMLElement>) {
    if (touchStartX.current === null) return;
    const delta = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 42) return;
    changeSlide(delta > 0 ? -1 : 1);
  }

  if (layout === "showcase") {
    const previousIndex = (activeIndex - 1 + items.length) % items.length;
    const nextIndex = (activeIndex + 1) % items.length;
    const previousItem = items[previousIndex];
    const nextItem = items[nextIndex];

    return (
      <div
        className="pickup-showcase"
        aria-label={label}
        onTouchStart={(event) => {
          touchStartX.current = event.touches[0].clientX;
        }}
        onTouchEnd={handleTouchEnd}
      >
        <div className="pickup-showcase-viewport" aria-live="polite">
          <button
            key={`previous-${previousItem.id}-${activeIndex}`}
            type="button"
            className="pickup-showcase-card is-side is-previous"
            onClick={() => setActiveIndex(previousIndex)}
            aria-label={`${previousItem.title}を表示`}
          >
            <img src={previousItem.imageUrl} alt="" />
            <span className="pickup-showcase-shade" />
            <span className="pickup-showcase-side-title">{previousItem.title}</span>
          </button>

          <article key={`active-${activeItem.id}`} className="pickup-showcase-card is-active">
            <a href={activeItem.href} {...externalProps}>
              <img src={activeItem.imageUrl} alt="" />
              <span className="pickup-showcase-shade" />
              <div className="pickup-showcase-copy">
                <p>{[activeItem.area, activeItem.city].filter(Boolean).join(" / ")}</p>
                <h3>{activeItem.title}</h3>
                <div className="pickup-carousel-tags">
                  {activeItem.tags.map((tag) => <span key={tag}>{tag}</span>)}
                </div>
              </div>
            </a>
          </article>

          <button
            key={`next-${nextItem.id}-${activeIndex}`}
            type="button"
            className="pickup-showcase-card is-side is-next"
            onClick={() => setActiveIndex(nextIndex)}
            aria-label={`${nextItem.title}を表示`}
          >
            <img src={nextItem.imageUrl} alt="" />
            <span className="pickup-showcase-shade" />
            <span className="pickup-showcase-side-title">{nextItem.title}</span>
          </button>
        </div>

        <div className="pickup-showcase-controls">
          <button type="button" onClick={() => changeSlide(-1)} aria-label={`前の${itemLabel}`}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m15 5-7 7 7 7" />
            </svg>
          </button>
          {listHref ? <a href={listHref}>{listLabel}</a> : <span>{label}</span>}
          <button type="button" onClick={() => changeSlide(1)} aria-label={`次の${itemLabel}`}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m9 5 7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="pickup-carousel"
      aria-label={label}
      onTouchStart={(event) => {
        touchStartX.current = event.touches[0].clientX;
      }}
      onTouchEnd={handleTouchEnd}
    >
      <div className="pickup-carousel-grid" aria-live="polite">
        <article className="pickup-carousel-main">
          <a href={activeItem.href} {...externalProps}>
            <img src={activeItem.imageUrl} alt="" />
            <span className="pickup-carousel-overlay" />
            <div className="pickup-carousel-copy">
              <p>{[activeItem.area, activeItem.city].filter(Boolean).join(" / ")}</p>
              <h3>{activeItem.title}</h3>
              <div className="pickup-carousel-tags">
                {activeItem.tags.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
            </div>
          </a>
        </article>
        <div className="pickup-carousel-side">
          {sideItems.map(({ item, index }) => (
            <button key={item.id} type="button" onClick={() => setActiveIndex(index)} aria-label={`${item.title}を表示`}>
              <img src={item.imageUrl} alt="" />
              <span className="pickup-carousel-overlay" />
              <span className="pickup-carousel-side-copy">
                <strong>{item.title}</strong>
                <small>{[item.area, item.city].filter(Boolean).join(" / ")}</small>
              </span>
            </button>
          ))}
        </div>
      </div>
      <div className="pickup-carousel-dots" aria-label={`${label}のスライドを選択`}>
        {items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className={index === activeIndex ? "is-active" : ""}
            onClick={() => setActiveIndex(index)}
            aria-label={`${index + 1}枚目を表示`}
            aria-current={index === activeIndex ? "true" : undefined}
          />
        ))}
      </div>
      <div
        className="pickup-carousel-thumbnails"
        style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
      >
        {items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className={index === activeIndex ? "is-active" : ""}
            onClick={() => setActiveIndex(index)}
            aria-label={`${item.title}を表示`}
          >
            <img src={item.imageUrl} alt="" />
            <span>{item.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function RandomPickupSections({ courses, practiceRanges }: RandomPickupSectionsProps) {
  const [randomPracticeRanges, setRandomPracticeRanges] = useState<PickupPracticeRange[]>([]);
  const recommendedCourses = courses.filter((course) => course.isVisible !== false).slice(0, 4);

  useEffect(() => {
    setRandomPracticeRanges(pickRandomItems(practiceRanges, 5));
  }, [practiceRanges]);

  return (
    <>
      <section id="courses" className="portal-section pickup-section" aria-labelledby="courses-title">
        <div className="portal-section-heading with-link">
          <div>
            <p className="portal-eyebrow">Golf Course</p>
            <h2 id="courses-title">今週のおすすめゴルフ場</h2>
            <p>沖縄県内のおすすめコースを見やすくご紹介</p>
          </div>
        </div>
        <div className="recommended-course-grid">
          {recommendedCourses.map((course) => (
            <a key={course.id} className="recommended-course-card" href={course.href}>
              <span className="recommended-course-image">
                <img src={course.imageUrl} alt="" loading="lazy" />
              </span>
              <span className="recommended-course-copy">
                <small>{[course.area, course.city].filter(Boolean).join(" / ")}</small>
                <strong>{course.title}</strong>
                <span className="recommended-course-tags">
                  {course.tags.slice(0, 2).map((tag) => <em key={tag}>{tag}</em>)}
                </span>
              </span>
            </a>
          ))}
        </div>
        <a className="recommended-course-more" href="/courses">すべてのゴルフ場を見る</a>
        <aside className="pickup-mobile-ad pickup-mobile-ad-f" aria-label="広告枠F">
          <a href={advertisingContactUrl} target="_blank" rel="noreferrer">
            <span>広告枠 F</span>
            <h2>ショップ・商品広告</h2>
            <strong>広告掲載募集中</strong>
            <p>ゴルフ用品やキャンペーン情報を効果的にPRできます。</p>
            <small>推奨画像 300 × 300px</small>
          </a>
        </aside>
      </section>

      <section className="home-wide-pr-banner pickup-between-ad is-recruiting" aria-label="広告枠I">
        <span>広告枠 I</span>
        <strong>ゴルフ場・練習場ワイド広告 掲載募集中</strong>
        <small>推奨画像 1080 × 148px</small>
        <a href={advertisingContactUrl} target="_blank" rel="noreferrer">掲載のお問い合わせ</a>
      </section>

      <section id="practice" className="portal-section pickup-section" aria-labelledby="practice-title">
        <div className="portal-section-heading with-link">
          <div>
            <p className="portal-eyebrow">Practice Range</p>
            <h2 id="practice-title">ピックアップ練習場</h2>
            <p>沖縄県内の練習場をランダムにピックアップ</p>
          </div>
        </div>
        <div className="pickup-practice-desktop">
          <PickupCarousel
            items={randomPracticeRanges}
            label="ピックアップ練習場"
            layout="showcase"
            listHref="/practice"
            listLabel="すべての練習場"
            itemLabel="練習場"
          />
        </div>
        <div className="pickup-practice-mobile-list">
          {randomPracticeRanges.slice(0, 5).map((range) => (
            <a key={range.id} href={range.href} {...(isExternalUrl(range.href) ? { target: "_blank", rel: "noreferrer" } : {})}>
              <span className="pickup-practice-mobile-image">
                <img src={range.imageUrl} alt="" loading="lazy" />
              </span>
              <span className="pickup-practice-mobile-copy">
                <small>{[range.area, range.city].filter(Boolean).join(" / ")}</small>
                <strong>{range.title}</strong>
                <em>{range.tags[0] || "練習場"}</em>
              </span>
              <i aria-hidden="true">›</i>
            </a>
          ))}
          <a className="pickup-practice-mobile-more" href="/practice">すべての練習場を見る</a>
        </div>
      </section>
    </>
  );
}
