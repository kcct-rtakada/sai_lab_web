"use client";
import React, { useState, useEffect, useRef } from "react";
import styles from "@/styles/components/YearListSidebar.module.scss";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListUl, faXmark } from "@fortawesome/free-solid-svg-icons";

export default function YearListSidebar({
  pageName,
  years,
}: {
  pageName: string;
  years: number[];
}) {
  const [isOpening, setIsOpening] = useState<boolean>(false);
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (divRef.current && !divRef.current.contains(event.target as Node)) {
        setIsOpening(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={divRef}
      onClick={() => {
        if (!isOpening) setIsOpening(true);
        else return;
      }}
      className={`${styles.l_sidebar} ${isOpening ? styles.open : ""}`}
    >
      <div className={styles.icon_box}>
        <FontAwesomeIcon
          icon={faListUl}
          style={{
            fill: "white",
            color: "white",
            width: "1.8rem",
            fontSize: "1.8rem",
          }}
        />
      </div>
      <div
        className={`${styles.side_content_area} ${
          isOpening ? styles.open : ""
        }`}
      >
        <div className={styles.close_icon_box}>
          <button
            onClick={() => setIsOpening(false)}
            className={styles.close_button}
          >
            <FontAwesomeIcon
              icon={faXmark}
              style={{
                display: "block",
                width: "1.3rem",
                fontSize: "1.3rem",
              }}
            />
          </button>
        </div>
        <p className={styles.section_title}>目次</p>
        <div className={styles.l_index}>
          <ul>
            <li>
              <Link
                href="#"
                className={styles.link_box}
                onClick={() => setIsOpening(false)}
              >
                {pageName}
              </Link>
            </li>
            {years.map((year, i) => (
              <li key={i}>
                <Link
                  href={`#${year}`}
                  className={`${styles.link_box} ${styles.h2}`}
                  onClick={() => setIsOpening(false)}
                >
                  {year}年度
                </Link>
              </li>
            ))}
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
  );
}
