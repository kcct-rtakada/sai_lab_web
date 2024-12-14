import React from 'react';
import Image from 'next/image';
import styles from '@/styles/components/ErrorBlock.module.scss';

export default function ErrorBlock({ children }: { children?: React.ReactNode }) {
  return (
    <div className={styles.error}>
      <div className={styles.error_text}>{children}</div>
      <div className={styles.error_img_box}>
        <Image src='/sai_logo.png' alt='sai_logo' fill sizes='4rem' />
      </div>
    </div>
  );
}
