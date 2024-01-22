'use client'
import React, { useEffect, useState } from "react";
import styles from "@/styles/components/Header.module.scss";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export default function Header() {
  const [isJapanese, setIsJapanese] = useState<boolean>(true)
  const router = useRouter();
  const path = usePathname()

  return (
    <header>
      <nav className={styles.fixed_header}>
        <div className={styles.header_contents}>
          <div className={styles.icon_box}>
            <Link href="/">
              <Image src="/sai_logo.png" alt="SAI LOGO" fill sizes="4rem" priority={false} />
              <p>神戸高専<br />髙田研究室</p>
            </Link>
          </div>
          <input
            type="checkbox"
            id="hamburger"
            className={styles.hamburger}
            style={{ display: "none" }}
          />
          <label htmlFor="hamburger" className={styles.hamburger_button}>
            <div >
              <span />
              <span />
              <span />
            </div>
          </label>
          <div className={styles.link_box}>
            <ul>
              <Link href="/member">メンバー</Link>
              <Link href="/project">プロジェクト</Link>
              <Link href="/publication">研究業績</Link>
              <Link href="/thesis">卒論/修論</Link>
              <Link href="/award">表彰</Link>
              <Link href="/contact">コンタクト</Link>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
