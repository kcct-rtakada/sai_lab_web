"use client";
import React, { useEffect, useState } from "react";
import styles from "@/styles/components/Footer.module.scss";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <div>
      <div className={styles.footer_box}>
        <p>髙田 崚介</p>
        <p>
          (
          <a href="mailto:kcct-rtakada@g.kobe-kosen.ac.jp">
            kcct-rtakada@g.kobe-kosen.ac.jp
          </a>
          )
        </p>
        <p>
          <Link
            href="https://www.kobe-kosen.ac.jp/"
            target="_blank"
            rel="noopener noreferrer"
          >
            神戸高専
          </Link>
          &nbsp;&nbsp;
          <Link
            href="https://www.kobe-kosen.ac.jp/groups/denshi/"
            target="_blank"
            rel="noopener noreferrer"
          >
            電子工学科
          </Link>
        </p>
        <p>&copy; SAI</p>
      </div>
    </div>
  );
}
