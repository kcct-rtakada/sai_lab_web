import SEO from "@/components/common/SEO";
import type { Metadata } from "next";
import HomeContent from "@/components/client_page/HomeContent";

export async function generateMetadata(): Promise<Metadata> {
  return SEO({
    title: undefined,
    description: undefined,
    url: `https://sai.ac`,
    imageUrl: undefined,
  });
}

export default function Home() {
  return <HomeContent />;
}
