/* eslint-disable @next/next/no-img-element */
import { Award } from "@/components/DefaultStructure";
import styles from "@/styles/app/award/award.module.scss";
import Link from "next/link";
import SEO from "@/components/common/SEO";
import type { Metadata } from "next";
import YearListSidebar from "@/components/client_parts/YearListSidebar";
import React from "react";
import { fetchAwards } from "@/components/GASFetch";

export async function generateMetadata(): Promise<Metadata> {
  return SEO({
    title: "Award",
    description: "SAI (髙田研究室)での表彰",
    url: `https://sai.ac/award`,
    imageUrl: undefined,
  });
}

export default async function Award() {
  const response = await fetchAwards();
  const awards: Award[] = await response.json();
  const filteredAwards = awards.filter((item) => item.id !== "");

  const uniqueYears = Array.from(
    new Set(
      filteredAwards?.flatMap((item) => {
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

  return (
    <React.Fragment>
      <div className={styles.main}>
        <div className={styles.title_box}>
          <div className={styles.title_area}>
            <h1 className={styles.page_title}>表彰</h1>
          </div>
        </div>
        <YearListSidebar pageName="表彰" years={uniqueYears} />
        <div className={styles.list_box}>
          <div className={styles.result_box}>
            {uniqueYears.map((year, i) => {
              const matchedDataWithYear = filteredAwards?.filter((item) => {
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
              });

              return (
                <React.Fragment key={i}>
                  <h2 key={`year${i}`} id={String(year)}>
                    {year}年度
                  </h2>
                  <ul key={`ul${i}`}>
                    {matchedDataWithYear!.map((award, j) => {
                      const japanTime = new Date(
                        new Date(award.date).toLocaleString("en-US", {
                          timeZone: "Asia/Tokyo",
                        })
                      );

                      const displayDate = `${japanTime.getFullYear()}/${(
                        japanTime.getMonth() + 1
                      )
                        .toString()
                        .padStart(2, "0")}/${japanTime
                        .getDate()
                        .toString()
                        .padStart(2, "0")}`;
                      return (
                        <li key={j}>
                          {award.link ? (
                            <Link
                              href={award.link}
                              target="_blank"
                              rel="noopener noreferrer"
                            >{`${
                              award.organization ? `${award.organization}` : ``
                            }${
                              award.competition ? `, ${award.competition}` : ``
                            }, ${award.award}, ${
                              award.person
                            } (${displayDate})`}</Link>
                          ) : (
                            `${
                              award.organization ? `${award.organization}` : ``
                            }${
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
