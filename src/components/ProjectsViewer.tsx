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
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  _projects: Project[];
}

export default function ProjectsViewer(props: Props) {
  const projects = props._projects;
  const [loaded, setLoaded] = useState<boolean>(false);
  const [selectedSearchMode, setSelectedSearchMode] =
    useState<string>("research_name");
  const [selectedYear, setSelectedYear] = useState<number>(0);
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
    if (projects) {
      setLoaded(true);

      if (initialQ) {
        const initialSearchWord = initialQ.replace(/,/g, " ");
        setSearchWord(initialSearchWord);
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
        searchProjects(initialSearchWord, mode, projects);
        setUserFiltered(true);
      }
    }
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
            keyword.toLowerCase() !== "" &&
            project.title.toLowerCase().includes(keyword.toLowerCase())
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
              keyword.toLowerCase() !== "" &&
              author.name.toLowerCase().includes(keyword.toLowerCase())
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
            (tag) =>
              keyword.toLowerCase() !== "" &&
              tag.name.toLowerCase().includes(keyword.toLowerCase())
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

  const triggerYearSelection = (event: { target: { value: string } }) => {
    const selectedOptionValue = event.target.value;

    setSelectedYear(Number(selectedOptionValue));
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

  const uniqueTypes = Array.from(
    new Set(projects!.flatMap((item) => item.type))
  );

  const uniqueYears = Array.from(
    new Set(
      displayArray?.flatMap((item) =>
        new Date(item.date).getMonth() > 3
          ? new Date(item.date).getFullYear()
          : new Date(item.date).getFullYear() - 1
      )
    )
  );

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
            <div className={styles.years_list_box}>
              <p>表示年度</p>
              <select
                className={styles.year_select}
                onChange={triggerYearSelection}
                name="year_filtering"
              >
                <option key={`year0`} value={0}>
                  すべて
                </option>
                {uniqueYears.map((year, i) => (
                  <option key={`year${i}`} value={year}>
                    {year}年度
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.search_area}>
              <div className={styles.search_box_frame}>
                <input
                  value={searchWord}
                  placeholder={
                    initialQ
                      ? "クリアはXをクリック/タップ"
                      : "クリック/タップして入力"
                  }
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
          <div
            className={`${styles.result_box} ${
              isDisplayingSearchBox ? styles.opening : ""
            }`}
          >
            {displayArray ? (
              displayArray.length > 0 ? (
                uniqueYears.map((year, i) => {
                  if (selectedYear !== 0 && year !== selectedYear)
                    return <span key={`dYear${i}`}></span>;
                  const matchedDataWithYear = displayArray?.filter(
                    (item) =>
                      (new Date(item.date).getMonth() > 3
                        ? new Date(item.date).getFullYear()
                        : new Date(item.date).getFullYear() - 1) === year
                  );
                  return (
                    <React.Fragment key={`dYear${i}`}>
                      <div key={`dYear${i}`} className={styles.project_link}>
                        <div
                          key={`dYear${i}`}
                          className={`${styles.project} ${styles.year}`}
                        >
                          <p key={`dYear${i}`}>{year}年度</p>
                        </div>
                      </div>
                      {matchedDataWithYear!.length > 0 ? (
                        matchedDataWithYear.map((project, j) => (
                          <Link
                            key={`dProj${j}`}
                            href={`/project/${project.id}`}
                            className={styles.project_link}
                          >
                            <div className={styles.project}>
                              <div className={styles.thumbnail_box}>
                                {project.thumbnailURL ? (
                                  <img
                                    src={project.thumbnailURL}
                                    alt="thumbnail"
                                    className={styles.thumbnail}
                                    loading="lazy"
                                  />
                                ) : (
                                  <img
                                    src="/sai_default_thumbnail.webp"
                                    alt="thumbnail"
                                    className={styles.thumbnail}
                                    loading="lazy"
                                  />
                                )}
                              </div>
                              {project.type ? (
                                <div
                                  className={`${
                                    styles.type
                                  } unique-type${uniqueTypes.findIndex(
                                    (type) => type === project.type
                                  )}`}
                                >
                                  <span>{project.type}</span>
                                </div>
                              ) : (
                                <></>
                              )}
                              <div className={styles.date}>
                                <FontAwesomeIcon
                                  icon={faCalendar}
                                  style={{ marginRight: ".3rem" }}
                                />
                                {`${
                                  new Date(project.date).getMonth() > 3
                                    ? new Date(project.date).getFullYear()
                                    : new Date(project.date).getFullYear() - 1
                                }年度`}
                              </div>
                              <div className={styles.description_area}>
                                <div className={styles.title}>
                                  {project.title}
                                </div>
                                <div className={styles.authors}>
                                  {project.authors.map((author, k) => (
                                    <span
                                      className={styles.author}
                                      key={`dProjAuthor${k}`}
                                    >
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
                                {project.tags.length > 0 ? (
                                  <div className={styles.tags}>
                                    {project.tags.map((tag, k) => (
                                      <span key={`dProjTag${k}`}>
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
                                    {`${
                                      project.bookTitle
                                        ? `${project.bookTitle}`
                                        : ``
                                    }${
                                      project.volume
                                        ? `, Vol.${project.volume}`
                                        : ``
                                    }${
                                      project.number
                                        ? `, ${project.number}`
                                        : ``
                                    }${
                                      project.pageStart && project.pageEnd
                                        ? `, pp.${project.pageStart}-${project.pageEnd}`
                                        : ``
                                    }`}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))
                      ) : (
                        <></>
                      )}
                    </React.Fragment>
                  );
                })
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

  return <></>;
}
