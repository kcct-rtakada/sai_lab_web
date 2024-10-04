import NewsViewer from "@/components/news_list/NewsViewer";
import SEO from "@/components/common/SEO";
import { fetchNews } from "@/components/GASFetch";
import { Suspense } from "react";
import styles from "@/styles/app/news/newsList.module.scss";
import { getJsonLd, getJsonLdScript } from "@/components/common/JsonLd";

export async function generateMetadata(
  { searchParams }: { searchParams: { [key: string]: string } }
) {
  const mode = searchParams['mode'] ?? null
  const q = searchParams['q'] ?? null

  const modeDic: { [key: string]: string } = {
    name: "記事名",
    year: "公開年"
  }
  const modeDisplayName = modeDic[mode] ?? "不明"

  return SEO({
    title: `${q ? `[${modeDisplayName}]` + (q.length > 10 ? q.substring(0, 10) + "..." : q) + " の" : ""}News`,
    description: "SAI (髙田研究室)のニュース一覧",
    url: `/news`,
    imageUrl: undefined,
  });
}

export default async function NewsList({ searchParams }: { searchParams: { [key: string]: string } }) {
  const newsList = await fetchNews();

  const mode = searchParams['mode'] ?? null
  const q = searchParams['q'] ?? null

  const modeDic: { [key: string]: string } = {
    name: "記事名",
    year: "公開年"
  }
  const modeDisplayName = modeDic[mode] ?? "不明"

  const jsonLd = getJsonLd(false, `${q ? `[${modeDisplayName}]` + (q.length > 10 ? q.substring(0, 10) + "..." : q) + " の" : ""}News`, "SAI (髙田研究室)のニュース一覧", "/news")

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
      {getJsonLdScript(jsonLd)}
      <NewsViewer _newsList={newsList} />
    </Suspense>
  );
}
