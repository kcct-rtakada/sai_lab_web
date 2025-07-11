'use client';
import { RefObject } from 'react';
import styles from '@/styles/components/ScrollToTopButton.module.scss';

export default function ScrollToTopButton({
  targetRef,
  isVisible,
}: {
  targetRef: RefObject<HTMLDivElement | null>;
  isVisible: boolean;
}) {
  const scrollToTop = () => {
    if (targetRef.current) {
      targetRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <button
      title='ページ上部へ戻る'
      className={`${styles.scrollToTopButton} ${isVisible ? styles.visible : styles.hidden}`}
      onClick={scrollToTop}
    />
  );
}
