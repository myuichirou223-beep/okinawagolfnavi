import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { formatArticleBody } from "../../../lib/articleBody";
import { articlePath, formatDate, getArticle, getArticles } from "../../../lib/microcms";

type ArticlePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const revalidate = 300;

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((article) => ({
    slug: `${article.slug}.html`
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

        <div className="article-detail-layout">
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

            <footer className="article-footer-nav">
              <p>最後までお読みいただきありがとうございます。</p>
              <a href="/articles">記事一覧に戻る</a>
            </footer>
          </article>

          <aside className="article-sidebar" aria-label="記事サイドバー">
            <section className="article-sidebar-panel">
              <p className="article-sidebar-label">RELATED ARTICLES</p>
              <h2>あわせて読みたい</h2>
              <div className="article-related-list">
                {relatedArticles.map((item) => (
                  <a key={item.id} className="article-related-card" href={articlePath(item)}>
                    <img src={item.eyecatch?.url || "/assets/logo.png"} alt="" />
                    <span>
                      <small>{item.category || "記事"}</small>
                      <strong>{item.title}</strong>
                      {item.published ? <time dateTime={item.published}>{formatDate(item.published)}</time> : null}
                    </span>
                  </a>
                ))}
              </div>
            </section>

            <section className="article-sidebar-panel article-sidebar-guide">
              <p className="article-sidebar-label">OKINAWA GOLF NAVI</p>
              <h2>沖縄のゴルフ情報を探す</h2>
              <p>大会・ゴルフ場・練習場など、目的に合わせて県内情報を確認できます。</p>
              <a href="/courses">ゴルフ場を見る</a>
              <a href="/practice">練習場を見る</a>
            </section>
          </aside>
        </div>
      </main>
      <Footer articleLink />
    </>
  );
}
