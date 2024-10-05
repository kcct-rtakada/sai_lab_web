import RSS from "rss";
import { fetchNews } from "@/components/GASFetch";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const feed = new RSS({
    title: "SAI(髙田研究室) ニュース",
    description: "SAI(髙田研究室)のニュース",
    site_url: "https://sai.ac",
    feed_url: "https://sai.ac/news/feed.xml",
    copyright: "sai",
    language: "ja",
    pubDate: new Date().toISOString()
  });

  const newsList = await fetchNews();

  newsList.forEach(news => {
    const plainText = news.article.replaceAll(/<\/?[^>]+(>|$)/g, "").replaceAll("\\n+", " ");

    feed.item({
      title: news.title,
      description: plainText.length > 100 ? plainText.substring(0, 99) + "..." : plainText,
      url: `https://sai.ac/news/${news.id}`,
      date: new Date(news.date)
    });
  });

  return new Response(feed.xml({ indent: true }), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}