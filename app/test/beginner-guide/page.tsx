import { DesktopSidebarLayout } from "../../components/DesktopSidebarLayout";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { BeginnerRouteSwitcher } from "./BeginnerRouteSwitcher";
import { courseImages, getCourses, getGolfShops, getPracticeRanges, type Course, type GolfShop, type PracticeRange } from "../../../lib/microcms";
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
const indoorRangeTargets = ["サンシャイン牧港", "北谷インドア", "サンシャイン具志川"];
const courseTargets = ["芭蕉布コース", "南山カントリー", "大西"];

type RecommendationCard = {
  title: string;
  lead: string;
  body: string;
  image: string;
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

function courseToRecommendation(course: Course, fallbackImage: string): RecommendationCard {
  const lead = [course.city || course.area, course.courseType].filter(Boolean).join(" / ");

  return {
    title: course.title,
    lead: lead || "初心者にもおすすめ",
    body: firstText(course.summary, course.features, course.airportAccess) || "CMSに登録された施設情報からおすすめ表示しています。",
    image: courseImages(course)[0]?.url || fallbackImage
  };
}

function practiceRangeToRecommendation(range: PracticeRange, fallbackImage: string): RecommendationCard {
  const lead = [range.area, range.category].filter(Boolean).join(" / ");

  return {
    title: range.name,
    lead: lead || "練習しやすい",
    body: firstText(range.accessFromNaha, range.address) || "CMSに登録された施設情報からおすすめ表示しています。",
    image: range.imageUrl || fallbackImage
  };
}

function golfShopToRecommendation(shop: GolfShop): RecommendationCard {
  const lead = [shop.city || shop.area, shop.storeSize, shop.productCondition].filter(Boolean).join(" / ");

  return {
    title: shop.name,
    lead: lead || "ショップ",
    body: firstText(shop.summary, shop.address) || "CMSに登録されたショップ情報からおすすめ表示しています。",
    image: shop.imageUrl || "/assets/logo.png"
  };
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
  return targets.map((target, index) => {
    const range = ranges.find((item) => recommendationMatches(item.name, target));
    return range
      ? practiceRangeToRecommendation(range, fallbackImages[index])
      : {
          title: target,
          lead: "CMS登録待ち",
          body: "該当施設がCMSに見つかったら自動で正式情報に切り替わります。",
          image: fallbackImages[index]
        };
  });
}

function pickRecommendedGolfShops(shops: GolfShop[]) {
  return shops.slice(0, 3).map(golfShopToRecommendation);
}

function recommendationGrid(cards: RecommendationCard[]) {
  return cards.map((card) => (
    <article key={card.title} className="beginner-guide__course-card">
      <img src={card.image} alt="" loading="lazy" />
      <div>
        <h3>{card.title}</h3>
        <strong>{card.lead}</strong>
        <p>{card.body}</p>
      </div>
    </article>
  ));
}

export default async function BeginnerGuideTestPage() {
  const [courses, practiceRanges, golfShops] = await Promise.all([getCourses(), getPracticeRanges(), getGolfShops()]);
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
                  </Fragment>
                ))}
              </div>
            </section>
          </section>

          <section className="beginner-guide__panel is-compact" aria-labelledby="beginner-lesson-title">
            <h2 id="beginner-lesson-title" className="beginner-guide__section-title">
              <GuideIcon name="flag" />
              おすすめのゴルフレッスン施設
            </h2>
            <div className="beginner-guide__course-grid">
              {recommendationGrid(recommendedLessonFacilities)}
            </div>
          </section>

          <section className="beginner-guide__panel is-compact" aria-labelledby="beginner-course-title">
            <h2 id="beginner-course-title" className="beginner-guide__section-title">
              <GuideIcon name="flag" />
              おすすめの沖縄のゴルフ場
            </h2>
            <div className="beginner-guide__course-grid">
              {recommendationGrid(recommendedCourses)}
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
