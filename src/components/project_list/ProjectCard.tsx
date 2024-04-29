/* eslint-disable @next/next/no-img-element */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faBookOpen,
  faTag,
  faCalendar,
} from "@fortawesome/free-solid-svg-icons";
import { Project } from "@/components/DefaultStructure";
import styles from "@/styles/app/projects/projectList.module.scss";
import Link from "next/link";
import { CalcFiscalYear, ConvertToJST } from "../JSTConverter";
export default function ProjectCard({
  project,
  uniqueColorNumber,
}: {
  project: Project;
  uniqueColorNumber: number;
}) {
  const japanTime = ConvertToJST(project.date);
  return (
    <Link href={`/project/${project.id}`} className={styles.project_link}>
      <div className={`${styles.project} ${styles.border}`}>
        <div className={styles.thumbnail_box}>
          {/* 画像がない場合はデフォルト画像 */}
          {project.thumbnailURL ? (
            <img
              src={project.thumbnailURL}
              alt="thumbnail"
              className={styles.thumbnail}
              loading="lazy"
            />
          ) : (
            <img
              src="/sai_default_thumbnail.webp"
              alt="thumbnail"
              className={styles.thumbnail}
              loading="lazy"
            />
          )}
        </div>
        {project.type ? (
          <div className={`${styles.type} unique-type${uniqueColorNumber}`}>
            <span>{project.type}</span>
          </div>
        ) : (
          <></>
        )}
        <div className={styles.date}>
          <FontAwesomeIcon icon={faCalendar} style={{ marginRight: ".3rem" }} />
          {`${CalcFiscalYear(japanTime)}年度`}
        </div>
        <div className={styles.description_area}>
          <div className={styles.title}>{project.title}</div>
          <div className={styles.authors}>
            {project.authors.map((author, k) => (
              <span className={styles.author} key={`dProjAuthor${k}`}>
                <div>
                  <FontAwesomeIcon icon={faUser} style={{ color: "#222" }} />
                </div>
                <p>{author.name}</p>
              </span>
            ))}
          </div>
          {project.tags.length > 0 ? (
            <div className={styles.tags}>
              {project.tags.map((tag, k) => (
                <span key={`dProjTag${k}`}>
                  <FontAwesomeIcon icon={faTag} style={{ color: "#8a8a8a" }} />
                  {tag.name}
                </span>
              ))}
            </div>
          ) : (
            <></>
          )}
          <div className={styles.book}>
            <div>
              <FontAwesomeIcon icon={faBookOpen} style={{ color: "#222" }} />
            </div>
            <p>
              {/* 手動で形成する */}
              {`${project.bookTitle ? `${project.bookTitle}` : ``}${
                project.volume ? `, Vol.${project.volume}` : ``
              }${project.number ? `, ${project.number}` : ``}${
                project.pageStart && project.pageEnd
                  ? `, pp.${project.pageStart}-${project.pageEnd}`
                  : ``
              }`}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
