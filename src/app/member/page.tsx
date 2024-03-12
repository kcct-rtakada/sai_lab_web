/* eslint-disable @next/next/no-img-element */
import Member from "@/components/DefaultStructure";
import styles from "@/styles/app/member/member.module.scss";
import Link from "next/link";
import { sai_members } from "@/components/constant";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import {
  faEarthAmericas,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import SEO from "@/components/SEO";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return SEO({
    title: "Member",
    description: "SAI (髙田研究室)のメンバー一覧",
    url: `https://sai.ac/member`,
    imageUrl: undefined,
  });
}

export default async function Member() {
  const response = await fetch(sai_members);
  const members: Member[] = await response.json();

  const sortedMemberWithTeacher = members?.filter((element) =>
    element.belonging.toLowerCase().includes("教員")
  );
  const sortedMemberWithGraduation = members?.filter(
    (element) =>
      element.belonging.toLowerCase().includes("卒") ||
      element.belonging.toLowerCase().includes("修")
  );
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

  const displayingMember = (name: string, members: Member[] | undefined) => {
    return (
      <div className={styles.result_box}>
        <h2>{name}</h2>
        {members!.map((item, i) => (
          <div key={i} className={styles.member}>
            <div className="left">
              <div className={styles.name}>
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
                <Link
                  href={`/project?mode=author&q=${item.name.replace(
                    /[ 　]+/,
                    ""
                  )},${item.englishName.replace(
                    /[ 　]+/,
                    ""
                  )},${item.englishName
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
                  title="プロジェクトを検索"
                >
                  <FontAwesomeIcon
                    icon={faMagnifyingGlass}
                    style={{
                      display: "inline-block",
                      marginLeft: ".5rem",
                      fontSize: "1.2rem",
                      width: "1.2rem",
                    }}
                  />
                </Link>
                {item.homepage ? (
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`${item.homepage}`}
                    title="個人ホームページ"
                    style={{ marginLeft: ".5rem" }}
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
                    style={{ marginLeft: ".5rem" }}
                    title={`GitHub(${item.githubId})`}
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
            <div className="right">
              <div className={styles.belonging}>{item.belonging}</div>
              <div className={styles.classification}>{item.classification}</div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.main}>
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
