/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import Project from "@/components/DefaultStructure";
import styles from "@/styles/app/projects/projectList.module.scss";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faBookOpen,
  faMagnifyingGlass,
  faXmark,
  faTag,
  faCalendar,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { sai_projects } from "@/components/constant";
import { useRouter, useSearchParams } from "next/navigation";

export default function Home() {
  const [projects, setProjects] = useState<null | Project[]>(null);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [selectedSearchMode, setSelectedSearchMode] =
    useState<string>("research_name");
  const [filteredProjects, setFilteredProjects] = useState<
    undefined | Project[]
  >([]);
  const [userFiltered, setUserFiltered] = useState<boolean>(false);
  const [searchWord, setSearchWord] = useState<string>("");
  const [isDisplayingSearchBox, setIsDisplayingSearchBox] =
    useState<boolean>(true);
  const [displayingSearchCondition, setDisplayingSearchCondition] = useState<
    string | null
  >(null);

  const router = useRouter();
  const params = useSearchParams();
  const initialMode = params.get("mode");
  const initialQ = params.get("q");

  useEffect(() => {
    fetch(sai_projects)
      .then((response) => response.json())
      .then((data) => {
        setProjects(data);
        setLoaded(true);

        if (initialQ) {
          const initialSearchWord = initialQ.replace(",", " ")
          let mode: string | null = null;
          if (initialMode === "mode") {
            mode = "research_name";
          } else if (initialMode === "author") {
            mode = "research_author";
          } else if (initialMode === "keyword") {
            mode = "research_tag";
          } else if (initialMode === "year") {
            mode = "research_year";
          }
          searchProjects(initialSearchWord, mode, data);
          setUserFiltered(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const searchProjects = (
    _searchWord: string,
    _mode: string | null = null,
    _projects: Project[] | undefined = undefined
  ) => {
    const filterKeywords = _searchWord.split(/[ 　]+/);
    const mode = _mode ? _mode : selectedSearchMode;
    const lists = _projects ? _projects : projects;

    if (filterKeywords.every((keyword) => keyword === "")) {
      setUserFiltered(false);
      router.push(`/project/`);
      setDisplayingSearchCondition(null);
      return;
    }

    let filteredArray: Project[] | undefined = [];

    if (mode === "research_name") {
      filteredArray = lists?.filter((project) =>
        filterKeywords.some(
          (keyword) =>
            keyword.toLowerCase() !== "" && project.title.toLowerCase().includes(keyword)
        )
      );
      setDisplayingSearchCondition(
        `検索条件: 研究題目(${filterKeywords.map((item, j) => {
          if (j === 0) return `${item}`;
          else return ` OR ${item}`;
        })})`
      );

      router.push(
        `/project/?mode=name&q=${filterKeywords.map((item) => item)}`
      );
    } else if (mode === "research_author") {
      filteredArray = lists?.filter((project) =>
        filterKeywords.some((keyword) =>
          project.authors.some(
            (author) =>
              keyword.toLowerCase() !== "" && author.name.toLowerCase().includes(keyword)
          )
        )
      );
      setDisplayingSearchCondition(
        `検索条件: 著者名(${filterKeywords.map((item, j) => {
          if (j === 0) return `${item}`;
          else return ` OR ${item}`;
        })})`
      );

      router.push(
        `/project/?mode=author&q=${filterKeywords.map((item) => item)}`
      );
    } else if (mode === "research_tag") {
      filteredArray = lists?.filter((project) =>
        filterKeywords.some((keyword) =>
          project.tags.some(
            (tag) => keyword.toLowerCase() !== "" && tag.name.toLowerCase().includes(keyword)
          )
        )
      );
      setDisplayingSearchCondition(
        `検索条件: キーワード(${filterKeywords.map((item, j) => {
          if (j === 0) return `${item}`;
          else return ` OR ${item}`;
        })})`
      );

      router.push(
        `/project/?mode=keyword&q=${filterKeywords.map((item) => item)}`
      );
    } else if (mode === "research_year") {
      filteredArray = lists?.filter((project) =>
        filterKeywords.some(
          (keyword) => String(new Date(project.date).getFullYear()) === keyword
        )
      );
      setDisplayingSearchCondition(
        `検索条件: 発行年(${filterKeywords.map((item, j) => {
          if (j === 0) return `${item}`;
          else return ` OR ${item}`;
        })})`
      );

      router.push(
        `/project/?mode=year&q=${filterKeywords.map((item) => item)}`
      );
    }

    setFilteredProjects(filteredArray);
    setUserFiltered(true);
  };

  const triggerSearchProjects = () => {
    if (searchWord === "") {
      setUserFiltered(false);
      router.push(`/project/`);
      setDisplayingSearchCondition(null);
      return;
    }
    searchProjects(searchWord);
  };

  const triggerSearchInput = (event: React.FormEvent<HTMLInputElement>) => {
    if (event.currentTarget.value === "") {
      setUserFiltered(false);
      setDisplayingSearchCondition(null);
      router.push(`/project/`);
    }

    setSearchWord(event.currentTarget.value);
  };

  const handleEnterKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      triggerSearchProjects();
    }
  };

  const triggerSearchModeSelection = (event: { target: { value: string } }) => {
    const selectedOptionValue = event.target.value;

    setSelectedSearchMode(selectedOptionValue);
  };

  if (!loaded) {
    return (
      <>
        <div className={styles.main}>
          <div className={styles.title_box}>
            <div className={styles.title_area}>
              <h1 className={styles.page_title}>プロジェクト</h1>
            </div>
          </div>
          <div className="loading">
            <span className="load_1" />
            <span className="load_2" />
          </div>
        </div>
      </>
    );
  }

  const displayArray = userFiltered ? filteredProjects : projects;

  return (
    <>
      <div className={styles.main}>
        <div className={styles.title_box}>
          <div className={styles.title_area}>
            <h1 className={styles.page_title}>プロジェクト</h1>
          </div>
        </div>
        <div className={styles.list_box}>
          <div
            className={`${styles.search_box} ${
              isDisplayingSearchBox ? styles.opening : ""
            }`}
          >
            <div
              className={`${styles.circle}`}
              onClick={() => setIsDisplayingSearchBox(!isDisplayingSearchBox)}
            >
              <FontAwesomeIcon icon={faChevronDown} />
            </div>
            <div className={styles.search_area}>
              <div className={styles.search_box_frame}>
                <input
                  value={searchWord}
                  placeholder={initialQ ? "クリアはXをクリック/タップ" : "クリック/タップして入力"}
                  type={"text"}
                  className={`${styles.search_input}`}
                  onInput={triggerSearchInput}
                  onKeyDown={handleEnterKeyPress}
                />
                <button
                  className={styles.search_clear_button}
                  onClick={() => {
                    setSearchWord("");
                    setUserFiltered(false);
                    router.push(`/project/`);
                    setDisplayingSearchCondition(null);
                  }}
                >
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              </div>
              <button
                id="header-search-click"
                className={`
                ${styles.search_button}`}
                onClick={triggerSearchProjects}
              >
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  className={styles.search_magnify}
                />
              </button>

              <select
                className={styles.search_select}
                onChange={triggerSearchModeSelection}
                name="search_type"
              >
                <option value="research_name">研究題目</option>
                <option value="research_author">著者</option>
                <option value="research_tag">キーワード</option>
                <option value="research_year">発行年</option>
              </select>
            </div>
          </div>
          <div className={styles.result_box}>
            {displayArray ? (
              displayArray.length > 0 ? (
                displayArray!.map((item, i) => (
                  <Link
                    key={i}
                    href={`/project/${item.id}`}
                    className={styles.project_link}
                  >
                    <div className={styles.project}>
                      <div className={styles.thumbnail_box}>
                        {item.thumbnailURL ? (
                          <img
                            src={item.thumbnailURL}
                            alt="thumbnail"
                            className={styles.thumbnail}
                          />
                        ) : (
                          <img
                            src="/sai_default_thumbnail.webp"
                            alt="thumbnail"
                            className={styles.thumbnail}
                          />
                        )}
                      </div>
                      {item.type ? (
                        <div className={styles.type}>
                          <span>{item.type}</span>
                        </div>
                      ) : (
                        <></>
                      )}
                      <div className={styles.date}>
                        <FontAwesomeIcon
                          icon={faCalendar}
                          style={{ marginRight: ".3rem" }}
                        />
                        {`${new Date(item.date).getFullYear()}`}
                      </div>
                      <div className={styles.description_area}>
                        <div className={styles.title}>{item.title}</div>
                        <div className={styles.authors}>
                          {item.authors.map((author, j) => (
                            <span className={styles.author} key={j}>
                              <div>
                                <FontAwesomeIcon
                                  icon={faUser}
                                  style={{ color: "#222" }}
                                />
                              </div>
                              <p>{author.name}</p>
                            </span>
                          ))}
                        </div>
                        {item.tags.length > 0 ? (
                          <div className={styles.tags}>
                            {item.tags.map((tag, j) => (
                              <span key={j}>
                                <FontAwesomeIcon
                                  icon={faTag}
                                  style={{ color: "#8a8a8a" }}
                                />
                                {tag.name}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <></>
                        )}
                        <div className={styles.book}>
                          <div>
                            <FontAwesomeIcon
                              icon={faBookOpen}
                              style={{ color: "#222" }}
                            />
                          </div>
                          <p>
                            {`${item.bookTitle ? `${item.bookTitle}` : ``}${
                              item.volume ? `, Vol.${item.volume}` : ``
                            }${item.number ? `, ${item.number}` : ``}${
                              item.pageStart && item.pageEnd
                                ? `, pp.${item.pageStart}-${item.pageEnd}`
                                : ``
                            }`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className={styles.notfound}>
                  <div className={styles.notfound_text}>
                    検索結果は得られませんでした。
                    <br />
                    検索キーワードは間違っていませんか？
                  </div>
                  <div className={styles.notfound_img_box}>
                    <Image
                      src="/sai_logo.png"
                      alt="sai_logo"
                      fill
                      sizes="4rem"
                    />
                  </div>
                </div>
              )
            ) : (
              <div className={styles.notfound}>
                <div className={styles.notfound_text}>
                  無効な結果を得ました。
                  <br />
                  再度お試しください。
                </div>
                <div className={styles.notfound_img_box}>
                  <Image src="/sai_logo.png" alt="sai_logo" fill sizes="4rem" />
                </div>
              </div>
            )}
          </div>
        </div>
        {displayingSearchCondition ? (
          <div className={styles.search_condition}>
            {displayingSearchCondition}
          </div>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}
