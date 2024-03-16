/* eslint-disable @next/next/no-img-element */
import { Project } from "@/components/DefaultStructure";
import styles from "@/styles/app/publication/publication.module.scss";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faLink } from "@fortawesome/free-solid-svg-icons";
import SEO from "@/components/common/SEO";
import type { Metadata } from "next";
import YearListSidebar from "@/components/client_parts/YearListSidebar";
import React from "react";
import { fetchProjects } from "@/components/GASFetch";

export async function generateMetadata(): Promise<Metadata> {
  return SEO({
    title: "Publication",
    description: "SAI (髙田研究室)の研究業績",
    url: `https://sai.ac/publication`,
    imageUrl: undefined,
  });
}

export default async function Publication() {
  const response = await fetchProjects();
  const projects: Project[] = await response.json();
  const filteredProjects = projects.filter((item) => item.id !== "");

  const sortedConferencePapers = filteredProjects?.filter(
    (element) =>
      element.classification.toLowerCase().includes("国内会議") ||
      element.classification.toLowerCase().includes("国際会議") ||
      element.classification.toLowerCase().includes("論文誌")
  );

  const uniqueYears = Array.from(
    new Set(
      sortedConferencePapers?.flatMap((item) => {
        const japanTime = new Date(
          new Date(item.date).toLocaleString("en-US", {
            timeZone: "Asia/Tokyo",
          })
        );
        return japanTime.getMonth() > 3
          ? japanTime.getFullYear()
          : japanTime.getFullYear() - 1;
      })
    )
  );

  const displayingThesis = (name: string, arrays: Project[] | undefined) => {
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
        <div className={styles.title_box}>
          <div className={styles.title_area}>
            <h1 className={styles.page_title}>研究業績</h1>
          </div>
        </div>
        <YearListSidebar pageName="研究業績" years={uniqueYears} />
        <div className={styles.list_box}>
          <div className={styles.result_box}>
            {uniqueYears.map((year, i) => {
              const matchedDataWithYear = sortedConferencePapers?.filter(
                (item) => {
                  const japanTime = new Date(
                    new Date(item.date).toLocaleString("en-US", {
                      timeZone: "Asia/Tokyo",
                    })
                  );
                  return (
                    (japanTime.getMonth() > 3
                      ? japanTime.getFullYear()
                      : japanTime.getFullYear() - 1) === year
                  );
                }
              );
              const matchedInternal = matchedDataWithYear?.filter((item) =>
                item.classification.toLowerCase().includes("国内会議")
              );
              const matchedExternal = matchedDataWithYear?.filter((item) =>
                item.classification.toLowerCase().includes("国際会議")
              );
              const matchedJournal = matchedDataWithYear?.filter((item) =>
                item.classification.toLowerCase().includes("論文誌")
              );
              return (
                <React.Fragment key={i}>
                  <h2 key={i} id={String(year)}>
                    {year}年度
                  </h2>
                  {matchedJournal!.length > 0 ? (
                    <React.Fragment>
                      {displayingThesis("論文誌", matchedJournal)}
                    </React.Fragment>
                  ) : (
                    <></>
                  )}

                  {matchedInternal!.length > 0 ? (
                    <React.Fragment>
                      {displayingThesis("国内会議", matchedInternal)}
                    </React.Fragment>
                  ) : (
                    <></>
                  )}

                  {matchedExternal!.length > 0 ? (
                    <React.Fragment>
                      {displayingThesis("国際会議", matchedExternal)}
                    </React.Fragment>
                  ) : (
                    <></>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
