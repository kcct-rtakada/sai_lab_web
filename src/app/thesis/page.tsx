/* eslint-disable @next/next/no-img-element */
import Project from "@/components/DefaultStructure";
import styles from "@/styles/app/thesis/thesis.module.scss";
import Link from "next/link";
import { sai_projects } from "@/components/constant";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faLink } from "@fortawesome/free-solid-svg-icons";
import SEO from "@/components/common/SEO";
import type { Metadata } from "next";
import YearListSidebar from "@/components/client_parts/YearListSidebar";

export async function generateMetadata(): Promise<Metadata> {
  return SEO({
    title: "Thesis",
    description: "SAI (髙田研究室)での学位論文",
    url: `https://sai.ac/thesis`,
    imageUrl: undefined,
  });
}

export default async function Thesis() {
  const response = await fetch(sai_projects);
  const projects: Project[] = await response.json();

  const sortedConferencePapers = projects?.filter(
    (element) =>
      element.classification.toLowerCase().includes("本科卒業論文") ||
      element.classification.toLowerCase().includes("専攻科特別研究論文")
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
            <h1 className={styles.page_title}>学位論文</h1>
          </div>
        </div>
        <YearListSidebar pageName="学位論文" years={uniqueYears} />
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
              const matched2ndPaper = matchedDataWithYear?.filter((item) =>
                item.classification.toLowerCase().includes("専攻科特別研究論文")
              );
              const matched1stPaper = matchedDataWithYear?.filter((item) =>
                item.classification.toLowerCase().includes("本科卒業論文")
              );
              return (
                <>
                  <h2 key={i} id={String(year)}>
                    {year}年度
                  </h2>
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
