import Image from 'next/image'
import styles from '@/styles/app/page.module.scss'

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.section}>
        <p className={styles.section_name}>プロジェクト</p>
      </div>
    </main>
  )
}
