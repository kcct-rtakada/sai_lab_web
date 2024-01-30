/* eslint-disable @next/next/no-img-element */
"use client";
import styles from "@/styles/app/page.module.scss";
import Link from "next/link";
import { sai_news } from "@/components/constant";
import News from "@/components/DefaultStructure";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Home() {
  const [newsList, setNewsList] = useState<null | News[]>(null);
  const [newsLoaded, setNewsLoaded] = useState<boolean>(false);

  useEffect(() => {
    fetch(sai_news)
      .then((response) => response.json())
      .then((data) => {
        setNewsList(data);
        setNewsLoaded(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const listingNum = newsList ? (newsList.length > 5 ? 5 : newsList.length) : 0;

  return (
    <div className={styles.main}>
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
        <div className={styles.top_images}>
          <div className={styles.top_img_box}>
            <Image
              src="/sai_top_img.png"
              alt="top_img"
              fill
              sizes="100%"
            />
          </div>
          <div className={styles.back_img_box}>
            <Image
              src="/sai_top_img.png"
              alt="top_img"
              fill
              sizes="100%"
            />
          </div>
        </div>
      </div>
      <div className={styles.section}></div>
      <div className={styles.section}>
        <h2 className={styles.section_name}>最新のニュース</h2>
        {newsLoaded ? (
          <ul>
            {newsList?.slice(0, listingNum).map((news, i) => (
              <li key={i} style={{listStyle: "none"}}>
                <Link href={`/news/${news.id}`}>
                  {news.title}-{" "}
                  {`${new Date(news.date).getFullYear()}/${(
                    new Date(news.date).getMonth() + 1
                  )
                    .toString()
                    .padStart(2, "0")}/${new Date(news.date)
                    .getDate()
                    .toString()
                    .padStart(2, "0")}`}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="loading">
            <span className="load_1" />
            <span className="load_2" />
          </div>
        )}

        <h2 className={styles.section_name}>Welcome to SAI!!</h2>
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
            <br />
            コンピュータへの入力手法
          </div>
          <div className={styles.keyword}>
            『Creator Assist Design』
            <br />
            クリエータを支援する
          </div>
          <div className={styles.keyword}>
            『Human Agent(Robot) Interaction』
            <br />
            人と協調・人の支援
          </div>
          <div className={styles.keyword}>
            『Human Sensing』
            <br />
            人の一挙手一投足を
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

        <h3>他学科・3年生以下のみなさんへ</h3>
        <p>
          SAIではHCIに興味ある他学科・他学年の放課後・長期休みの研究や外部発表もサポートしています。研究テーマの立案や論文執筆に至るまでの相談・サポート、手持ちの範囲で各種計測機器や電子部品等の貸し出しも行っています。興味がある方は昼休みや放課後に髙田の居室、あるいはメール等でご連絡ください。
        </p>

        <h3>企業・大学等の皆様へ</h3>
        <p>
          SAIでは出張授業やコラボレーション等の相談も随時受け付けておりますので、興味がある方はご連絡ください。
        </p>

        <h3>コンタクト</h3>
        <p>
          メールアドレス
          <br />
          <Link href="mailto:kcct-rtakada@g.kobe-kosen.ac.jp">
            kcct-rtakada@g.kobe-kosen.ac.jp
          </Link>
        </p>
        <p>
          問い合わせフォーム
          <br />
          <Link
            href="https://forms.gle/JngM8dAN5b6yAtBv9"
            target="_blank"
            rel="noopener noreferrer"
          >
            SAI（神戸高専
            髙田研究室）問い合わせフォーム：https://forms.gle/JngM8dAN5b6yAtBv9
          </Link>
        </p>
      </div>
    </div>
  );
}
