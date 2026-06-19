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
  const article = await getArticle(slug);

  if (!article) notFound();

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
