import type { Metadata } from "next";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { articleKeywords, articlePath, formatDate, getArticles } from "../../lib/microcms";

export const metadata: Metadata = {
  title: "記事一覧",
  description: "沖縄のゴルフ初心者、観光ゴルフ、大会参加に役立つ記事一覧です。",
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
      <main id="main">
        <section id="articles" className="section articles-section" aria-labelledby="articles-page-title">
          <div className="section-heading">
            <p className="eyebrow">Articles</p>
            <h1 id="articles-page-title">記事</h1>
            <p>沖縄でゴルフを楽しむ人、これから始める人、県外から訪れる人に向けた記事を掲載します。</p>
          </div>
          <div className="portal-card-grid four">
            {articles.map((article) => (
              <article key={article.id} className="blog-card searchable" data-keywords={articleKeywords(article)}>
                <a href={articlePath(article)}>
                  <img src={article.eyecatch?.url || "/assets/logo.png"} alt="" />
                  <div className="blog-card-body">
                    {article.published ? <time dateTime={article.published}>{formatDate(article.published)}</time> : null}
                    <h3>{article.title}</h3>
                    <p>{article.description || "沖縄のゴルフをもっと楽しむための記事です。"}</p>
                  </div>
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
