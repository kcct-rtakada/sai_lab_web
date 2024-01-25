/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import News from "@/components/DefaultStructure";
import styles from "@/styles/app/news/news.module.scss";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { sai_news, sai_projects } from "@/components/constant";
import parse from "html-react-parser";
// import SEO from "@/components/SEO";

export default function Page({ params }: { params: { slug: string } }) {
  const [news, setNews] = useState<null | News>(null);

  useEffect(() => {
    fetch(sai_news)
      .then((response) => response.json())
      .then((data) => {
        const id: string = String(params.slug);
        const selectedCompany: News = data.find((c: { id: string }) => {
          const cid = String(c.id);
          return cid === params.slug;
        });

        if (selectedCompany) {
          setNews(selectedCompany);
        } else console.log("Not Found");
      })
      .catch((err) => {
        console.log(err);
      });
  }, [params.slug]);

  if (!news) {
    return (
      <>
        {/* <SEO pageTitle="Loading" pageDescription={""} /> */}

        <div className={styles.main}>
          <div className="loading">
            <span className="load_1" />
            <span className="load_2" />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* <SEO pageTitle={project.name} pageDescription={""} /> */}
      <div className={styles.main}>
        <section className={styles.project}>
          <div className={styles.project_card}>
            <h1 className={styles.title}>{news.title}</h1>
            <div className={styles.date}>
              <FontAwesomeIcon
                icon={faCalendar}
                style={{ marginRight: ".3rem" }}
              />
              {`${new Date(news.date).getFullYear()}/${(
                new Date(news.date).getMonth() + 1
              )
                .toString()
                .padStart(2, "0")}/${new Date(news.date)
                .getDate()
                .toString()
                .padStart(2, "0")}`}
            </div>
          </div>

          <div className={styles.main_script}>
            {news.thumbnailURL ? (
              <div className={styles.thumbnail_box}>
                <Link
                  href={news.thumbnailURL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={news.thumbnailURL} alt="thumbnail" />
                </Link>
              </div>
            ) : (
              <></>
            )}

            {news.article ? (
              <>
                <div className={styles.article}>{parse(news.article)}</div>
              </>
            ) : (
              <></>
            )}
            {news.links.length > 0 ? (
              <>
                <h2 className={styles.section_name}>関連リンク</h2>
                <ul className={styles.links}>
                  {news.links.map((link, j) => (
                    <li key={j}>
                      <Link
                        href={link.name}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <></>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
