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

function isExternalUrl(url: string) {
  return url.startsWith("http");
}

export function RandomPickupSections({ courses, practiceRanges }: RandomPickupSectionsProps) {
  const recommendedCourses = courses.filter((course) => course.isVisible !== false).slice(0, 4);
  const recommendedPracticeRanges = practiceRanges.filter((range) => range.isVisible !== false).slice(0, 4);

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

      <section id="practice" className="portal-section pickup-section" aria-labelledby="practice-title">
        <div className="portal-section-heading with-link">
          <div>
            <p className="portal-eyebrow">Practice Range</p>
            <h2 id="practice-title">ピックアップ練習場</h2>
            <p>沖縄県内のおすすめ練習場を見やすくご紹介</p>
          </div>
        </div>
        <div className="recommended-course-grid recommended-practice-grid">
          {recommendedPracticeRanges.map((range) => (
            <a
              key={range.id}
              className="recommended-course-card"
              href={range.href}
              {...(isExternalUrl(range.href) ? { target: "_blank", rel: "noreferrer" } : {})}
            >
              <span className="recommended-course-image">
                <img src={range.imageUrl} alt="" loading="lazy" />
              </span>
              <span className="recommended-course-copy">
                <small>{[range.area, range.city].filter(Boolean).join(" / ")}</small>
                <strong>{range.title}</strong>
                <span className="recommended-course-tags">
                  {range.tags.slice(0, 2).map((tag) => <em key={tag}>{tag}</em>)}
                </span>
              </span>
            </a>
          ))}
        </div>
        <a className="recommended-course-more" href="/practice">すべての練習場を見る</a>
      </section>

      <section className="home-wide-pr-banner pickup-between-ad is-recruiting" aria-label="広告枠I">
        <span>広告枠 I</span>
        <strong>ゴルフ場・練習場ワイド広告 掲載募集中</strong>
        <small>推奨画像 1080 × 148px</small>
        <a href={advertisingContactUrl} target="_blank" rel="noreferrer">掲載のお問い合わせ</a>
      </section>
    </>
  );
}
