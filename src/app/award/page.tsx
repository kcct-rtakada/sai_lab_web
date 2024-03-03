/* eslint-disable @next/next/no-img-element */
import Award from "@/components/DefaultStructure";
import styles from "@/styles/app/award/award.module.scss";
import Link from "next/link";
import { sai_awards } from "@/components/constant";
import SEO from "@/components/SEO";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return SEO({
    title: "Award",
    description: "SAI (髙田研究室)での表彰",
    url: `https://sai.ac/award`,
    imageUrl: undefined,
  });
}

export default async function Award() {
  const response = await fetch(sai_awards);
  const awards: Award[] = await response.json();

  const uniqueYears = Array.from(
    new Set(
      awards?.flatMap((item) =>
        new Date(item.date).getMonth() > 3
          ? new Date(item.date).getFullYear()
          : new Date(item.date).getFullYear() - 1
      )
    )
  );

  return (
    <>
      <div className={styles.main}>
        <div className={styles.title_box}>
          <div className={styles.title_area}>
            <h1 className={styles.page_title}>表彰</h1>
          </div>
        </div>
        <div className={styles.list_box}>
          <div className={styles.result_box}>
            {uniqueYears.map((year, i) => {
              const matchedDataWithYear = awards?.filter(
                (item) =>
                  (new Date(item.date).getMonth() > 3
                    ? new Date(item.date).getFullYear()
                    : new Date(item.date).getFullYear() - 1) === year
              );

              return (
                <>
                  <h2 key={`year${i}`}>{year}年度</h2>
                  <ul key={`ul${i}`}>
                    {matchedDataWithYear!.map((award, j) => {
                      const date = new Date(award.date);

                      const displayDate = `${date.getFullYear()}/${(
                        date.getMonth() + 1
                      )
                        .toString()
                        .padStart(2, "0")}/${date
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
                </>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

// https://script.google.com/macros/s/AKfycbyghZzjroYK8o4rRH2eVByK5id4Obxn3GqoyF7iJL9Ap8MjZCnA5GPbpAtpGle1Vo_8/exec
