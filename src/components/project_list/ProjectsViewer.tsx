/* eslint-disable no-irregular-whitespace */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useState, useEffect } from 'react';
import { faMagnifyingGlass, faXmark, faChevronDown, faSquareRss } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDocumentTitle } from 'usehooks-ts';
import { Project } from '@/components/DefaultStructure';
import getUsingPhone from '@/libs/PhoneTester';
import styles from '@/styles/app/projects/projectList.module.scss';
import { CalcFiscalYear, ConvertToJST } from '../JSTConverter';
import LoadingUI from '../Loading';
import ErrorBlock from '../common/ErrorBlock';
import { Title } from '../common/SubPageLayout';
import ProjectCard from './ProjectCard';
import ProjectGroupCard from './ProjectGroupCard';

interface Props {
  _projects: Project[];
}

interface ProjectsAndColors {
  project: Project;
  uniqueColorNumber: number;
}

const modeDic: { [key: string]: string } = {
  name: '研究題目',
  author: '著者',
  tag: 'キーワード',
  year: '発行年',
};

export default function ProjectsViewer(props: Props) {
  const projects = props._projects;
  const [loaded, setLoaded] = useState<boolean>(false);
  const [selectedSearchMode, setSelectedSearchMode] = useState<string>('name');
  const [selectedYear, setSelectedYear] = useState<number>(0);
  const [filteredProjects, setFilteredProjects] = useState<undefined | Project[]>([]);
  const [userFiltered, setUserFiltered] = useState<boolean>(false);
  const [searchWord, setSearchWord] = useState<string>('');
  const [isDisplayingSearchBox, setIsDisplayingSearchBox] = useState<boolean>(true);
  const [displayingSearchCondition, setDisplayingSearchCondition] = useState<string | null>(null);
  const [isUsingPhone, setIsUsingPhone] = useState<boolean>(false);
  const [title, setTitle] = useState('Project');

  const router = useRouter();
  const params = useSearchParams();
  const initialMode = params.get('mode');
  const initialQ = params.get('q');

  useDocumentTitle(title + ' - SAI');

  // タップ/クリックの表示を切り替え
  useEffect(() => {
    setIsUsingPhone(getUsingPhone());
    if (projects) {
      setLoaded(true);

      if (initialQ) {
        const initialSearchWord = initialQ.replace(/,/g, ' ');
        setSearchWord(initialSearchWord);
        searchProjects(initialSearchWord, initialMode, projects);
        setUserFiltered(true);
      }
    }
  }, []);

  const searchProjects = (
    _searchWord: string,
    _mode: string | null = null,
    _projects: Project[] | undefined = undefined,
  ) => {
    // スペースごとにキーワード化
    const filterKeywords = _searchWord.split(/[ 　]+/);
    const mode = _mode ? _mode : selectedSearchMode;
    const lists = _projects ? _projects : projects;

    const modeDisplayName = modeDic[mode] ?? '不明';
    const commaKeyword = filterKeywords.join(',');
    setTitle(
      `${commaKeyword ? `[${modeDisplayName}]` + (commaKeyword.length > 10 ? commaKeyword.substring(0, 10) + '...' : commaKeyword) + ' の' : ''}Project`,
    );

    setSelectedYear(0);
    setSelectedSearchMode(mode);

    // スペースしか入力がない場合はリセット
    if (filterKeywords.every((keyword) => keyword === '')) {
      resetSearch();
      return;
    }

    let filteredArray: Project[] | undefined = [];

    switch (mode) {
      case 'name':
        filteredArray = lists?.filter((project) =>
          filterKeywords.some(
            (keyword) => keyword.toLowerCase() !== '' && project.title.toLowerCase().includes(keyword.toLowerCase()),
          ),
        );
        break;
      case 'author':
        filteredArray = lists?.filter((project) =>
          filterKeywords.some((keyword) =>
            project.authors.some(
              (author) =>
                keyword.toLowerCase() !== '' &&
                (author.name
                  .toLowerCase()
                  .replace(/[ 　]+/, '')
                  .includes(keyword.toLowerCase()) ||
                  author.name
                    .toLowerCase()
                    .split(/[ 　]+/)
                    .reverse()
                    .join('')
                    .includes(keyword.toLowerCase())),
            ),
          ),
        );
        break;
      case 'keyword':
        filteredArray = lists?.filter((project) =>
          filterKeywords.some((keyword) =>
            project.tags.some(
              (tag) => keyword.toLowerCase() !== '' && tag.name.toLowerCase().includes(keyword.toLowerCase()),
            ),
          ),
        );
        break;
      case 'year':
        filteredArray = lists?.filter((project) =>
          filterKeywords.some((keyword) => String(ConvertToJST(project.date).getFullYear()) === keyword),
        );
        break;
      default:
        filteredArray = [];
        break;
    }

    setDisplayingSearchCondition(`検索条件: ${modeDisplayName}(${filterKeywords.join(' OR ')})`);

    router.push(`/project/?mode=${mode}&q=${commaKeyword}`);

    setFilteredProjects(filteredArray);
    setUserFiltered(true);
  };

  const resetSearch = () => {
    setSearchWord('');
    setSelectedYear(0);
    setUserFiltered(false);
    router.push(`/project/`);
    setDisplayingSearchCondition(null);
  };

  // 空文字ならリセット
  const triggerSearchProjects = () => {
    if (searchWord === '') {
      resetSearch();
      return;
    }
    searchProjects(searchWord);
  };

  // 検索時に空文字ならリセット
  const triggerSearchInput = (event: React.FormEvent<HTMLInputElement>) => {
    if (event.currentTarget.value === '') {
      resetSearch();
    }

    setSearchWord(event.currentTarget.value);
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
          <Title color1='#dbc70e' color2='#44b835'>
            <span>プロジェクト</span>
          </Title>
          <LoadingUI />
        </div>
      </>
    );
  }

  // 表示対象の切り替え
  const displayArray = userFiltered ? filteredProjects : projects;

  // 種類リストを作成する
  const uniqueTypes = Array.from(new Set(projects!.flatMap((item) => item.type)));

  // 年度リストを作成する
  const uniqueYears = Array.from(
    new Set(
      displayArray
        ?.flatMap((item) => {
          const japanTime = ConvertToJST(item.date);
          return CalcFiscalYear(japanTime);
        })
        .sort((a, b) => b - a),
    ),
  );

  return (
    <>
      <div className={styles.main}>
        <Title color1='#dbc70e' color2='#44b835'>
          <span>プロジェクト</span>
          <span>
            <Link href='/project/feed.xml' target='_blank' rel='noopener noreferrer' title='RSS'>
              <FontAwesomeIcon icon={faSquareRss} />
            </Link>
          </span>
        </Title>
        <div className={styles.list_box}>
          <div className={`${styles.search_box} ${isDisplayingSearchBox ? styles.opening : ''}`}>
            <button
              title={isDisplayingSearchBox ? '折りたたむ' : '展開する'}
              className={`${styles.circle}`}
              onClick={() => setIsDisplayingSearchBox(!isDisplayingSearchBox)}
            >
              <FontAwesomeIcon icon={faChevronDown} />
            </button>
            <div className={styles.years_list_box}>
              <p>表示年度</p>
              <div className={styles.select_box}>
                <select
                  title='表示年度を選択'
                  className={styles.year_select}
                  onChange={triggerYearSelection}
                  name='year_filtering'
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
                  title='検索カテゴリを選択'
                  className={styles.search_select}
                  onChange={triggerSearchModeSelection}
                  name='search_type'
                  value={selectedSearchMode}
                >
                  <option value='name'>研究題目</option>
                  <option value='author'>著者</option>
                  <option value='keyword'>キーワード</option>
                  <option value='year'>発行年</option>
                </select>
              </div>
              <div className={styles.search_box_frame}>
                <input
                  title='検索条件を入力'
                  value={searchWord}
                  placeholder={
                    initialQ
                      ? `クリアはXを${isUsingPhone ? 'タップ' : 'クリック'}`
                      : `${isUsingPhone ? 'タップ' : 'クリック'}して入力`
                  }
                  type={'text'}
                  className={`${styles.search_input}`}
                  onInput={triggerSearchInput}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === 'Enter') {
                      triggerSearchProjects();
                    }
                  }}
                />
                <button title='検索条件をクリア' className={styles.search_clear_button} onClick={() => resetSearch()}>
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              </div>
              <button
                title='検索する'
                id='header-search-click'
                className={styles.search_button}
                onClick={triggerSearchProjects}
              >
                <FontAwesomeIcon icon={faMagnifyingGlass} className={styles.search_magnify} />
              </button>
            </div>
          </div>
          <div className={`${styles.result_box} ${isDisplayingSearchBox ? styles.opening : ''}`}>
            {displayArray ? (
              // 検索結果が1件以上あるか
              displayArray.length > 0 ? (
                uniqueYears.map((year, i) => {
                  // 年度ごとにグループ化
                  function groupByThumbnail(array: Project[]) {
                    var grouped: { [name: string]: Project[] } = {};
                    // サムネイルパスが一致した場合にグループ化する
                    array.forEach((item) => {
                      if (item.thumbnailURL !== '' || item.thumbnailURL) {
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
                  if (selectedYear !== 0 && year !== selectedYear) return <React.Fragment key={i} />;
                  const matchedDataWithYear = displayArray?.filter((item) => {
                    const japanTime = ConvertToJST(item.date);
                    // 年度を計算
                    return CalcFiscalYear(japanTime) === year;
                  });

                  const groupedArray = groupByThumbnail(matchedDataWithYear);

                  return (
                    <React.Fragment key={`dYear${i}`}>
                      <div className={styles.year_bar}>
                        <p>{year}年度</p>
                      </div>
                      <section>
                        {matchedDataWithYear!.length > 0 &&
                          Object.keys(groupedArray).map((key, j) => {
                            const projects = groupedArray[key];
                            const uniqueColorNumber = (project: Project) =>
                              uniqueTypes.findIndex((type) => type === project.type);

                            if (projects.length === 1) {
                              return (
                                <ProjectCard
                                  key={j}
                                  project={projects[0]}
                                  uniqueColorNumber={uniqueColorNumber(projects[0])}
                                />
                              );
                            }

                            const projectAndColors: ProjectsAndColors[] = projects.map((project) => ({
                              project,
                              uniqueColorNumber: uniqueColorNumber(project),
                            }));

                            return <ProjectGroupCard key={j} projectsAndColors={projectAndColors} />;
                          })}
                      </section>
                    </React.Fragment>
                  );
                })
              ) : (
                <ErrorBlock>
                  検索結果は得られませんでした。
                  <br />
                  検索キーワードは間違っていませんか？
                </ErrorBlock>
              )
            ) : (
              <ErrorBlock>
                無効な結果を得ました。
                <br />
                再度お試しください。
              </ErrorBlock>
            )}
          </div>
        </div>
        {displayingSearchCondition ? <div className={styles.search_condition}>{displayingSearchCondition}</div> : <></>}
      </div>
    </>
  );
}
