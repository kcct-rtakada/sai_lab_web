import SEO from "@/components/common/SEO";
import type { Metadata } from "next";
import ContactContent from "@/components/client_page/ContactContent";

export async function generateMetadata(): Promise<Metadata> {
  return SEO({
    title: "Contact",
    description: "SAI (髙田研究室)へのお問い合わせはこちら",
    url: `https://sai.ac/contact`,
    imageUrl: undefined,
  });
}

export default function Contact() {
  return <ContactContent />;
}
