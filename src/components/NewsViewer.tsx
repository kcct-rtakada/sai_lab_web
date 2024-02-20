/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import News from "@/components/DefaultStructure";
import styles from "@/styles/app/news/newsList.module.scss";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faXmark,
  faCalendar,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  _newsList: News[];
}

export default function NewsViewer(props: Props) {
  const newsList = props._newsList;
  const [loaded, setLoaded] = useState<boolean>(false);
  const [selectedSearchMode, setSelectedSearchMode] =
    useState<string>("news_name");
  const [selectedYear, setSelectedYear] = useState<number>(0);
  const [filteredNews, setFilteredNews] = useState<undefined | News[]>([]);
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
    if (newsList) {
      setLoaded(true);

      if (initialQ) {
        const initialSearchWord = initialQ.replace(/,/g, " ");
        setSearchWord(initialSearchWord);
        let mode: string | null = null;
        if (initialMode === "mode") {
          mode = "news_name";
        } else if (initialMode === "year") {
          mode = "news_year";
        }
        searchNews(initialSearchWord, mode, newsList);
        setUserFiltered(true);
      }
    }
  }, []);

  const searchNews = (
    _searchWord: string,
    _mode: string | null = null,
    _newsList: News[] | undefined = undefined
  ) => {
    const filterKeywords = _searchWord.split(/[ 　]+/);
    const mode = _mode ? _mode : selectedSearchMode;
    const lists = _newsList ? _newsList : newsList;

    if (filterKeywords.every((keyword) => keyword === "")) {
      setUserFiltered(false);
      return;
    }

    let filteredArray: News[] | undefined = [];

    if (mode === "news_name") {
      filteredArray = lists?.filter((news) =>
        filterKeywords.some(
          (keyword) =>
            keyword.toLowerCase() !== "" &&
            news.title.toLowerCase().includes(keyword.toLowerCase())
        )
      );
      setDisplayingSearchCondition(
        `検索条件: ニュース名(${filterKeywords.map((item, j) => {
          if (j === 0) return `${item}`;
          else return ` OR ${item}`;
        })})`
      );

      router.push(`/news/?mode=name&q=${filterKeywords.map((item) => item)}`);
    } else if (mode === "news_year") {
      filteredArray = lists?.filter((news) =>
        filterKeywords.some(
          (keyword) => String(new Date(news.date).getFullYear()) === keyword
        )
      );
      setDisplayingSearchCondition(
        `検索条件: 公開年(${filterKeywords.map((item, j) => {
          if (j === 0) return `${item}`;
          else return ` OR ${item}`;
        })})`
      );

      router.push(`/news/?mode=year&q=${filterKeywords.map((item) => item)}`);
    }

    setFilteredNews(filteredArray);
    setUserFiltered(true);
  };

  const triggerSearchNews = () => {
    if (searchWord === "") {
      setUserFiltered(false);
      router.push(`/news/`);
      setDisplayingSearchCondition(null);
      return;
    }

    searchNews(searchWord);
  };

  const triggerSearchInput = (event: React.FormEvent<HTMLInputElement>) => {
    if (event.currentTarget.value === "") {
      setUserFiltered(false);
      router.push(`/news/`);
      setDisplayingSearchCondition(null);
    }

    setSearchWord(event.currentTarget.value);
  };

  const handleEnterKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      triggerSearchNews();
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
              <h1 className={styles.page_title}>ニュース</h1>
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

  const displayArray = userFiltered ? filteredNews : newsList;

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
            <h1 className={styles.page_title}>ニュース</h1>
          </div>
        </div>
        <div className={styles.list_box}>
          <div
            className={`${styles.search_box} ${
              isDisplayingSearchBox ? styles.opening : ""
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
              <select
                title="表示年度を選択"
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
                  title="検索条件を入力"
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
                  title="検索条件をクリア"
                  className={styles.search_clear_button}
                  onClick={() => {
                    setSearchWord("");
                    setUserFiltered(false);
                    router.push(`/news/`);
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
                onClick={triggerSearchNews}
              >
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  className={styles.search_magnify}
                />
              </button>

              <select
                title="検索カテゴリを選択"
                className={styles.search_select}
                onChange={triggerSearchModeSelection}
                name="search_type"
              >
                <option value="news_name">記事名</option>
                <option value="news_year">公開年</option>
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
                      <div key={`dYear${i}`} className={styles.news_link}>
                        <div
                          key={`dYear${i}`}
                          className={`${styles.news} ${styles.year}`}
                        >
                          <p key={`dYear${i}`}>{year}年度</p>
                        </div>
                      </div>
                      {matchedDataWithYear!.map((item, j) => (
                        <Link
                          key={j}
                          href={`/news/${item.id}`}
                          className={styles.news_link}
                        >
                          <div className={styles.news}>
                            <div className={styles.thumbnail_box}>
                              {item.thumbnailURL ? (
                                <img
                                  src={item.thumbnailURL}
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

                            <div className={styles.text_box}>
                              <div className={styles.title}>{item.title}</div>
                              <div className={styles.date}>
                                <FontAwesomeIcon
                                  icon={faCalendar}
                                  style={{ marginRight: ".3rem" }}
                                />
                                {`${new Date(item.date).getFullYear()}/${(
                                  new Date(item.date).getMonth() + 1
                                )
                                  .toString()
                                  .padStart(2, "0")}/${new Date(item.date)
                                  .getDate()
                                  .toString()
                                  .padStart(2, "0")}`}
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
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
