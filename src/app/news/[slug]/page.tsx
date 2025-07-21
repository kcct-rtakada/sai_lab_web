/* eslint-disable @next/next/no-img-element */
import { cache } from 'react';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import parse from 'html-react-parser';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { News } from '@/components/DefaultStructure';
import { fetchNews } from '@/components/GASFetch';
import { ConvertToJST, DisplayDefaultDateString } from '@/components/JSTConverter';
import { getJsonLd, getJsonLdScript } from '@/components/common/JsonLd';
import SEO from '@/components/common/SEO';
import styles from '@/styles/app/news/news.module.scss';

// ニュース取得・一致判定を行う
const getNews = cache(async (slug: string) => {
  const newsList = await fetchNews();
  const news: News | undefined = newsList.find((c: { id: string }) => {
    const cid = String(c.id);
    return cid === slug;
  });
  if (!news) notFound();
  return news;
});

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const news = await getNews(params.slug);
  const japanTime = ConvertToJST(news.date);
  const plainText = news.article.replaceAll(/<\/?[^>]+(>|$)/g, '').replaceAll('\\n+', ' ');

  // 日付のmetaにのせる
  return SEO({
    title: news.title,
    description: `${plainText.length > 100 ? plainText.substring(0, 99) + '...' : plainText}(${DisplayDefaultDateString(
      japanTime,
    )})`,
    url: `/news/${params.slug}`,
    imageUrl: undefined,
  });
}

export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const news = await getNews(params.slug);

  const japanTime = ConvertToJST(news.date);
  const plainText = news.article.replaceAll(/<\/?[^>]+(>|$)/g, '').replaceAll('\\n+', ' ');
  const jsonLd = getJsonLd(
    true,
    `${news.title}`,
    plainText.length > 100 ? plainText.substring(0, 99) + '...' : plainText,
    `/news/${news.id}`,
  );

  return (
    <>
      {getJsonLdScript(jsonLd)}
      <div className={styles.main}>
        <section className={styles.project}>
          <div className={styles.project_card}>
            <h1 className={styles.title}>{news.title}</h1>
            <div className={styles.date}>
              <FontAwesomeIcon
                icon={faCalendar}
                style={{
                  display: 'inline-block',
                  marginRight: '.3rem',
                  fontSize: '1rem',
                  width: '1rem',
                }}
              />
              <time dateTime={japanTime.toISOString()}>{DisplayDefaultDateString(japanTime)}</time>
            </div>
          </div>

          <div className={styles.main_script}>
            {news.thumbnailURL ? (
              <div className={styles.thumbnail_box}>
                <Link href={news.thumbnailURL} target='_blank' rel='noopener'>
                  <img src={news.thumbnailURL} alt='thumbnail' />
                </Link>
              </div>
            ) : (
              <></>
            )}

            {/* 記事本文はstringからHTML要素へパース */}
            {news.article ? (
              <>
                <div className={styles.article}>{parse(news.article)}</div>
              </>
            ) : (
              <></>
            )}
            {news.additionalImageURL.length > 0 ? (
              <>
                <h2 className={styles.section_name}>Images</h2>
                <div className={styles.images_box}>
                  {news.additionalImageURL.map((item, j) => (
                    <Link href={`${item.name}`} key={j} target='_blank' rel='noopener'>
                      <div className={styles.image} key={j}>
                        <img src={item.name} key={j} alt={`img_${j}`} />
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <></>
            )}
            {news.links.length > 0 ? (
              <>
                <h2 className={styles.section_name}>関連リンク</h2>
                <ul className={styles.links}>
                  {news.links.map((link, j) => (
                    <li key={j}>
                      <Link href={link.name} target='_blank' rel='noopener'>
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <></>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
