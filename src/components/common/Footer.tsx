'use client';
import Link from 'next/link';
import styles from '@/styles/components/Footer.module.scss';

export default function Footer() {
  return (
    <div>
      <div className={styles.footer_box}>
        <p>髙田 崚介</p>
        <p>
          <Link href='https://www.kobe-kosen.ac.jp/' target='_blank' rel='noopener noreferrer'>
            神戸高専
          </Link>
          &nbsp;&nbsp;
          <Link href='https://www.kobe-kosen.ac.jp/groups/denshi/' target='_blank' rel='noopener noreferrer'>
            電子工学科
          </Link>
        </p>
        <p>&copy; SAI</p>
      </div>
    </div>
  );
}
