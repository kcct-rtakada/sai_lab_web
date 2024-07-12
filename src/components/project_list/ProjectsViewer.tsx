/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import { Project } from "@/components/DefaultStructure";
import styles from "@/styles/app/projects/projectList.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ProjectCard from "./ProjectCard";
import ProjectGroupCard from "./ProjectGroupCard";
import {
  faMagnifyingGlass,
  faXmark,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { CalcFiscalYear, ConvertToJST } from "../JSTConverter";

interface Props {
  _projects: Project[];
}

interface ProjectsAndColors {
  project: Project;
  uniqueColorNumber: number;
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
  const [isUsingPhone, setIsUsingPhone] = useState<boolean>(false);

  const router = useRouter();
  const params = useSearchParams();
  const initialMode = params.get("mode");
  const initialQ = params.get("q");

  // タップ/クリックの表示を切り替え
  useEffect(() => {
    setIsUsingPhone(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
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
    // スペースごとにキーワード化
    const filterKeywords = _searchWord.split(/[ 　]+/);
    const mode = _mode ? _mode : selectedSearchMode;
    const lists = _projects ? _projects : projects;

    setSelectedYear(0);
    setSelectedSearchMode(mode);

    // スペースしか入力がない場合はリセット
    if (filterKeywords.every((keyword) => keyword === "")) {
      setUserFiltered(false);
      router.push(`/project/`);
      setDisplayingSearchCondition(null);
      return;
    }

    let filteredArray: Project[] | undefined = [];

    if (mode === "research_name") {
      // タイトルの部分一致
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
      // 名前のスペースを詰めて、そのまま、または順番を入れ替えた場合の文字列で部分一致
      filteredArray = lists?.filter((project) =>
        filterKeywords.some((keyword) =>
          project.authors.some(
            (author) =>
              keyword.toLowerCase() !== "" &&
              (author.name
                .toLowerCase()
                .replace(/[ 　]+/, "")
                .includes(keyword.toLowerCase()) ||
                author.name
                  .toLowerCase()
                  .split(/[ 　]+/)
                  .reverse()
                  .join("")
                  .includes(keyword.toLowerCase()))
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
      // キーワードの部分一致
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
      // 年の一致
      filteredArray = lists?.filter((project) =>
        filterKeywords.some(
          (keyword) =>
            String(ConvertToJST(project.date).getFullYear()) === keyword
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

  // 空文字ならリセット
  const triggerSearchProjects = () => {
    if (searchWord === "") {
      setUserFiltered(false);
      router.push(`/project/`);
      setDisplayingSearchCondition(null);
      return;
    }
    searchProjects(searchWord);
  };

  // 検索時に空文字ならリセット
  const triggerSearchInput = (event: React.FormEvent<HTMLInputElement>) => {
    if (event.currentTarget.value === "") {
      setUserFiltered(false);
      setDisplayingSearchCondition(null);
      router.push(`/project/`);
    }

    setSearchWord(event.currentTarget.value);
  };

  // エンターキー押した場合
  const handleEnterKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      triggerSearchProjects();
    }
  };

  // 検索条件を記憶
  const triggerSearchModeSelection = (event: { target: { value: string } }) => {
    const selectedOptionValue = event.target.value;

    setSelectedSearchMode(selectedOptionValue);
  };

  // 表示年度を切り替え
  const triggerYearSelection = (event: { target: { value: string } }) => {
    const selectedOptionValue = event.target.value;

    setSelectedYear(Number(selectedOptionValue));
  };

  // レイアウトシフト対策
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

  // 表示対象の切り替え
  const displayArray = userFiltered ? filteredProjects : projects;

  // 種類リストを作成する
  const uniqueTypes = Array.from(
    new Set(projects!.flatMap((item) => item.type))
  );

  // 年度リストを作成する
  const uniqueYears = Array.from(
    new Set(
      displayArray
        ?.flatMap((item) => {
          const japanTime = ConvertToJST(item.date);
          return CalcFiscalYear(japanTime);
        })
        .sort((a, b) => b - a)
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
            className={`${styles.search_box} ${isDisplayingSearchBox ? styles.opening : ""
              }`}
          >
            <button
              title={isDisplayingSearchBox ? "折りたたむ" : "展開する"}
              className={`${styles.circle}`}
              onClick={() => setIsDisplayingSearchBox(!isDisplayingSearchBox)}
            >
              <FontAwesomeIcon icon={faChevronDown} />
            </button>
            <div className={styles.years_list_box}>
              <p>表示年度</p>
              <div className={styles.select_box}>
                <select
                  title="表示年度を選択"
                  className={styles.year_select}
                  onChange={triggerYearSelection}
                  name="year_filtering"
                  value={selectedYear}
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
            </div>
            <div className={styles.search_area}>
              <div className={styles.select_box}>
                <select
                  title="検索カテゴリを選択"
                  className={styles.search_select}
                  onChange={triggerSearchModeSelection}
                  name="search_type"
                  value={selectedSearchMode}
                >
                  <option value="research_name">研究題目</option>
                  <option value="research_author">著者</option>
                  <option value="research_tag">キーワード</option>
                  <option value="research_year">発行年</option>
                </select>
              </div>
              <div className={styles.search_box_frame}>
                <input
                  title="検索条件を入力"
                  value={searchWord}
                  placeholder={
                    initialQ
                      ? `クリアはXを${isUsingPhone ? "タップ" : "クリック"}`
                      : `${isUsingPhone ? "タップ" : "クリック"}して入力`
                  }
                  type={"text"}
                  className={`${styles.search_input}`}
                  onInput={triggerSearchInput}
                  onKeyDown={handleEnterKeyPress}
                />
                <button
                  title="検索条件をクリア"
                  className={styles.search_clear_button}
                  onClick={() => {
                    setSearchWord("");
                    setSelectedYear(0);
                    setUserFiltered(false);
                    router.push(`/project/`);
                    setDisplayingSearchCondition(null);
                  }}
                >
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              </div>
              <button
                title="検索する"
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
            </div>
          </div>
          <div
            className={`${styles.result_box} ${isDisplayingSearchBox ? styles.opening : ""
              }`}
          >
            {displayArray ? (
              // 検索結果が1件以上あるか
              displayArray.length > 0 ? (
                uniqueYears.map((year, i) => {
                  // 年度ごとにグループ化
                  function groupByThumbnail(array: Project[]) {
                    var grouped: { [name: string]: Project[] } = {};
                    // サムネイルパスが一致した場合にグループ化する
                    array.forEach((item) => {
                      if (item.thumbnailURL !== "" || item.thumbnailURL) {
                        // キーが無い場合は作成
                        if (!grouped[item.thumbnailURL]) {
                          grouped[item.thumbnailURL] = [];
                        }
                        grouped[item.thumbnailURL].push(item);
                      } else {
                        // デフォルトサムネイルの場合
                        if (!grouped[item.id]) {
                          grouped[item.id] = [];
                        }
                        grouped[item.id].push(item);
                      }
                    });
                    return grouped;
                  }

                  // 表示年度と一致するか
                  if (selectedYear !== 0 && year !== selectedYear)
                    return <React.Fragment key={i} />;
                  const matchedDataWithYear = displayArray?.filter((item) => {
                    const japanTime = ConvertToJST(item.date);
                    // 年度を計算
                    return CalcFiscalYear(japanTime) === year;
                  });

                  const groupedArray = groupByThumbnail(matchedDataWithYear);

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
                        <React.Fragment>
                          {Object.keys(groupedArray).map((key, j) => {
                            // 一致するものが無かった場合
                            if (groupedArray[key].length == 1) {
                              return (
                                <ProjectCard
                                  key={j}
                                  project={groupedArray[key][0]}
                                  uniqueColorNumber={uniqueTypes.findIndex(
                                    (type) => type === groupedArray[key][0].type
                                  )}
                                />
                              );
                            } else {
                              // 種類リストからインデックスを取得
                              const projectAndColors: ProjectsAndColors[] = [];
                              groupedArray[key].forEach((project) => {
                                projectAndColors.push({
                                  project: project,
                                  uniqueColorNumber: uniqueTypes.findIndex(
                                    (type) => type === project.type
                                  ),
                                });
                              });

                              return (
                                <ProjectGroupCard
                                  key={j}
                                  projectsAndColors={projectAndColors}
                                />
                              );
                            }
                          })}
                        </React.Fragment>
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
}
