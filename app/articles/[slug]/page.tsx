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
  const article = await getArticle(slug);

  if (!article) notFound();

  return (
    <>
      <Header />
      <main id="main" className="article-page">
        <article className="article-body">
          <p className="eyebrow">{article.category || "Article"}</p>
          <h1>{article.title}</h1>
          {article.description ? <p className="article-lead">{article.description}</p> : null}
          <div className="article-meta">
            {article.published ? `公開日: ${formatDate(article.published)}` : "公開日: 準備中"}
          </div>

          {article.eyecatch?.url ? (
            <img className="article-eyecatch" src={article.eyecatch.url} alt="" />
          ) : null}

          <div
            className="article-html"
            dangerouslySetInnerHTML={{ __html: formatArticleBody(article.body) }}
          />

          <aside className="ad-slot" aria-label="広告">
            <span>広告</span>
            <strong>記事内容に関連するパートナー掲載枠</strong>
            <p>読者の邪魔にならない位置に、沖縄県内のゴルフ関連サービスを紹介します。</p>
          </aside>
        </article>
      </main>
      <Footer articleLink />
    </>
  );
}
