import SEO from "@/components/common/SEO";
import type { Metadata } from "next";
import ContactContent from "@/components/client_page/ContactContent";
import { generateWebsiteStructure } from "@/components/common/JsonLd";
import { PageMetadata } from "@/components/PageMetadata";

const pageMeta: PageMetadata = {
  isArticle: false,
  title: "Contact",
  description: "SAI (髙田研究室)へのお問い合わせはこちら",
  url: `/contact`,
  imageUrl: undefined,
}

export async function generateMetadata(): Promise<Metadata> {
  return SEO({
    title: pageMeta.title,
    description: pageMeta.description,
    url: pageMeta.url,
    imageUrl: pageMeta.imageUrl,
  });
}

// 日本語英語ボタン有
export default function Contact() {
  // クライアントコンポーネントで描画
  return <>
    {generateWebsiteStructure(pageMeta)}
    <ContactContent />
  </>;
}
