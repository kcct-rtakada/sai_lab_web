import { MetadataRoute } from "next";
import Project from "@/components/DefaultStructure";
import { sai_news, sai_projects } from "@/components/constant";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projectsResponse = await fetch(sai_projects);
  const projects: Project[] = await projectsResponse.json();
  const filteredProjects = projects.filter((item) => item.id !== "");

  const newsResponse = await fetch(sai_news);
  const news: Project[] = await newsResponse.json();
  const filteredNews = news.filter((item) => item.id !== "");

  const lastModified = new Date();
  const baseURL = "https://sai.ac/";

  const paths: MetadataRoute.Sitemap = [
    {
      url: "https://sai.ac",
      lastModified,
    },
    {
      url: baseURL + "award",
      lastModified,
    },
    {
      url: baseURL + "contact",
      lastModified,
    },
    {
      url: baseURL + "member",
      lastModified,
    },
    {
      url: baseURL + "news",
      lastModified,
    },
    {
      url: baseURL + "project",
      lastModified,
    },
    {
      url: baseURL + "publication",
      lastModified,
    },
    {
      url: baseURL + "thesis",
      lastModified,
    },
  ];

  filteredProjects.forEach((item) => {
    paths.push({
      url: baseURL + "project/" + item.id,
      lastModified,
    });
  });

  filteredNews.forEach((item) => {
    paths.push({
      url: baseURL + "news/" + item.id,
      lastModified,
    });
  });

  return [...paths];
}
