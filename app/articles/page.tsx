import type { Metadata } from "next";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { articleKeywords, articlePath, getArticles } from "../../lib/microcms";

export const metadata: Metadata = {
  title: "記事一覧",
  description: "沖縄のゴルフ初心者、観光ゴルフ、大会参加に役立つブログ記事一覧です。",
  alternates: {
    canonical: "/articles"
  }
};

export const revalidate = 300;

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <>
      <Header />
      <main id="main" className="article-page">
        <section className="section articles-section" aria-labelledby="articles-page-title">
          <div className="section-heading">
            <p className="eyebrow">Articles</p>
            <h1 id="articles-page-title">読み物・ブログ記事</h1>
            <p>沖縄でゴルフを楽しむ人、これから始める人、県外から訪れる人に向けた記事を掲載します。</p>
          </div>
          <div className="article-grid">
            {articles.map((article) => (
              <article key={article.id} className="article-card searchable" data-keywords={articleKeywords(article)}>
                <a className="article-card-link" href={articlePath(article)}>
                  <div className={`article-image${article.eyecatch?.url ? "" : " article-image-fallback"}`}>
                    <img src={article.eyecatch?.url || "/assets/logo.png"} alt={article.title} />
                  </div>
                  <h3>{article.title}</h3>
                </a>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer articleLink />
    </>
  );
}
