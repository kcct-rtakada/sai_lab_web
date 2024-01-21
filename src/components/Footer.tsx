'use client'
import React, { useEffect, useState } from "react";
import styles from "@/styles/components/Footer.module.scss";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <div className={styles.footer_box}>
      &copy; SAI lab.
      </div>
    </footer>
  );
}
