/* eslint-disable @next/next/no-html-link-for-pages */
'use client';
import React, { useState } from 'react';
import { Klee_One } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '@/styles/components/Header.module.scss';

export const kleeOne = Klee_One({
  subsets: ['latin'],
  weight: '400',
});

export default function Header() {
  const [isOpening, setIsOpening] = useState<boolean>(false);
  const path = usePathname();

  // 全てのリンクで自身のページに居る時と居ない時で表示を変える
  return (
    <header>
      <nav className={styles.fixed_header}>
        <div className={styles.header_contents}>
          <div className={styles.icon_box}>
            {path != '/' ? (
              // 通常遷移
              <Link onClick={() => setIsOpening(false)} href='/'>
                <Image src='/sai_logo.png' alt='SAI LOGO' fill sizes='4rem' priority={false} />
                <div className={`${styles.top_text_box}`}>
                  <div>
                    <p className={kleeOne.className}>
                      神戸高専
                      <br />
                      髙田研究室
                    </p>
                  </div>
                </div>
              </Link>
            ) : (
              // リロードさせる
              <a href='/'>
                <Image src='/sai_logo.png' alt='SAI LOGO' fill sizes='4rem' priority={false} />
                <div className={styles.top_text_box}>
                  <div>
                    <p className={kleeOne.className}>
                      神戸高専
                      <br />
                      髙田研究室
                    </p>
                  </div>
                </div>
              </a>
            )}
          </div>
          <input
            onChange={() => setIsOpening(!isOpening)}
            type='checkbox'
            id='hamburger'
            className={styles.hamburger}
            style={{ display: 'none' }}
          />
          <label htmlFor='hamburger' className={`${styles.hamburger_button} ${isOpening ? styles.opening : ''}`}>
            {/* ハンバーガーメニュー */}
            <div>
              <span />
              <span />
              <span />
            </div>
          </label>
          <div className={`${styles.link_box} ${isOpening ? styles.opening : ''}`}>
            <ul>
              {path !== '/news' ? (
                <li>
                  <Link onClick={() => setIsOpening(false)} href='/news'>
                    ニュース
                  </Link>
                </li>
              ) : (
                <li>
                  <p>ニュース</p>
                </li>
              )}
              {path !== '/project' ? (
                <li>
                  <Link onClick={() => setIsOpening(false)} href='/project'>
                    プロジェクト
                  </Link>
                </li>
              ) : (
                <li>
                  <p>プロジェクト</p>
                </li>
              )}
              {path !== '/member' ? (
                <li>
                  <Link onClick={() => setIsOpening(false)} href='/member'>
                    メンバー
                  </Link>
                </li>
              ) : (
                <li>
                  <p>メンバー</p>
                </li>
              )}
              {path !== '/publication' ? (
                <li>
                  <Link onClick={() => setIsOpening(false)} href='/publication'>
                    研究業績
                  </Link>
                </li>
              ) : (
                <li>
                  <p>研究業績</p>
                </li>
              )}
              {path !== '/thesis' ? (
                <li>
                  <Link onClick={() => setIsOpening(false)} href='/thesis'>
                    学位論文
                  </Link>
                </li>
              ) : (
                <li>
                  <p>学位論文</p>
                </li>
              )}
              {path !== '/funds' ? (
                <li>
                  <Link onClick={() => setIsOpening(false)} href='/funds'>
                    研究費
                  </Link>
                </li>
              ) : (
                <li>
                  <p>研究費</p>
                </li>
              )}
              {path !== '/award' ? (
                <li>
                  <Link onClick={() => setIsOpening(false)} href='/award'>
                    表彰
                  </Link>
                </li>
              ) : (
                <li>
                  <p>表彰</p>
                </li>
              )}
              {path !== '/contact' ? (
                <li>
                  <Link onClick={() => setIsOpening(false)} href='/contact'>
                    コンタクト
                  </Link>
                </li>
              ) : (
                <li>
                  <p>コンタクト</p>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
