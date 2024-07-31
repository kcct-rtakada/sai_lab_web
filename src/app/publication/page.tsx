/* eslint-disable @next/next/no-img-element */
import { Project, Publication } from "@/components/DefaultStructure";
import styles from "@/styles/app/publication/publication.module.scss";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faLink } from "@fortawesome/free-solid-svg-icons";
import SEO from "@/components/common/SEO";
import type { Metadata } from "next";
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

const pageMeta: PageMetadata = {
  isArticle: false,
  title: "Publication",
  description: "SAI (髙田研究室)の研究業績",
  url: `/publication`,
  imageUrl: undefined,
}

export async function generateMetadata(): Promise<Metadata> {
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
  const projectResponse = await fetchProjects();
  const projects: Project[] = await projectResponse.json();
  // 空要素がある場合は取り除く
  const filteredProjects = projects.filter((item) => item.id !== "");

  const publicationsResponse = await fetchPublications();
  const publications: Publication[] = await publicationsResponse.json();
  // 空要素がある場合は取り除く
  const filteredPublications = publications.filter((item) => item.id !== "");

  // 国内会議 または 国際会議 または 論文誌 のみをこのページでは表示する
  const sortedConferencePapers = filterItems(filteredProjects, ["国内会議", "国際会議", "論文誌"]);
  const sortedPublications = filterItems(filteredPublications, ["記事", "出版", "講演", "報道"]);

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
    <React.Fragment>
      <div className={styles.main}>
        {generateWebsiteStructure(pageMeta)}
        <div className={styles.title_box}>
          <div className={styles.title_area}>
            <h1 className={styles.page_title}>研究業績</h1>
          </div>
        </div>
        <YearListSidebar pageName="研究業績" years={uniqueYears} />
        <div className={styles.list_box}>
          <div className={styles.result_box}>
            {uniqueYears.map((year, i) => {
              const matchedProjectsWithYear = sortedConferencePapers?.filter(
                (item) => {
                  const japanTime = ConvertToJST(item.date);
                  // 年度を計算
                  return CalcFiscalYear(japanTime) === year;
                }
              );
              const matchedPublicationsWithYear = sortedPublications?.filter(
                (item) => {
                  const japanTime = ConvertToJST(item.date);
                  // 年度を計算
                  return CalcFiscalYear(japanTime) === year;
                }
              );
              // 年度内で種類ごとに抽出
              const matchedInternal = matchedProjectsWithYear?.filter((item) =>
                item.classification.toLowerCase().includes("国内会議")
              );
              const matchedExternal = matchedProjectsWithYear?.filter((item) =>
                item.classification.toLowerCase().includes("国際会議")
              );
              const matchedJournal = matchedProjectsWithYear?.filter((item) =>
                item.classification.toLowerCase().includes("論文誌")
              );
              const matchedCoverage = matchedPublicationsWithYear?.filter(
                (item) => item.classification.toLowerCase().includes("報道")
              );
              const matchedSpeech = matchedPublicationsWithYear?.filter(
                (item) => item.classification.toLowerCase().includes("講演")
              );
              const matchedArticle = matchedPublicationsWithYear?.filter(
                (item) =>
                  item.classification.toLowerCase().includes("記事") ||
                  item.classification.toLowerCase().includes("出版")
              );
              const types = [
                {name: "国内会議", filter: ["国内会議"], items: matchedProjectsWithYear, func: displayingProjects},
                {name: "国際会議", filter: ["国際会議"], items: matchedProjectsWithYear, func: displayingProjects},
                {name: "論文誌", filter: ["論文誌"], items: matchedProjectsWithYear, func: displayingProjects},
                {name: "報道", filter: ["報道"], items: matchedPublicationsWithYear, func: displayingPublications},
                {name: "講演", filter: ["講演"], items: matchedPublicationsWithYear, func: displayingPublications},
                {name: "記事・出版", filter: ["記事", "出版"], items: matchedPublicationsWithYear, func: displayingPublications},
              ];

              return (
                <React.Fragment key={i}>
                  <h2 key={i} id={String(year)}>
                    {year}年度
                  </h2>
                  {
                    types.map((type, typeNum) => {
                      const matchedItem = filterItems(type.items, type.filter);
                      if (matchedItem.length > 0) {
                        return <React.Fragment key={typeNum}>{type.func(type.name, matchedItem)}</React.Fragment>;
                      } else return <React.Fragment key={typeNum} />;
                    })
                  }
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
