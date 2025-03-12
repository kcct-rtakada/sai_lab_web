/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { faFilePdf, faLink } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { Project } from '@/components/DefaultStructure';
import { fetchProjects } from '@/components/GASFetch';
import { CalcFiscalYear, ConvertToJST } from '@/components/JSTConverter';
import { PageMetadata } from '@/components/PageMetadata';
import YearBanner from '@/components/YearBanner';
import YearListSidebar from '@/components/client_parts/YearListSidebar';
import { generateWebsiteStructure } from '@/components/common/JsonLd';
import SEO from '@/components/common/SEO';
import { Title } from '@/components/common/SubPageLayout';
import styles from '@/styles/app/thesis/thesis.module.scss';

const pageMeta: PageMetadata = {
  isArticle: false,
  title: 'Thesis',
  description: 'SAI (髙田研究室)での学位論文',
  url: `/thesis`,
  imageUrl: undefined,
};

export async function generateMetadata() {
  return SEO({
    title: pageMeta.title,
    description: pageMeta.description,
    url: pageMeta.url,
    imageUrl: pageMeta.imageUrl,
  });
}

const filterItems = (items: any[], classifications: string[]) => {
  return items.filter((item) =>
    classifications.some((classification) => item.classification.toLowerCase().includes(classification)),
  );
};

export default async function Thesis() {
  const projectList = await fetchProjects();

  // 本科卒業論文 または 専攻科特別研究論文 のみをこのページでは表示する
  const sortedConferencePapers = filterItems(projectList, ['本科卒業論文', '専攻科特別研究論文']);

  // 年度リストを作成する
  const uniqueYears = Array.from(
    new Set(
      sortedConferencePapers
        ?.flatMap((item) => {
          const japanTime = ConvertToJST(item.date);
          return CalcFiscalYear(japanTime);
        })
        .sort((a, b) => b - a),
    ),
  );

  // 種類単位のプロジェクト(研究業績)を関数で描画
  const displayingThesis = (name: string, arrays: Project[] | undefined) => {
    return (
      <React.Fragment>
        <h3>{name}</h3>
        <ol>
          {arrays!.map((item, i) => (
            <li key={i}>
              <Link
                href={`/project/${item.id}`}
                className={styles.direct}
              >{`${item.authors.map((e) => `${e.name}, `)}${item.title}`}</Link>
              {item.url ? (
                <Link href={item.url} target='_blank' rel='noopener noreferrer' style={{ marginLeft: '.5rem' }}>
                  <FontAwesomeIcon
                    icon={faLink}
                    style={{
                      color: '#FA5F2F',
                      display: 'inline-block',
                      fontSize: '1rem',
                      width: '1rem',
                    }}
                  />
                </Link>
              ) : (
                <></>
              )}
              {item.paperUrl ? (
                <Link href={item.paperUrl} target='_blank' rel='noopener noreferrer' style={{ marginLeft: '.5rem' }}>
                  <FontAwesomeIcon
                    icon={faFilePdf}
                    style={{
                      color: '#df0000',
                      display: 'inline-block',
                      fontSize: '1rem',
                      width: '1rem',
                    }}
                  />
                </Link>
              ) : (
                <></>
              )}
            </li>
          ))}
        </ol>
      </React.Fragment>
    );
  };

  return (
    <div className={styles.main}>
      {generateWebsiteStructure(pageMeta)}
      <Title color1='#63b0ce' color2='#683bb1'>
        学位論文
      </Title>
      <YearListSidebar pageName='学位論文' years={uniqueYears} />
      <div className={styles.list_box}>
        <div className={styles.result_box}>
          {uniqueYears.map((year, i) => {
            const filters = [
              {
                name: '学士（専攻科特別研究論文）',
                keyword: '専攻科特別研究論文',
                func: displayingThesis,
              },
              {
                name: '準学士（本科卒業論文）',
                keyword: '本科卒業論文',
                func: displayingThesis,
              },
            ];

            return (
              <React.Fragment key={i}>
                <YearBanner year={year} />
                {filters.map(({ name, keyword, func }, typeNum) => {
                  const matchedItems = sortedConferencePapers.filter(
                    (item) =>
                      CalcFiscalYear(ConvertToJST(item.date)) === year &&
                      item.classification.toLowerCase().includes(keyword.toLowerCase()),
                  );
                  return matchedItems.length > 0 ? (
                    <React.Fragment key={typeNum}>{func(name, matchedItems)}</React.Fragment>
                  ) : null;
                })}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
