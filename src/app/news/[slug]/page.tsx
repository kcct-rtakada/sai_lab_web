/* eslint-disable @next/next/no-img-element */
// "use client";
import React, { useState, useEffect } from "react";
import News from "@/components/DefaultStructure";
import styles from "@/styles/app/news/news.module.scss";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { sai_news } from "@/components/constant";
import parse from "html-react-parser";
import Image from "next/image";
import SEO from "@/components/SEO";
import type { Metadata } from "next";
import { cache } from "react";

const getNews = cache(async (slug: string) => {
  const response = await fetch(sai_news);
  const newsList: News[] = await response.json();
  const news: News | undefined = newsList.find((c: { id: string }) => {
    const cid = String(c.id);
    return cid === slug;
  });
  return news;
});

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const news = await getNews(params.slug);
  if (!news)
    return SEO({
      title: "Undefined",
      description: "No News",
      url: `https://sai.ac/news/${params.slug}`,
      imageUrl: undefined,
    });
  else
    return SEO({
      title: news.title,
      description: `SAI (髙田研究室)のニュース(${new Date(
        news.date
      ).getFullYear()}/${(new Date(news.date).getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${new Date(news.date)
        .getDate()
        .toString()
        .padStart(2, "0")})`,
      url: `https://sai.ac/project/${params.slug}`,
      imageUrl: undefined,
    });
}

export default async function Page({ params }: { params: { slug: string } }) {
  const news = await getNews(params.slug);

  // 見つからなかった場合
  if (!news) {
    return (
      <div className={styles.main}>
        <div className="notfound">
          <div className="notfound_text">
            このページの詳細が見つかりませんでした。
            <br />
            まだ反映されていない可能性があるので、
            <br />
            時間を空けてから再度アクセスしてください。
          </div>
          <div className="notfound_img_box">
            <Image src="/sai_logo.png" alt="sai_logo" fill sizes="4rem" />
          </div>
        </div>
      </div>
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
                style={{
                  display: "inline-block",
                  marginRight: ".3rem",
                  fontSize: "1rem",
                  width: "1rem",
                }}
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
