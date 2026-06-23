import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { DesktopSidebarLayout } from "../components/DesktopSidebarLayout";
import {
  getTournaments,
  tournamentActionLinks,
  tournamentFilterCategory,
  tournamentKeywords,
  tournamentSortDate
} from "../../lib/microcms";

export const revalidate = 300;

export const metadata = {
  title: "大会情報",
  description: "沖縄県内で開催されるゴルフ大会の年間スケジュール、募集要項、概要、成績表へのリンクを掲載しています。"
};

function tournamentDateLabel(eventDate?: string, fallbackLabel?: string) {
  if (!eventDate) return fallbackLabel || "";

  const date = new Date(eventDate);
  if (Number.isNaN(date.getTime())) return fallbackLabel || "";

  const dateText = new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Tokyo"
  }).format(date);
  const weekday = new Intl.DateTimeFormat("ja-JP", {
    weekday: "short",
    timeZone: "Asia/Tokyo"
  }).format(date);

  return `${dateText}（${weekday}）`;
}

export default async function TournamentsPage() {
  const tournaments = await getTournaments();

  return (
    <>
      <Header />
      <DesktopSidebarLayout>
        <section id="tournaments" className="section" aria-labelledby="tournament-title">
          <div className="section-heading">
            <p className="eyebrow">Tournament</p>
            <h1 id="tournament-title">大会情報</h1>
            <p>沖縄県内で開催される大会を年間スケジュールで確認できます。</p>
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
            <div className="schedule-list">
              {tournaments.map((tournament) => (
                <article
                  key={tournament.id}
                  className="schedule-item searchable"
                  data-category={tournamentFilterCategory(tournament)}
                  data-keywords={tournamentKeywords(tournament)}
                  data-sort-date={tournamentSortDate(tournament)}
                >
                  <time>{tournament.month || "未定"}</time>
                  <div className="schedule-copy">
                    <h4>{tournament.title}</h4>
                    <p>
                      {[
                        tournamentDateLabel(tournament.eventDate, tournament.dateLabel),
                        tournament.venue
                      ].filter(Boolean).join(" / ") || "詳細確認中"}
                    </p>
                  </div>
                  <div className="schedule-actions" aria-label={`${tournament.title}の関連リンク`}>
                    {tournamentActionLinks(tournament).map((link) => (
                      link.url ? (
                        <a
                          key={link.label}
                          className="schedule-action-button"
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                        >
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
              ))}
            </div>
          </div>
        </section>
      </DesktopSidebarLayout>
      <Footer />
    </>
  );
}
