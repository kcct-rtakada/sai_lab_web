/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import { News } from "@/components/DefaultStructure";
import styles from "@/styles/app/news/newsList.module.scss";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faXmark,
  faCalendar,
  faChevronDown,
  faSquareRss,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CalcFiscalYear,
  ConvertToJST,
  DisplayDefaultDateString,
} from "@/components/JSTConverter";

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
  const [isUsingPhone, setIsUsingPhone] = useState<boolean>(false);

  const router = useRouter();
  const params = useSearchParams();
  // 2つのパラメータがあるかチェック
  const initialMode = params.get("mode");
  const initialQ = params.get("q");

  // タップ/クリックの表示を切り替え
  useEffect(() => {
    setIsUsingPhone(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
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
    // スペースごとにキーワード化
    const filterKeywords = _searchWord.split(/[ 　]+/);
    const mode = _mode ? _mode : selectedSearchMode;
    const lists = _newsList ? _newsList : newsList;

    setSelectedYear(0);

    // スペースのみで検索なら取り消し
    if (filterKeywords.every((keyword) => keyword === "")) {
      setUserFiltered(false);
      return;
    }

    let filteredArray: News[] | undefined = [];

    if (mode === "news_name") {
      // タイトルの部分一致
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
      // 年の一致
      filteredArray = lists?.filter((news) =>
        filterKeywords.some(
          (keyword) => String(ConvertToJST(news.date).getFullYear()) === keyword
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

  // 空文字ならリセット
  const triggerSearchNews = () => {
    if (searchWord === "") {
      setUserFiltered(false);
      router.push(`/news/`);
      setDisplayingSearchCondition(null);
      return;
    }

    searchNews(searchWord);
  };

  // 文字を更新、空ならリセット
  const triggerSearchInput = (event: React.FormEvent<HTMLInputElement>) => {
    if (event.currentTarget.value === "") {
      setUserFiltered(false);
      router.push(`/news/`);
      setDisplayingSearchCondition(null);
    }

    setSearchWord(event.currentTarget.value);
  };

  // エンターキーで検索
  const handleEnterKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      triggerSearchNews();
    }
  };

  // 検索条件を記憶
  const triggerSearchModeSelection = (event: { target: { value: string } }) => {
    const selectedOptionValue = event.target.value;

    setSelectedSearchMode(selectedOptionValue);
  };

  // 年度選択を適用
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

  // 表示対象の切り替え
  const displayArray = userFiltered ? filteredNews : newsList;

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
            <h1 className={styles.page_title}>
              <span>ニュース</span>
              <span>
                <Link href="/project/feed.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="RSS">
                  <FontAwesomeIcon icon={faSquareRss} />
                </Link>
              </span>
            </h1>
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
              <div className={styles.select_box}>
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
          </div>
          <div
            className={`${styles.result_box} ${
              isDisplayingSearchBox ? styles.opening : ""
            }`}
          >
            {displayArray ? (
              displayArray.length > 0 ? (
                uniqueYears.map((year, i) => {
                  // 年度が選択されているかどうか
                  if (selectedYear !== 0 && year !== selectedYear)
                    return <span key={`dYear${i}`}></span>;
                  const matchedDataWithYear = displayArray?.filter((item) => {
                    const japanTime = ConvertToJST(item.date);
                    // 該当年度か判定
                    return CalcFiscalYear(japanTime) === year;
                  });
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
                      {matchedDataWithYear!.map((item, j) => {
                        const japanTime = ConvertToJST(item.date);
                        return (
                          <Link
                            key={j}
                            href={`/news/${item.id}`}
                            className={styles.news_link}
                          >
                            <div className={styles.news}>
                              <div className={styles.thumbnail_box}>
                                {/* 画像がない場合はデフォルト画像 */}
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
                                  {`${DisplayDefaultDateString(japanTime)}`}
                                </div>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
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
