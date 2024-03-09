/* eslint-disable @next/next/no-img-element */
import Project from "@/components/DefaultStructure";
import styles from "@/styles/app/publication/publication.module.scss";
import Link from "next/link";
import { sai_projects } from "@/components/constant";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faLink } from "@fortawesome/free-solid-svg-icons";
import SEO from "@/components/SEO";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return SEO({
    title: "Publication",
    description: "SAI (髙田研究室)の研究業績",
    url: `https://sai.ac/publication`,
    imageUrl: undefined,
  });
}

export default async function Publication() {
  const response = await fetch(sai_projects);
  const projects: Project[] = await response.json();

  const sortedConferencePapers = projects?.filter(
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
      <>
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
      </>
    );
  };

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
                <>
                  <h2 key={i}>{year}年度</h2>
                  {matchedJournal!.length > 0 ? (
                    <>{displayingThesis("論文誌", matchedJournal)}</>
                  ) : (
                    <></>
                  )}

                  {matchedInternal!.length > 0 ? (
                    <>{displayingThesis("国内会議", matchedInternal)}</>
                  ) : (
                    <></>
                  )}

                  {matchedExternal!.length > 0 ? (
                    <>{displayingThesis("国際会議", matchedExternal)}</>
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
