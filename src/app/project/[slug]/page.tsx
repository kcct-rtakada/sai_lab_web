/* eslint-disable @next/next/no-img-element */
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
import React, { cache } from "react";
import CopyButton from "@/components/CopyButton";
import ProjectRightSidebar from "@/components/ProjectRightSidebar";

const getProject = cache(async (slug: string) => {
  const response = await fetch(sai_projects);
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
      <div className={styles.main}>
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
                <div className={styles.slide_box}>
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
                <div className={styles.slide_box}>
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
                <div className={styles.slide_box}>
                  {parse(project.presentationHTML)}
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
                  <div>{String(displayDate)}</div>
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
          <div className={styles.l_sidebar}>
            <div className={styles.side_content_area}>
              <p className={styles.section_title}>目次</p>
              <div className={styles.l_index}>
                <ul>
                  <li>
                    <Link href="#" className={styles.link_box}>
                      {project.title}
                    </Link>
                  </li>
                  {project.abstract ? (
                    <li>
                      <Link
                        href="#abstract"
                        className={`${styles.link_box} ${styles.h2}`}
                      >
                        Abstract
                      </Link>
                    </li>
                  ) : (
                    <></>
                  )}
                  {project.posterHTML ? (
                    <li>
                      <Link
                        href="#poster"
                        className={`${styles.link_box} ${styles.h2}`}
                      >
                        Poster
                      </Link>
                    </li>
                  ) : (
                    <></>
                  )}
                  {project.presentationHTML ? (
                    <li>
                      <Link
                        href="#presentation"
                        className={`${styles.link_box} ${styles.h2}`}
                      >
                        Presentation
                      </Link>
                    </li>
                  ) : (
                    <></>
                  )}
                  {project.documentHTML ? (
                    <li>
                      <Link
                        href="#document"
                        className={`${styles.link_box} ${styles.h2}`}
                      >
                        Document
                      </Link>
                    </li>
                  ) : (
                    <></>
                  )}
                  {project.freeHTML ? (
                    <li>
                      <Link
                        href="#misc"
                        className={`${styles.link_box} ${styles.h2}`}
                      >
                        Misc
                      </Link>
                    </li>
                  ) : (
                    <></>
                  )}
                  {project.additionalImageURL.length > 0 ? (
                    <li>
                      <Link
                        href="#images"
                        className={`${styles.link_box} ${styles.h2}`}
                      >
                        Images
                      </Link>
                    </li>
                  ) : (
                    <></>
                  )}
                  <li>
                    <Link
                      href="#information"
                      className={`${styles.link_box} ${styles.h2}`}
                    >
                      Information
                    </Link>
                  </li>
                </ul>
              </div>
              <svg
                id="polygon1"
                className={styles.polygon1}
                data-name="triangles"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 459.91 620.09"
              >
                <path
                  className={styles.svg_polygon_1}
                  d="M151.4,466.85c-4.45-1.27-7.87-3.38-10.25-6.34-2.38-2.96-3.62-6.69-3.71-11.18-.02-.09,0-.21.04-.37.09-.32.35-.48.78-.49l7.2.31c.09-.02.2,0,.32.03.36.1.54.37.54.8.27,2.36.99,4.23,2.14,5.61,1.15,1.38,2.94,2.42,5.37,3.11,2.3.66,4.27.8,5.91.43,1.63-.37,2.7-1.45,3.21-3.24.5-1.75.21-3.33-.87-4.76-1.08-1.42-2.7-2.92-4.88-4.49l-3.75-2.68c-3.44-2.4-5.91-5.03-7.42-7.89-1.51-2.86-1.77-6-.79-9.41.56-1.95,1.47-3.62,2.75-5.02,1.28-1.4,2.8-2.48,4.57-3.24,1.77-.76,3.71-1.2,5.82-1.3,2.11-.11,4.31.17,6.57.81,3.97,1.13,7.11,3.04,9.4,5.71,2.29,2.67,3.46,6.17,3.52,10.48.02.09,0,.22-.04.38-.09.32-.35.48-.78.49l-7.6-.24c-.09.02-.22,0-.38-.04-.28-.08-.46-.35-.55-.8-.24-2.17-.85-3.83-1.84-4.97-.99-1.14-2.37-1.97-4.16-2.48-2.11-.6-3.89-.67-5.36-.21-1.47.46-2.4,1.39-2.79,2.78-.42,1.47-.14,2.92.83,4.33.97,1.42,2.72,2.98,5.24,4.69l3.02,2.09c3.9,2.62,6.57,5.36,8.03,8.22,1.46,2.87,1.63,6.25.52,10.14-.56,1.95-1.48,3.64-2.77,5.08-1.29,1.44-2.84,2.54-4.65,3.31-1.81.77-3.85,1.2-6.11,1.29-2.26.08-4.62-.22-7.09-.93Z"
                />
                <path
                  className={styles.svg_polygon_1}
                  d="M238.76,332.48c-.33.06-.57.02-.75-.11-.17-.14-.21-.38-.11-.74l10.48-50.43c.08-.48.36-.76.85-.85l6.15-1.16c.49-.09.85.07,1.1.49l28.21,43.13c.05.07.1.19.13.35.08.41-.13.66-.62.75l-8.35,1.58c-.49.09-.86-.07-1.1-.49l-5.11-8.37-20.11,3.79-1.77,9.67c-.08.48-.36.76-.85.85l-8.16,1.54ZM264.92,308.93l-10.41-17.03-3.48,19.65,13.89-2.62Z"
                />
                <path
                  className={styles.svg_polygon_1}
                  d="M373.46,389.37c-.55-.2-.72-.57-.52-1.11l16.08-44.75c.2-.54.56-.72,1.11-.52l6.89,2.47c.54.2.72.57.52,1.11l-16.08,44.75c-.2.54-.57.72-1.11.52l-6.89-2.47Z"
                />
              </svg>
            </div>
          </div>
          <ProjectRightSidebar filteredProjects={filteredRelativeProject} />
        </section>
      </div>
    </>
  );
}
