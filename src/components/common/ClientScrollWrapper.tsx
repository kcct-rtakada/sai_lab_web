'use client';

import { ReactNode, useRef, useEffect, useState } from 'react';
import ScrollToTopButton from './ScrollToTopButton';

export default function ClientScrollWrapper({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => {
      setShowButton(el.scrollTop > 300);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <main id='top_main' ref={containerRef}>
      {children}
      <ScrollToTopButton targetRef={containerRef} isVisible={showButton} />
    </main>
  );
}
