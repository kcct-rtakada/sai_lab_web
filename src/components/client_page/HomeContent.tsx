/* eslint-disable @next/next/no-img-element */
"use client";
import styles from "@/styles/app/page.module.scss";
import Link from "next/link";
import { News } from "@/components/DefaultStructure";
import Image from "next/image";
import { useState } from "react";
import Game from "@/components/game/GameBase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";

export default function HomeContent({ newsList }: { newsList: News[] }) {
  const [usingJapanese, setUsingJapanese] = useState<boolean>(true);
  const [clickedLogoCount, setClickedLogoCount] = useState<number>(0);

  const displayString = (japaneseString: string, englishString: string) => {
    return <>{usingJapanese ? japaneseString : englishString}</>;
  };

  const resetClickingCount = () => {
    setClickedLogoCount(0);
  };

  const listingNum = newsList ? (newsList.length > 5 ? 5 : newsList.length) : 0;

  return (
    <div className={styles.main}>
      <div
        className={`${styles.egg_canvas} ${
          clickedLogoCount >= 3 ? styles.open : ""
        }`}
      >
        <div>
          <Game resetFunc={resetClickingCount} />
        </div>
      </div>
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
            <img
              onClick={() => setClickedLogoCount(clickedLogoCount + 1)}
              src="/sai_logo.png"
              alt="sai"
            />
          </div>
        </div>
        <div className={styles.top_images}>
          <div className={styles.top_img_box}>
            <Image src="/sai_top_img.png" alt="top_img" fill sizes="100%" />
          </div>
          <div className={styles.back_img_box}>
            <Image src="/sai_top_img.png" alt="top_img" fill sizes="100%" />
          </div>
        </div>
      </div>
      <div className={styles.section}></div>
      <div className={styles.section}>
        <h2 className={styles.section_name}>
          {displayString("最新のニュース", "Latest News")}
        </h2>
        <ul>
          {newsList?.slice(0, listingNum).map((news, i) => {
            const japanTime = new Date(
              new Date(news.date).toLocaleString("en-US", {
                timeZone: "Asia/Tokyo",
              })
            );
            return (
              <li key={i} style={{ listStyle: "none" }}>
                <Link href={`/news/${news.id}`}>
                  {news.title}-{" "}
                  {`${japanTime.getFullYear()}/${(japanTime.getMonth() + 1)
                    .toString()
                    .padStart(2, "0")}/${japanTime
                    .getDate()
                    .toString()
                    .padStart(2, "0")}`}
                </Link>
              </li>
            );
          })}
        </ul>
        <h2 className={styles.section_name}>Welcome to SAI!!</h2>
        <div className={styles.string_box}>
          <p>
            {displayString(
              `SAIは神戸市立工業高等専門学校
            電子工学科の研究室です。入力インタフェース・ヒューマンセンシングを中心にヒューマン・コンピュータ・インタラクション（HCI）を研究しています。`,
              `SAI is a laboratory in the Department of Electronics in Kobe City College of Technology. We study on Human Computer Interaction (HCI), especially Input Interface & Human Sensing.`
            )}
          </p>
        </div>
        <h3>{displayString("研究室のビジョン", "Our Vision")}</h3>
        <p>
          {displayString(
            `SAIでは、多様な時代に沿った「彩」ある研究テーマに取り組んでいます。`,
            `In SAI, we work on topics that follows the ''Color'' of each personality.`
          )}
        </p>
        <p>
          {displayString(
            "特に下記テーマに注力しています。",
            "We especially focus on these kind of topics:"
          )}
        </p>
        <ul>
          <li>
            <b>Human Interface Design</b>
            {displayString(
              "：コンピュータの入出力インタフェースPCやスマートフォン、VRデバイスのインタフェースデザイン。入力時のコスト（負担、時間、学習、金銭）を減らす手法や、視聴覚・触力覚を用いたフィードバック手法の設計。",
              ": Input/output interfaces for computers, Interface design for computers, smartphones, VR devices. Low cost input interactions (like lowering time, effort, learning costs, money). Designing feedback methods for sight, sound and touch."
            )}
          </li>
          <li>
            <b>Human Sensing</b>
            {displayString(
              "：人の一挙手一投足のセンシング。既存の入力インタフェース内蔵センサの多用途への利活用や、導電繊維を用いたウェアラブルセンシング技術開発。",
              ": Sensing every single action from the human body.  Expanding the usage and applications of the pre-existing sensors in the interface, Developing wearable sensing technology with conductive fiber cloth. "
            )}
          </li>
        </ul>
        <p>
          {displayString(
            "また、上記以外に興味があるテーマとして",
            "Other topics that we are interested include: "
          )}
        </p>
        <ul>
          <li>
            <b>Creator Assist Design</b>
            {displayString(
              "：「人類総クリエータ時代」を支えるインタフェース。習熟なく誰でもクリエータになるためのツール開発。",
              ": Interface that supports ''The age of Creators for All People''. Tool development that supports anyone, without learning to become creator."
            )}
          </li>
          <li>
            <b>Human Agent(Robot) Interaction</b>
            {displayString(
              "：人とAgent / Robotのコミュニケーション支援。AgentやRobotによる人の能力補完や行動誘導。",
              ": Communication Support between humans and Agents / Robots. Complementary Abilities & Guiding actions by Agents & Robots."
            )}
          </li>
        </ul>
        <p>{displayString("があります。", "")}</p>

        <div className={styles.circles_box}>
          <div className={styles.keyword}>
            {displayString(
              "『Human Interface Design』",
              '"コンピュータへの入力手法"'
            )}
            <br />
            {displayString(
              "コンピュータへの入力手法",
              "Human Interface Design"
            )}
          </div>
          <div className={styles.keyword}>
            {displayString(
              "『Creator Assist Design』",
              '"クリエータを支援する"'
            )}
            <br />
            {displayString("クリエータを支援する", "Creator Assist Design")}
          </div>
          <div className={styles.keyword}>
            {displayString(
              "『Human Agent(Robot) Interaction』",
              '"人と協調・人の支援"'
            )}
            <br />
            {displayString(
              "人と協調・人の支援",
              "Human Agent(Robot) Interaction"
            )}
          </div>
          <div className={styles.keyword}>
            {displayString(
              "『Human Sensing』",
              '"人の一挙手一投足をセンシングする"'
            )}
            <br />
            {displayString("人の一挙手一投足をセンシングする", "Human Sensing")}
          </div>
          <span
            className={`${styles.circle} ${usingJapanese ? "" : styles.active}`}
          />
          <span
            className={`${styles.circle} ${usingJapanese ? "" : styles.active}`}
          />
          <span
            className={`${styles.circle} ${usingJapanese ? "" : styles.active}`}
          />
          <span
            className={`${styles.circle} ${usingJapanese ? "" : styles.active}`}
          />
        </div>

        <h3>
          {displayString(
            "研究室志望のみなさんへ",
            "Students who are Interested"
          )}
        </h3>
        <p>
          {displayString(
            "SAIではHCI研究のテーマ立案・文献調査・実装・実験設計・実験・解析・論文執筆・発表までを学生自身の力で取り組んでもらいます。また、原則一人一件以上/年の外部発表にチャレンジしてもらいます。研究遂行に必要な環境は提供しますが、技術的なサポートは原則ありません。",
            "In SAI, we let students work on the process of Choosing the Topic, Surveying, Implementing, Designing the Experiment, Experimenting, Analyzing the Data, Writing the Paper,  Presenting the HCI research with the student's own skill. Also, we challenge students to present their research outside of school more than once per year in principle. We provide the environment to accomplish the research, but do not provide technical support in general."
          )}
        </p>
        <p>
          {displayString(
            "ハードルが高そうに聞こえますが大丈夫です。毎週のゼミ活動等を通してメンバー全員の集合知をもって研究遂行をサポートする姿勢を整えています。また先輩方の各種知見をデータベースとして引き継ぐための体制も整えています。基本的に無理ない範囲で進められるようメンバーの能力に応じた研究テーマのボリューム感も含めて相談できます。",
            "It seems hard, but don't worry. We are ready to support you through our weekly seminar and combining our members knowledge and skills. We can discuss on the volume of the research topic depending on your skill so it won't basically overload you."
          )}
        </p>
        <p>
          {displayString(
            `SAIでは論文業績や受賞自体を目的にしておらず、あくまでHCIを通したプロジェクト企画から推敲・報告までの能力を伸ばすことを目的としております（もちろん査読付きへの投稿もサポートします。受賞できれば一緒に喜びましょう）。
          また、投稿先としては学会以外にも各種技術コンテストやSNSなどもありえるかもしれません（要相談）。`,
            `In SAI, we don't focus on to have publications or getting awarded, but focus on developing the ability from start of planning the project, till finish of polishing the  document and reporting through HCI (Of course we support you posting a peer-reviewed paper. If we get award let's share the joy).
          Also, we may be posting to not just academic conferences, but also technical contests or on social media ... etc. (to be well discussed)`
          )}
        </p>
        <p>
          {displayString(
            "是非、みんなで楽しく「才」を磨いていきましょう！",
            'Let\'s enjoy brushing up the "Talent" together!'
          )}
        </p>

        <h3>
          {displayString(
            "他学科・3年生以下のみなさんへ",
            "Students from other departments or in 3rd years or under"
          )}
        </h3>
        <p>
          {displayString(
            "SAIではHCIに興味ある他学科・他学年の放課後・長期休みの研究や外部発表もサポートしています。研究テーマの立案や論文執筆に至るまでの相談・サポート、手持ちの範囲で各種計測機器や電子部品等の貸し出しも行っています。興味がある方は昼休みや放課後に髙田の居室、あるいはメール等でご連絡ください。",
            "In SAI, we welcome and give support for students from other departments and younger grades who want to challenge on researching after school or during the vacations and present out of school. From planning a topic to writing a paper, we are open for giving an advice, support, and lending some tools and parts that are available. If interested please come to the Takada Office during noon break or after school, or either send a e-mail."
          )}
        </p>

        <h3>
          {displayString(
            "企業・大学等の皆様へ",
            "People in Business or Academic"
          )}
        </h3>
        <p>
          {displayString(
            "SAIでは出張授業やコラボレーション等の相談も随時受け付けておりますので、興味がある方はご連絡ください。",
            "We are widely open for visiting lectures, collaborations and so on. If interested please contact from below."
          )}
        </p>

        <h3>{displayString("コンタクト", "Contact")}</h3>
        <p>
          {displayString("メールアドレス", "Email Address")}
          <br />
          <Link href="mailto:kcct-rtakada@g.kobe-kosen.ac.jp">
            kcct-rtakada@g.kobe-kosen.ac.jp
          </Link>
        </p>
        <p>
          {displayString("問い合わせフォーム", "Contact Form")}
          <br />
          <Link
            href="https://forms.gle/JngM8dAN5b6yAtBv9"
            target="_blank"
            rel="noopener noreferrer"
          >
            {displayString(
              `SAI（神戸高専
            髙田研究室）問い合わせフォーム：`,
              `SAI(KCCT Takada Lab) Contact Form: `
            )}
            https://forms.gle/JngM8dAN5b6yAtBv9
          </Link>
        </p>
        <div className={styles.language_switching_box}>
          <button
            title={
              usingJapanese
                ? "Switch from Japanese to English"
                : "英語から日本語へ切り替える"
            }
            onClick={() => setUsingJapanese(!usingJapanese)}
          >
            {usingJapanese ? (
              <span>
                日
                <FontAwesomeIcon
                  icon={faArrowRightLong}
                  style={{
                    margin: "0 .15rem",
                    fontSize: "1.15rem",
                    width: "1.15rem",
                    display: "inline-block",
                  }}
                />
                EN
              </span>
            ) : (
              <span>
                EN
                <FontAwesomeIcon
                  icon={faArrowRightLong}
                  style={{
                    margin: "0 .15rem",
                    fontSize: "1.15rem",
                    width: "1.15rem",
                    display: "inline-block",
                  }}
                />
                日
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
