import {
  articlePath,
  getArticles,
  getPartners,
  type Article,
  type Partner
} from "../../lib/microcms";
import { PartnerLogoCarousel } from "./PartnerLogoCarousel";

const googleFormDirectUrl = "https://forms.gle/SKkamSAieuaUjuTW6";
const fallbackVisual = "/assets/hero-golfer.jpg";

type PortalSidebarProps = {
  articles?: Article[];
  partners?: Partner[];
};

function articleImage(article: Article) {
  return article.eyecatch?.url || fallbackVisual;
}

function pickRandomArticles(articles: Article[], count = 3) {
  const items = [...articles];
  for (let index = items.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [items[index], items[randomIndex]] = [items[randomIndex], items[index]];
  }
  return items.slice(0, count);
}

export async function PortalSidebar({
  articles: providedArticles,
  partners: providedPartners
}: PortalSidebarProps = {}) {
  const [allArticles, allPartners] = await Promise.all([
    providedArticles ? Promise.resolve(providedArticles) : getArticles(),
    providedPartners ? Promise.resolve(providedPartners) : getPartners()
  ]);
  const sidebarArticles = pickRandomArticles(allArticles);

  return (
    <aside className="home-sidebar portal-shared-sidebar" aria-label="サイド情報">
      <section className="sidebar-box sidebar-hero-ad is-recruiting" aria-label="広告枠A" data-ad-slot="A">
        <a href={googleFormDirectUrl} target="_blank" rel="noreferrer">
          <span className="sidebar-ad-slot-label">広告枠 A</span>
          <strong>広告掲載パートナー募集中</strong>
          <small>サイド上部の注目枠でPRできます</small>
          <em>掲載のお問い合わせ</em>
        </a>
      </section>

      <a className="sidebar-beginner-guide-banner" href="/beginner" aria-label="ゴルフデビューガイドを見る">
        <img src="/assets/beginner/sidebar-debut-guide.png" alt="" loading="lazy" />
      </a>

      <a className="sidebar-beginner-guide-banner sidebar-junior-feature-banner" href="/junior" aria-label="ジュニア特設ページを見る">
        <img src="/assets/junior/sidebar-junior-feature.png" alt="" loading="lazy" />
      </a>

      <section className="sidebar-box sidebar-tournament-card" aria-labelledby="shared-sidebar-articles-title">
        <div className="sidebar-heading">
          <h2 id="shared-sidebar-articles-title">おすすめ記事</h2>
          <a href="/articles">記事一覧</a>
        </div>
        <div className="sidebar-tournament-list">
          {sidebarArticles.map((article) => (
            <a key={article.id} href={articlePath(article)}>
              <img src={articleImage(article)} alt="" loading="lazy" />
              <span>
                <strong>{article.title}</strong>
              </span>
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
