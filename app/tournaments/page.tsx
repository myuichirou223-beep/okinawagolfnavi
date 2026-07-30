import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { DesktopSidebarLayout } from "../components/DesktopSidebarLayout";
import {
  getTournaments,
  tournamentActionLinks,
  tournamentSortDate,
  tournamentTargetLabel
} from "../../lib/microcms";

export const revalidate = 300;

export const metadata = {
  title: "大会情報",
  description: "沖縄県内で開催されるゴルフ大会の年間スケジュール、募集要項、概要、成績表へのリンクを掲載しています。"
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

function BoardIcon({ type }: { type: "calendar" | "clock" | "organizer" | "venue" | "category" | "trophy" | "info" }) {
  const commonProps = {
    "aria-hidden": true,
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 2.6,
    viewBox: "0 0 24 24"
  };

  if (type === "calendar") {
    return (
      <svg {...commonProps}>
        <path d="M8 2.8v3.4M16 2.8v3.4M4.5 9.3h15" />
        <rect x="4.5" y="5.2" width="15" height="15.8" rx="2.2" />
      </svg>
    );
  }

  if (type === "clock") {
    return (
      <svg {...commonProps}>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7.5V12l3.2 2" />
      </svg>
    );
  }

  if (type === "organizer") {
    return (
      <svg {...commonProps}>
        <circle cx="12" cy="7.2" r="3.2" />
        <path d="M5.8 20c.8-4 3-6 6.2-6s5.4 2 6.2 6" />
      </svg>
    );
  }

  if (type === "venue") {
    return (
      <svg {...commonProps}>
        <path d="M12 21s6.5-5.8 6.5-11.2a6.5 6.5 0 0 0-13 0C5.5 15.2 12 21 12 21Z" />
        <circle cx="12" cy="9.8" r="2.2" />
      </svg>
    );
  }

  if (type === "category") {
    return (
      <svg {...commonProps}>
        <path d="M20.5 13.1 12.1 21 3 11.9V3h8.9l8.6 8.6v1.5Z" />
        <circle cx="8.2" cy="8.2" r="1.2" />
      </svg>
    );
  }

  if (type === "trophy") {
    return (
      <svg {...commonProps}>
        <path d="M8 4.5h8v5.2a4 4 0 0 1-8 0V4.5Z" />
        <path d="M8 6.5H5.5v2.2A3.2 3.2 0 0 0 8.7 12M16 6.5h2.5v2.2a3.2 3.2 0 0 1-3.2 3.3M12 14v3.2M8.8 20h6.4" />
      </svg>
    );
  }

  return (
    <svg {...commonProps}>
      <circle cx="12" cy="12" r="8.6" />
      <path d="M12 11.2v5M12 7.6h.01" />
    </svg>
  );
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
        <div className="tournament-date-group">
          <span className="tournament-date-icon"><BoardIcon type="calendar" /></span>
          <time>{eventDateText || tournament.dateLabel || tournament.month || "日程確認中"}</time>
        </div>
        <span className={isPast ? "tournament-countdown is-past" : "tournament-countdown"}>
          <BoardIcon type="clock" />
          {tournamentTimingLabel(daysUntil, isPast)}
        </span>
      </div>
      <h2>{tournament.title}</h2>
      <dl className="tournament-board-meta" aria-label={`${tournament.title}の基本情報`}>
        <div className="is-organizer">
          <dt><BoardIcon type="organizer" />主催者</dt>
          <dd>{tournament.organizer || "確認中"}</dd>
        </div>
        <div className="is-venue">
          <dt><BoardIcon type="venue" />会場</dt>
          <dd>{tournament.venue || tournament.area || "確認中"}</dd>
        </div>
      </dl>
      <div className="tournament-board-categories" aria-label="カテゴリー">
        <span><BoardIcon type="category" />カテゴリー</span>
        {tags.length ? (
          tags.map((tag) => (
            <em key={tag}><span className="tournament-tag-prefix" aria-hidden="true">#</span>{tag}</em>
          ))
        ) : (
          <em><span className="tournament-tag-prefix" aria-hidden="true">#</span>確認中</em>
        )}
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

export default async function TournamentsPage() {
  const tournaments = await getTournaments();
  const today = currentJstDate();
  const { upcoming, past } = splitTournamentsByTiming(tournaments, today.sortDate);

  return (
    <>
      <Header />
      <DesktopSidebarLayout mainClassName="tournament-test-shell">
        <section id="tournament-test" aria-labelledby="tournament-title">
          <div className="section-heading">
            <p className="eyebrow"><BoardIcon type="trophy" />Tournament</p>
            <h1 id="tournament-title">大会情報</h1>
            <p>沖縄県内で開催される大会を新しい告知ボード型レイアウトで確認できます。</p>
          </div>
          <div className="schedule-note">
            <BoardIcon type="info" />
            <p>掲載している日程は変更される場合があります。参加・観戦前に、公式ページや主催者発表で最新情報を再確認してください。</p>
          </div>
          <div className="tournament-tabs" role="tablist" aria-label="大会表示の切り替え">
            <button className="is-active" type="button" role="tab" aria-selected="true" data-tournament-tab="upcoming">
              <BoardIcon type="calendar" />
              これから開催
            </button>
            <button type="button" role="tab" aria-selected="false" data-tournament-tab="past">
              <BoardIcon type="calendar" />
              過去大会
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
