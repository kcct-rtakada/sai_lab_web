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
        setMembers(data);
        setLoaded(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  if (!loaded) {
    return (
      <div className={styles.main}>
        <div className={styles.title_box}>
          <div className={styles.title_area}>
            <h1 className={styles.page_title}>メンバー</h1>
          </div>
        </div>
        <div className="loading">
          <span className="load_1" />
          <span className="load_2" />
        </div>
      </div>
    );
  }

  const sortedMemberWithTeacher = members?.filter((element) =>
    element.belonging.toLowerCase().includes("教員")
  );
  const sortedMemberWithGraduation = members?.filter(
    (element) =>
      element.belonging.toLowerCase().includes("卒") ||
      element.belonging.toLowerCase().includes("修")
  );
  const sortedEnrolledMember = members?.filter((element) => {
    return (
      !sortedMemberWithGraduation?.some(
        (sortedMember) => sortedMember.id === element.id
      ) &&
      !sortedMemberWithTeacher?.some(
        (sortedMember) => sortedMember.id === element.id
      )
    );
  });

  return (
    <div className={styles.main}>
      <div className={styles.title_box}>
        <div className={styles.title_area}>
          <h1 className={styles.page_title}>メンバー</h1>
        </div>
      </div>
      <div className={styles.list_box}>
        <div className={styles.result_box}>
          <h2>教員</h2>
          {sortedMemberWithTeacher!.map((item, i) => (
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
        <div className={styles.result_box}>
          <h2>在籍中</h2>
          {sortedEnrolledMember!.map((item, i) => (
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
        <div className={styles.result_box}>
          <h2>卒業/修了</h2>
          {sortedMemberWithGraduation!.map((item, i) => (
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
    </div>
  );
}
