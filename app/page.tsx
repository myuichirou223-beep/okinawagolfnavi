import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import {
  articleKeywords,
  articlePath,
  courseImages,
  courseKeywords,
  coursePath,
  formatDate,
  getArticles,
  getCourses,
  getPartners,
  getPracticeRanges,
  getTournaments,
  tournamentActionLinks,
  getTopics,
  tournamentFilterCategory,
  tournamentKeywords,
  tournamentSortDate,
  practiceRangeKeywords,
  topicKeywords,
  topicCategoryLabel
} from "../lib/microcms";

export const revalidate = 300;

const googleFormDirectUrl = "https://forms.gle/SKkamSAieuaUjuTW6";

function fieldText(value: unknown): string {
  if (!value) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  if (Array.isArray(value)) return value.map(fieldText).filter(Boolean).join("・");
  if (typeof value !== "object") return "";

  const field = value as Record<string, unknown>;
  const candidates = [
    field.value,
    field.label,
    field.name,
    field.title,
    field.text,
    field.category,
    field.area,
    field.id
  ];

  for (const candidate of candidates) {
    const text = fieldText(candidate);
    if (text) return text;
  }

  return "";
}

function areaFilterValue(value: unknown): string {
  const area = fieldText(value);
  return area.startsWith("離島") ? "離島" : area;
}

export default async function Home() {
  const articles = await getArticles();
  const courses = await getCourses();
  const practiceRanges = await getPracticeRanges();
  const partners = await getPartners();
  const topics = await getTopics();
  const tournaments = await getTournaments();
  const latestTopics = topics.slice(0, 5);

  return (
    <>
      <Header />
      <main id="main">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-media" role="img" aria-label="沖縄のゴルフ場でスイングするプレーヤー" />
          <div className="hero-content">
            <p className="eyebrow">沖縄県内のゴルフ情報ポータル</p>
            <h1 id="hero-title">
              <span>沖縄のゴルフ情報を</span>
              <span>見やすくひとつの入口に。</span>
            </h1>
            <p>
              競技ゴルファー、週末プレーヤー、ジュニア、観光で訪れる方まで。
              沖縄のゴルフを探す時間を短くし、参加する人を増やすための地域密着サイトです。
            </p>
          </div>
        </section>

        <section id="topics" className="section topics-section" aria-labelledby="topics-title">
          <div className="section-heading">
            <p className="eyebrow">Topics</p>
            <h2 id="topics-title">最新情報</h2>
            <p>大会結果、募集開始、イベント開催など、いま見ておきたい沖縄ゴルフ情報をまとめます。</p>
          </div>
          <div className="topics-board">
            <div className="topics-list">
              {latestTopics.map((topic) => (
                <article key={topic.id} className="topic-news-row searchable" data-keywords={topicKeywords(topic)}>
                  <div className="topic-news-meta">
                    {topic.published ? <time dateTime={topic.published}>{formatDate(topic.published)}</time> : null}
                    <span>{topicCategoryLabel(topic)}</span>
                  </div>
                  <div className="topic-news-body">
                    <h3>
                      {topic.linkUrl ? (
                        <a href={topic.linkUrl} target="_blank" rel="noreferrer">
                          {topic.title}
                        </a>
                      ) : (
                        topic.title
                      )}
                    </h3>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section banner-ad-section" aria-label="広告掲載枠">
          <div className="banner-ad-grid">
            <aside className="banner-ad-slot banner-ad-slot-image">
              <img src="/assets/ads/nuchi-banner.png" alt="NUCHI たった15分で、変わるカラダ。" />
            </aside>
            <aside className="banner-ad-slot banner-ad-slot-image">
              <img src="/assets/ads/moanika-banner.png" alt="Moanika RENTACAR 2026.9中旬 NEW OPEN" />
            </aside>
          </div>
        </section>

        <section id="tournaments" className="section" aria-labelledby="tournament-title">
          <div className="section-heading">
            <p className="eyebrow">Tournament</p>
            <h2 id="tournament-title">大会情報</h2>
            <p>開催予定から開催済みの成績まで、参加者と保護者にも読みやすい表示にします。</p>
          </div>
          <div className="filter-bar" aria-label="大会の絞り込み">
            <button className="filter-button is-active" type="button" data-filter="all">すべて</button>
            <button className="filter-button" type="button" data-filter="general">一般</button>
            <button className="filter-button" type="button" data-filter="senior">シニア</button>
            <button className="filter-button" type="button" data-filter="women">女性</button>
            <button className="filter-button" type="button" data-filter="junior">ジュニア</button>
            <button className="filter-button" type="button" data-filter="pro">プロ</button>
            <button className="filter-button" type="button" data-filter="past">開催済み</button>
            <button className="filter-button" type="button" data-filter="upcoming">これから開催</button>
          </div>
          <div className="sort-bar" aria-label="大会の並び替え">
            <span>開催日順</span>
            <button className="sort-button is-active" type="button" data-sort-order="asc">早い順</button>
            <button className="sort-button" type="button" data-sort-order="desc">遅い順</button>
          </div>
          <div className="annual-schedule" aria-label="大会年間スケジュール">
            <div className="schedule-heading">
              <h3>年間スケジュール</h3>
              <p>月別に大会の時期、会場、確認したい情報をまとめます。</p>
            </div>
            <div className="schedule-list">
              {tournaments.map((tournament) => {
                const actionLinks = tournamentActionLinks(tournament);
                return (
                  <article
                    key={tournament.id}
                    className="schedule-item searchable"
                    data-category={tournamentFilterCategory(tournament)}
                    data-keywords={tournamentKeywords(tournament)}
                    data-sort-date={tournamentSortDate(tournament)}
                  >
                    <time>{tournament.month || "未定"}</time>
                    <div>
                      <h4>{tournament.title}</h4>
                      <p>{[tournament.dateLabel, tournament.venue].filter(Boolean).join(" / ") || "詳細確認中"}</p>
                    </div>
                    <div className="schedule-actions" aria-label={`${tournament.title}の関連リンク`}>
                      {actionLinks.map((link) => (
                        link.url ? (
                          <a key={link.label} className="schedule-action-button" href={link.url} target="_blank" rel="noreferrer">
                            {link.label}
                          </a>
                        ) : (
                          <span key={link.label} className="schedule-action-button is-disabled" aria-disabled="true">
                            {link.label}
                          </span>
                        )
                      ))}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
          <div className="banner-ad-grid section-ad-grid" aria-label="大会情報下の広告掲載枠">
            <aside className="banner-ad-slot">
              <span>広告掲載枠 C</span>
              <strong>大会参加者・競技ゴルファー向けバナー</strong>
              <p>大会情報の下、左側に表示される広告枠です。</p>
            </aside>
            <aside className="banner-ad-slot">
              <span>広告掲載枠 D</span>
              <strong>ゴルフ用品・レッスン・宿泊プラン向けバナー</strong>
              <p>大会情報の下、右側に表示される広告枠です。</p>
            </aside>
          </div>
        </section>

        <section id="events" className="section section-muted" aria-labelledby="events-title">
          <div className="section-heading">
            <p className="eyebrow">Event</p>
            <h2 id="events-title">イベント・コンペ・試打会</h2>
            <p>大きなコンペ、メーカー試打会、観戦イベント、親子体験会を掲載し、ゴルフ参加の入口を増やします。</p>
          </div>
          <div className="timeline">
            {[
              ["2026年1月27日-29日", "ザ・リッツ・カールトン沖縄カップ2026", "かねひで喜瀬カントリークラブで行われる宿泊パッケージ型コンペ。"],
              ["2026年3月-4月", "フレンズゴルフカップ 2026年春 in カヌチャ", "チーム参加型のコンペ。募集要項、賞品、参加条件をわかりやすく紹介します。"],
              ["随時更新", "試打会・フィッティング情報", "沖縄県内開催分を地域別に整理して紹介します。"]
            ].map(([date, title, text]) => (
              <article key={title} className="timeline-item searchable" data-keywords={`${title} ${text}`}>
                <time>{date}</time>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="courses" className="section section-muted" aria-labelledby="courses-title">
          <div className="section-heading">
            <p className="eyebrow">Golf Course</p>
            <h2 id="courses-title">沖縄県内のゴルフ場</h2>
            <p>エリア、特徴、公式サイトへの導線を整理。観光客にも県内プレーヤーにも使いやすい一覧です。</p>
          </div>
          <div className="course-filter-groups">
            <div className="filter-bar" aria-label="ゴルフ場のエリア絞り込み">
              <span>エリア</span>
              <button className="course-filter-button is-active" type="button" data-area-filter="all">すべて</button>
              <button className="course-filter-button" type="button" data-area-filter="南部">南部</button>
              <button className="course-filter-button" type="button" data-area-filter="中部">中部</button>
              <button className="course-filter-button" type="button" data-area-filter="北部">北部</button>
              <button className="course-filter-button" type="button" data-area-filter="離島">離島</button>
            </div>
            <div className="filter-bar" aria-label="ゴルフ場のコース種別絞り込み">
              <span>種別</span>
              <button className="course-type-filter-button is-active" type="button" data-type-filter="all">すべて</button>
              <button className="course-type-filter-button" type="button" data-type-filter="long">ロング</button>
              <button className="course-type-filter-button" type="button" data-type-filter="middle">ミドル</button>
              <button className="course-type-filter-button" type="button" data-type-filter="short">ショート</button>
            </div>
          </div>
          <div className="course-list">
            {courses.map((course) => {
              const image = courseImages(course)[0];
              const courseArea = fieldText(course.area);
              const courseCity = fieldText(course.city);
              const courseType = fieldText(course.courseType);
              return (
                <article
                  key={course.id}
                  className="course-row searchable"
                  data-area={areaFilterValue(course.area)}
                  data-course-type={[
                    courseType.includes("ロング") ? "long" : "",
                    courseType.includes("ミドル") ? "middle" : "",
                    courseType.includes("ショート") ? "short" : ""
                  ].filter(Boolean).join(" ")}
                  data-keywords={courseKeywords(course)}
                >
                  <a className="course-card-link" href={coursePath(course)}>
                    <div className={`course-image${image?.url ? "" : " course-image-fallback"}`}>
                      <img src={image?.url || "/assets/logo.png"} alt={course.title} />
                    </div>
                    <h3>{course.title}</h3>
                    <p className="course-card-meta">
                      {[courseArea, courseCity, courseType].filter(Boolean).join(" / ")}
                    </p>
                  </a>
                </article>
              );
            })}
          </div>
          <div className="banner-ad-grid section-ad-grid" aria-label="ゴルフ場情報下の広告掲載枠">
            <aside className="banner-ad-slot">
              <span>広告掲載枠 E</span>
              <strong>観光ゴルフ・レンタカー・宿泊向けバナー</strong>
              <p>ゴルフ場情報の下、左側に表示される広告枠です。</p>
            </aside>
            <aside className="banner-ad-slot">
              <span>広告掲載枠 F</span>
              <strong>ゴルフ用品・予約サービス向けバナー</strong>
              <p>ゴルフ場情報の下、右側に表示される広告枠です。</p>
            </aside>
          </div>
        </section>

        <section id="practice" className="section" aria-labelledby="practice-title">
          <div className="section-heading">
            <p className="eyebrow">Practice</p>
            <h2 id="practice-title">練習場・レッスン施設</h2>
            <p>県内の屋外・屋内練習場を、エリアやアクセス情報とあわせて確認できます。</p>
          </div>
          <div className="course-filter-groups">
            <div className="filter-bar" aria-label="練習場の種別絞り込み">
              <span>種別</span>
              <button className="practice-filter-button is-active" type="button" data-practice-filter="all">すべて</button>
              <button className="practice-filter-button" type="button" data-practice-filter="屋外">屋外</button>
              <button className="practice-filter-button" type="button" data-practice-filter="屋内">屋内</button>
            </div>
            <div className="filter-bar" aria-label="練習場のエリア絞り込み">
              <span>エリア</span>
              <button className="practice-area-filter-button is-active" type="button" data-practice-area-filter="all">すべて</button>
              <button className="practice-area-filter-button" type="button" data-practice-area-filter="南部">南部</button>
              <button className="practice-area-filter-button" type="button" data-practice-area-filter="中部">中部</button>
              <button className="practice-area-filter-button" type="button" data-practice-area-filter="北部">北部</button>
              <button className="practice-area-filter-button" type="button" data-practice-area-filter="離島">離島</button>
            </div>
          </div>
          <div className="practice-list">
            {practiceRanges.map((range) => {
              const rangeCategory = fieldText(range.category) || "練習場";
              const rangeArea = fieldText(range.area) || "沖縄県";
              return (
                <article
                  key={range.id}
                  className="practice-row searchable"
                  data-practice-category={rangeCategory}
                  data-practice-area={areaFilterValue(range.area)}
                  data-keywords={practiceRangeKeywords(range)}
                >
                  <details>
                    <summary>
                      <span className="practice-summary-main">
                        <span className="practice-name">{range.name}</span>
                        <span className="practice-location-line">
                          {[rangeCategory, rangeArea].filter(Boolean).join(" / ")}
                        </span>
                      </span>
                      <span className="practice-open-label">詳細</span>
                    </summary>
                    <div className="practice-detail">
                      <p><strong>住所</strong>{range.address || "所在地確認中"}</p>
                      {range.accessFromNaha ? <p><strong>アクセス</strong>{range.accessFromNaha}</p> : null}
                      <div className="practice-actions">
                        {range.phone ? <a className="text-link" href={`tel:${range.phone.replace(/[^0-9+]/g, "")}`}>{range.phone}</a> : null}
                        {range.url ? <a className="text-link" href={range.url} target="_blank" rel="noreferrer">公式サイト</a> : null}
                      </div>
                    </div>
                  </details>
                </article>
              );
            })}
          </div>
        </section>

        <section id="articles" className="section articles-section" aria-labelledby="articles-title">
          <div className="section-heading">
            <p className="eyebrow">Articles</p>
            <h2 id="articles-title">読み物・ブログ記事</h2>
            <p>沖縄でゴルフを楽しむ人、これから始める人、県外から訪れる人に向けて、役立つ記事を掲載します。</p>
          </div>
          <div className="article-grid">
            {articles.map((article) => (
              <article key={article.id} className="article-card searchable" data-keywords={articleKeywords(article)}>
                <a className="article-card-link" href={articlePath(article)}>
                  <div className={`article-image${article.eyecatch?.url ? "" : " article-image-fallback"}`}>
                    <img src={article.eyecatch?.url || "/assets/logo.png"} alt={article.title} />
                  </div>
                  <h3>{article.title}</h3>
                </a>
              </article>
            ))}
          </div>
        </section>

        <section id="partners" className="section partner-logo-section" aria-labelledby="partner-logo-title">
          <div className="section-heading partner-logo-heading">
            <p className="eyebrow">Partners</p>
            <h2 id="partner-logo-title">パートナー</h2>
            <p>おきなわGOLFなびは、多くの企業・団体様に支えられて運営しております。</p>
          </div>
          <div className="partner-logo-marquee" aria-label="パートナーロゴ一覧">
            <div className="partner-logo-track">
              {[0, 1].map((groupIndex) => (
                <div key={groupIndex} className="partner-logo-group" aria-hidden={groupIndex === 1}>
                  {partners.map((partner) => {
                    const content = partner.logo?.url ? (
                      <img src={partner.logo.url} alt={partner.name} />
                    ) : (
                      <span>{partner.name}</span>
                    );

                    return partner.websiteUrl ? (
                      <a
                        key={`${partner.id}-${groupIndex}`}
                        className="partner-logo-item"
                        href={partner.websiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        tabIndex={groupIndex === 1 ? -1 : undefined}
                      >
                        {content}
                      </a>
                    ) : (
                      <div key={`${partner.id}-${groupIndex}`} className="partner-logo-item">
                        {content}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          <div className="partner-contact-panel">
            <p>掲載依頼、情報修正、広告掲載、パートナー相談、大会・イベント情報の提供などはこちらからご連絡ください。</p>
            <a className="button-secondary" href={googleFormDirectUrl} target="_blank" rel="noreferrer">お問い合わせ</a>
          </div>
        </section>

        <section className="notice-band" aria-label="編集方針">
          <div>
            <strong>掲載情報の確認方針</strong>
            <p>大会日程、募集要項、成績、料金、営業時間は変更される場合があります。公式発表を一次情報として確認し、更新日を明記して運用します。</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
