/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import styles from "@/styles/app/page.module.scss";
import { useState, useEffect } from "react";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.img_box}>
        <div className={styles.animation_box}>
          <div>
            <p>細</p>
          </div>
          <div>
            <p>最</p>
          </div>
          <div>
            <p>再</p>
          </div>
          <div>
            <p>祭</p>
          </div>
          <div>
            <p>際</p>
          </div>
          <div>
            <p>採</p>
          </div>
          <div>
            <p>才</p>
          </div>
          <div>
            <p>差異</p>
          </div>
          <div>
            <img src="/sai_logo.png" alt="sai" />
          </div>
        </div>
      </div>
      <div className={styles.section}></div>
      <div className={styles.section}>
        <h2 className={styles.section_name}>Welcome to SAI lab.!!</h2>
        <div className={styles.string_box}>
          <p>
            SAIは神戸市立工業高等専門学校
            電子工学科の研究室です。入力インタフェース・ヒューマンセンシングを中心にヒューマン・コンピュータ・インタラクション（HCI）を研究しています。
          </p>
        </div>
        <h3>研究室のビジョン</h3>
        <p>
          SAIでは、多様な時代に沿った「彩」ある研究テーマに取り組んでいます。
        </p>
        <p>特に下記テーマに注力しています。</p>
        <ul>
          <li>
            <b>Human Interface Design</b>
            ：コンピュータの入出力インタフェースPCやスマートフォン、VRデバイスのインタフェースデザイン。入力時のコスト（負担、時間、学習、金銭）を減らす手法や、視聴覚・触力覚を用いたフィードバック手法の設計。
          </li>
          <li>
            <b>Human Sensing</b>
            ：人の一挙手一投足のセンシング。既存の入力インタフェース内蔵センサの多用途への利活用や、導電繊維を用いたウェアラブルセンシング技術開発。
          </li>
        </ul>
        <p>また、上記以外に興味があるテーマとして</p>
        <ul>
          <li>
            <b>Creator Assist Design</b>
            ：「人類総クリエータ時代」を支えるインタフェース。習熟なく誰でもクリエータになるためのツール開発。
          </li>
          <li>
            <b>Human Agent(Robot) Interaction</b>：人とAgent /
            Robotのコミュニケーション支援。AgentやRobotによる人の能力補完や行動誘導。
          </li>
        </ul>
        <p>があります。</p>

        <div className={styles.circles_box}>
          <div className={styles.keyword}>
            『Human Interface Design』
            <br />- コンピュータへの入力手法
          </div>
          <div className={styles.keyword}>
            『Creator Assist Design』
            <br />- クリエータを支援する
          </div>
          <div className={styles.keyword}>
            『Human Agent(Robot) Interaction』
            <br />- 人と協調・人の支援
          </div>
          <div className={styles.keyword}>
            『Human Sensing』
            <br />- 人の一挙手一投足を
            <br />
            センシングする
          </div>
          <span className={styles.circle} />
          <span className={styles.circle} />
          <span className={styles.circle} />
          <span className={styles.circle} />
        </div>

        <h3>研究室志望のみなさんへ</h3>
        <p>
          SAIではHCI研究のテーマ立案・文献調査・実装・実験設計・実験・解析・論文執筆・発表までを学生自身の力で取り組んでもらいます。また、原則一人一件以上/年の外部発表にチャレンジしてもらいます。研究遂行に必要な環境は提供しますが、技術的なサポートは原則ありません。
        </p>
        <p>
          ハードルが高そうに聞こえますが大丈夫です。毎週のゼミ活動等を通してメンバー全員の集合知をもって研究遂行をサポートする姿勢を整えています。また先輩方の各種知見をデータベースとして引き継ぐための体制も整えています。基本的に無理ない範囲で進められるようメンバーの能力に応じた研究テーマのボリューム感も含めて相談できます。
        </p>
        <p>
          SAIでは論文業績や受賞自体を目的にしておらず、あくまでHCIを通したプロジェクト企画から推敲・報告までの能力を伸ばすことを目的としております（もちろん査読付きへの投稿もサポートします。受賞できれば一緒に喜びましょう）。
          また、投稿先としては学会以外にも各種技術コンテストやSNSなどもありえるかもしれません（要相談）。
        </p>
        <p>是非、みんなで楽しく「才」を磨いていきましょう！</p>
      </div>
    </main>
  );
}
