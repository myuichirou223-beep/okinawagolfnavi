import { DesktopSidebarLayout } from "../components/DesktopSidebarLayout";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { BeginnerChecklist } from "./BeginnerChecklist";

export const metadata = {
  title: "初心者ゴルフ入門ナビ",
  description:
    "未経験者・初心者のために、打ちっぱなし体験からコースデビューまでの準備、持ち物、基本マナーを5ステップで案内します。"
};

const roadmapSteps = [
  {
    step: "01",
    title: "まずは「打ちっぱなし」へGO！",
    timing: "今すぐ必要なもの：グローブ、スニーカー",
    tip: "最初はレンタルクラブでOK。動きやすい私服で、手ぶらに近い感覚から体験できます。",
    icon: "flag",
    image: "/assets/hero/beginner-step-01-range.png",
    imageAlt: "打ちっぱなし練習場のイメージ",
    tone: "mint",
    spots: [
      { title: "波之上ゴルフ練習場", label: "屋外", note: "那覇市周辺でアクセスしやすい定番の打ちっぱなし。", href: "/practice", group: "屋外" },
      { title: "森川ゴルフガーデン", label: "屋外", note: "中部エリアで屋外練習を始めたい人の候補。", href: "/practice", group: "屋外" },
      { title: "豊見城ゴルフ練習場", label: "屋外", note: "南部エリアで仕事帰りの練習にも寄りやすい。", href: "/practice", group: "屋外" },
      { title: "ゴルフラウンジSUNSHINE牧港", label: "屋内", note: "天候を気にせず、はじめての練習をしやすい屋内施設。", href: "/practice", group: "屋内" },
      { title: "みんなのゴルフ", label: "屋内", note: "気軽に始めたい初心者向けの屋内練習候補。", href: "/practice", group: "屋内" },
      { title: "eXGOLF LAB", label: "屋内", note: "シミュレーターや分析系の練習を試したい人へ。", href: "/practice", group: "屋内" }
    ]
  },
  {
    step: "02",
    title: "シミュレーション＆ショートコース",
    timing: "実戦感覚をプチ体験",
    tip: "天候を気にせず楽しめるシミュレーションや、短いコースで雰囲気に慣れていきましょう。",
    icon: "screen",
    image: "/assets/hero/beginner-step-02-simulator.png",
    imageAlt: "ゴルフシミュレーター練習場のイメージ",
    tone: "yellow",
    spots: [
      { title: "ゴルフラウンジSUNSHINE牧港", label: "シミュレーション", note: "天候を気にせず、室内でコース気分を試しやすい。", href: "/practice", group: "シミュレーション" },
      { title: "みんなのゴルフ", label: "シミュレーション", note: "初心者同士でも気軽に体験しやすい屋内候補。", href: "/practice", group: "シミュレーション" },
      { title: "ゴルフラウンジSUNSHINE具志川", label: "シミュレーション", note: "中部エリアでシミュレーション練習を試したい人へ。", href: "/practice", group: "シミュレーション" },
      { title: "パブリックゴルフうらそえ", label: "ショートコース", note: "短い距離から実戦感覚をつかみたい人の候補。", href: "/courses", group: "ショートコース" },
      { title: "西原グリーンセンター", label: "ショートコース", note: "練習の延長でコースの流れに慣れやすい。", href: "/courses", group: "ショートコース" },
      { title: "マリンタウンゴルフ", label: "ショートコース", note: "コースデビュー前のプチ実戦に使いやすい候補。", href: "/courses", group: "ショートコース" }
    ]
  },
  {
    step: "03",
    title: "マイギアとウェアを選ぼう",
    timing: "1〜2ヶ月前：マイクラブ、シューズ、キャディバッグ",
    tip: "最初はハーフセットで十分。シューズは練習場で履き慣らしておくと安心です。",
    icon: "bag",
    image: "/assets/hero/beginner-step-03-gear.png",
    imageAlt: "ゴルフクラブとシューズとキャディバッグのイメージ",
    tone: "mint",
    spots: [
      { title: "マンガ倉庫 那覇店", label: "ギア探し", note: "クラブや小物をまずは手頃に探したい人の候補。", href: "/deals" },
      { title: "練習場でシューズを慣らす", label: "実践準備", note: "買ったシューズはラウンド前に履き心地を確認。", href: "/practice" },
      { title: "お得情報ページ", label: "ショップ", note: "ゴルフ用品やサービス情報をまとめて確認。", href: "/deals" }
    ]
  },
  {
    step: "04",
    title: "これだけは！基本マナー＆ルール",
    timing: "2週間前：襟付きゴルフウェアを確認",
    tip: "プレーファスト、グリーンの上は走らない、ドレスコードを守る。この3つから押さえれば大丈夫。",
    icon: "shirt",
    image: "/assets/hero/beginner-step-04-wear.png",
    imageAlt: "襟付きゴルフウェアのイメージ",
    tone: "orange",
    recommendationTitle: "おすすめ記事",
    spots: [
      { title: "初心者向けルール記事", label: "ルール", note: "当日あわてないための基本だけを先に確認。", href: "/articles/beginner-guide.html" },
      { title: "レッスン情報", label: "相談", note: "マナーや構え方をプロに聞きたい人はこちら。", href: "/lessons" },
      { title: "大会情報の見方", label: "読み物", note: "募集要項や注意事項の読み方にも慣れておく。", href: "/articles/tournament-checklist.html" }
    ]
  },
  {
    step: "05",
    title: "ついに！コースデビュー！",
    timing: "直前・前日：ボール15個、ティー、マーカー、フォーク",
    tip: "当日は1時間前に到着。スコアよりも、楽しんだ人が勝ちです。",
    icon: "ball",
    image: "/assets/hero/beginner-step-05-debut.png",
    imageAlt: "コースデビューを表すピンフラッグとゴルフボールのイメージ",
    tone: "coral",
    spots: [
      { title: "南山カントリークラブ", label: "南部", note: "コースデビュー候補として検討しやすい南部エリアのゴルフ場。", href: "/courses" },
      { title: "知花ゴルフコース", label: "中部", note: "中部エリアで気軽にラウンド候補を探したい人へ。", href: "/courses" },
      { title: "オーシャンキャッスルカントリークラブ", label: "中城村", note: "景観も楽しみながら初ラウンド気分を高めたい人へ。", href: "/courses" }
    ]
  }
];

const courseCards = [
  {
    label: "初心者にやさしい",
    title: "かねひで喜瀬カントリークラブ",
    copy: "開放感のある景観で、沖縄らしいリゾートゴルフを体験しやすいコース。",
    href: "/courses",
    image: "/assets/hero/okinawa-golf-navi-main.jpg",
    tags: ["名護市", "リゾート"]
  },
  {
    label: "ショートコースあり",
    title: "エメラルドコーストゴルフリンクス",
    copy: "海風を感じながら、本番に近い雰囲気を短い距離から試せます。",
    href: "/courses",
    image: "/assets/hero/okinawa-golf-info-poster.png",
    tags: ["宮古島", "ショート"]
  },
  {
    label: "フラットで安心",
    title: "南風原カントリークラブ",
    copy: "那覇近郊からアクセスしやすく、デビュー前の下見にも向いたコース。",
    href: "/courses",
    image: "/assets/hero-golfer.jpg",
    tags: ["南部", "カジュアル"]
  }
];

const articleCards = [
  { title: "ゴルフの基本ルールをやさしく解説", href: "/articles", label: "ルール", tone: "mint" },
  { title: "覚えておきたい！ゴルフ場のマナー", href: "/articles", label: "マナー", tone: "yellow" },
  { title: "初心者におすすめのクラブ・ウェアの選び方", href: "/articles", label: "ギア選び", tone: "mint" },
  { title: "コースデビュー当日の流れとポイント", href: "/articles", label: "デビュー", tone: "coral" }
];

const lessonBenefits = [
  {
    title: "変なクセがつく前に直せる",
    copy: "最初にグリップ・構え・振り方を見てもらうだけで、遠回りをかなり減らせます。"
  },
  {
    title: "何を練習すればいいか分かる",
    copy: "打ちっぱなしで闇雲に打つより、今日やることが明確になるので上達を感じやすくなります。"
  },
  {
    title: "コースデビューの不安が減る",
    copy: "マナー、持ち物、当日の流れまで相談できると、初ラウンドを楽しむ余裕が生まれます。"
  }
];

const lessonFacilities = [
  {
    title: "eXGOLF LAB",
    area: "分析・屋内",
    image: "/assets/hero/beginner-step-02-simulator.png",
    copy: "スイング分析やシミュレーター練習で、自分のクセを見える化したい人へ。"
  },
  {
    title: "ゴルフラウンジSUNSHINE牧港",
    area: "浦添・屋内",
    image: "/assets/partners/golf-lounge-sunshine-logo.png",
    copy: "天候を気にせず通いやすく、初心者の体験レッスン候補にしやすい施設。"
  },
  {
    title: "北谷インドアゴルフ",
    area: "北谷・屋内",
    image: "/assets/hero/beginner-step-02-simulator.png",
    copy: "中部エリアで、仕事帰りや休日にレッスンを受けたい人におすすめ。"
  }
];

function StepIcon({ name, image, imageAlt }: { name: string; image?: string; imageAlt?: string }) {
  if (image) {
    return (
      <span className="beginner-step-visual is-image">
        <img src={image} alt={imageAlt || ""} loading="lazy" />
      </span>
    );
  }

  return <span className={`beginner-step-visual is-${name}`} aria-hidden="true" />;
}

type RoadmapSpot = {
  title: string;
  label: string;
  note: string;
  href: string;
  group?: string;
};

function SpotCard({ spot }: { spot: RoadmapSpot }) {
  return (
    <a className="beginner-spot-card" href={spot.href}>
      <span>{spot.label}</span>
      <b>{spot.title}</b>
      <em>{spot.note}</em>
    </a>
  );
}

function StepSpots({ title, heading = "おすすめスポット", spots }: { title: string; heading?: string; spots: RoadmapSpot[] }) {
  const groups = spots.reduce<string[]>((acc, spot) => {
    if (spot.group && !acc.includes(spot.group)) acc.push(spot.group);
    return acc;
  }, []);

  return (
    <div className="beginner-step-spots" aria-label={`${title}の${heading}`}>
      <strong>{heading}</strong>
      {groups.length ? (
        <div className="beginner-spot-groups">
          {groups.map((group) => (
            <section key={group} className="beginner-spot-group" aria-label={`${group}のおすすめ`}>
              <h4>{group}</h4>
              <div>
                {spots.filter((spot) => spot.group === group).map((spot) => (
                  <SpotCard key={spot.title} spot={spot} />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="beginner-spot-grid">
          {spots.map((spot) => (
            <SpotCard key={spot.title} spot={spot} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function BeginnerPage() {
  return (
    <>
      <Header />
      <DesktopSidebarLayout mainClassName="beginner-page-shell">
        <div className="beginner-page">
          <section className="beginner-hero" aria-labelledby="beginner-title">
            <h1 id="beginner-title" className="beginner-hero-title">ゴルフをはじめよう！コースデビューまでの5ステップ</h1>
            <figure className="beginner-hero-visual">
              <img src="/assets/hero/beginner-first-view.png" alt="初心者向け完全ガイド ゴルフをはじめよう！コースデビューまでのステップ5" />
            </figure>
          </section>

          <section id="beginner-roadmap" className="beginner-roadmap" aria-labelledby="beginner-roadmap-title">
            <div className="beginner-section-heading is-centered">
              <p>Roadmap</p>
              <h2 id="beginner-roadmap-title">コースデビューロードマップ</h2>
              <span>焦らず、必要なタイミングで少しずつ準備しましょう。</span>
            </div>

            <div className="beginner-step-list">
              {roadmapSteps.map((item) => (
                <article key={item.step} className={`beginner-step-card is-${item.tone}`}>
                  <div className="beginner-step-badge">
                    <span>STEP</span>
                    <strong>{item.step}</strong>
                  </div>
                  <StepIcon name={item.icon} image={item.image} imageAlt={item.imageAlt} />
                  <div className="beginner-step-copy">
                    <h3>{item.title}</h3>
                    <p className="beginner-step-timing">{item.timing}</p>
                    <p>{item.tip}</p>
                    <StepSpots title={item.title} heading={item.recommendationTitle} spots={item.spots} />
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="beginner-lesson-guide" aria-labelledby="beginner-lesson-title">
            <div className="beginner-lesson-copy">
              <p className="beginner-lesson-eyebrow">Lesson Support</p>
              <h2 id="beginner-lesson-title">初心者こそ、最初の数回はレッスンがおすすめ</h2>
              <p>
                独学でも始められますが、最初だけプロに見てもらうと「何が正解かわからない」不安がぐっと減ります。
                まずは単発レッスンや体験レッスンからで十分です。
              </p>
              <a className="beginner-lesson-link" href="/lessons">レッスン情報を見る</a>
            </div>
            <div className="beginner-lesson-benefits">
              {lessonBenefits.map((benefit, index) => (
                <article key={benefit.title} className="beginner-lesson-benefit">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{benefit.title}</strong>
                  <p>{benefit.copy}</p>
                </article>
              ))}
            </div>
            <div className="beginner-lesson-facilities">
              <h3>おすすめのレッスン施設</h3>
              <div>
                {lessonFacilities.map((facility) => (
                  <a key={facility.title} className="beginner-lesson-facility" href="/lessons">
                    <img src={facility.image} alt="" loading="lazy" />
                    <div>
                      <span>{facility.area}</span>
                      <strong>{facility.title}</strong>
                      <p>{facility.copy}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>

          <BeginnerChecklist />

          <section className="beginner-recommend" aria-labelledby="beginner-recommend-title">
            <div className="beginner-section-heading is-centered">
              <p>Recommended</p>
              <h2 id="beginner-recommend-title">おすすめコンテンツ</h2>
            </div>

            <div className="beginner-content-block">
              <h3>初心者におすすめの沖縄のゴルフ場</h3>
              <div className="beginner-course-grid">
                {courseCards.map((card) => (
                  <a key={card.title} className="beginner-course-card" href={card.href}>
                    <img src={card.image} alt="" loading="lazy" />
                    <div>
                      <span>{card.label}</span>
                      <strong>{card.title}</strong>
                      <p>{card.copy}</p>
                      <em>{card.tags.join(" / ")}</em>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div className="beginner-content-block">
              <h3>初心者向けお役立ち記事</h3>
              <div className="beginner-article-grid">
                {articleCards.map((card) => (
                  <a key={card.title} className={`beginner-article-card is-${card.tone}`} href={card.href}>
                    <span>{card.label}</span>
                    <strong>{card.title}</strong>
                  </a>
                ))}
              </div>
            </div>
          </section>
        </div>
      </DesktopSidebarLayout>
      <Footer />
    </>
  );
}
