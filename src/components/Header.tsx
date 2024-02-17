"use client";
import React, { useState } from "react";
import styles from "@/styles/components/Header.module.scss";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export default function Header() {
  const [isJapanese, setIsJapanese] = useState<boolean>(true);
  const [isOpening, setIsOpening] = useState<boolean>(false);
  const router = useRouter();
  const path = usePathname();

  return (
    <header>
      <nav className={styles.fixed_header}>
        <div className={styles.header_contents}>
          <div className={styles.icon_box}>
            {path != "/" ? (
              <Link onClick={() => setIsOpening(false)} href="/">
                <Image
                  src="/sai_logo.png"
                  alt="SAI LOGO"
                  fill
                  sizes="4rem"
                  priority={false}
                />
                <p>
                  神戸高専
                  <br />
                  髙田研究室
                </p>
              </Link>
            ) : (
              <span>
                <Image
                  src="/sai_logo.png"
                  alt="SAI LOGO"
                  fill
                  sizes="4rem"
                  priority={false}
                />
                <p>
                  神戸高専
                  <br />
                  髙田研究室
                </p>
              </span>
            )}
          </div>
          <input
            onChange={() => setIsOpening(!isOpening)}
            type="checkbox"
            id="hamburger"
            className={styles.hamburger}
            style={{ display: "none" }}
          />
          <label
            htmlFor="hamburger"
            className={`${styles.hamburger_button} ${
              isOpening ? styles.opening : ""
            }`}
          >
            <div>
              <span />
              <span />
              <span />
            </div>
          </label>
          <div
            className={`${styles.link_box} ${isOpening ? styles.opening : ""}`}
          >
            <ul>
              {path !== "/news" ? (
                <Link onClick={() => setIsOpening(false)} href="/news">
                  <li>ニュース</li>
                </Link>
              ) : (
                <p>ニュース</p>
              )}
              {path !== "/member" ? (
                <Link onClick={() => setIsOpening(false)} href="/member">
                  <li>メンバー</li>
                </Link>
              ) : (
                <p>メンバー</p>
              )}
              {path !== "/project" ? (
                <Link onClick={() => setIsOpening(false)} href="/project">
                  <li>プロジェクト</li>
                </Link>
              ) : (
                <p>プロジェクト</p>
              )}
              {path !== "/publication" ? (
                <Link onClick={() => setIsOpening(false)} href="/publication">
                  <li>研究業績</li>
                </Link>
              ) : (
                <p>研究業績</p>
              )}
              {path !== "/thesis" ? (
                <Link onClick={() => setIsOpening(false)} href="/thesis">
                  <li>学位論文</li>
                </Link>
              ) : (
                <p>学位論文</p>
              )}
              {path !== "/award" ? (
                <Link onClick={() => setIsOpening(false)} href="/award">
                  <li>表彰</li>
                </Link>
              ) : (
                <p>表彰</p>
              )}
              {path !== "/contact" ? (
                <Link onClick={() => setIsOpening(false)} href="/contact">
                  <li>コンタクト</li>
                </Link>
              ) : (
                <p>コンタクト</p>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
