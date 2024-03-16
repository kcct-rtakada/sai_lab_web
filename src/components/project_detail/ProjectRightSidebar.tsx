"use client";
import React, { useEffect, useState } from "react";
import { Project } from "../DefaultStructure";
import styles from "@/styles/app/projects/project.module.scss";
import MiniSearchArea from "@/components/client_parts/MiniSearchArea";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag, faUser, faBookOpen } from "@fortawesome/free-solid-svg-icons";

export default function ProjectRightSidebar({
  filteredProjects,
}: {
  filteredProjects: Project[];
}) {
  const [displayingNum, setDisplayingNum] = useState<number>(
    filteredProjects.length > 4 ? 4 : filteredProjects.length
  );
  const [isUsingPhone, setIsUsingPhone] = useState<boolean>(false);
  const [scrollbarWidth, setScrollbarWidth] = useState<number>(0);
  const [scrollbarAppeared, setScrollbarAppeared] = useState<boolean>(false);

  useEffect(() => {
    setIsUsingPhone(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));

    function getScrollbarWidth() {
      const outer = document.createElement("div");
      outer.style.visibility = "hidden";
      outer.style.overflow = "scroll";

      document.body.appendChild(outer);

      const inner = document.createElement("div");
      outer.appendChild(inner);

      const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;

      outer.parentNode?.removeChild(outer);

      return scrollbarWidth;
    }

    function updateScrollbarWidth() {
      const width = getScrollbarWidth();
      setScrollbarWidth(width);

      const outerDiv = document.getElementById("top_main");
      if (outerDiv) {
        const scrollbarVisible = outerDiv.scrollHeight > outerDiv.clientHeight;
        setScrollbarAppeared(scrollbarVisible);
      }
    }

    updateScrollbarWidth();

    window.addEventListener("resize", updateScrollbarWidth);

    return () => {
      window.removeEventListener("resize", updateScrollbarWidth);
    };
  }, []);

  const addDisplayingNum = () => {
    setDisplayingNum(
      displayingNum + 4 <= filteredProjects.length
        ? displayingNum + 4
        : filteredProjects.length
    );
  };

  return (
    <div
      className={`${styles.r_sidebar} ${
        isUsingPhone ? "" : styles.using_computer
      }`}
      style={{ right: `${scrollbarAppeared ? scrollbarWidth : 0}px` }}
      id="r_sidebar"
    >
      <div className={styles.side_content_area}>
        <p className={styles.section_title}>プロジェクト検索</p>
        <MiniSearchArea />
        {filteredProjects.length > 0 ? (
          <React.Fragment>
            <p className={styles.section_title}>
              関連プロジェクト({filteredProjects.length}件)
            </p>
            <ul className={styles.r_projects}>
              {filteredProjects.slice(0, displayingNum).map((item, i) => (
                <li key={i}>
                  <Link
                    href={`/project/${item.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.r_project_link}
                  >
                    <div className={styles.r_project}>
                      <div className={styles.title}>{item.title}</div>
                      <div className={styles.authors}>
                        {item.authors.map((author, k) => (
                          <span
                            className={styles.author}
                            key={`dProjAuthor${k}`}
                          >
                            <div>
                              <FontAwesomeIcon
                                icon={faUser}
                                style={{
                                  color: "#222",
                                  fontSize: "0.8rem",
                                  width: "0.8rem",
                                }}
                              />
                            </div>
                            <p>{author.name}</p>
                          </span>
                        ))}
                      </div>
                      {item.tags.length > 0 ? (
                        <div className={styles.tags}>
                          {item.tags.map((tag, k) => (
                            <span key={`dProjTag${k}`}>
                              <FontAwesomeIcon
                                icon={faTag}
                                style={{
                                  color: "#8a8a8a",
                                  fontSize: "0.8rem",
                                  width: "0.8rem",
                                }}
                              />
                              {tag.name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <></>
                      )}
                      <div className={styles.book}>
                        <div>
                          <FontAwesomeIcon
                            icon={faBookOpen}
                            style={{
                              color: "#222",
                              fontSize: "0.7rem",
                              width: "0.7rem",
                              display: "inline-block",
                            }}
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
                </li>
              ))}
            </ul>
            {displayingNum < filteredProjects.length ? (
              <button className={styles.see_more} onClick={addDisplayingNum}>
                さらに表示
              </button>
            ) : (
              <></>
            )}
          </React.Fragment>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
