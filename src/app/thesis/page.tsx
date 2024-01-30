/* eslint-disable @next/next/no-img-element */
// "use client";
import React, { useState, useEffect } from "react";
import Project from "@/components/DefaultStructure";
import styles from "@/styles/app/thesis/thesis.module.scss";
import Link from "next/link";
import { sai_projects } from "@/components/constant";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faLink } from "@fortawesome/free-solid-svg-icons";
// import SEO from "@/components/SEO";

export default async function Page() {
  const response = await fetch(sai_projects);
  // const response = await fetch(sai_projects, { cache: 'no-store' });
  const projects: Project[] = await response.json();

  const sortedConferencePapers = projects?.filter(
    (element) =>
      element.classification.toLowerCase().includes("本科卒業論文") ||
      element.classification.toLowerCase().includes("専攻科特別研究論文")
  );

  const uniqueYears = Array.from(
    new Set(
      sortedConferencePapers?.flatMap((item) =>
        new Date(item.date).getFullYear()
      )
    )
  );

  const displayingThesis = (name: string, arrays: Project[] | undefined) => {
    return (
      <>
        <h3>{name}</h3>
        <ol>
          {arrays!.map((item, i) => (
            <li key={i}>
              <Link
                href={`/project/${item.id}`}
                className={styles.direct}
              >{`${item.authors.map((e, j) => `${e.name}, `)}${
                item.title
              }`}</Link>
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
      </>
    );
  };

  return (
    <>
      <div className={styles.main}>
        <div className={styles.title_box}>
          <div className={styles.title_area}>
            <h1 className={styles.page_title}>卒論/修論</h1>
          </div>
        </div>
        <div className={styles.list_box}>
          <div className={styles.result_box}>
            {uniqueYears.map((year, i) => {
              const matchedDataWithYear = sortedConferencePapers?.filter(
                (item) => new Date(item.date).getFullYear() === year
              );
              const matched2ndPaper = matchedDataWithYear?.filter((item) =>
                item.classification.toLowerCase().includes("専攻科特別研究論文")
              );
              const matched1stPaper = matchedDataWithYear?.filter((item) =>
                item.classification.toLowerCase().includes("本科卒業論文")
              );
              return (
                <>
                  <h2>{year}年</h2>
                  {matched2ndPaper!.length > 0 ? (
                    <>
                      {displayingThesis(
                        "学士（専攻科特別研究論文）",
                        matched2ndPaper
                      )}
                    </>
                  ) : (
                    <></>
                  )}
                  {matched1stPaper!.length > 0 ? (
                    <>
                      {displayingThesis(
                        "準学士（本科卒業論文）",
                        matched1stPaper
                      )}
                    </>
                  ) : (
                    <></>
                  )}
                </>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
