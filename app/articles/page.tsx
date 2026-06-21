import type { Metadata } from "next";
import { DesktopSidebarLayout } from "../components/DesktopSidebarLayout";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { articlePath, formatDate, getArticles } from "../../lib/microcms";
import { ArticlesList, type ArticleListItem } from "./ArticlesList";

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
  const articleListItems: ArticleListItem[] = articles.map((article) => ({
    id: article.id,
    title: article.title,
    category: article.category || "おすすめ",
    description: article.description || "沖縄のゴルフをもっと楽しむための記事です。",
    imageUrl: article.eyecatch?.url || "/assets/logo.png",
    href: articlePath(article),
    published: article.published || "",
    publishedLabel: article.published ? formatDate(article.published) : ""
  }));

  return (
    <>
      <Header />
      <DesktopSidebarLayout>
        <section id="articles" className="section articles-section" aria-labelledby="articles-page-title">
          <div className="section-heading">
            <p className="eyebrow">Articles</p>
            <h1 id="articles-page-title">記事</h1>
            <p>沖縄でゴルフを楽しむ人、これから始める人、県外から訪れる人に向けた記事を掲載します。</p>
          </div>
          <ArticlesList articles={articleListItems} />
        </section>
      </DesktopSidebarLayout>
      <Footer articleLink />
    </>
  );
}
