import { MetadataRoute } from "next";
import { Project } from "@/components/DefaultStructure";
import { fetchNews, fetchProjects } from "@/components/GASFetch";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projectsResponse = await fetchProjects();
  const projects: Project[] = await projectsResponse.json();
  const filteredProjects = projects.filter((item) => item.id !== "");

  const newsResponse = await fetchNews();
  const news: Project[] = await newsResponse.json();
  const filteredNews = news.filter((item) => item.id !== "");

  const lastModified = new Date();
  const baseURL = "https://sai.ac/";

  // 固定ページ
  const staticPaths = [
    {
      url: "https://sai.ac",
      lastModified,
      changeFrequency: "yearly",
      priority: 1.0,
    },
    {
      url: baseURL + "award",
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: baseURL + "contact",
      lastModified,
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      url: baseURL + "member",
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: baseURL + "news",
      lastModified,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: baseURL + "project",
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: baseURL + "publication",
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: baseURL + "thesis",
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const dynamicPaths: any[] = [];

  // ニュースとプロジェクトのリストをsitemapに追加
  filteredProjects.forEach((item) => {
    dynamicPaths.push({
      url: baseURL + "project/" + item.id,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    });
  });

  filteredNews.forEach((item) => {
    dynamicPaths.push({
      url: baseURL + "news/" + item.id,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  });

  return [...staticPaths, ...dynamicPaths];
}
