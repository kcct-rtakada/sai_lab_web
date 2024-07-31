/* eslint-disable @next/next/no-img-element */
import { Member } from "@/components/DefaultStructure";
import styles from "@/styles/app/member/member.module.scss";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import {
  faEarthAmericas,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import SEO from "@/components/common/SEO";
import type { Metadata } from "next";
import { fetchMembers } from "@/components/GASFetch";
import { generateWebsiteStructure } from "@/components/common/JsonLd";
import { PageMetadata } from "@/components/PageMetadata";

const pageMeta: PageMetadata = {
  isArticle: false,
  title: "Member",
  description: "SAI (髙田研究室)のメンバー一覧",
  url: `/member`,
  imageUrl: undefined,
}

export async function generateMetadata(): Promise<Metadata> {
  return SEO({
    title: pageMeta.title,
    description: pageMeta.description,
    url: pageMeta.url,
    imageUrl: pageMeta.imageUrl,
  });
}

export default async function DisplayMember() {
  const response = await fetchMembers();
  const originalMembers: Member[] = await response.json();
  // 空要素がある場合は取り除く
  const members = originalMembers.filter((item) => item.id !== "");

  // 教員の抽出
  const sortedMemberWithTeacher = members?.filter((element) =>
    element.belonging.toLowerCase().includes("教員")
  );

  // 卒業生と修了生の抽出
  const sortedMemberWithGraduation = members?.filter(
    (element) =>
      element.belonging.toLowerCase().includes("卒") ||
      element.belonging.toLowerCase().includes("修")
  );

  // 上2つに当てはまらなかったメンバーを抽出
  const sortedEnrolledMember = members?.filter((element) => {
    return (
      !sortedMemberWithGraduation?.some(
        (sortedMember) => sortedMember.id === element.id
      ) &&
      !sortedMemberWithTeacher?.some(
        (sortedMember) => sortedMember.id === element.id
      )
    );
  });

  // 上の3つのグループをそれぞれ関数で描画する
  const displayingMember = (name: string, members: Member[] | undefined) => {
    return (
      <div className={styles.result_box}>
        <h2>{name}</h2>
        {members!.map((item, i) => (
          <div key={i} className={styles.member}>
            <div className={styles.member_content}>
              <div className={styles.left}>
                <div className={styles.name}>
                  {/* ()で括られた文字列の中身をリスト化し、","で結合する。*/}
                  {/* 全角スペースは半角スペースに置き換える。 */}
                  <span
                    title={`${
                      item.otherName
                        ? "異体字等: " +
                          item.otherName
                            .match(/\([^()]+\)/g)
                            ?.flatMap((match) => match.split(","))
                            .flatMap((match) => match.slice(1, -1))
                            .map((match) => match.replace(/[ 　]+/g, " "))
                            .join(",")
                        : ""
                    }`}
                  >
                    {item.name}
                  </span>
                  {item.homepage ? (
                    <Link
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`${item.homepage}`}
                      title="個人ホームページ"
                      style={{ marginLeft: ".6rem" }}
                    >
                      <FontAwesomeIcon
                        icon={faEarthAmericas}
                        style={{
                          display: "inline-block",
                          fontSize: "1.2rem",
                          width: "1.2rem",
                        }}
                      />
                    </Link>
                  ) : (
                    <></>
                  )}
                  {item.githubId ? (
                    <Link
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`https://github.com/${item.githubId}`}
                      title={`GitHub(${item.githubId})`}
                      style={{ marginLeft: ".6rem" }}
                    >
                      <FontAwesomeIcon
                        icon={faGithub}
                        style={{
                          display: "inline-block",
                          fontSize: "1.2rem",
                          width: "1.2rem",
                        }}
                      />
                    </Link>
                  ) : (
                    <></>
                  )}
                </div>
                <div className={styles.english_name}>{item.englishName}</div>
              </div>
              <div className={styles.middle}>
                <div className={styles.belonging}>{item.belonging}</div>
                <div className={styles.classification}>
                  {item.classification}
                </div>
              </div>
            </div>

            <div className={styles.right}>
              {/* プロジェクトページで検索させる */}
              {/* 名前・英語名のスペースを詰める。英語は順序を入れ替えたものも用意 */}
              {/* 異体字等も同様に検索対象に含める */}
              <Link
                href={`/project?mode=author&q=${item.name.replace(
                  /[ 　]+/,
                  ""
                )},${item.englishName.replace(/[ 　]+/, "")},${item.englishName
                  .split(/[ 　]+/)
                  .reverse()
                  .join("")}${
                  item.otherName
                    ? `,${item.otherName
                        .match(/\([^()]+\)/g)
                        ?.flatMap((match) => match.split(","))
                        .flatMap((match) => match.slice(1, -1))
                        .map((match) => match.replace(/[ 　]+/g, ""))
                        .join(",")}`
                    : ""
                }`}
                className={styles.search_link}
                title="プロジェクトを検索"
              >
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  style={{
                    color: "white",
                    fill: "white",
                    display: "block",
                    fontSize: "1.2rem",
                    width: "1.2rem",
                  }}
                />
              </Link>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.main}>
      {generateWebsiteStructure(pageMeta)}
      <div className={styles.title_box}>
        <div className={styles.title_area}>
          <h1 className={styles.page_title}>メンバー</h1>
        </div>
      </div>
      <div className={styles.list_box}>
        {displayingMember("教員", sortedMemberWithTeacher)}
        {displayingMember("在籍中", sortedEnrolledMember)}
        {displayingMember("卒業/修了", sortedMemberWithGraduation)}
      </div>
    </div>
  );
}
