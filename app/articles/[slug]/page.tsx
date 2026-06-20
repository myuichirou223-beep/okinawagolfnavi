import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { PortalSidebar } from "../../components/PortalSidebar";
import { formatArticleBody } from "../../../lib/articleBody";
import {
  articlePath,
  articleRouteSlug,
  formatDate,
  getArticle,
  getArticles
} from "../../../lib/microcms";

type ArticlePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const recommendedLinks = [
  {
    href: "/courses",
    label: "ゴルフ場",
    title: "沖縄県内のゴルフ場をエリア・コース種別から探す",
    image: "/assets/hero-golfer.jpg"
  },
  {
    href: "/practice",
    label: "練習場",
    title: "屋内・屋外の練習場をエリア別にチェック",
    image: "/assets/hero-golfer.jpg"
  },
  {
    href: "/tournaments",
    label: "大会情報",
    title: "これから開催される大会と募集情報を確認する",
    image: "/assets/hero-golfer.jpg"
  }
];

function articleRelatedLinks(category?: string) {
  const commonLinks = [
    { href: "/courses", title: "沖縄県内のゴルフ場一覧" },
    { href: "/practice", title: "沖縄県内の練習場一覧" },
    { href: "/tournaments", title: "大会スケジュール・募集情報" },
    { href: "/lessons", title: "ゴルフレッスン情報" }
  ];

  if (category?.includes("大会")) {
    return [commonLinks[2], commonLinks[0], { href: "/events", title: "ゴルフイベント情報" }, commonLinks[1]];
  }
  if (category?.includes("観光")) {
    return [commonLinks[0], commonLinks[1], { href: "/events", title: "沖縄のゴルフイベント" }, commonLinks[2]];
  }
  return [commonLinks[1], commonLinks[0], commonLinks[3], commonLinks[2]];
}

export const revalidate = 300;

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((article) => ({
    slug: `${articleRouteSlug(article)}.html`
  }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) return {};

  const title = article.seoTitle || article.title;
  const description = article.seoDescription || article.description || `${article.title}の記事ページです。`;
  const url = articlePath(article);
  const image = article.eyecatch?.url || "/assets/logo.png";

  return {
    title,
    description,
    alternates: {
      canonical: url
    },
    openGraph: {
      type: "article",
      title,
      description,
      url,
      images: [image],
      publishedTime: article.published
    },
    twitter: {
      card: "summary_large_image"
    }
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const [article, articles] = await Promise.all([getArticle(slug), getArticles()]);

  if (!article) notFound();

  const relatedArticles = articles
    .filter((item) => item.id !== article.id)
    .sort((a, b) => Number(b.category === article.category) - Number(a.category === article.category))
    .slice(0, 4);
  const relatedLinks = articleRelatedLinks(article.category);

  return (
    <>
      <Header />
      <main id="main" className="article-page article-detail-page">
        <nav className="article-breadcrumb" aria-label="パンくずリスト">
          <a href="/">ホーム</a>
          <span aria-hidden="true">›</span>
          <a href="/articles">記事</a>
          <span aria-hidden="true">›</span>
          <span>{article.category || "記事"}</span>
        </nav>

        <div className="article-detail-layout has-portal-sidebar">
          <article className="article-body">
            <header className="article-header">
              <p className="eyebrow">{article.category || "Article"}</p>
              <h1>{article.title}</h1>
              {article.description ? <p className="article-lead">{article.description}</p> : null}
              <div className="article-meta">
                <time dateTime={article.published}>
                  {article.published ? formatDate(article.published) : "公開準備中"}
                </time>
                <span>おきなわGOLFなび編集部</span>
              </div>
            </header>

            {article.eyecatch?.url ? (
              <figure className="article-eyecatch-frame">
                <img className="article-eyecatch" src={article.eyecatch.url} alt="" />
              </figure>
            ) : null}

            <div
              className="article-html"
              dangerouslySetInnerHTML={{ __html: formatArticleBody(article.body) }}
            />

            <aside className="ad-slot article-inline-ad" aria-label="広告">
              <span>広告枠</span>
              <strong>記事内容に関連するパートナー掲載枠</strong>
              <p>沖縄県内のゴルフ関連サービスを紹介するスペースです。</p>
            </aside>

            {relatedArticles.length ? (
              <section className="article-related-section" aria-labelledby="related-articles-title">
                <div className="article-related-heading">
                  <p>RELATED ARTICLES</p>
                  <h2 id="related-articles-title">あわせて読みたい</h2>
                </div>
                <div className="article-related-grid">
                  {relatedArticles.map((item) => (
                    <a key={item.id} className="article-related-item" href={articlePath(item)}>
                      <img src={item.eyecatch?.url || "/assets/logo.png"} alt="" loading="lazy" />
                      <span>
                        <small>{item.category || "記事"}</small>
                        <strong>{item.title}</strong>
                        {item.published ? <time dateTime={item.published}>{formatDate(item.published)}</time> : null}
                      </span>
                    </a>
                  ))}
                </div>
                <a className="article-related-more" href="/articles">すべての記事を見る</a>
              </section>
            ) : null}

            <section className="article-link-section" aria-labelledby="article-links-title">
              <h2 id="article-links-title">関連リンク</h2>
              <div className="article-link-list">
                {relatedLinks.map((link) => (
                  <a key={link.href} href={link.href}>
                    <span>{link.title}</span>
                    <b aria-hidden="true">›</b>
                  </a>
                ))}
              </div>
            </section>

            <section className="article-recommend-section" aria-labelledby="article-recommend-title">
              <h2 id="article-recommend-title">おすすめリンク</h2>
              <div className="article-recommend-grid">
                {recommendedLinks.map((link) => (
                  <a key={link.href} href={link.href}>
                    <img src={link.image} alt="" loading="lazy" />
                    <span>
                      <small>{link.label}</small>
                      <strong>{link.title}</strong>
                    </span>
                  </a>
                ))}
              </div>
            </section>

            <footer className="article-footer-nav">
              <p>最後までお読みいただきありがとうございます。</p>
              <a href="/articles">記事一覧に戻る</a>
            </footer>
          </article>

          <PortalSidebar />
        </div>
      </main>
      <Footer articleLink />
    </>
  );
}
