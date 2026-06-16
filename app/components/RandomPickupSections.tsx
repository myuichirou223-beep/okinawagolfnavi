"use client";

import { useEffect, useState } from "react";

export type PickupCourse = {
  id: string;
  title: string;
  href: string;
  imageUrl: string;
  area: string;
  city?: string;
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

function pickRandomItems<T extends { isVisible?: boolean }>(items: T[]) {
  const visibleItems = items.filter((item) => item.isVisible !== false);
  return [...visibleItems].sort(() => Math.random() - 0.5).slice(0, 6);
}

function isExternalUrl(url: string) {
  return url.startsWith("http");
}

function PickupCard({ item }: { item: PickupCourse | PickupPracticeRange }) {
  const externalProps = isExternalUrl(item.href) ? { target: "_blank", rel: "noreferrer" } : {};

  return (
    <article className="pickup-card">
      <a href={item.href} {...externalProps}>
        <img src={item.imageUrl} alt="" />
        <div className="pickup-card-body">
          <h3>{item.title}</h3>
          <p>{[item.area, item.city].filter(Boolean).join(" / ")}</p>
          <div className="pickup-tags">
            {item.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <strong>詳細を見る</strong>
        </div>
      </a>
    </article>
  );
}

export function RandomPickupSections({ courses, practiceRanges }: RandomPickupSectionsProps) {
  const [randomCourses, setRandomCourses] = useState<PickupCourse[]>([]);
  const [randomPracticeRanges, setRandomPracticeRanges] = useState<PickupPracticeRange[]>([]);

  useEffect(() => {
    setRandomCourses(pickRandomItems(courses));
    setRandomPracticeRanges(pickRandomItems(practiceRanges));
  }, [courses, practiceRanges]);

  return (
    <>
      <section id="courses" className="portal-section pickup-section" aria-labelledby="courses-title">
        <div className="portal-section-heading with-link">
          <div>
            <p className="portal-eyebrow">Golf Course</p>
            <h2 id="courses-title">今週のおすすめゴルフ場</h2>
            <p>沖縄県内のゴルフ場をランダムにピックアップ</p>
          </div>
          <a className="portal-more-link" href="/courses">一覧を見る</a>
        </div>
        <div className="portal-card-grid six" aria-live="polite">
          {randomCourses.map((course) => (
            <PickupCard key={course.id} item={course} />
          ))}
        </div>
      </section>

      <section id="practice" className="portal-section pickup-section" aria-labelledby="practice-title">
        <div className="portal-section-heading with-link">
          <div>
            <p className="portal-eyebrow">Practice Range</p>
            <h2 id="practice-title">ピックアップ練習場</h2>
            <p>沖縄県内の練習場をランダムにピックアップ</p>
          </div>
          <a className="portal-more-link" href="/practice">一覧を見る</a>
        </div>
        <div className="portal-card-grid six" aria-live="polite">
          {randomPracticeRanges.map((range) => (
            <PickupCard key={range.id} item={range} />
          ))}
        </div>
      </section>
    </>
  );
}
