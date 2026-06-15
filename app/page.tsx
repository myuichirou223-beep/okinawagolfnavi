import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
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
  topicImage,
  tournamentActionLinks
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

function preferredTopicImage(topic: Parameters<typeof topicImage>[0]) {
  const image = topicImage(topic);
  return image === "/assets/logo.png" ? fallbackVisual : image;
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

export default async function Home() {
  const [articles, courses, practiceRanges, partners, topics, tournaments] = await Promise.all([
    getArticles(),
    getCourses(),
    getPracticeRanges(),
    getPartners(),
    getTopics(),
    getTournaments()
  ]);

  const latestTopics = topics.slice(0, 3);
  const mainTopic = latestTopics[0];
  const subTopics = latestTopics.slice(1, 3);
  const monthlyTournaments = tournaments.slice(0, 4);
  const latestArticles = articles.slice(0, 4);

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
      tags: courseTypeTags(courseType, course.holes),
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
      tags: [category, range.status === "営業確認済み" ? "営業確認済み" : ""].filter(Boolean).slice(0, 2),
      isVisible: range.status ? range.status !== "非公開" : true
    };
  });

  return (
    <>
      <Header />
      <main id="main" className="portal-main">
        <section className="portal-hero" aria-labelledby="hero-title">
          <div className="portal-hero-copy">
            <p className="portal-eyebrow">沖縄ゴルフナビ</p>
            <h1 id="hero-title">
              沖縄のゴルフ情報を、
              <br />
              もっと簡単に。
            </h1>
            <p>
              大会・ゴルフ場・練習場・イベントを
              <br />
              ひとつのサイトで検索。
            </p>
            <div className="portal-hero-actions">
              <a className="portal-button portal-button-primary" href="#tournaments">大会を探す</a>
              <a className="portal-button portal-button-accent" href="#courses">ゴルフ場を探す</a>
            </div>
          </div>
          <div className="portal-hero-visual" aria-hidden="true" />
        </section>

        <section id="quick-search" className="portal-section quick-search-section" aria-labelledby="quick-search-title">
          <div className="portal-section-heading is-centered">
            <h2 id="quick-search-title">何を探していますか？</h2>
          </div>
          <div className="quick-search-grid">
            {[
              ["大会", "大会を探す", "#tournaments", "大"],
              ["ゴルフ場", "ゴルフ場を探す", "#courses", "場"],
              ["練習場", "練習場を探す", "#practice", "練"],
              ["イベント", "イベントを探す", "#quick-search", "催"],
              ["レッスン", "レッスンを探す", "#practice", "習"],
              ["ブログ", "ブログを読む", "#articles", "記"]
            ].map(([title, text, href, mark]) => (
              <a key={title} className="quick-search-card" href={href}>
                <span className="quick-search-icon" aria-hidden="true">{mark}</span>
                <strong>{title}</strong>
                <small>{text}</small>
              </a>
            ))}
          </div>
        </section>

        <section id="topics" className="portal-section" aria-labelledby="topics-title">
          <div className="portal-section-heading with-link">
            <div>
              <p className="portal-eyebrow">News</p>
              <h2 id="topics-title">最新情報</h2>
            </div>
            <a className="portal-more-link" href="#topics">一覧を見る</a>
          </div>
          <div className="featured-news-grid">
            {mainTopic ? (
              <article className="featured-news-card">
                <a href={mainTopic.linkUrl || "#topics"} {...externalLinkProps(mainTopic.linkUrl || "")}>
                  <img src={preferredTopicImage(mainTopic)} alt="" />
                  <div className="featured-news-body">
                    <div className="news-meta">
                      <span>{topicCategoryLabel(mainTopic)}</span>
                      {mainTopic.published ? <time dateTime={mainTopic.published}>{compactDate(mainTopic.published)}</time> : null}
                    </div>
                    <h3>{mainTopic.title}</h3>
                    <p>{mainTopic.description || "沖縄県内のゴルフ関連ニュースをお知らせします。"}</p>
                  </div>
                </a>
              </article>
            ) : null}
            <div className="sub-news-list">
              {subTopics.map((topic) => (
                <article key={topic.id} className="sub-news-card">
                  <a href={topic.linkUrl || "#topics"} {...externalLinkProps(topic.linkUrl || "")}>
                    <img src={preferredTopicImage(topic)} alt="" />
                    <div>
                      <div className="news-meta">
                        <span>{topicCategoryLabel(topic)}</span>
                        {topic.published ? <time dateTime={topic.published}>{compactDate(topic.published)}</time> : null}
                      </div>
                      <h3>{topic.title}</h3>
                      <p>{topic.description || "詳しい情報を確認できます。"}</p>
                    </div>
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="tournaments" className="portal-section" aria-labelledby="tournaments-title">
          <div className="portal-section-heading with-link">
            <div>
              <p className="portal-eyebrow">Tournament</p>
              <h2 id="tournaments-title">今月の大会</h2>
            </div>
            <a className="portal-more-link" href="/tournaments">一覧を見る</a>
          </div>
          <div className="portal-tabs" aria-label="大会の分類">
            {["開催中", "今月の大会", "来月の大会", "シニア", "ジュニア", "レディス", "プロ"].map((tab, index) => (
              <button key={tab} className={index === 1 ? "is-active" : ""} type="button">{tab}</button>
            ))}
          </div>
          <div className="tournament-card-grid">
            {monthlyTournaments.map((tournament) => {
              const href = firstAvailableTournamentUrl(tournament);
              return (
                <article key={tournament.id} className="mini-tournament-card">
                  <time>{tournament.month || "未定"}</time>
                  <h3>{tournament.title}</h3>
                  <p>{tournament.venue || "会場確認中"}</p>
                  <a href={href} {...externalLinkProps(href)}>詳細を見る</a>
                </article>
              );
            })}
          </div>
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
                    <p>{article.description || "沖縄のゴルフをもっと楽しむための記事です。"}</p>
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
          <div className="partner-card-grid">
            {partners.map((partner) => {
              const content = partner.logo?.url ? <img src={partner.logo.url} alt={partner.name} /> : <span>{partner.name}</span>;
              return partner.websiteUrl ? (
                <a key={partner.id} className="partner-card" href={partner.websiteUrl} target="_blank" rel="noreferrer">
                  {content}
                </a>
              ) : (
                <div key={partner.id} className="partner-card">{content}</div>
              );
            })}
          </div>
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
