/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import Project from "@/components/DefaultStructure";
import styles from "@/styles/app/projects/project.module.scss";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faLink } from "@fortawesome/free-solid-svg-icons";
// import SEO from "@/components/SEO";

export default function Page({ params }: { params: { slug: string } }) {
  const [project, setProject] = useState<null | Project>(null);

  useEffect(() => {
    fetch(
      "https://script.google.com/macros/s/AKfycbyOfmK1lgnsFRZLQzghGEvYT-y3ftv0B0qBnAyKnpQNcOD3Z_oocbpSqJgUribNcYel/exec"
    )
      .then((response) => response.json())
      .then((data) => {
        const id_num: number = Number(params.slug);
        const selectedCompany: Project = data.find(
          (c: { id: number }) => c.id === id_num
        );

        if (selectedCompany) {
          setProject(selectedCompany);
        } else console.log("Not Found");
      })
      .catch((err) => {
        console.log(err);
      });
  }, [params.slug]);

  if (!project) {
    return (
      <>
        {/* <SEO pageTitle="Loading" pageDescription={""} /> */}

        <main className={styles.main}>
          <div className="loading">
            <span className="load_1" />
            <span className="load_2" />
          </div>
        </main>
      </>
    );
  }

  const date = new Date(project.date);

  const displayDate = `${date.getFullYear()}/${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${(date.getDate() + 1).toString().padStart(2, "0")}`;

  return (
    <>
      {/* <SEO pageTitle={project.name} pageDescription={""} /> */}
      <main className={styles.main}>
        <section className={styles.project}>
          <div className={styles.project_card}>
            {project.type ? (
              <div className={styles.type}>
                <span>{project.type}</span>
              </div>
            ) : (
              <></>
            )}

            <h1 className={styles.title}>{project.title}</h1>
            <div className={styles.authors}>
              {project.authors.map((item, i) => (
                <span key={i} className={styles.author}>
                  {item.name}
                </span>
              ))}
            </div>
            {project.url ? (
              <Link href={project.url} className={styles.url_box_link}>
                <div className={styles.url_box}>
                  <FontAwesomeIcon icon={faLink} style={{ color: "#ffffff" }} />
                </div>
              </Link>
            ) : (
              <></>
            )}
            {project.paperUrl ? (
              <Link href={project.paperUrl} className={styles.pdf_box_link}>
                <div className={styles.pdf_box}>
                  <FontAwesomeIcon
                    icon={faFilePdf}
                    style={{ color: "#ffffff" }}
                  />
                </div>
              </Link>
            ) : (
              <></>
            )}
          </div>

          <div className={styles.main_script}>
            {project.thumbnailURL ? (
              <div className={styles.thumbnail_box}>
                <Link
                  href={project.thumbnailURL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={project.thumbnailURL} alt="thumbnail" />
                </Link>
              </div>
            ) : (
              <></>
            )}

            {project.abstract ? (
              <>
                <h2 className={styles.section_name}>Abstract</h2>
                <div className={styles.abstract}>{project.abstract}</div>
              </>
            ) : (
              <></>
            )}

            {project.presentationURL ? (
              <div>{project.presentationURL}</div>
            ) : (
              <>{/*No Slideshow*/}</>
            )}

            <h2 className={styles.section_name}>Information</h2>
            <div className={styles.book_card}>
              <h3 className={styles.information_section_title}>Book Title</h3>
              <div>{project.bookTitle}</div>
              <div className={styles.flex_box}>
                <div>
                  <h3 className={styles.information_section_title}>Volume</h3>
                  <div>{project.volume}</div>
                </div>
                <div>
                  <h3 className={styles.information_section_title}>Number</h3>
                  <div>{project.number}</div>
                </div>
              </div>
              <div className={styles.flex_box}>
                <div>
                  <h3 className={styles.information_section_title}>Date</h3>
                  <div>{String(displayDate)}</div>
                </div>
                <div>
                  <h3 className={styles.information_section_title}>Pages</h3>
                  <div>
                    {project.pageStart}-{project.pageEnd}
                  </div>
                </div>
              </div>
              <h3 className={styles.information_section_title}>Citation</h3>
              <div>{project.citation}</div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
