import { fetchNews } from '@/components/GASFetch';
import { PageMetadata } from '@/components/PageMetadata';
import HomeContent from '@/components/client_page/HomeContent';
import { generateWebsiteStructure } from '@/components/common/JsonLd';
import SEO from '@/components/common/SEO';

const pageMeta: PageMetadata = {
  isArticle: false,
  title: undefined,
  description: undefined,
  url: undefined,
  imageUrl: undefined,
};

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
  const newsList = await fetchNews();
  // クライアントコンポーネントにより描画
  return (
    <>
      {generateWebsiteStructure(pageMeta)}
      <HomeContent newsList={newsList} />
    </>
  );
}
