import React, { useEffect, useState } from "react";
import styles from "@/styles/components/Header.module.scss";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header>
      <nav className={styles.fixed_header}>
        <div className={styles.header_contents}>
          <div className={styles.icon_box}>
            <Link href="/">
              <Image src="/sai_logo.png" alt="SAI LOGO" fill />
            </Link>
          </div>
          <div className={styles.link_box}>
            <ul>
              <Link href="/member">メンバー</Link>
              <Link href="/project">プロジェクト</Link>
              <Link href="/">コンタクト</Link>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
