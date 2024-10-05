/* eslint-disable @next/next/no-img-element */
import { Project, Publication } from "@/components/DefaultStructure";
import styles from "@/styles/app/publication/publication.module.scss";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faLink } from "@fortawesome/free-solid-svg-icons";
import SEO from "@/components/common/SEO";
import YearListSidebar from "@/components/client_parts/YearListSidebar";
import React from "react";
import { fetchProjects, fetchPublications } from "@/components/GASFetch";
import {
  CalcFiscalYear,
  ConvertToJST,
  DisplayDefaultDateString,
} from "@/components/JSTConverter";
import { generateWebsiteStructure } from "@/components/common/JsonLd";
import { PageMetadata } from "@/components/PageMetadata";
import { Title } from "@/components/common/SubPageLayout";

const pageMeta: PageMetadata = {
  isArticle: false,
  title: "Publication",
  description: "SAI (髙田研究室)の研究業績",
  url: `/publication`,
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

const filterItems = (items: any[], classifications: string[]) => {
  return items.filter(item => classifications.some(classification => item.classification.toLowerCase().includes(classification)));
}

export default async function PagePublication() {
  const projectList = await fetchProjects();

  const publicationList = await fetchPublications();

  // 国内会議 または 国際会議 または 論文誌 のみをこのページでは表示する
  const sortedConferencePapers = filterItems(projectList, ["国内会議", "国際会議", "論文誌"]);
  const sortedPublications = filterItems(publicationList, ["記事", "出版", "講演", "報道"]);

  // 年度リストを作成する
  const uniqueYears = Array.from(
    new Set(
      sortedConferencePapers
        ?.flatMap((item) => {
          const japanTime = new Date(
            new Date(item.date).toLocaleString("en-US", {
              timeZone: "Asia/Tokyo",
            })
          );
          return japanTime.getMonth() + 1 > 3
            ? japanTime.getFullYear()
            : japanTime.getFullYear() - 1;
        })
        .concat(
          sortedPublications?.flatMap((item) => {
            const japanTime = new Date(
              new Date(item.date).toLocaleString("en-US", {
                timeZone: "Asia/Tokyo",
              })
            );
            return japanTime.getMonth() + 1 > 3
              ? japanTime.getFullYear()
              : japanTime.getFullYear() - 1;
          })
        )
        .sort((a, b) => b - a)
    )
  );

  const displayingPublications = (
    name: string,
    arrays: Publication[] | undefined
  ) => {
    return (
      <React.Fragment>
        <h3>{name}</h3>
        <ol>
          {arrays!.map((item, j) => {
            const japanTime = ConvertToJST(item.date);
            return (
              <li key={j}>
                {item.url ? (
                  <Link
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.direct}
                  >
                    {`${item.author}, ${item.title}, ${item.publisher
                      }(${DisplayDefaultDateString(japanTime)})`}
                  </Link>
                ) : (
                  <span>
                    {`${item.author}, ${item.title}, ${item.publisher
                      }(${DisplayDefaultDateString(japanTime)})`}
                  </span>
                )}
                {item.additionalURL ? (
                  <Link
                    href={item.additionalURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ marginLeft: ".5rem" }}
                  >
                    <FontAwesomeIcon
                      icon={faLink}
                      style={{
                        color: "#FA5F2F",
                        display: "inline-block",
                        fontSize: "1rem",
                        width: "1rem",
                      }}
                    />
                  </Link>
                ) : (
                  <></>
                )}
              </li>
            );
          })}
        </ol>
      </React.Fragment>
    );
  };

  // 種類単位のプロジェクト(研究業績)を関数で描画
  const displayingProjects = (name: string, arrays: Project[] | undefined) => {
    return (
      <React.Fragment>
        <h3>{name}</h3>
        <ol>
          {arrays!.map((item, j) => (
            <li key={j}>
              <Link href={`/project/${item.id}`} className={styles.direct}>
                {item.citation}
              </Link>
              {item.url ? (
                <Link
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ marginLeft: ".5rem" }}
                >
                  <FontAwesomeIcon
                    icon={faLink}
                    style={{
                      color: "#FA5F2F",
                      display: "inline-block",
                      fontSize: "1rem",
                      width: "1rem",
                    }}
                  />
                </Link>
              ) : (
                <></>
              )}
              {item.paperUrl ? (
                <Link
                  href={item.paperUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ marginLeft: ".5rem" }}
                >
                  <FontAwesomeIcon
                    icon={faFilePdf}
                    style={{
                      color: "#df0000",
                      display: "inline-block",
                      fontSize: "1rem",
                      width: "1rem",
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
      <Title color1="#62c734" color2="#24a5a5">研究業績</Title>
      <YearListSidebar pageName="研究業績" years={uniqueYears} />
      <div className={styles.list_box}>
        <div className={styles.result_box}>
          {uniqueYears.map((year, i) => {
            const filters = [
              { name: "国内会議", items: sortedConferencePapers, func: displayingProjects },
              { name: "国際会議", items: sortedConferencePapers, func: displayingProjects },
              { name: "論文誌", items: sortedConferencePapers, func: displayingProjects },
              { name: "報道", items: sortedPublications, func: displayingPublications },
              { name: "講演", items: sortedPublications, func: displayingPublications },
              { name: "記事・出版", items: sortedPublications, func: displayingPublications },
            ];
  
            return (
              <React.Fragment key={i}>
                <h2 id={String(year)}>{year}年度</h2>
                {filters.map(({ name, items, func }, typeNum) => {
                  const matchedItems = items.filter((item) => {
                    return CalcFiscalYear(ConvertToJST(item.date)) === year && 
                      name.split("・").some(filter => item.classification.toLowerCase().includes(filter.toLowerCase()));
                  });
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
