import type { MetadataRoute } from "next";
import { articlePath, coursePath, getArticles, getCourses } from "../lib/microcms";

const siteUrl = "https://okinawagolfnavi.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getArticles();
  const courses = await getCourses();

  return [
    {
      url: siteUrl,
      lastModified: new Date()
    },
    {
      url: `${siteUrl}/articles`,
      lastModified: new Date()
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date()
    },
    ...articles.map((article) => ({
      url: `${siteUrl}${articlePath(article)}`,
      lastModified: article.published ? new Date(article.published) : new Date()
    })),
    ...courses.map((course) => ({
      url: `${siteUrl}${coursePath(course)}`,
      lastModified: new Date()
    }))
  ];
}
