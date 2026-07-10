import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { UpcomingSchedule, type UpcomingScheduleItem } from "../components/UpcomingSchedule";
import {
  getEvents,
  getTournaments,
  tournamentActionLinks,
  tournamentFilterCategory,
  tournamentKeywords,
  tournamentSortDate,
  tournamentTargetLabel
} from "../../lib/microcms";

const googleFormDirectUrl = "https://forms.gle/SKkamSAieuaUjuTW6";
export const revalidate = 300;

const juniorProfiles = [
  {
    label: "PLAYER STORY",
    title: "はじめての大会に挑む、ジュニアゴルファーの一日",
    name: "掲載選手 募集中",
    description: "練習のきっかけ、目標、大会当日の気持ちまで。ひとりの挑戦を丁寧に紹介します。",
    imageUrl: "/assets/junior/coming-soon.png",
    imageAlt: "COMING SOON",
    tags: ["小学生", "大会デビュー", "練習記録"],
    tone: "blue"
  },
  {
    label: "PRACTICE NOTE",
    title: "毎週の練習で積み重ねていること",
    name: "レッスン生 募集中",
    description: "ショット、パター、体づくり。ジュニア世代がどんな練習をしているかを紹介します。",
    imageUrl: "/assets/junior/coming-soon.png",
    imageAlt: "COMING SOON",
    tags: ["練習場", "レッスン", "目標設定"],
    tone: "green"
  },
  {
    label: "FAMILY SUPPORT",
    title: "家族と一緒に続けるゴルフの楽しさ",
    name: "親子ストーリー 募集中",
    description: "送迎、応援、道具選び。ジュニアゴルフを支える家族の声も残していきます。",
    imageUrl: "/assets/junior/coming-soon.png",
    imageAlt: "COMING SOON",
    tags: ["親子", "サポート", "成長記録"],
    tone: "orange"
  },
  {
    label: "NEXT GOAL",
    title: "次に目指すスコア、次に出たい大会",
    name: "チャレンジ枠 募集中",
    description: "今の目標やこれから挑戦したいことを、写真とコメントで紹介します。",
    imageUrl: "/assets/junior/coming-soon.png",
    imageAlt: "COMING SOON",
    tags: ["目標", "大会", "チャレンジ"],
    tone: "pink"
  },
  {
    label: "NEW STORY",
    title: "新しいジュニアゴルファーの紹介枠",
    name: "追加掲載 募集中",
    description: "練習風景、大会の挑戦、これからの目標など、追加の紹介枠として掲載できます。",
    imageUrl: "/assets/junior/coming-soon.png",
    imageAlt: "COMING SOON",
    tags: ["追加掲載", "ジュニア", "募集中"],
    tone: "green"
  }
];

const featureSteps = [
  {
    title: "写真で伝える",
    text: "本人の雰囲気が伝わる写真を大きく掲載。大会、練習、親子ショットにも対応します。"
  },
  {
    title: "言葉で残す",
    text: "好きなクラブ、得意なショット、これからの目標など、本人の言葉を短く紹介します。"
  },
  {
    title: "沖縄の未来へつなぐ",
    text: "ジュニアゴルファー同士、保護者、指導者、施設がつながるきっかけを作ります。"
  }
];

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

function sortDateToDate(value: number) {
  const text = String(value);
  if (text.length !== 8) return null;
  const year = Number(text.slice(0, 4));
  const month = Number(text.slice(4, 6));
  const day = Number(text.slice(6, 8));
  if (!year || !month || !day || day > 31) return null;
  return new Date(year, month - 1, day);
}

function parseEventDate(value?: string) {
  const dateText = value?.slice(0, 10) || "";
  const match = dateText.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;

  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return Number.isNaN(date.getTime()) ? null : date;
}

function scheduleDateLabel(date: Date | null) {
  if (!date) return "開催日確認中";
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日（${weekdays[date.getDay()]}）`;
}

function dateCountdownLabel(date: Date) {
  const today = getJstToday();
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const days = Math.ceil((target.getTime() - today.getTime()) / 86400000);
  if (days > 0) return `開催まであと${days}日`;
  if (days === 0) return "本日開催";
  return "開催済み";
}

function firstAvailableTournamentUrl(tournament: Awaited<ReturnType<typeof getTournaments>>[number]) {
  return tournamentActionLinks(tournament).find((link) => link.url)?.url || "/tournaments";
}

function isJuniorText(text: string) {
  return ["ジュニア", "学生", "U-22", "U22", "中学生", "高校生", "小学生"].some((keyword) => text.includes(keyword));
}

export const metadata = {
  title: "ジュニア特集",
  description: "沖縄のジュニアゴルファーをひとりひとり紹介する特集ページです。"
};

export default async function JuniorFeaturePage() {
  const [tournaments, events] = await Promise.all([getTournaments(), getEvents()]);
  const todaySortValue = dateToSortValue(getJstToday());
  const fallbackJuniorScheduleItems: UpcomingScheduleItem[] = [
    {
      id: "fallback-junior-prefecture-2026",
      type: "tournament" as const,
      title: "第30回沖縄県民ゴルフ ジュニア選手権大会",
      audience: "ジュニア",
      venue: "オーシャンキャッスルカントリークラブ",
      eventDate: "2026-08-07",
      dateLabel: scheduleDateLabel(new Date(2026, 7, 7)),
      countdownLabel: dateCountdownLabel(new Date(2026, 7, 7)),
      href: "http://www.okinawakengolfasc.jp/kensyusaikyogi/430-2026-2.html"
    },
    {
      id: "fallback-kanucha-junior-cup-2026",
      type: "tournament" as const,
      title: "第22回 ジュニアゴルフ・カヌチャカップ",
      audience: "ジュニア",
      venue: "カヌチャゴルフコース",
      eventDate: "2026-08-29",
      dateLabel: scheduleDateLabel(new Date(2026, 7, 29)),
      countdownLabel: dateCountdownLabel(new Date(2026, 7, 29)),
      href: "https://www.kanucha.jp/golf/information/1603782"
    }
  ].filter((item) => dateToSortValue(parseEventDate(item.eventDate) || new Date(0)) >= todaySortValue);
  const juniorScheduleItems: UpcomingScheduleItem[] = [
    ...tournaments.map<UpcomingScheduleItem | null>((tournament) => {
      const searchableText = [
        tournamentFilterCategory(tournament),
        tournamentKeywords(tournament),
        tournament.title,
        tournamentTargetLabel(tournament),
        fieldText(tournament.category),
        tournament.description,
        tournament.tags,
        tournament.organizer
      ].filter(Boolean).join(" ");
      if (!isJuniorText(searchableText)) return null;

      const date = parseEventDate(tournament.eventDate) || sortDateToDate(tournamentSortDate(tournament));
      if (!date || dateToSortValue(date) < todaySortValue) return null;
      const eventDate = tournament.eventDate?.slice(0, 10) || [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0")
      ].join("-");

      return {
        id: `junior-tournament-${tournament.id}`,
        type: "tournament" as const,
        title: tournament.title,
        audience: tournamentTargetLabel(tournament),
        venue: tournament.venue || tournament.area || "開催場所確認中",
        eventDate,
        dateLabel: scheduleDateLabel(date),
        countdownLabel: dateCountdownLabel(date),
        href: firstAvailableTournamentUrl(tournament)
      };
    }),
    ...events.map<UpcomingScheduleItem | null>((event) => {
      const searchableText = [
        event.title,
        fieldText(event.category),
        event.description,
        event.tags,
        event.venue,
        event.location
      ].filter(Boolean).join(" ");
      if (!isJuniorText(searchableText)) return null;

      const date = parseEventDate(event.eventDate);
      if (!date || dateToSortValue(date) < todaySortValue) return null;

      return {
        id: `junior-event-${event.id}`,
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
  const visibleJuniorScheduleItems = juniorScheduleItems.length ? juniorScheduleItems : fallbackJuniorScheduleItems;

  return (
    <>
      <Header />
      <main id="main" className="junior-feature-page">
        <section className="junior-feature-hero" aria-labelledby="junior-feature-title">
          <div className="junior-feature-hero__heading">
            <p className="junior-feature-hero__eyebrow">Junior Golf Feature</p>
            <h1 id="junior-feature-title">JUNIOR PICK UP .</h1>
          </div>

          <div className="junior-profile-grid" aria-label="ジュニアゴルファー紹介">
            {juniorProfiles.map((profile) => (
              <article key={profile.label} className={`junior-profile-card tone-${profile.tone}`}>
                <div className="junior-profile-card__image">
                  <img src={profile.imageUrl} alt={profile.imageAlt} />
                  <span>{profile.label}</span>
                </div>
                <div className="junior-profile-card__body">
                  <h2>{profile.title}</h2>
                  <p className="junior-profile-card__name">{profile.name}</p>
                  <p>{profile.description}</p>
                  <div className="junior-profile-card__tags" aria-label="紹介タグ">
                    {profile.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="junior-feature-schedule upcoming-schedule-section" aria-labelledby="junior-feature-schedule-title">
          <div className="portal-section-heading">
            <h2 id="junior-feature-schedule-title">ジュニア向けの大会・イベント</h2>
            <p>ジュニア、学生、U-22世代が参加しやすい開催予定をまとめています。</p>
          </div>
          <UpcomingSchedule items={visibleJuniorScheduleItems} />
          <div className="upcoming-schedule-links">
            <a href="/tournaments">大会一覧を見る</a>
            <a href="/events">イベント一覧を見る</a>
          </div>
        </section>

        <aside className="junior-feature-banner" aria-label="ジュニア向けイベント運営相談">
          <a href={googleFormDirectUrl} target="_blank" rel="noreferrer">
            <img
              src="/assets/junior/junior-event-consulting-banner.png"
              alt="ジュニア向けイベントに関して、運営相談お待ちしてます。開催したい思いのある方、企画・運営のお手伝いします。お問い合わせはこちらから"
            />
          </a>
        </aside>

        <section className="junior-feature-section" aria-labelledby="junior-feature-flow-title">
          <div className="junior-feature-section__heading">
            <p>Feature Format</p>
            <h2 id="junior-feature-flow-title">紹介ページで掲載できること</h2>
          </div>
          <div className="junior-feature-step-grid">
            {featureSteps.map((step, index) => (
              <article key={step.title} className="junior-feature-step">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </section>

      </main>
      <Footer articleLink />
    </>
  );
}
