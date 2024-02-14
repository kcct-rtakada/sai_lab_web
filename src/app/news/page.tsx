import News from "@/components/DefaultStructure";
import { sai_news } from "@/components/constant";
import NewsViewer from "@/components/NewsViewer";

export default async function Home() {
  const response = await fetch(sai_news);
  const newsList: News[] = await response.json();

  return <NewsViewer _newsList={newsList} />;
}
