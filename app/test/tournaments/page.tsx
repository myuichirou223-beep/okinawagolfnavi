import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { DesktopSidebarLayout } from "../../components/DesktopSidebarLayout";
import {
  getTournaments,
  tournamentActionLinks,
  tournamentSortDate,
  tournamentTargetLabel
} from "../../../lib/microcms";

export const revalidate = 300;

export const metadata = {
  title: "大会情報 テストページ",
  description: "大会情報ページの新レイアウト確認用テストページです。"
};

function tournamentDateLabel(eventDate?: string, fallbackLabel?: string) {
  let date = tournamentDate(eventDate, fallbackLabel);

  if (!date) return fallbackLabel || "";

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

function tournamentDate(eventDate?: string, fallbackLabel?: string) {
  let date = eventDate ? new Date(eventDate) : null;

  if (!date || Number.isNaN(date.getTime())) {
    const label = fallbackLabel || "";
    const year = Number(label.match(/(\d{4})年/)?.[1] || new Date().getFullYear());
    const dateParts =
      label.match(/(\d{1,2})月\s*(\d{1,2})日/) ||
      label.match(/(\d{1,2})\/(\d{1,2})/);

    if (!dateParts) return null;
    date = new Date(`${year}-${dateParts[1].padStart(2, "0")}-${dateParts[2].padStart(2, "0")}T00:00:00+09:00`);
  }

  return Number.isNaN(date.getTime()) ? null : date;
}

function daysUntilTournament(eventDate: Date | null, todayDate: Date) {
  if (!eventDate) return null;

  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  return Math.round((eventDate.getTime() - todayDate.getTime()) / millisecondsPerDay);
}

function currentJstDate() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Tokyo"
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const isoDate = `${values.year}-${values.month}-${values.day}`;

  return {
    label: tournamentDateLabel(`${isoDate}T00:00:00+09:00`),
    date: new Date(`${isoDate}T00:00:00+09:00`),
    sortDate: Number(`${values.year}${values.month}${values.day}`)
  };
}

function tournamentTimingLabel(daysUntil: number | null, isPast: boolean) {
  if (isPast) return "開催済み";
  if (daysUntil === 0) return "本日開催";
  if (daysUntil && daysUntil > 0) return `開催まであと${daysUntil}日`;
  return "開催日確認中";
}

function tournamentCategoryTags(tournament: Awaited<ReturnType<typeof getTournaments>>[number]) {
  return tournamentTargetLabel(tournament)
    .split(/[・、,／/ ]+/)
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 4);
}

function splitTournamentsByTiming(
  tournaments: Awaited<ReturnType<typeof getTournaments>>,
  todaySortDate: number
) {
  const upcoming = tournaments
    .filter((tournament) => tournamentSortDate(tournament) >= todaySortDate)
    .sort((a, b) => tournamentSortDate(a) - tournamentSortDate(b));
  const past = tournaments
    .filter((tournament) => tournamentSortDate(tournament) < todaySortDate)
    .sort((a, b) => tournamentSortDate(b) - tournamentSortDate(a));

  return { upcoming, past };
}

function TournamentBoard({
  tournament,
  today
}: {
  tournament: Awaited<ReturnType<typeof getTournaments>>[number];
  today: ReturnType<typeof currentJstDate>;
}) {
  const eventDateText = tournament.dateLabel
    ? tournamentDateLabel(undefined, tournament.dateLabel)
    : tournamentDateLabel(tournament.eventDate);
  const eventDate = tournament.dateLabel
    ? tournamentDate(undefined, tournament.dateLabel)
    : tournamentDate(tournament.eventDate);
  const daysUntil = daysUntilTournament(eventDate, today.date);
  const isPast = tournamentSortDate(tournament) < today.sortDate;
  const tags = tournamentCategoryTags(tournament);
  const actionLinks = tournamentActionLinks(tournament);

  return (
    <article className="tournament-board">
      <div className="tournament-board-header">
        <time>{eventDateText || tournament.dateLabel || tournament.month || "日程確認中"}</time>
        <span className={isPast ? "tournament-countdown is-past" : "tournament-countdown"}>
          {tournamentTimingLabel(daysUntil, isPast)}
        </span>
      </div>
      <h2>{tournament.title}</h2>
      <dl className="tournament-board-meta" aria-label={`${tournament.title}の基本情報`}>
        <div>
          <dt>主催者</dt>
          <dd>{tournament.organizer || "確認中"}</dd>
        </div>
        <div>
          <dt>会場</dt>
          <dd>{tournament.venue || tournament.area || "確認中"}</dd>
        </div>
      </dl>
      <div className="tournament-board-categories" aria-label="カテゴリー">
        <span>カテゴリー</span>
        {tags.length ? tags.map((tag) => <em key={tag}>#{tag}</em>) : <em>#確認中</em>}
      </div>
      <div className="tournament-board-actions" aria-label={`${tournament.title}の関連リンク`}>
        {actionLinks.map((link) => (
          link.url ? (
            <a
              key={link.label}
              className="tournament-board-button"
              href={link.url}
              target="_blank"
              rel="noreferrer"
            >
              {link.label}
            </a>
          ) : (
            <span key={link.label} className="tournament-board-button is-disabled" aria-disabled="true">
              {link.label}
            </span>
          )
        ))}
      </div>
    </article>
  );
}

export default async function TournamentTestPage() {
  const tournaments = await getTournaments();
  const today = currentJstDate();
  const { upcoming, past } = splitTournamentsByTiming(tournaments, today.sortDate);

  return (
    <>
      <Header />
      <DesktopSidebarLayout>
        <section id="tournament-test" className="section" aria-labelledby="tournament-test-title">
          <div className="section-heading">
            <p className="eyebrow">Tournament Test</p>
            <h1 id="tournament-test-title">大会情報 テストページ</h1>
            <p>沖縄県内で開催される大会を新しい告知ボード型レイアウトで確認できます。</p>
            <p className="schedule-note">
              掲載している日程は変更される場合があります。参加・観戦前に、公式ページや主催者発表で最新情報を再確認してください。
            </p>
          </div>
          <div className="tournament-tabs" role="tablist" aria-label="大会表示の切り替え">
            <button className="is-active" type="button" role="tab" aria-selected="true" data-tournament-tab="upcoming">
              これから開催
              <span>{upcoming.length}</span>
            </button>
            <button type="button" role="tab" aria-selected="false" data-tournament-tab="past">
              過去大会
              <span>{past.length}</span>
            </button>
          </div>
          <div className="annual-schedule" aria-label="大会スケジュール">
            <div className="tournament-panel is-active" data-tournament-panel="upcoming">
              {upcoming.length ? (
                <div className="tournament-board-list">
                  {upcoming.map((tournament) => <TournamentBoard key={tournament.id} tournament={tournament} today={today} />)}
                </div>
              ) : (
                <p className="empty-message">これから開催される大会は確認中です。</p>
              )}
            </div>
            <div className="tournament-panel" data-tournament-panel="past" hidden>
              {past.length ? (
                <div className="tournament-board-list">
                  {past.map((tournament) => <TournamentBoard key={tournament.id} tournament={tournament} today={today} />)}
                </div>
              ) : (
                <p className="empty-message">開催済みの大会はまだありません。</p>
              )}
            </div>
          </div>
        </section>
      </DesktopSidebarLayout>
      <Footer />
    </>
  );
}
