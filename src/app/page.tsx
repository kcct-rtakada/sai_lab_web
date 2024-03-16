import SEO from "@/components/common/SEO";
import type { Metadata } from "next";
import HomeContent from "@/components/client_page/HomeContent";
import { fetchNews } from "@/components/GASFetch";
import { News } from "@/components/DefaultStructure";

export async function generateMetadata(): Promise<Metadata> {
  return SEO({
    title: undefined,
    description: undefined,
    url: `https://sai.ac`,
    imageUrl: undefined,
  });
}

export default async function Home() {
  const response = await fetchNews();
  const newsList: News[] = await response.json();
  const filteredNews = newsList.filter((item) => item.id !== "");
  return <HomeContent newsList={filteredNews} />;
}
