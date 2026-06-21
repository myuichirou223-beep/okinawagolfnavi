"use client";

import { useMemo, useState } from "react";

export type ArticleListItem = {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  href: string;
  published: string;
  publishedLabel: string;
};

type SortKey = "newest" | "oldest" | "title" | "category";

type ArticlesListProps = {
  articles: ArticleListItem[];
};

export function ArticlesList({ articles }: ArticlesListProps) {
  const [sortKey, setSortKey] = useState<SortKey>("newest");

  const sortedArticles = useMemo(() => {
    const items = [...articles];

    if (sortKey === "oldest") {
      return items.sort((a, b) => Date.parse(a.published || "1970-01-01") - Date.parse(b.published || "1970-01-01"));
    }

    if (sortKey === "title") {
      return items.sort((a, b) => a.title.localeCompare(b.title, "ja"));
    }

    if (sortKey === "category") {
      return items.sort(
        (a, b) => a.category.localeCompare(b.category, "ja") || b.published.localeCompare(a.published)
      );
    }

    return items.sort((a, b) => Date.parse(b.published || "1970-01-01") - Date.parse(a.published || "1970-01-01"));
  }, [articles, sortKey]);

  return (
    <>
      <div className="articles-toolbar">
        <p><strong>{articles.length}</strong>件の記事</p>
        <label>
          <span>並び替え</span>
          <select value={sortKey} onChange={(event) => setSortKey(event.target.value as SortKey)}>
            <option value="newest">新しい順</option>
            <option value="oldest">古い順</option>
            <option value="title">タイトル順</option>
            <option value="category">カテゴリー順</option>
          </select>
        </label>
      </div>

      <div className="articles-news-list" aria-live="polite">
        {sortedArticles.map((article) => (
          <article key={article.id} className="articles-news-item">
            <a href={article.href}>
              <div className="articles-news-image">
                <img src={article.imageUrl} alt="" loading="lazy" />
              </div>
              <div className="articles-news-body">
                <div className="articles-news-meta">
                  <span>{article.category}</span>
                  {article.published ? <time dateTime={article.published}>{article.publishedLabel}</time> : null}
                </div>
                <h2>{article.title}</h2>
                <p>{article.description}</p>
              </div>
            </a>
          </article>
        ))}
      </div>
    </>
  );
}
