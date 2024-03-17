/* eslint-disable @next/next/no-img-element */
import { Project } from "@/components/DefaultStructure";
import styles from "@/styles/app/projects/project.module.scss";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faLink, faTag } from "@fortawesome/free-solid-svg-icons";
import parse from "html-react-parser";
import Image from "next/image";
import SEO from "@/components/common/SEO";
import type { Metadata } from "next";
import React, { cache } from "react";
import CopyButton from "@/components/client_parts/CopyButton";
import ProjectRightSidebar from "@/components/project_detail/ProjectRightSidebar";
import ProjectLeftSidebar from "@/components/project_detail/ProjectLeftSidebar";
import { fetchProjects } from "@/components/GASFetch";

const getProject = cache(async (slug: string) => {
  const response = await fetchProjects();
  const projects: Project[] = await response.json();
  const filteredProjects = projects.filter((item) => item.id !== "");
  const project: Project | undefined = filteredProjects.find(
    (c: { id: string }) => {
      const cid = String(c.id);
      return cid === slug;
    }
  );
  return {
    project: project,
    projects: filteredProjects,
  };
});

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { project } = await getProject(params.slug);
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
  const { project, projects } = await getProject(params.slug);

  const filteredRelativeProject = projects.filter(
    (item) =>
      project?.tags.some(
        (tag) =>
          item.tags.some(
            (itemTag) =>
              tag.name !== "" &&
              itemTag.name.toLowerCase().includes(tag.name.toLowerCase())
          ) || project?.title.toLowerCase().includes(item.title.toLowerCase())
      ) && project?.id !== item.id
  );

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

  const japanTime = new Date(
    new Date(project!.date).toLocaleString("en-US", { timeZone: "Asia/Tokyo" })
  );

  const displayDate = `${japanTime.getFullYear()}/${(japanTime.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${japanTime.getDate().toString().padStart(2, "0")}`;

  return (
    <>
      <div className={styles.main} id="project-detail">
        <section className={styles.project}>
          <div id="top" className={styles.project_card}>
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
                        top: ".8rem",
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
                <h2 id="abstract" className={styles.section_name}>
                  Abstract
                </h2>
                <div className={styles.abstract}>{project.abstract}</div>
              </>
            ) : (
              <></>
            )}

            {project.posterHTML ? (
              <>
                <h2 id="poster" className={styles.section_name}>
                  Poster
                </h2>
                <div className={`${styles.slide_box} ${styles.poster}`}>
                  {parse(project.posterHTML)}
                </div>
              </>
            ) : (
              <></>
            )}

            {project.presentationHTML ? (
              <>
                <h2 id="presentation" className={styles.section_name}>
                  Presentation
                </h2>
                <div className={`${styles.slide_box} ${styles.presentation}`}>
                  {parse(project.presentationHTML)}
                </div>
              </>
            ) : (
              <></>
            )}

            {project.documentHTML ? (
              <>
                <h2 id="document" className={styles.section_name}>
                  Document
                </h2>
                <div className={`${styles.slide_box} ${styles.document}`}>
                  {parse(project.documentHTML)}
                </div>
              </>
            ) : (
              <></>
            )}

            {project.freeHTML ? (
              <>
                <h2 id="misc" className={styles.section_name}>
                  Misc
                </h2>
                <div className={styles.slide_box}>
                  {parse(project.freeHTML)}
                </div>
              </>
            ) : (
              <></>
            )}

            {project.additionalImageURL.length > 0 ? (
              <>
                <h2 id="images" className={styles.section_name}>
                  Images
                </h2>
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

            <h2 id="information" className={styles.section_name}>
              Information
            </h2>
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
                  <div>
                    <time dateTime={japanTime.toISOString()}>
                      {String(displayDate)}
                    </time>
                  </div>
                </div>
                <div>
                  <h3 className={styles.information_section_title}>Pages</h3>
                  <div>
                    {project.pageStart}-{project.pageEnd}
                  </div>
                </div>
              </div>
              <h3 className={styles.information_section_title}>
                Citation&nbsp;
                <CopyButton text={project.citation} />
              </h3>
              <div>{project.citation}</div>
            </div>
          </div>
          <ProjectLeftSidebar project={project} />
          <ProjectRightSidebar filteredProjects={filteredRelativeProject} />
        </section>
      </div>
    </>
  );
}
