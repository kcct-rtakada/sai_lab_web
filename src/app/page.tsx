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

// 日本語英語ボタン有
export default async function Home() {
  const response = await fetchNews();
  const newsList: News[] = await response.json();
  // 空要素がある場合は取り除く
  const filteredNews = newsList.filter((item) => item.id !== "");
  // クライアントコンポーネントにより描画
  return <HomeContent newsList={filteredNews} />;
}
