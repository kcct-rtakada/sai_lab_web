/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import Member from "@/components/DefaultStructure";
import styles from "@/styles/app/member/member.module.scss";
import Link from "next/link";

export default function Home() {
  const [members, setMembers] = useState<null | Member[]>(null);
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    fetch(
      "https://script.google.com/macros/s/AKfycbxiw89-v7yG6pGfG3HPDcrJb6tjrQ6_vKI8EATuKX8WmchggOC2gWlYaoiXUCRcokUt/exec"
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setMembers(data);
        setLoaded(true)
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  if (!loaded) {
    return (
      <main className={styles.main}>
        <div className={styles.title_box}>
          <div className={styles.title_area}>
            <h1 className={styles.page_title}>メンバー</h1>
          </div>
        </div>
        <div className="loading">
          <span className="load_1" />
          <span className="load_2" />
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <div className={styles.title_box}>
        <div className={styles.title_area}>
          <h1 className={styles.page_title}>メンバー</h1>
        </div>
      </div>
      <div className={styles.list_box}>
        <div className={styles.result_box}>
          {members!.map((item, i) => (
            <div key={i} className={styles.member}>
              <div className="left">
                <div className={styles.name}>{item.name}</div>
                <div className={styles.english_name}>{item.englishName}</div>
              </div>
              <div className="right">
                <div className={styles.belonging}>{item.belonging}</div>
                <div className={styles.classification}>
                  {item.classification}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
