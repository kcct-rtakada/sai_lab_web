import { News } from "@/components/DefaultStructure";
import NewsViewer from "@/components/news_list/NewsViewer";
import SEO from "@/components/common/SEO";
import type { Metadata } from "next";
import { fetchNews } from "@/components/GASFetch";
import { Suspense } from "react";

export async function generateMetadata(): Promise<Metadata> {
  return SEO({
    title: "News",
    description: "SAI (髙田研究室)のニュース一覧",
    url: `https://sai.ac/news`,
    imageUrl: undefined,
  });
}

export default async function NewsList() {
  const response = await fetchNews();
  const newsList: News[] = await response.json();
  const filteredNews = newsList.filter((item) => item.id !== "");

  return (
    <Suspense>
      <NewsViewer _newsList={filteredNews} />
    </Suspense>
  );
}
