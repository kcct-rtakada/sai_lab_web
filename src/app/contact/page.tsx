/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import styles from "@/styles/app/contact/contact.module.scss";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  return (
      <div className={styles.main}>
        <div className={styles.title_box}>
          <div className={styles.title_area}>
            <h1 className={styles.page_title}>コンタクト</h1>
          </div>
        </div>
        <div className={styles.main_script}>
          <h2>コンタクト</h2>
          <p>研究室への</p>
          <ul>
            <li>SAIへの配属希望・研究室説明希望</li>
            <li>他学科・他学年学生だけど研究に興味がある</li>
            <li>共同研究依頼</li>
            <li>取材依頼</li>
          </ul>
          <p>
            また、指導教員（髙田）個人への連絡は
            <Link href="mailto:kcct-rtakada@g.kobe-kosen.ac.jp">
              kcct-rtakada@g.kobe-kosen.ac.jp
            </Link>
            でも受け付けています。
          </p>
          <h2>アクセス</h2>
          <p>
            <Link
              href="https://www.kobe-kosen.ac.jp/common/access_campus_map.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              神戸高専アクセス情報：https://www.kobe-kosen.ac.jp/common/access_campus_map.html
            </Link>
          </p>
          <p>
            上記ウェブページのキャンパスマップ内⑦にある「電子工学科棟3F」で活動しております。
          </p>
          <h2>フォーム</h2>
          <p>
            <Link
              href="https://forms.gle/JngM8dAN5b6yAtBv9"
              target="_blank"
              rel="noopener noreferrer"
            >
              SAI（神戸高専 髙田研究室）問い合わせフォーム：https://forms.gle/JngM8dAN5b6yAtBv9
            </Link>
          </p>
          <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSeP-U1M1MeJIp4b5wBAlDmgptdyLxOWacAZVLIPezzGssslhw/viewform?embedded=true" width="640" height="1171">読み込んでいます…</iframe>
        </div>
      </div>
  );
}
