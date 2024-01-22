/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import Award from "@/components/DefaultStructure";
import styles from "@/styles/app/award/award.module.scss";
import Link from "next/link";
// import SEO from "@/components/SEO";

export default function Home() {
  const [awards, setAwards] = useState<null | Award[]>(null);
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    fetch(
      "https://script.google.com/macros/s/AKfycbyghZzjroYK8o4rRH2eVByK5id4Obxn3GqoyF7iJL9Ap8MjZCnA5GPbpAtpGle1Vo_8/exec"
    )
      .then((response) => response.json())
      .then((data) => {
        setAwards(data);
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
              <h1 className={styles.page_title}>表彰</h1>
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
  console.log(awards);

  return (
    <>
      <main className={styles.main}>
        <div className={styles.title_box}>
          <div className={styles.title_area}>
            <h1 className={styles.page_title}>表彰</h1>
          </div>
        </div>
        <div className={styles.list_box}>
          <div className={styles.result_box}>
            <ul>
              {awards!.map((award, i) => {
                const date = new Date(award.date);

                const displayDate = `${date.getFullYear()}/${(
                  date.getMonth() + 1
                )
                  .toString()
                  .padStart(2, "0")}/${(date.getDate() + 1)
                  .toString()
                  .padStart(2, "0")}`;
                return (
                  <li key={i}>
                    {award.link ? (
                      <Link
                        href={award.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >{`${award.organization ? `${award.organization}` : ``}${
                        award.competition ? `, ${award.competition}` : ``
                      }, ${award.award}, ${award.person} (${displayDate})`}</Link>
                    ) : (
                      `${award.organization ? `${award.organization}` : ``}${
                        award.competition ? `, ${award.competition}` : ``
                      }, ${award.award}, ${award.person} (${displayDate})`
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </main>
    </>
  );
}

// https://script.google.com/macros/s/AKfycbyghZzjroYK8o4rRH2eVByK5id4Obxn3GqoyF7iJL9Ap8MjZCnA5GPbpAtpGle1Vo_8/exec
