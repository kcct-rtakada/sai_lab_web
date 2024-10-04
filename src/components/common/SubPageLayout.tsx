import styles from '@/styles/components/SubPageLayout.module.scss'
import Link from 'next/link'

export function Main({ children }: { children?: React.ReactNode }) {
  return <div className={styles.main}>
    {children}
  </div>
}

export function Title({ children, color1, color2 }: { children?: React.ReactNode, color1: string, color2: string }) {
  return <div className={styles.title_box} style={{
    backgroundImage: `linear-gradient(to bottom right, ${color1}, ${color2})`
  }}>
  <div className={styles.title_area}>
    <h1 className={styles.page_title}>
      {children}
    </h1>
  </div>
</div>
}