import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { EventCalendar, type CalendarEventData } from "./components/EventCalendar";
import { HomeFeatureCarousel } from "./components/HomeFeatureCarousel";
import { PartnerLogoCarousel } from "./components/PartnerLogoCarousel";
import { RandomPickupSections, type PickupCourse, type PickupPracticeRange } from "./components/RandomPickupSections";
import {
  articlePath,
  courseImages,
  coursePath,
  formatDate,
  getArticles,
  getCourses,
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

function sortDateToCalendarDate(value: number) {
  const text = String(value);
  if (text.length !== 8) return null;
  const year = Number(text.slice(0, 4));
  const month = Number(text.slice(4, 6));
  const day = Number(text.slice(6, 8));
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day > 31 ? 1 : day);
}

function tournamentDayLabel(tournament: Awaited<ReturnType<typeof getTournaments>>[number]) {
  const date = sortDateToDate(tournamentSortDate(tournament));
  if (!date) return tournament.month || "未定";
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

function countdownLabel(tournament: Awaited<ReturnType<typeof getTournaments>>[number]) {
  const date = sortDateToDate(tournamentSortDate(tournament));
  if (!date) return "日程確認中";
  const today = new Date(2026, 5, 16);
  const days = Math.ceil((date.getTime() - today.getTime()) / 86400000);
  if (days > 0) return `あと${days}日`;
  if (days === 0) return "本日開催";
  return "開催済み";
}

function tournamentStatusLabel(tournament: Awaited<ReturnType<typeof getTournaments>>[number]) {
  if (tournament.status?.includes("成績")) return "結果公開中";
  if (tournament.status?.includes("確認")) return "確認中";
  return tournament.status || "受付状況確認";
}

function tournamentStatusClass(tournament: Awaited<ReturnType<typeof getTournaments>>[number]) {
  const status = tournamentStatusLabel(tournament);
  if (status.includes("結果")) return "is-result";
  if (status.includes("確認")) return "is-checking";
  return "is-open";
}

type CalendarEvent = {
  id: string;
  title: string;
  date: Date;
  label: string;
  type: "tournament" | "event" | "demo" | "competition" | "lesson";
  href: string;
  venue?: string;
};

function calendarEventType(label: string): CalendarEvent["type"] {
  if (label.includes("試打")) return "demo";
  if (label.includes("コンペ")) return "competition";
  if (label.includes("レッスン")) return "lesson";
  if (label.includes("イベント")) return "event";
  return "tournament";
}

function QuickSearchIcon({ name }: { name: string }) {
  if (name === "trophy") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 21h8" />
        <path d="M12 17v4" />
        <path d="M7 4h10v4a5 5 0 0 1-10 0V4Z" />
        <path d="M5 5H3v3a4 4 0 0 0 4 4" />
        <path d="M19 5h2v3a4 4 0 0 1-4 4" />
      </svg>
    );
  }

  if (name === "flag") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 21V4" />
        <path d="M5 5h12l-1.5 4L17 13H5" />
      </svg>
    );
  }

  if (name === "golf") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="11" cy="9" r="5" />
        <path d="M11 14v7" />
        <path d="M7 21h8" />
        <path d="M15.5 5.5 19 2" />
        <path d="M9 8h.01" />
        <path d="M12 7h.01" />
        <path d="M13 10h.01" />
      </svg>
    );
  }

  if (name === "calendar") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 3v4" />
        <path d="M17 3v4" />
        <path d="M4 8h16" />
        <rect x="4" y="5" width="16" height="16" rx="2" />
        <path d="M8 12h3" />
        <path d="M8 16h5" />
      </svg>
    );
  }

  if (name === "lesson") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="7" r="3" />
        <path d="M6 21v-2a6 6 0 0 1 12 0v2" />
        <path d="M18 8h3" />
        <path d="M21 8v8" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 20h4l10-10a2.8 2.8 0 0 0-4-4L4 16v4Z" />
      <path d="m13 7 4 4" />
      <path d="M12 20h8" />
    </svg>
  );
}

export default async function Home() {
  const [articles, courses, practiceRanges, partners, tournaments, topics] = await Promise.all([
    getArticles(),
    getCourses(),
    getPracticeRanges(),
    getPartners(),
    getTournaments(),
    getTopics()
  ]);

  const todaySortValue = 20260616;
  const today = new Date(2026, 5, 16);
  const featuredTournament = tournaments.find((tournament) => tournamentSortDate(tournament) >= todaySortValue) || tournaments[0];
  const monthlyTournaments = tournaments.slice(0, 4);
  const latestArticles = articles.slice(0, 4);
  const tournamentCalendarEvents: CalendarEvent[] = tournaments
    .flatMap((tournament) => {
      const date = sortDateToCalendarDate(tournamentSortDate(tournament));
      if (!date) return [];
      const label = fieldText(tournament.category) || "大会";
      return [{
        id: `tournament-${tournament.id}`,
        title: tournament.title,
        date,
        label,
        type: calendarEventType(label),
        href: firstAvailableTournamentUrl(tournament),
        venue: tournament.venue
      } satisfies CalendarEvent];
    });
  const topicCalendarEvents: CalendarEvent[] = topics
    .flatMap((topic) => {
      if (!topic.published) return [];
      const date = new Date(topic.published);
      if (Number.isNaN(date.getTime())) return [];
      const label = topicCategoryLabel(topic);
      return [{
        id: `topic-${topic.id}`,
        title: topic.title,
        date,
        label,
        type: calendarEventType(label),
        href: topic.linkUrl || "/events",
        venue: label
      } satisfies CalendarEvent];
    });
  const allCalendarEvents = [...tournamentCalendarEvents, ...topicCalendarEvents]
    .filter((event) => event.date >= new Date(2026, 0, 1))
    .sort((a, b) => a.date.getTime() - b.date.getTime());
  const currentMonthEvents = allCalendarEvents.filter(
    (event) => event.date.getFullYear() === today.getFullYear() && event.date.getMonth() === today.getMonth()
  );
  const calendarBaseDate = currentMonthEvents.length
    ? today
    : allCalendarEvents.find((event) => event.date >= today)?.date || today;
  const calendarEventData: CalendarEventData[] = allCalendarEvents.map((event) => ({
    id: event.id,
    title: event.title,
    dateIso: event.date.toISOString(),
    label: event.label,
    type: event.type,
    href: event.href,
    venue: event.venue
  }));

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

  return (
    <>
      <Header />
      <main id="main" className="portal-main">
        <HomeFeatureCarousel slides={featureSlides} />

        <section id="quick-search" className="portal-section quick-search-section" aria-labelledby="quick-search-title">
          <div className="portal-section-heading is-centered">
            <h2 id="quick-search-title">カテゴリーから探す</h2>
          </div>
          <div className="quick-search-grid">
            {[
              ["大会情報", "トーナメント・コンペ", "/tournaments", "trophy", "quick-tournament"],
              ["ゴルフ場", "県内ゴルフ場を探す", "/courses", "flag", "quick-course"],
              ["練習場", "打ちっぱなし・スクール", "/practice", "golf", "quick-practice"],
              ["イベント", "試打会・体験会など", "/events", "calendar", "quick-event"],
              ["レッスン", "スクール・インストラクター", "/lessons", "lesson", "quick-lesson"],
              ["ブログ", "ブログを読む", "/articles", "blog", "quick-blog"]
            ].map(([title, text, href, icon, className]) => (
              <a key={title} className={`quick-search-card ${className}`} href={href}>
                <span className="quick-search-icon" aria-hidden="true">
                  <QuickSearchIcon name={icon} />
                </span>
                <strong>{title}</strong>
                <small>{text}</small>
              </a>
            ))}
          </div>
        </section>

        <section className="portal-section weekly-tournament-section" aria-labelledby="weekly-tournaments-title">
          <div className="portal-section-heading with-link">
            <div>
              <h2 id="weekly-tournaments-title">🔥 今週の注目大会 <span>NEW</span></h2>
              <p>エントリー受付中の注目大会をピックアップ！</p>
            </div>
            <a className="portal-more-link" href="/tournaments">一覧を見る</a>
          </div>
          <div className="weekly-tournament-rail">
            {monthlyTournaments.map((tournament, index) => {
              const href = firstAvailableTournamentUrl(tournament);
              return (
                <article key={tournament.id} className={`weekly-tournament-card ${index === 0 ? "is-featured" : ""}`}>
                  <div className="weekly-tournament-image">
                    <img src={index === 0 ? fallbackVisual : pickupCourses[index % Math.max(pickupCourses.length, 1)]?.imageUrl || fallbackVisual} alt="" loading={index === 0 ? "eager" : "lazy"} />
                    <span>{fieldText(tournament.category) || "大会"}</span>
                  </div>
                  <div className="weekly-tournament-body">
                    <h3>{tournament.title}</h3>
                    <p>{tournament.venue || "開催場所確認中"}</p>
                    <div className="weekly-tournament-meta">
                      <span><small>開催まで</small><strong>{countdownLabel(tournament)}</strong></span>
                      <span><small>エントリー締切</small><strong>{tournamentStatusLabel(tournament)}</strong></span>
                      <span><small>募集カテゴリ</small><strong>{index === 0 ? "ジュニア 37名" : "受付中"}</strong></span>
                    </div>
                  </div>
                  <a href={href} {...externalLinkProps(href)} aria-label={`${tournament.title}の詳細を見る`}>詳細を見る</a>
                </article>
              );
            })}
          </div>
        </section>

        <section className="home-focus-grid" aria-label="イベントカレンダーと大会情報">
          <EventCalendar
            events={calendarEventData}
            initialYear={calendarBaseDate.getFullYear()}
            initialMonth={calendarBaseDate.getMonth()}
          />

          <section id="tournaments" className="home-tournament-panel" aria-labelledby="tournaments-title">
          <div className="portal-section-heading with-link">
            <div>
              <p className="portal-eyebrow">Tournament</p>
              <h2 id="tournaments-title">大会情報</h2>
            </div>
            <a className="portal-more-link" href="/tournaments">一覧を見る</a>
          </div>
          <div className="home-tournament-list">
            {monthlyTournaments.map((tournament) => {
              const href = firstAvailableTournamentUrl(tournament);
              return (
                <article key={tournament.id} className="home-tournament-item">
                  <time>{tournamentDayLabel(tournament)}</time>
                  <div>
                    <h3>{tournament.title}</h3>
                    <p>{tournament.venue || "開催コース確認中"}</p>
                  </div>
                  <span className={`entry-status ${tournamentStatusClass(tournament)}`}>{tournamentStatusLabel(tournament)}</span>
                  <a href={href} {...externalLinkProps(href)} aria-label={`${tournament.title}の詳細を見る`}>詳細</a>
                </article>
              );
            })}
          </div>
          </section>
        </section>

        <RandomPickupSections courses={pickupCourses} practiceRanges={pickupPracticeRanges} />

        <section id="articles" className="portal-section" aria-labelledby="articles-title">
          <div className="portal-section-heading with-link">
            <div>
              <p className="portal-eyebrow">Blog</p>
              <h2 id="articles-title">新着ブログ</h2>
            </div>
            <a className="portal-more-link" href="/articles">一覧を見る</a>
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
                </a>
              </article>
            ))}
          </div>
        </section>

        <section id="partners" className="portal-section partners-section" aria-labelledby="partners-title">
          <div className="portal-section-heading">
            <p className="portal-eyebrow">Partners</p>
            <h2 id="partners-title">パートナー</h2>
            <p>おきなわGOLFなびは、多くの企業・団体様に支えられて運営しております。</p>
          </div>
          <PartnerLogoCarousel partners={partners} />
        </section>

        <section className="portal-cta" aria-labelledby="cta-title">
          <h2 id="cta-title">沖縄のゴルフ情報をいち早くお届け！</h2>
          <div className="portal-cta-actions">
            <a href={googleFormDirectUrl} target="_blank" rel="noreferrer">公式LINEに登録</a>
            <a href={googleFormDirectUrl} target="_blank" rel="noreferrer">Instagramをフォロー</a>
            <a href={googleFormDirectUrl} target="_blank" rel="noreferrer">大会情報を受け取る</a>
            <a href={googleFormDirectUrl} target="_blank" rel="noreferrer">イベント情報を受け取る</a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
