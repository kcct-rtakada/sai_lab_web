import React from 'react';
import Link from 'next/link';
import { fetchAwards } from '@/components/GASFetch';
import { CalcFiscalYear, ConvertToJST, DisplayDefaultDateString } from '@/components/JSTConverter';
import { PageMetadata } from '@/components/PageMetadata';
import YearBanner from '@/components/YearBanner';
import YearListSidebar from '@/components/client_parts/YearListSidebar';
import { generateWebsiteStructure } from '@/components/common/JsonLd';
import SEO from '@/components/common/SEO';
import { Title } from '@/components/common/SubPageLayout';
import styles from '@/styles/app/award/award.module.scss';

const pageMeta: PageMetadata = {
  isArticle: false,
  title: 'Award',
  description: 'SAI (髙田研究室)での表彰',
  url: `/award`,
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

export default async function DisplayAward() {
  const awardList = await fetchAwards();

  // 年度リストを作成する
  const uniqueYears = Array.from(
    new Set(
      awardList
        ?.flatMap((item) => {
          const japanTime = ConvertToJST(item.date);
          return CalcFiscalYear(japanTime);
        })
        .sort((a, b) => b - a),
    ),
  );

  return (
    <React.Fragment>
      <div className={styles.main}>
        {generateWebsiteStructure(pageMeta)}
        <Title color1='#a153eb' color2='#e660b2'>
          表彰
        </Title>
        <YearListSidebar pageName='表彰' years={uniqueYears} />
        <div className={styles.list_box}>
          <div className={styles.result_box}>
            {uniqueYears.map((year, i) => {
              const matchedDataWithYear = awardList?.filter((item) => {
                const japanTime = ConvertToJST(item.date);
                // 年度による仕分け
                return CalcFiscalYear(japanTime) === year;
              });

              return (
                <React.Fragment key={i}>
                  <YearBanner year={year} />
                  <ul key={`ul${i}`}>
                    {matchedDataWithYear!.map((award, j) => {
                      const japanTime = ConvertToJST(award.date);

                      // 日付を表示用にフォーマット
                      const displayDate = DisplayDefaultDateString(japanTime);
                      return (
                        <li key={j}>
                          {award.link ? (
                            <Link href={award.link} target='_blank' rel='noopener'>{`${
                              award.organization ? `${award.organization}` : ``
                            }${award.competition ? `, ${award.competition}` : ``}, ${award.award}, ${
                              award.person
                            } (${displayDate})`}</Link>
                          ) : (
                            `${award.organization ? `${award.organization}` : ``}${
                              award.competition ? `, ${award.competition}` : ``
                            }, ${award.award}, ${award.person} (${displayDate})`
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
