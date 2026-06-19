import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
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

export default async function Home() {
  const [articles, courses, practiceRanges, partners, tournaments, topics] = await Promise.all([
    getArticles(),
    getCourses(),
    getPracticeRanges(),
    getPartners(),
    getTournaments(),
    getTopics()
  ]);

  const today = getJstToday();
  const todaySortValue = dateToSortValue(today);
  const featuredTournament = tournaments.find((tournament) => tournamentSortDate(tournament) >= todaySortValue) || tournaments[0];
  const upcomingTournaments = tournaments
    .filter((tournament) => tournamentSortDate(tournament) >= todaySortValue)
    .sort((a, b) => tournamentSortDate(a) - tournamentSortDate(b));
  const monthlyTournaments = (upcomingTournaments.length ? upcomingTournaments : tournaments).slice(0, 4);
  const latestArticles = articles.slice(0, 4);
  const mobileTopics = topics.slice(0, 5);
  const eventTopics = [
    ...topics.filter((topic) => ["イベント", "試打会"].some((label) => topicCategoryLabel(topic).includes(label))),
    ...topics
  ].filter((topic, index, items) => items.findIndex((item) => item.id === topic.id) === index).slice(0, 3);

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
  const sidebarTournaments = monthlyTournaments.slice(0, 3);
  const sidebarFavorites = pickupCourses.slice(0, 3);

  return (
    <>
      <Header />
      <main id="main" className="portal-main">
        <div className="home-portal-layout">
          <div className="home-content-column">
        <HomeFeatureCarousel slides={featureSlides} />

        <section className="home-banner-ad-section" aria-label="広告">
          <div className="home-banner-ad-slot">
            <img src="/assets/ads/nuchi-banner.png" alt="NUCHI たった15分で、変わるカラダ。" />
          </div>
          <div className="home-banner-ad-slot">
            <img src="/assets/ads/moanika-banner.png" alt="Moanika RENTACAR 2026年9月中旬オープン" />
          </div>
        </section>

        <section className="portal-section weekly-tournament-section" aria-labelledby="weekly-tournaments-title">
          <div className="portal-section-heading with-link">
            <div>
              <h2 id="weekly-tournaments-title">🔥 今後の大会 <span>NEW</span></h2>
              <p>これから開催される大会を近い順にピックアップ！</p>
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

        <aside className="mobile-inline-ad" aria-label="広告">
          <a href={googleFormDirectUrl} target="_blank" rel="noreferrer">
            <span>AD</span>
            <strong>広告掲載枠</strong>
            <small>バナー広告のお問い合わせはこちら</small>
          </a>
        </aside>

        <section className="mobile-topic-list" aria-labelledby="mobile-topics-title">
          <div className="mobile-section-heading with-link">
            <h2 id="mobile-topics-title">注目情報</h2>
            <a href="/events">一覧を見る</a>
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
          <a className="mobile-more-link" href="/events">すべての情報を見る <span aria-hidden="true">›</span></a>
        </section>

        <section className="home-wide-pr-banner" aria-label="パートナー広告">
          <span>PR</span>
          <strong>沖縄のゴルフをもっと楽しく、もっと快適に。</strong>
          <small>OKINAWA GOLF PARTNER</small>
          <a href={googleFormDirectUrl} target="_blank" rel="noreferrer">詳しくはこちら</a>
        </section>

        <section className="home-focus-grid" aria-label="近日開催のイベントと大会情報">
          <section className="home-event-panel" aria-labelledby="home-events-title">
            <div className="portal-section-heading with-link">
              <div>
                <p className="portal-eyebrow">Event</p>
                <h2 id="home-events-title">近日開催のイベント</h2>
              </div>
              <a className="portal-more-link" href="/events">一覧を見る</a>
            </div>
            <div className="home-event-list">
              {eventTopics.map((topic) => {
                const href = topic.linkUrl || "/events";
                return (
                  <article key={topic.id} className="home-event-card">
                    <a href={href} {...externalLinkProps(href)}>
                      <img
                        src={topic.image?.url || topic.eyecatch?.url || topic.thumbnail?.url || fallbackVisual}
                        alt=""
                        loading="lazy"
                      />
                      <div>
                        <span>{topicCategoryLabel(topic)}</span>
                        <h3>{topic.title}</h3>
                        {topic.published ? <time dateTime={topic.published}>{compactDate(topic.published)}</time> : null}
                      </div>
                    </a>
                  </article>
                );
              })}
            </div>
          </section>

          <section id="tournaments" className="home-tournament-panel" aria-labelledby="tournaments-title">
          <div className="portal-section-heading with-link">
            <div>
              <p className="portal-eyebrow">Tournament</p>
              <h2 id="tournaments-title">今後の大会情報</h2>
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

        <section className="home-wide-pr-banner is-resort" aria-label="リゾート広告">
          <span>PR</span>
          <strong>上質なリゾートステイで、ワンランク上のゴルフ体験を。</strong>
          <small>OKINAWA GOLF RESORTS</small>
          <a href={googleFormDirectUrl} target="_blank" rel="noreferrer">詳しくはこちら</a>
        </section>

          </div>

          <aside className="home-sidebar" aria-label="サイド情報">
            <section className="sidebar-box sidebar-hero-ad">
              <a href="https://haisaigolf.com/" target="_blank" rel="noreferrer">
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
              <span>PR</span>
              <strong>あなたの大会・サービスをPRしませんか？</strong>
              <a href={googleFormDirectUrl} target="_blank" rel="noreferrer">詳しくはこちら</a>
            </section>

            <section className="sidebar-box sidebar-tall-ad">
              <span>PR</span>
              <h2>ゴルフレッスン体験</h2>
              <strong>3,300円〜</strong>
              <p>初心者歓迎！手ぶらOK！</p>
              <a href={googleFormDirectUrl} target="_blank" rel="noreferrer">詳しくはこちら</a>
            </section>

            <section className="sidebar-box sidebar-sale-ad">
              <span>PR</span>
              <h2>ゴルフ用品</h2>
              <strong>SPECIAL SALE</strong>
              <p>人気ブランド多数！</p>
              <a href={googleFormDirectUrl} target="_blank" rel="noreferrer">今すぐチェック</a>
            </section>

            <section className="sidebar-box sidebar-line-card">
              <h2>公式LINEで最新情報をお届け！</h2>
              <p>大会情報やイベント情報をいち早くお届けします。</p>
              <a href={googleFormDirectUrl} target="_blank" rel="noreferrer">友だち追加</a>
            </section>

            <section className="sidebar-box sidebar-favorite-card">
              <div className="sidebar-heading">
                <h2>お気に入り</h2>
                <a href="/courses">すべて見る</a>
              </div>
              <ul>
                {sidebarFavorites.map((course) => (
                  <li key={course.id}><a href={course.href}>{course.title}</a></li>
                ))}
              </ul>
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
