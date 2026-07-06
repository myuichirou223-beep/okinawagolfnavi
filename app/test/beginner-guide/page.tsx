import { DesktopSidebarLayout } from "../../components/DesktopSidebarLayout";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { BeginnerRouteSwitcher } from "./BeginnerRouteSwitcher";
import {
  articlePath,
  courseImages,
  getArticles,
  getCourses,
  getGolfShops,
  getPracticeRanges,
  type Article,
  type Course,
  type GolfShop,
  type PracticeRange
} from "../../../lib/microcms";
import { Fragment, type CSSProperties } from "react";

export const revalidate = 300;

export const metadata = {
  title: "ゴルフデビューガイド",
  description:
    "おきなわGOLFなびの初心者専用テストページ。自分に合うスタートルートからコースデビューまでを案内します。"
};

const beginnerAssets = {
  heroBg: "/assets/beginner/okinawa-course-hero.png",
  heroTop: "/assets/beginner/top-beginner-guide.png",
  mainCharacter: "/assets/beginner/yui-main.png",
  characterPointing: "/assets/beginner/yui-pointing.png",
  characterSmile: "/assets/beginner/yui-smile.png",
  characterCheer: "/assets/beginner/yui-cheer.png",
  course1: "/assets/hero/okinawa-golf-info-poster.png",
  course2: "/assets/hero/okinawa-golf-navi-main.jpg",
  course3: "/assets/hero/beginner-step-05-debut.png"
};

const commonSteps = [
  {
    step: "02",
    title: "マイギアとウェアを選ぼう",
    body: "最初はハーフセット（7〜9本）で十分。シューズは練習場で足に馴染ませておきましょう。",
    message: "お気に入りの服やクラブが見つかると、モチベーションがグッと上がるよ！",
    character: "smile"
  },
  {
    step: "03",
    title: "これだけは守るルールとマナー",
    body: "「プレーは素早く」「グリーン上は走らない」「襟付きのシャツを着る」から覚えれば大丈夫。",
    message: "ルールは全部覚えなくて大丈夫。周りの人が気持ちよくプレーできれば満点だよ！",
    character: "point"
  },
  {
    step: "04",
    title: "ついに！コースデビュー！",
    body: "ロストボール15個、ティー、マーカーを持って、朝は1時間前に到着しましょう。",
    message: "いよいよ本番！緑の芝生を満喫して、とにかく楽しんできてね♪",
    character: "cheer"
  }
];

const lessonFacilityTargets = ["eXGOLFLAB", "サンシャイン牧港", "北谷インドア"];
const indoorRangeTargets = ["ゴルフラウンジサンシャイン牧港", "森川ゴルフガーデン", "西原グリーンセンター"];
const courseTargets = ["芭蕉布コース", "南山カントリー", "大西"];

type RecommendationCard = {
  title: string;
  lead: string;
  body: string;
  image: string;
  href?: string;
};

const articleLinks = [
  "初心者が最初に\n覚えたいマナー5選",
  "ゴルフ練習場の\n使い方をやさしく解説",
  "コースデビュー前日の\nチェックリスト"
];

function GuideCharacter({ type = "main", image, label }: { type?: string; image?: string; label: string }) {
  return (
    <figure className={`beginner-guide__character is-${type}`} aria-label={label}>
      {image ? <img src={image} alt="" loading="lazy" /> : <span aria-hidden="true" />}
    </figure>
  );
}

function GuideIcon({ name }: { name: string }) {
  return <span className={`beginner-guide__icon is-${name}`} aria-hidden="true" />;
}

function characterImageFor(type: string) {
  if (type === "cheer") return beginnerAssets.characterCheer;
  if (type === "point") return beginnerAssets.characterPointing;
  return beginnerAssets.characterSmile;
}

function normalizeRecommendationText(value: string) {
  return value
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[・･\-_（）()]/g, "");
}

function recommendationMatches(value: string, target: string) {
  const normalizedValue = normalizeRecommendationText(value);
  const normalizedTarget = normalizeRecommendationText(target);
  return normalizedValue.includes(normalizedTarget) || normalizedTarget.includes(normalizedValue);
}

function firstText(...values: Array<string | undefined>) {
  return values.find((value) => value?.trim())?.trim() || "";
}

function rangeDisplayCategory(category?: string) {
  if (!category) return "";
  if (category.includes("屋内")) return category.replace("屋内", "室内");
  return category;
}

function courseDebutDayArticlePath(articles: Article[]) {
  const keywords = ["ゴルフ場デビュー", "コースデビュー", "当日", "動き", "マナー", "スループレー"];
  const rankedArticles = articles
    .map((article) => {
      const text = [article.title, article.description, article.category, article.tags].filter(Boolean).join(" ");
      const score = keywords.reduce((total, keyword) => total + (text.includes(keyword) ? 1 : 0), 0);
      return { article, score };
    })
    .filter((item) => item.score >= 2)
    .sort((a, b) => b.score - a.score);

  return rankedArticles[0] ? articlePath(rankedArticles[0].article) : "/articles";
}

function courseToRecommendation(course: Course, fallbackImage: string): RecommendationCard {
  const lead = [course.city || course.area, course.courseType].filter(Boolean).join(" / ");

  return {
    title: course.title,
    lead: lead || "初心者にもおすすめ",
    body: firstText(course.summary, course.features, course.airportAccess) || "CMSに登録された施設情報からおすすめ表示しています。",
    image: courseImages(course)[0]?.url || fallbackImage,
    href: `/courses/${course.slug}`
  };
}

function practiceRangeToRecommendation(range: PracticeRange, fallbackImage: string): RecommendationCard {
  const lead = [range.area, rangeDisplayCategory(range.category)].filter(Boolean).join(" / ");

  return {
    title: range.name,
    lead: lead || "練習しやすい",
    body: firstText(range.summary, range.features, range.accessFromNaha, range.address) || "CMSに登録された施設情報からおすすめ表示しています。",
    image: range.imageUrl || "/assets/logo.png",
    href: "/practice"
  };
}

function golfShopToRecommendation(shop: GolfShop): RecommendationCard {
  const lead = [shop.city || shop.area, shop.storeSize, shop.productCondition].filter(Boolean).join(" / ");

  return {
    title: shop.name,
    lead: lead || "ショップ",
    body: firstText(shop.summary, shop.address) || "CMSに登録されたショップ情報からおすすめ表示しています。",
    image: shop.imageUrl || "/assets/logo.png",
    href: "/shops"
  };
}

function seededScore(seed: string, value: string) {
  let hash = 0;
  const text = `${seed}:${value}`;
  for (let index = 0; index < text.length; index += 1) {
    hash = (hash * 31 + text.charCodeAt(index)) >>> 0;
  }
  return hash;
}

function dailyRandomItems<T>(items: T[], count: number, seed: string, keyForItem: (item: T) => string) {
  return [...items]
    .sort((a, b) => seededScore(seed, keyForItem(a)) - seededScore(seed, keyForItem(b)))
    .slice(0, count);
}

function pickRecommendedCourses(courses: Course[]) {
  const fallbackImages = [beginnerAssets.course1, beginnerAssets.course2, beginnerAssets.course3];

  return courseTargets.map((target, index) => {
    const course = courses.find((item) => recommendationMatches(item.title, target));
    return course
      ? courseToRecommendation(course, fallbackImages[index])
      : {
          title: target,
          lead: "CMS登録待ち",
          body: "該当施設がCMSに見つかったら自動で正式情報に切り替わります。",
          image: fallbackImages[index]
        };
  });
}

function pickRecommendedPracticeRanges(ranges: PracticeRange[], targets: string[], fallbackImages: string[]) {
  const cmsRanges = ranges.filter((range) => range.source !== "fallback");

  return targets.map((target, index) => {
    const range = cmsRanges.find((item) => recommendationMatches(item.name, target));
    return range
      ? practiceRangeToRecommendation(range, fallbackImages[index])
      : {
          title: target,
          lead: "CMS情報を参照",
          body: "CMSの施設写真と紹介文が登録されると、この枠に正式情報が表示されます。",
          image: "/assets/logo.png"
        };
  });
}

function uniquePracticeRanges(ranges: PracticeRange[]) {
  const seen = new Set<string>();
  return ranges.filter((range) => {
    const key = range.id || range.name;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function looksLikeLessonFacility(range: PracticeRange) {
  const text = [range.name, range.category, range.address, range.accessFromNaha].filter(Boolean).join(" ");
  return /レッスン|lesson|スクール|コーチ|フォーム|分析|ラボ|lab/i.test(text);
}

function pickPickupPracticeRanges(ranges: PracticeRange[], seed: string) {
  const fallbackImages = [
    "/assets/hero/beginner-step-02-simulator.png",
    "/assets/hero/beginner-step-01-range.png",
    "/assets/partners/golf-lounge-sunshine-logo.png"
  ];

  return dailyRandomItems(ranges, 6, `${seed}:practice`, (range) => range.id || range.name).map((range, index) =>
    practiceRangeToRecommendation(range, fallbackImages[index % fallbackImages.length])
  );
}

function pickPickupLessonFacilities(ranges: PracticeRange[], seed: string) {
  const fallbackImages = [
    "/assets/hero/beginner-step-03-gear.png",
    "/assets/hero/beginner-step-02-simulator.png",
    "/assets/hero/beginner-step-01-range.png"
  ];
  const lessonCandidates = ranges.filter(looksLikeLessonFacility);
  const candidates = uniquePracticeRanges([...lessonCandidates, ...ranges]);

  return dailyRandomItems(candidates, 6, `${seed}:lesson`, (range) => range.id || range.name).map((range, index) =>
    practiceRangeToRecommendation(range, fallbackImages[index % fallbackImages.length])
  );
}

function pickPickupCourses(courses: Course[], seed: string) {
  const fallbackImages = [beginnerAssets.course1, beginnerAssets.course2, beginnerAssets.course3];

  return dailyRandomItems(courses, 6, `${seed}:courses`, (course) => course.id || course.slug || course.title).map((course, index) =>
    courseToRecommendation(course, fallbackImages[index % fallbackImages.length])
  );
}

function pickRecommendedGolfShops(shops: GolfShop[]) {
  const cmsShops = shops.filter((shop) => shop.source !== "fallback");
  if (cmsShops.length) return cmsShops.slice(0, 3).map(golfShopToRecommendation);

  return ["ショップ情報 1", "ショップ情報 2", "ショップ情報 3"].map((title) => ({
    title,
    lead: "CMS情報を参照",
    body: "CMSの施設写真と紹介文が登録されると、この枠に正式情報が表示されます。",
    image: "/assets/logo.png",
    href: "/shops"
  }));
}

function recommendationGrid(cards: RecommendationCard[]) {
  return cards.map((card) => (
    <article key={card.title} className="beginner-guide__course-card">
      <img src={card.image} alt="" loading="lazy" />
      <div>
        <h3>{card.title}</h3>
        <strong>{card.lead}</strong>
        <p>{card.body}</p>
        {card.href ? <a href={card.href}>詳しく見る</a> : null}
      </div>
    </article>
  ));
}

export default async function BeginnerGuideTestPage() {
  const [courses, practiceRanges, golfShops, articles] = await Promise.all([getCourses(), getPracticeRanges(), getGolfShops(), getArticles()]);
  const recommendedLessonFacilities = pickRecommendedPracticeRanges(practiceRanges, lessonFacilityTargets, [
    "/assets/hero/beginner-step-03-gear.png",
    "/assets/hero/beginner-step-02-simulator.png",
    "/assets/hero/beginner-step-01-range.png"
  ]);
  const recommendedIndoorRanges = pickRecommendedPracticeRanges(practiceRanges, indoorRangeTargets, [
    "/assets/hero/beginner-step-02-simulator.png",
    "/assets/hero/beginner-step-01-range.png",
    "/assets/partners/golf-lounge-sunshine-logo.png"
  ]);
  const recommendedCourses = pickRecommendedCourses(courses);
  const recommendedGolfShops = pickRecommendedGolfShops(golfShops);
  const pickupSeed = new Date().toISOString().slice(0, 10);
  const pickupPracticeRanges = pickPickupPracticeRanges(practiceRanges, pickupSeed);
  const pickupLessonFacilities = pickPickupLessonFacilities(practiceRanges, pickupSeed);
  const pickupCourses = pickPickupCourses(courses, pickupSeed);
  const courseDebutArticleHref = courseDebutDayArticlePath(articles);

  return (
    <>
      <Header />
      <DesktopSidebarLayout mainClassName="beginner-guide-page-shell">
        <article className="beginner-guide" aria-labelledby="beginner-guide-title" style={{ "--hero-bg": `url(${beginnerAssets.heroBg})` } as CSSProperties}>
          <section className="beginner-guide__hero">
            <img className="beginner-guide__hero-image" src={beginnerAssets.heroTop} alt="" fetchPriority="high" />
            <div className="beginner-guide__hero-copy">
              <p>自分らしく始める！</p>
              <h1 id="beginner-guide-title">ゴルフデビューガイド</h1>
              <div className="beginner-guide__speech">
                ゴルフの始め方は1つじゃないよ！<br />
                あなたにぴったりのスタートルートを<br />
                選んでね♪
              </div>
            </div>
            <GuideCharacter type="hero" image={beginnerAssets.mainCharacter} label="ゴルフデビューを案内する女性キャラクター" />
          </section>

          <section className="beginner-guide__panel" aria-labelledby="beginner-route-title">
            <h2 id="beginner-route-title" className="beginner-guide__section-title">
              <GuideIcon name="flag" />
              まずはスタートルートを選ぼう
            </h2>

            <BeginnerRouteSwitcher
              selfPacedRecommendations={recommendedIndoorRanges}
              lessonRecommendations={recommendedLessonFacilities}
            />

            <section className="beginner-guide__steps" aria-labelledby="beginner-common-step-title">
              <h2 id="beginner-common-step-title" className="beginner-guide__section-title">
                <GuideIcon name="flag" />
                次はみんな共通のステップへ
              </h2>
              <div className="beginner-guide__timeline">
                {commonSteps.map((item) => (
                  <Fragment key={item.step}>
                    <article className="beginner-guide__step">
                      <span className="beginner-guide__step-dot" aria-hidden="true" />
                      <div className="beginner-guide__step-copy">
                        <span>STEP {item.step}</span>
                        <h3>{item.title}</h3>
                        <p>{item.body}</p>
                      </div>
                      <div className="beginner-guide__step-message">
                        <p>{item.message}</p>
                        <GuideCharacter type={item.character} image={characterImageFor(item.character)} label="応援する女性キャラクター" />
                      </div>
                    </article>
                    {item.step === "02" && recommendedGolfShops.length ? (
                      <section className="beginner-guide__step-shops" aria-labelledby="beginner-step-shop-title">
                        <h3 id="beginner-step-shop-title" className="beginner-guide__section-title">
                          <GuideIcon name="flag" />
                          初心者におすすめのショップ
                        </h3>
                        <div className="beginner-guide__course-grid">
                          {recommendationGrid(recommendedGolfShops)}
                        </div>
                      </section>
                    ) : null}
                    {item.step === "03" ? (
                      <figure className="beginner-guide__step-image">
                        <img src="/assets/beginner/step-03-manners.png" alt="ゴルフデビュー前に覚えたい最低限のマナー" loading="lazy" />
                      </figure>
                    ) : null}
                    {item.step === "04" ? (
                      <figure className="beginner-guide__step-image">
                        <img src="/assets/beginner/step-04-course-arrival.png" alt="ゴルフ場デビュー前の到着から準備までの流れ" loading="lazy" />
                      </figure>
                    ) : null}
                    {item.step === "04" ? (
                      <a className="beginner-guide__article-banner" href={courseDebutArticleHref} aria-label="ゴルフ場デビュー当日の動きとマナー解説の記事を読む">
                        <img src="/assets/beginner/course-debut-day-guide.png" alt="" loading="lazy" />
                      </a>
                    ) : null}
                  </Fragment>
                ))}
              </div>
            </section>
          </section>

          <section className="beginner-guide__panel is-compact" aria-labelledby="beginner-pickup-practice-title">
            <h2 id="beginner-pickup-practice-title" className="beginner-guide__section-title">
              <GuideIcon name="flag" />
              ピックアップ練習場
            </h2>
            <div className="beginner-guide__course-grid">
              {recommendationGrid(pickupPracticeRanges)}
            </div>
          </section>

          <section className="beginner-guide__panel is-compact" aria-labelledby="beginner-pickup-lesson-title">
            <h2 id="beginner-pickup-lesson-title" className="beginner-guide__section-title">
              <GuideIcon name="flag" />
              ピックアップレッスン施設
            </h2>
            <div className="beginner-guide__course-grid">
              {recommendationGrid(pickupLessonFacilities)}
            </div>
          </section>

          <section className="beginner-guide__panel is-compact" aria-labelledby="beginner-pickup-course-title">
            <h2 id="beginner-pickup-course-title" className="beginner-guide__section-title">
              <GuideIcon name="flag" />
              ピックアップゴルフ場
            </h2>
            <div className="beginner-guide__course-grid">
              {recommendationGrid(pickupCourses)}
            </div>
          </section>

          <section className="beginner-guide__articles" aria-labelledby="beginner-article-title">
            <h2 id="beginner-article-title" className="beginner-guide__section-title">
              <GuideIcon name="book" />
              お役立ち記事
            </h2>
            <div className="beginner-guide__article-grid">
              {articleLinks.map((title) => (
                <a key={title} className="beginner-guide__article-link" href="#">
                  <GuideIcon name="clipboard" />
                  <strong>
                    {title.split("\n").map((line) => (
                      <span key={line}>{line}</span>
                    ))}
                  </strong>
                  <i aria-hidden="true" />
                </a>
              ))}
            </div>
          </section>

          <section className="beginner-guide__cta" aria-labelledby="beginner-guide-cta-title">
            <GuideCharacter type="cta" image={beginnerAssets.characterSmile} label="安心して楽しもうと伝える女性キャラクター" />
            <div className="beginner-guide__cta-balloon">
              あなたのペースで<br />
              大丈夫♪<br />
              一緒に楽しもう！
            </div>
            <div className="beginner-guide__cta-copy">
              <h2 id="beginner-guide-cta-title">次の一歩を踏み出そう</h2>
              <div className="beginner-guide__cta-actions">
                <a className="beginner-guide__button is-primary" href="/lessons">
                  体験レッスンを探す
                </a>
                <a className="beginner-guide__button is-secondary" href="/articles">
                  初心者向け記事を見る
                </a>
              </div>
            </div>
          </section>
        </article>
      </DesktopSidebarLayout>
      <Footer />
    </>
  );
}
