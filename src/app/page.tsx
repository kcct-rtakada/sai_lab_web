import SEO from "@/components/SEO";
import type { Metadata } from "next";
import HomeContent from "@/components/HomeContent";

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
