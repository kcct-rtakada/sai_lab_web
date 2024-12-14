import { Suspense } from 'react';
import { fetchNews } from '@/components/GASFetch';
import LoadingUI from '@/components/Loading';
import { getJsonLd, getJsonLdScript } from '@/components/common/JsonLd';
import SEO from '@/components/common/SEO';
import { Title } from '@/components/common/SubPageLayout';
import NewsViewer from '@/components/news_list/NewsViewer';
import styles from '@/styles/app/news/newsList.module.scss';

export async function generateMetadata({ searchParams }: { searchParams: { [key: string]: string } }) {
  const mode = searchParams['mode'] ?? null;
  const q = searchParams['q'] ?? null;

  const modeDic: { [key: string]: string } = {
    name: '記事名',
    year: '公開年',
  };
  const modeDisplayName = modeDic[mode] ?? '不明';

  return SEO({
    title: `${q ? `[${modeDisplayName}]` + (q.length > 10 ? q.substring(0, 10) + '...' : q) + ' の' : ''}News`,
    description: 'SAI (髙田研究室)のニュース一覧',
    url: `/news`,
    imageUrl: undefined,
  });
}

export default async function NewsList({ searchParams }: { searchParams: { [key: string]: string } }) {
  const newsList = await fetchNews();

  const mode = searchParams['mode'] ?? null;
  const q = searchParams['q'] ?? null;

  const modeDic: { [key: string]: string } = {
    name: '記事名',
    year: '公開年',
  };
  const modeDisplayName = modeDic[mode] ?? '不明';

  const jsonLd = getJsonLd(
    false,
    `${q ? `[${modeDisplayName}]` + (q.length > 10 ? q.substring(0, 10) + '...' : q) + ' の' : ''}News`,
    'SAI (髙田研究室)のニュース一覧',
    '/news',
  );

  // クライアントコンポーネントで描画
  return (
    <Suspense
      fallback={
        <div className={styles.main}>
          <Title color1='#e74e4e' color2='#dd8431'>
            <span>ニュース</span>
          </Title>
          <LoadingUI />
        </div>
      }
    >
      {getJsonLdScript(jsonLd)}
      <NewsViewer _newsList={newsList} />
    </Suspense>
  );
}
