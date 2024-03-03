import News from "@/components/DefaultStructure";
import { sai_news } from "@/components/constant";
import NewsViewer from "@/components/NewsViewer";
import SEO from "@/components/SEO";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return SEO({
    title: "News",
    description: "SAI (髙田研究室)のニュース一覧",
    url: `https://sai.ac/news`,
    imageUrl: undefined,
  });
}

export default async function NewsList() {
  const response = await fetch(sai_news);
  const newsList: News[] = await response.json();
  const filteredNews = newsList.filter((item) => item.id !== "");

  return <NewsViewer _newsList={filteredNews} />;
}
