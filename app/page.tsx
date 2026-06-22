import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { HomeFeatureCarousel } from "./components/HomeFeatureCarousel";
import { PartnerLogoCarousel } from "./components/PartnerLogoCarousel";
import { RandomPickupSections, type PickupCourse, type PickupPracticeRange } from "./components/RandomPickupSections";
import { UpcomingSchedule, type UpcomingScheduleItem } from "./components/UpcomingSchedule";
import {
  articlePath,
  courseImages,
  coursePath,
  formatDate,
  getArticles,
  getCourses,
  getEvents,
  getPartners,
  getPracticeRanges,
  getTournaments,
  getTopics,
  topicCategoryLabel,
  tournamentActionLinks,
  tournamentSortDate
} from "../lib/microcms";

export const revalidate = 300;

const googleFormDirectUrl = "https://forms.gle/SKkamSAieuaUjuTW6";
const fallbackVisual = "/assets/hero-golfer.jpg";

function getJstToday() {
  const jstNow = new Date(Date.now() + 9 * 60 * 60 * 1000);
  return new Date(jstNow.getUTCFullYear(), jstNow.getUTCMonth(), jstNow.getUTCDate());
}

function dateToSortValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return Number(`${year}${month}${day}`);
}

function fieldText(value: unknown): string {
  if (!value) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  if (Array.isArray(value)) return value.map(fieldText).filter(Boolean).join("・");
  if (typeof value !== "object") return "";

  const field = value as Record<string, unknown>;
  const candidates = [field.value, field.label, field.name, field.title, field.text, field.category, field.area, field.id];

  for (const candidate of candidates) {
    const text = fieldText(candidate);
    if (text) return text;
  }

  return "";
}

function externalLinkProps(url: string) {
  return url.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {};
}

function compactDate(value?: string) {
  if (!value) return "";
  return formatDate(value).replace("年", ".").replace("月", ".").replace("日", "");
}

function compactMonthDay(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

function firstAvailableTournamentUrl(tournament: Awaited<ReturnType<typeof getTournaments>>[number]) {
  return tournamentActionLinks(tournament).find((link) => link.url)?.url || "/#tournaments";
}

function courseTypeTags(courseType: string, holes?: number) {
  return [courseType, holes ? `${holes}H` : ""].filter(Boolean).slice(0, 2);
}

function sortDateToDate(value: number) {
  const text = String(value);
  if (text.length !== 8) return null;
  const year = Number(text.slice(0, 4));
  const month = Number(text.slice(4, 6));
  const day = Number(text.slice(6, 8));
  if (!year || !month || !day || day > 31) return null;
  return new Date(year, month - 1, day);
}

function countdownLabel(tournament: Awaited<ReturnType<typeof getTournaments>>[number]) {
  const date = sortDateToDate(tournamentSortDate(tournament));
  if (!date) return "日程確認中";
  const today = getJstToday();
  const days = Math.ceil((date.getTime() - today.getTime()) / 86400000);
  if (days > 0) return `あと${days}日`;
  if (days === 0) return "本日開催";
  return "開催済み";
}

function dateCountdownLabel(date: Date) {
  const today = getJstToday();
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const days = Math.ceil((target.getTime() - today.getTime()) / 86400000);
  if (days > 0) return `開催まであと${days}日`;
  if (days === 0) return "本日開催";
  return "開催済み";
}

function scheduleDateLabel(date: Date | null) {
  if (!date) return "開催日確認中";
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

function parseEventDate(value?: string) {
  const dateText = value?.slice(0, 10) || "";
  const match = dateText.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;

  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return Number.isNaN(date.getTime()) ? null : date;
}

export default async function Home() {
  const [articles, courses, practiceRanges, partners, tournaments, events, topics] = await Promise.all([
    getArticles(),
    getCourses(),
    getPracticeRanges(),
    getPartners(),
    getTournaments(),
    getEvents(),
    getTopics()
  ]);

  const today = getJstToday();
  const todaySortValue = dateToSortValue(today);
  const featuredTournament = tournaments.find((tournament) => tournamentSortDate(tournament) >= todaySortValue) || tournaments[0];
  const upcomingTournaments = tournaments
    .filter((tournament) => tournamentSortDate(tournament) >= todaySortValue)
    .sort((a, b) => tournamentSortDate(a) - tournamentSortDate(b));
  const monthlyTournaments = (upcomingTournaments.length ? upcomingTournaments : tournaments).slice(0, 4);
  const latestArticles = articles.slice(0, 10);
  const mobileTopics = topics.slice(0, 5);
  const scheduledItems: UpcomingScheduleItem[] = [
    ...tournaments.map((tournament) => {
      const date = parseEventDate(tournament.eventDate) || sortDateToDate(tournamentSortDate(tournament));
      if (!date || dateToSortValue(date) < todaySortValue) return null;
      const eventDate = tournament.eventDate?.slice(0, 10) || [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0")
      ].join("-");
      return {
        id: `tournament-${tournament.id}`,
        type: "tournament" as const,
        title: tournament.title,
        venue: tournament.venue || tournament.area || "開催場所確認中",
        eventDate,
        dateLabel: scheduleDateLabel(date),
        countdownLabel: dateCountdownLabel(date),
        href: firstAvailableTournamentUrl(tournament)
      };
    }),
    ...events.map((event) => {
      const date = parseEventDate(event.eventDate);
      if (!date || dateToSortValue(date) < todaySortValue) return null;
      return {
        id: `event-${event.id}`,
        type: "event" as const,
        title: event.title,
        venue: event.venue || event.location || "開催場所確認中",
        eventDate: event.eventDate!.slice(0, 10),
        dateLabel: scheduleDateLabel(date),
        countdownLabel: dateCountdownLabel(date),
        href: event.linkUrl || event.officialUrl || "/events"
      };
    })
  ]
    .filter((item): item is UpcomingScheduleItem => item !== null)
    .sort((a, b) => a.eventDate.localeCompare(b.eventDate))
    .slice(0, 6);

  const pickupCourses: PickupCourse[] = courses.map((course) => {
    const image = courseImages(course)[0]?.url || fallbackVisual;
    const area = fieldText(course.area) || "沖縄県";
    const city = fieldText(course.city);
    const courseType = fieldText(course.courseType);

    return {
      id: course.id,
      title: course.title,
      href: coursePath(course),
      imageUrl: image,
      area,
      city,
      courseType,
      tags: [
        course.summary ? course.summary.slice(0, 12) : "",
        ...courseTypeTags(courseType, course.holes)
      ].filter(Boolean).slice(0, 3),
      isVisible: course.status ? course.status !== "非公開" : true
    };
  });

  const pickupPracticeRanges: PickupPracticeRange[] = practiceRanges.map((range) => {
    const category = fieldText(range.category) || "練習場";
    const area = fieldText(range.area) || "沖縄県";

    return {
      id: range.id,
      title: range.name,
      href: range.url || "/#practice",
      imageUrl: fallbackVisual,
      area,
      city: "",
      tags: [category, range.accessFromNaha || "", range.status === "営業確認済み" ? "営業確認済み" : ""].filter(Boolean).slice(0, 3),
      isVisible: range.status ? range.status !== "非公開" : true
    };
  });
  const featureSlides = [
    {
      label: "メイン",
      title: "沖縄のゴルフ情報を\nひとつに。",
      description: "大会・ゴルフ場・練習場・イベント情報を\nまとめて探せるポータルサイト",
      imageUrl: pickupCourses[0]?.imageUrl || fallbackVisual,
      tone: "green" as const,
      actions: [
        { label: "大会を探す", href: "/tournaments" },
        { label: "ゴルフ場を探す", href: "/courses" }
      ]
    },
    {
      label: "今週の注目大会",
      title: "県民ゴルフジュニア選手権",
      description: "エントリー受付中！あと6日",
      imageUrl: fallbackVisual,
      tone: "orange" as const,
      actions: [{ label: "詳しく見る", href: "/tournaments" }]
    },
    {
      label: "PR",
      title: "PGMゴルフリゾート沖縄",
      description: "宿泊付きゴルフプランが充実！",
      imageUrl: pickupCourses[1]?.imageUrl || pickupCourses[0]?.imageUrl || fallbackVisual,
      tone: "blue" as const,
      actions: [{ label: "詳しく見る", href: "/courses" }]
    },
    {
      label: "PR",
      title: "エックスゴルフラボ 那覇小禄店",
      description: "最新シミュレーターでスコアアップ！",
      imageUrl: pickupPracticeRanges[0]?.imageUrl || fallbackVisual,
      tone: "dark" as const,
      actions: [{ label: "詳しく見る", href: "/practice" }]
    }
  ];
  const sidebarTournaments = monthlyTournaments.slice(0, 3);

  return (
    <>
      <Header />
      <main id="main" className="portal-main">
        <div className="home-portal-layout">
          <div className="home-content-column">
        <HomeFeatureCarousel slides={featureSlides} />

        <section className="home-banner-ad-section" aria-label="広告">
          <div className="home-banner-ad-slot is-recruiting">
            <a href={googleFormDirectUrl} target="_blank" rel="noreferrer">
              <span>広告枠 B</span>
              <strong>広告掲載パートナー募集中</strong>
              <small>大会・店舗・サービスをPRしませんか？</small>
              <em>推奨画像 860 × 300px</em>
              <b>詳しくはこちら</b>
            </a>
          </div>
          <div className="home-banner-ad-slot is-recruiting is-secondary">
            <a href={googleFormDirectUrl} target="_blank" rel="noreferrer">
              <span>広告枠 C</span>
              <strong>横長バナー広告 募集中</strong>
              <small>沖縄のゴルファーへ情報を届けませんか？</small>
              <em>推奨画像 860 × 300px</em>
              <b>掲載のお問い合わせ</b>
            </a>
          </div>
        </section>

        <section className="portal-section upcoming-schedule-section" aria-labelledby="upcoming-schedule-title">
          <div className="portal-section-heading">
            <h2 id="upcoming-schedule-title">開催予定</h2>
            <p>大会・イベントを開催日の近い順に掲載しています。</p>
          </div>
          <UpcomingSchedule items={scheduledItems} />
          <div className="upcoming-schedule-links">
            <a href="/tournaments">大会一覧を見る</a>
            <a href="/events">イベント一覧を見る</a>
          </div>
        </section>

        <aside className="mobile-inline-ad" aria-label="広告">
          <a href={googleFormDirectUrl} target="_blank" rel="noreferrer">
            <span>広告枠 D</span>
            <strong>スクエア広告 掲載パートナー募集中</strong>
            <small>PC・スマホ共通の広告掲載枠です</small>
            <em>推奨画像 300 × 300px</em>
          </a>
        </aside>

        <section className="mobile-topic-list" aria-labelledby="mobile-topics-title">
          <div className="mobile-section-heading with-link">
            <h2 id="mobile-topics-title">注目情報</h2>
          </div>
          <div className="mobile-topic-rows">
            {mobileTopics.map((topic) => (
              <a key={topic.id} href={topic.linkUrl || "/events"} {...externalLinkProps(topic.linkUrl || "/events")}>
                <span className="mobile-topic-image">
                  <img
                    src={topic.image?.url || topic.eyecatch?.url || topic.thumbnail?.url || fallbackVisual}
                    alt=""
                    loading="lazy"
                  />
                </span>
                <span className="mobile-topic-copy">
                  <span className="mobile-topic-meta">
                    <span className={`mobile-topic-badge is-${topicCategoryLabel(topic)}`}>{topicCategoryLabel(topic)}</span>
                    <time>{compactMonthDay(topic.published) || "更新"}</time>
                  </span>
                  <strong>{topic.title}</strong>
                </span>
                <i aria-hidden="true">›</i>
              </a>
            ))}
          </div>
          <a className="mobile-more-link" href="/events">すべての情報を見る</a>
        </section>

        <aside className="mobile-inline-ad mobile-inline-ad-e" aria-label="広告枠E">
          <a href={googleFormDirectUrl} target="_blank" rel="noreferrer">
            <span>広告枠 E</span>
            <strong>縦長バナー広告 掲載パートナー募集中</strong>
            <small>ゴルフ関連の店舗・サービス・イベントを大きくPRできる広告枠です</small>
            <em>推奨画像 300 × 300px</em>
          </a>
        </aside>

        <section className="home-wide-pr-banner is-recruiting" aria-label="広告枠G">
          <span>広告枠 G</span>
          <strong>ワイドバナー広告 掲載募集中</strong>
          <small>推奨画像 1080 × 148px</small>
          <a href={googleFormDirectUrl} target="_blank" rel="noreferrer">掲載のお問い合わせ</a>
        </section>

        <RandomPickupSections courses={pickupCourses} practiceRanges={pickupPracticeRanges} />

        <section id="articles" className="portal-section" aria-labelledby="articles-title">
          <div className="portal-section-heading with-link">
            <div>
              <p className="portal-eyebrow">Blog</p>
              <h2 id="articles-title">新着記事</h2>
            </div>
          </div>
          <div className="portal-card-grid four">
            {latestArticles.map((article) => (
              <article key={article.id} className="blog-card">
                <a href={articlePath(article)}>
                  <img src={article.eyecatch?.url || fallbackVisual} alt="" />
                  <div className="blog-card-body">
                    {article.published ? <time dateTime={article.published}>{compactDate(article.published)}</time> : null}
                    <h3>{article.title}</h3>
                  </div>
                  <i aria-hidden="true">›</i>
                </a>
              </article>
            ))}
          </div>
          <a className="home-articles-more" href="/articles">他の記事を見る</a>
        </section>

        <section className="home-wide-pr-banner is-resort is-recruiting" aria-label="広告枠H">
          <span>広告枠 H</span>
          <strong>ワイドバナー広告 掲載募集中</strong>
          <small>推奨画像 1080 × 148px</small>
          <a href={googleFormDirectUrl} target="_blank" rel="noreferrer">掲載のお問い合わせ</a>
        </section>

          </div>

          <aside className="home-sidebar" aria-label="サイド情報">
            <section className="sidebar-box sidebar-hero-ad" aria-label="広告枠A" data-ad-slot="A">
              <a href="https://haisaigolf.com/" target="_blank" rel="noreferrer">
                <span className="sidebar-ad-slot-label">広告枠 A</span>
                <img src="/assets/ads/haisai.png" alt="県内最大の女性ゴルフコミュニティ Haisai Golf Girls" />
              </a>
            </section>

            <section className="sidebar-box sidebar-tournament-card" aria-labelledby="sidebar-tournament-title">
              <div className="sidebar-heading">
                <h2 id="sidebar-tournament-title">注目大会</h2>
                <span>PR枠あり</span>
              </div>
              <div className="sidebar-tournament-list">
                {sidebarTournaments.map((tournament) => (
                  <a key={tournament.id} href={firstAvailableTournamentUrl(tournament)} {...externalLinkProps(firstAvailableTournamentUrl(tournament))}>
                    <img src={fallbackVisual} alt="" loading="lazy" />
                    <span>
                      <strong>{tournament.title}</strong>
                      <small>{tournament.venue || "開催コース確認中"}</small>
                    </span>
                    <em>{countdownLabel(tournament)}</em>
                  </a>
                ))}
              </div>
            </section>

            <section className="sidebar-box sidebar-pink-pr">
              <span>広告枠 D</span>
              <strong>スクエア広告<br />掲載パートナー募集中</strong>
              <small>推奨画像 300 × 300px</small>
              <a href={googleFormDirectUrl} target="_blank" rel="noreferrer">掲載のお問い合わせ</a>
            </section>

            <section className="sidebar-box sidebar-tall-ad is-recruiting">
              <span>広告枠 E</span>
              <h2>縦長バナー広告</h2>
              <strong>掲載パートナー募集中</strong>
              <p>ゴルフ関連の店舗・サービス・イベントを大きくPRできる広告枠です。</p>
              <small>推奨画像 300 × 300px</small>
              <a href={googleFormDirectUrl} target="_blank" rel="noreferrer">掲載のお問い合わせ</a>
            </section>

            <section className="sidebar-box sidebar-sale-ad is-recruiting">
              <span>広告枠 F</span>
              <h2>ショップ・商品広告</h2>
              <strong>広告掲載募集中</strong>
              <p>ゴルフ用品やキャンペーン情報を効果的にPRできます。</p>
              <small>推奨画像 300 × 300px</small>
              <a href={googleFormDirectUrl} target="_blank" rel="noreferrer">掲載のお問い合わせ</a>
            </section>

            <section className="sidebar-box sidebar-line-card">
              <h2>公式LINEで最新情報をお届け！</h2>
              <p>大会情報やイベント情報をいち早くお届けします。</p>
              <a href={googleFormDirectUrl} target="_blank" rel="noreferrer">友だち追加</a>
            </section>

            <section id="partners" className="partners-section sidebar-partners" aria-labelledby="partners-title">
              <div className="portal-section-heading">
                <p className="portal-eyebrow">Partners</p>
                <h2 id="partners-title">パートナー</h2>
              </div>
              <PartnerLogoCarousel partners={partners} />
            </section>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
