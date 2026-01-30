'use client';
import React, { useState } from 'react';
import { faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/navigation';
import useUsingPhone from '@/libs/useUsingPhone';
import styles from '@/styles/components/MiniSearchArea.module.scss';

export default function MiniSearchArea() {
  const [selectedSearchMode, setSelectedSearchMode] = useState<string>('research_name');
  const [searchWord, setSearchWord] = useState<string>('');
  const isUsingPhone = useUsingPhone();

  const router = useRouter();

  // 文字列の入力
  const triggerSearchInput = (event: React.FormEvent<HTMLInputElement>) => {
    setSearchWord(event.currentTarget.value);
  };

  // エンターキーの押下
  const handleEnterKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // 空文字の場合、何もしない
      if (searchWord === '') return;
      searchProjects(searchWord);
    }
  };

  const triggerSearchProjects = () => {
    searchProjects(searchWord);
  };

  // モード切替を記録する
  const triggerSearchModeSelection = (event: { target: { value: string } }) => {
    const selectedOptionValue = event.target.value;

    setSelectedSearchMode(selectedOptionValue);
  };

  const searchProjects = (_searchWord: string, _mode: string | null = null) => {
    const filterKeywords = _searchWord.split(/[ 　]+/);
    const mode = _mode ? _mode : selectedSearchMode;

    // スペースしか入力されていない場合
    if (filterKeywords.every((keyword) => keyword === '')) {
      return;
    }

    // 検索させる
    if (mode === 'research_name') {
      router.push(`/project/?mode=name&q=${filterKeywords.map((item) => item)}`);
    } else if (mode === 'research_author') {
      router.push(`/project/?mode=author&q=${filterKeywords.map((item) => item)}`);
    } else if (mode === 'research_tag') {
      router.push(`/project/?mode=keyword&q=${filterKeywords.map((item) => item)}`);
    } else if (mode === 'research_year') {
      router.push(`/project/?mode=year&q=${filterKeywords.map((item) => item)}`);
    }
  };

  return (
    <React.Fragment>
      <div className={styles.search_area}>
        <div className={styles.search_box_frame}>
          <input
            title='検索条件を入力'
            value={searchWord}
            placeholder={`${isUsingPhone ? 'タップ' : 'クリック'}して入力`}
            type={'text'}
            className={`${styles.search_input}`}
            onInput={triggerSearchInput}
            onKeyDown={handleEnterKeyPress}
          />
          <button
            title='検索条件をクリア'
            className={styles.search_clear_button}
            onClick={() => {
              setSearchWord('');
            }}
          >
            <FontAwesomeIcon
              icon={faXmark}
              style={{
                width: '1rem',
                fontSize: '1rem',
              }}
            />
          </button>
        </div>
        <button
          title='検索する'
          id='header-search-click'
          className={` ${styles.search_button}`}
          onClick={triggerSearchProjects}
          style={{
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className={styles.search_magnify}
            style={{
              width: '1.4rem',
              fontSize: '1.4rem',
              display: 'block',
              margin: '0 auto',
            }}
          />
        </button>

        <div className={styles.select_box}>
          <select
            title='検索カテゴリを選択'
            className={styles.search_select}
            onChange={triggerSearchModeSelection}
            name='search_type'
          >
            <option value='research_name'>研究題目</option>
            <option value='research_author'>著者</option>
            <option value='research_tag'>キーワード</option>
            <option value='research_year'>発行年</option>
          </select>
        </div>
      </div>
    </React.Fragment>
  );
}
