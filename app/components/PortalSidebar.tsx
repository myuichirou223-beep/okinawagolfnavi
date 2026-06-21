import {
  getPartners,
  getTournaments,
  tournamentActionLinks,
  tournamentSortDate,
  type Partner,
  type Tournament
} from "../../lib/microcms";
import { PartnerLogoCarousel } from "./PartnerLogoCarousel";

const googleFormDirectUrl = "https://forms.gle/SKkamSAieuaUjuTW6";
const fallbackVisual = "/assets/hero-golfer.jpg";

type PortalSidebarProps = {
  tournaments?: Tournament[];
  partners?: Partner[];
};

function externalLinkProps(url: string) {
  return url.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {};
}

function firstAvailableTournamentUrl(tournament: Tournament) {
  return tournamentActionLinks(tournament).find((link) => link.url)?.url || "/tournaments";
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

function countdownLabel(tournament: Tournament) {
  const date = sortDateToDate(tournamentSortDate(tournament));
  if (!date) return "日程確認中";
  const jstNow = new Date(Date.now() + 9 * 60 * 60 * 1000);
  const today = new Date(jstNow.getUTCFullYear(), jstNow.getUTCMonth(), jstNow.getUTCDate());
  const days = Math.ceil((date.getTime() - today.getTime()) / 86400000);
  if (days > 0) return `あと${days}日`;
  if (days === 0) return "本日開催";
  return "開催済み";
}

export async function PortalSidebar({
  tournaments: providedTournaments,
  partners: providedPartners
}: PortalSidebarProps = {}) {
  const [allTournaments, allPartners] = await Promise.all([
    providedTournaments ? Promise.resolve(providedTournaments) : getTournaments(),
    providedPartners ? Promise.resolve(providedPartners) : getPartners()
  ]);
  const sidebarTournaments = [...allTournaments]
    .sort((a, b) => tournamentSortDate(a) - tournamentSortDate(b))
    .slice(0, 3);

  return (
    <aside className="home-sidebar portal-shared-sidebar" aria-label="サイド情報">
      <section className="sidebar-box sidebar-hero-ad" aria-label="広告枠A" data-ad-slot="A">
        <a href="https://haisaigolf.com/" target="_blank" rel="noreferrer">
          <span className="sidebar-ad-slot-label">広告枠 A</span>
          <img src="/assets/ads/haisai.png" alt="県内最大の女性ゴルフコミュニティ Haisai Golf Girls" />
        </a>
      </section>

      <section className="sidebar-box sidebar-tournament-card" aria-labelledby="shared-sidebar-tournament-title">
        <div className="sidebar-heading">
          <h2 id="shared-sidebar-tournament-title">注目大会</h2>
          <span>PR枠あり</span>
        </div>
        <div className="sidebar-tournament-list">
          {sidebarTournaments.map((tournament) => {
            const href = firstAvailableTournamentUrl(tournament);
            return (
              <a key={tournament.id} href={href} {...externalLinkProps(href)}>
                <img src={fallbackVisual} alt="" loading="lazy" />
                <span>
                  <strong>{tournament.title}</strong>
                  <small>{tournament.venue || "開催コース確認中"}</small>
                </span>
                <em>{countdownLabel(tournament)}</em>
              </a>
            );
          })}
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

      <section className="partners-section sidebar-partners" aria-labelledby="shared-partners-title">
        <div className="portal-section-heading">
          <p className="portal-eyebrow">Partners</p>
          <h2 id="shared-partners-title">パートナー</h2>
        </div>
        <PartnerLogoCarousel partners={allPartners} />
      </section>
    </aside>
  );
}
