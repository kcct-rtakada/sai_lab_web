import RSS from "rss";
import { fetchNews } from "@/components/GASFetch";
import { News } from "@/components/DefaultStructure";

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

  const response = await fetchNews();
  const newsList: News[] = await response.json();
  // 空要素がある場合は取り除く
  const filteredNews = newsList.filter((item) => item.id !== "");

  filteredNews.forEach(news => {
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
      'Content-Type': 'application/atom+xml; charset=utf-8',
    },
  });
}