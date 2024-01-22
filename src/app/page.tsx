/* eslint-disable @next/next/no-img-element */
"use client";
import Image from "next/image";
import styles from "@/styles/app/page.module.scss";
import { useState, useEffect } from "react";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.img_box}>
        <div className={styles.animation_box}>
          <div><p>細</p></div>
          <div><p>最</p></div>
          <div><p>再</p></div>
          <div><p>祭</p></div>
          <div><p>際</p></div>
          <div><p>採</p></div>
          <div><p>才</p></div>
          <div><p>差異</p></div>
          <div><img src="/sai_logo.png" alt="sai" /></div>
        </div>
      </div>
      <div className={styles.section}></div>
      <div className={styles.section}>
        <h2 className={styles.section_name}>Welcome to SAI lab.!!</h2>
        <div className={styles.string_box}>
          <p>SAI lab.は神戸市立工業高等専門学校電子工学科内の研究室である．</p>
          <p>
            〇〇・〇〇を中心にヒューマン・コンピュータ・インタラクション(HCI)に関する研究を行っている．
          </p>
        </div>
        <h3>ヒューマン・コンピュータ・インタラクション(HCI)とは？</h3>
        <div className={styles.quote}>
          <p>
            デジタルデバイスが身の回りに溢れる昨今，人々とコンピュータを繋ぐ手法を探求するのがHCIである．
          </p>
        </div>
      </div>
    </main>
  );
}
