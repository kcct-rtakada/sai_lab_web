/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import styles from "@/styles/app/contact/contact.module.scss";
import { useState, useEffect } from "react";

export default function Home() {
  return (
    <>
        <main className={styles.main}>
          <div className={styles.title_box}>
            <div className={styles.title_area}>
              <h1 className={styles.page_title}>コンタクト</h1>
            </div>
          </div>
          <div className={styles.main_script}>
            <h2>メールアドレス</h2>
            hoge[at]example.com
          </div>
        </main>
      </>
  );
}
