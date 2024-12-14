'use client';
import { useEffect, useState } from 'react';
import styles from '@/styles/components/ScrollToTopButton.module.scss';

export default function ScrollToTopButton({ containerRef }: any) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = containerRef.current.scrollTop;
      // 300px下がるまで表示させない
      if (scrollTop > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    containerRef.current.addEventListener('scroll', handleScroll);

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      containerRef.current.removeEventListener('scroll', handleScroll);
    };
  }, [containerRef]);

  const scrollToTop = () => {
    containerRef.current.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      title='ページ上部へ戻る'
      className={`${styles.scrollToTopButton} ${isVisible ? styles.visible : styles.hidden}`}
      onClick={scrollToTop}
    />
  );
}
