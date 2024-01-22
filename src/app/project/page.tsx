/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import Project from "@/components/DefaultStructure";
import styles from "@/styles/app/projects/projectList.module.scss";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faBookOpen } from "@fortawesome/free-solid-svg-icons";
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
              <h1 className={styles.page_title}>プロジェクト</h1>
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

  return (
    <>
      <main className={styles.main}>
        <div className={styles.title_box}>
          <div className={styles.title_area}>
            <h1 className={styles.page_title}>プロジェクト</h1>
          </div>
        </div>
        <div className={styles.list_box}>
          <div className={styles.result_box}>
            {projects!.map((item, i) => (
              <Link
                key={i}
                href={`/project/${i + 1}`}
                className={styles.project_link}
              >
                <div className={styles.project}>
                  <div className={styles.thumbnail_box}>
                    {item.thumbnailURL ? (
                      <img
                        src={item.thumbnailURL}
                        alt="thumbnail"
                        className={styles.thumbnail}
                      />
                    ) : (
                      <img
                        src="/sai_default_thumbnail.webp"
                        alt="thumbnail"
                        className={styles.thumbnail}
                      />
                    )}
                  </div>
                  {item.type ? (
                    <div className={styles.type}>
                      <span>{item.type}</span>
                    </div>
                  ) : (
                    <></>
                  )}

                  <div className={styles.title}>{item.title}</div>
                  <div className={styles.authors}>
                    {item.authors.map((author, i) => (
                      <span className={styles.author} key={i}>
                        <div>
                          <FontAwesomeIcon
                            icon={faUser}
                            style={{ color: "#222" }}
                          />
                        </div>
                        <p>{author.name}</p>
                      </span>
                    ))}
                  </div>
                  <div className={styles.book}>
                    <div>
                      <FontAwesomeIcon
                        icon={faBookOpen}
                        style={{ color: "#222" }}
                      />
                    </div>
                    <p>
                      {`${item.bookTitle ? `${item.bookTitle}` : ``}${
                        item.volume ? `, Vol.${item.volume}` : ``
                      }${item.number ? `, ${item.number}` : ``}${
                        item.pageStart && item.pageEnd
                          ? `, pp.${item.pageStart}-${item.pageEnd}`
                          : ``
                      }`}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
