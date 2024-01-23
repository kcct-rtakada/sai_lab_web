/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import Project from "@/components/DefaultStructure";
import styles from "@/styles/app/publication/publication.module.scss";
import Link from "next/link";
// import SEO from "@/components/SEO";

export default function Home() {
  const [projects, setProjects] = useState<null | Project[]>(null);
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    fetch(
      "https://script.google.com/macros/s/AKfycbyOfmK1lgnsFRZLQzghGEvYT-y3ftv0B0qBnAyKnpQNcOD3Z_oocbpSqJgUribNcYel/exec"
    )
      .then((response) => response.json())
      .then((data) => {
        setProjects(data);
        setLoaded(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  if (!loaded) {
    return (
      <>
        <div className={styles.main}>
          <div className={styles.title_box}>
            <div className={styles.title_area}>
              <h1 className={styles.page_title}>研究業績</h1>
            </div>
          </div>
          <div className="loading">
            <span className="load_1" />
            <span className="load_2" />
          </div>
        </div>
      </>
    );
  }

  const sortedConferencePapers = projects?.filter(
    (element) =>
      element.classification.toLowerCase().includes("国内会議") ||
      element.classification.toLowerCase().includes("国際会議") ||
      element.classification.toLowerCase().includes("論文誌")
  );

  const uniqueYears = Array.from(
    new Set(
      sortedConferencePapers?.flatMap((item) =>
        new Date(item.date).getFullYear()
      )
    )
  );

  return (
    <>
      <div className={styles.main}>
        <div className={styles.title_box}>
          <div className={styles.title_area}>
            <h1 className={styles.page_title}>研究業績</h1>
          </div>
        </div>
        <div className={styles.list_box}>
          <div className={styles.result_box}>
            {uniqueYears.map((year, i) => {
              const matchedDataWithYear = sortedConferencePapers?.filter(
                (item) => new Date(item.date).getFullYear() === year
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
                <>
                  <h2 key={i}>{year}年</h2>
                  {matchedJournal!.length > 0 ? (
                    <>
                      <h3>論文誌</h3>
                      <ol>
                        {matchedJournal!.map((item, j) => (
                          <li key={j}>
                            <Link href={`/project/${item.id}`}>
                              {item.citation}
                            </Link>
                          </li>
                        ))}
                      </ol>
                    </>
                  ) : (
                    <></>
                  )}

                  {matchedInternal!.length > 0 ? (
                    <>
                      <h3>国内会議</h3>
                      <ol>
                        {matchedInternal!.map((item, j) => (
                          <li key={j}>
                            <Link href={`/project/${item.id}`}>
                              {item.citation}
                            </Link>
                          </li>
                        ))}
                      </ol>
                    </>
                  ) : (
                    <></>
                  )}

                  {matchedExternal!.length > 0 ? (
                    <>
                      <h3>国際会議</h3>
                      <ol>
                        {matchedExternal!.map((item, j) => (
                          <li key={j}>
                            <Link href={`/project/${item.id}`}>
                              {item.citation}
                            </Link>
                          </li>
                        ))}
                      </ol>
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
