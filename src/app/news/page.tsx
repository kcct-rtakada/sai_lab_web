import { News } from "@/components/DefaultStructure";
import NewsViewer from "@/components/news_list/NewsViewer";
import SEO from "@/components/common/SEO";
import type { Metadata } from "next";
import { fetchNews } from "@/components/GASFetch";
import { Suspense } from "react";
import styles from "@/styles/app/news/newsList.module.scss";

export async function generateMetadata(): Promise<Metadata> {
  return SEO({
    title: "News",
    description: "SAI (髙田研究室)のニュース一覧",
    url: `https://sai.ac/news`,
    imageUrl: undefined,
  });
}

export default async function NewsList() {
  const response = await fetchNews();
  const newsList: News[] = await response.json();
  // 空要素がある場合は取り除く
  const filteredNews = newsList.filter((item) => item.id !== "");

  // クライアントコンポーネントで描画
  return (
    <Suspense
      fallback={
        <div className={styles.main}>
          <div className={styles.title_box}>
            <div className={styles.title_area}>
              <h1 className={styles.page_title}>ニュース</h1>
            </div>
          </div>
          <div className="loading">
            <span className="load_1" />
            <span className="load_2" />
          </div>
        </div>
      }
    >
      <NewsViewer _newsList={filteredNews} />
    </Suspense>
  );
}
