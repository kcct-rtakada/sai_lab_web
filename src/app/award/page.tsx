/* eslint-disable @next/next/no-img-element */
import { Award } from "@/components/DefaultStructure";
import styles from "@/styles/app/award/award.module.scss";
import Link from "next/link";
import SEO from "@/components/common/SEO";
import YearListSidebar from "@/components/client_parts/YearListSidebar";
import React from "react";
import { fetchAwards } from "@/components/GASFetch";
import { CalcFiscalYear, ConvertToJST, DisplayDefaultDateString } from "@/components/JSTConverter";
import { generateWebsiteStructure } from "@/components/common/JsonLd";
import { PageMetadata } from "@/components/PageMetadata";
import { Title } from "@/components/common/SubPageLayout";

const pageMeta: PageMetadata = {
  isArticle: false,
  title: "Award",
  description: "SAI (髙田研究室)での表彰",
  url: `/award`,
  imageUrl: undefined,
}

export async function generateMetadata() {
  return SEO({
    title: pageMeta.title,
    description: pageMeta.description,
    url: pageMeta.url,
    imageUrl: pageMeta.imageUrl,
  });
}

export default async function DisplayAward() {
  const response = await fetchAwards();
  const awards: Award[] = await response.json();
  // 空要素がある場合は取り除く
  const filteredAwards = awards.filter((item) => item.id !== "");

  // 年度リストを作成する
  const uniqueYears = Array.from(
    new Set(
      filteredAwards
        ?.flatMap((item) => {
          const japanTime = ConvertToJST(item.date);
          return CalcFiscalYear(japanTime);
        })
        .sort((a, b) => b - a)
    )
  );

  return (
    <React.Fragment>
      <div className={styles.main}>
        {generateWebsiteStructure(pageMeta)}
        <Title color1="#a153eb" color2="#e660b2">
          表彰
        </Title>
        <YearListSidebar pageName="表彰" years={uniqueYears} />
        <div className={styles.list_box}>
          <div className={styles.result_box}>
            {uniqueYears.map((year, i) => {
              const matchedDataWithYear = filteredAwards?.filter((item) => {
                const japanTime = ConvertToJST(item.date);
                // 年度による仕分け
                return CalcFiscalYear(japanTime) === year;
              });

              return (
                <React.Fragment key={i}>
                  <h2 key={`year${i}`} id={String(year)}>
                    {year}年度
                  </h2>
                  <ul key={`ul${i}`}>
                    {matchedDataWithYear!.map((award, j) => {
                      const japanTime = ConvertToJST(award.date);

                      // 日付を表示用にフォーマット
                      const displayDate = DisplayDefaultDateString(japanTime);
                      return (
                        <li key={j}>
                          {award.link ? (
                            <Link
                              href={award.link}
                              target="_blank"
                              rel="noopener noreferrer"
                            >{`${award.organization ? `${award.organization}` : ``
                              }${award.competition ? `, ${award.competition}` : ``
                              }, ${award.award}, ${award.person
                              } (${displayDate})`}</Link>
                          ) : (
                            `${award.organization ? `${award.organization}` : ``
                            }${award.competition ? `, ${award.competition}` : ``
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
