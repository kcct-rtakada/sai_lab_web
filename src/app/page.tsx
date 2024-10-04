import SEO from "@/components/common/SEO";
import HomeContent from "@/components/client_page/HomeContent";
import { fetchNews } from "@/components/GASFetch";
import { News } from "@/components/DefaultStructure";
import { generateWebsiteStructure } from "@/components/common/JsonLd";
import { PageMetadata } from "@/components/PageMetadata";

const pageMeta: PageMetadata = {
  isArticle: false,
  title: undefined,
  description: undefined,
  url: undefined,
  imageUrl: undefined,
}

export async function generateMetadata() {
  return SEO({
    title: pageMeta.title,
    description: pageMeta.description,
    url: pageMeta.url,
    imageUrl: pageMeta.imageUrl,
  });
}

// 日本語英語ボタン有
export default async function Home() {
  const response = await fetchNews();
  const newsList: News[] = await response.json();
  // 空要素がある場合は取り除く
  const filteredNews = newsList.filter((item) => item.id !== "");
  // クライアントコンポーネントにより描画
  return <>
    {generateWebsiteStructure(pageMeta)}
    <HomeContent newsList={filteredNews} />
  </>;
}
