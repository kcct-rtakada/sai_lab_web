/* eslint-disable @next/next/no-img-element */
// "use client";
import Project from "@/components/DefaultStructure";
import styles from "@/styles/app/projects/project.module.scss";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faLink, faTag } from "@fortawesome/free-solid-svg-icons";
import { sai_projects } from "@/components/constant";
import parse from "html-react-parser";
import Image from "next/image";
import SEO from "@/components/SEO";
import type { Metadata } from "next";
import { cache } from "react";

const getProject = cache(async (slug: string) => {
  const response = await fetch(sai_projects);
  const projects: Project[] = await response.json();
  const project: Project | undefined = projects.find((c: { id: string }) => {
    const cid = String(c.id);
    return cid === slug;
  });
  return project;
});

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const project = await getProject(params.slug);
  if (!project)
    return SEO({
      title: "Undefined",
      description: "No Project",
      url: `https://sai.ac/project/${params.slug}`,
      imageUrl: undefined,
    });
  else
    return SEO({
      title: project.title,
      description: project.abstract,
      url: `https://sai.ac/project/${params.slug}`,
      imageUrl: undefined,
    });
}

export default async function Page({ params }: { params: { slug: string } }) {
  const project = await getProject(params.slug);

  // 見つからなかった場合
  if (!project) {
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

  const date = new Date(project!.date);

  const displayDate = `${date.getFullYear()}/${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${date.getDate().toString().padStart(2, "0")}`;
  // const project: Project

  return (
    <>
      {/* <SEO pageTitle={project.name} pageDescription={""} /> */}
      <div className={styles.main}>
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
            {project.tags.length > 0 ? (
              <div className={styles.tags}>
                {project.tags.map((tag, j) => (
                  <span key={j}>
                    <FontAwesomeIcon
                      icon={faTag}
                      style={{ color: "#8a8a8a" }}
                    />
                    {tag.name}
                  </span>
                ))}
              </div>
            ) : (
              <></>
            )}
            <div className={styles.links}>
              {project.url ? (
                <Link
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.url_box_link}
                >
                  <div className={styles.url_box}>
                    <FontAwesomeIcon
                      icon={faLink}
                      style={{
                        color: "#ffffff",
                        position: "absolute",
                        width: "2rem",
                        fontSize: "2rem",
                        top: "1.1rem",
                        left: ".8rem",
                        lineHeight: "1",
                      }}
                    />
                  </div>
                </Link>
              ) : (
                <></>
              )}
              {project.paperUrl ? (
                <Link
                  href={project.paperUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.pdf_box_link}
                >
                  <div className={styles.pdf_box}>
                    <FontAwesomeIcon
                      icon={faFilePdf}
                      style={{
                        color: "#ffffff",
                        position: "absolute",
                        width: "2rem",
                        fontSize: "2rem",
                        top: ".85rem",
                        left: "1rem",
                        lineHeight: "1",
                      }}
                    />
                  </div>
                </Link>
              ) : (
                <></>
              )}
            </div>
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
              <>
                <h2 className={styles.section_name}>Misc</h2>
                <div className={styles.slide_box}>
                  {parse(project.presentationURL)}
                </div>
              </>
            ) : (
              <></>
            )}

            {project.additionalImageURL.length > 0 ? (
              <>
                <h2 className={styles.section_name}>Images</h2>
                <div className={styles.images_box}>
                  {project.additionalImageURL.map((item, j) => (
                    <Link
                      href={`${item.name}`}
                      key={j}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className={styles.image} key={j}>
                        <img src={item.name} key={j} alt={`img_${j}`} />
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <></>
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
      </div>
    </>
  );
}
