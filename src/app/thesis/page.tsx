/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import Project from "@/components/DefaultStructure";
import styles from "@/styles/app/thesis/thesis.module.scss"
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
        <main className={styles.main}>
          <div className={styles.title_box}>
            <div className={styles.title_area}>
              <h1 className={styles.page_title}>卒論/修論</h1>
            </div>
          </div>
          <div className="loading">
            <span className="load_1" />
            <span className="load_2" />
          </div>
        </main>
      </>
    );
  }

  const sortedConferencePapers = projects?.filter(
    (element) =>
      element.classification.toLowerCase().includes("卒論") ||
      element.classification.toLowerCase().includes("修論")
  );
  console.log(sortedConferencePapers);

  const uniqueYears = Array.from(
    new Set(
      sortedConferencePapers?.flatMap((item) =>
        new Date(item.date).getFullYear()
      )
    )
  );
  console.log(uniqueYears);

  return (
    <>
      <main className={styles.main}>
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
              const matched2ndPaper = matchedDataWithYear?.filter(
                (item) => item.classification.toLowerCase().includes("修論")
              )
              const matched1stPaper = matchedDataWithYear?.filter(
                (item) => item.classification.toLowerCase().includes("卒論")
              )
              return (
                <>
                <h2>{year}年</h2>
                  <h3>修論</h3>
                  <ol>
                    {matched2ndPaper!.map((item, i) => (
                      <li key={i}><Link href={`/project/${item.id}`}>{`${item.authors.map((e, j) => `${e.name}, `)}${item.title}`}</Link></li>
                    ))}
                  </ol>
                  <h3>卒論</h3>
                  <ol>
                    {matched1stPaper!.map((item, i) => (
                      <li key={i}><Link href={`/project/${item.id}`}>{`${item.authors.map((e, j) => `${e.name}, `)}${item.title}`}</Link></li>
                    ))}
                  </ol>
                </>
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
}
