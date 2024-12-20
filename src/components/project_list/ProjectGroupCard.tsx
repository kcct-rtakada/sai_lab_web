/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useState } from 'react';
import {
  faUser,
  faBookOpen,
  faTag,
  faCalendar,
  faFolderOpen,
  faFolderClosed,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { Project } from '@/components/DefaultStructure';
import getUsingPhone from '@/libs/PhoneTester';
import styles from '@/styles/app/projects/projectList.module.scss';
import { CalcFiscalYear, ConvertToJST } from '../JSTConverter';

interface ProjectsAndColors {
  project: Project;
  uniqueColorNumber: number;
}

export default function ProjectGroupCard({ projectsAndColors }: { projectsAndColors: ProjectsAndColors[] }) {
  // 展開/折り畳みで表示量を調整する
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [isFolderHovered, setIsFolderHovered] = useState<boolean>(false);
  const [isFolderActive, setIsFolderActive] = useState<boolean>(false);

  const isUsingPhone = getUsingPhone();

  // タグリストを生成
  const uniqueTags = Array.from(new Set(projectsAndColors.flatMap((item) => item.project.tags.map((tag) => tag.name))));

  // 著者リストを生成、仕様上、First Authorが0インデックスに入る
  const uniqueAuthors = Array.from(
    new Set(projectsAndColors.flatMap((item) => item.project.authors.map((author) => author.name))),
  );

  let currentFolderIcon: IconDefinition = faFolderClosed;
  if ((isOpen && !isFolderActive && !isFolderHovered) || (!isOpen && (isFolderActive || isFolderHovered)))
    currentFolderIcon = faFolderOpen;

  // 年度が共通なので0インデックス目で計算
  const japanTimeOfLeader = ConvertToJST(projectsAndColors[0].project.date);

  return (
    <React.Fragment>
      <div className={styles.project_link}>
        <button
          className={`${styles.project} ${styles.border} ${styles.group} ${isOpen ? styles.open : ''}`}
          onClick={() => {
            setIsOpen(!isOpen);
            setIsFolderActive(false);
          }}
          onMouseEnter={() => setIsFolderHovered(true)}
          onMouseLeave={() => setIsFolderHovered(false)}
          onFocus={() => setIsFolderActive(true)}
          onBlur={() => setIsFolderActive(false)}
          onTouchStart={() => setIsFolderHovered(true)}
          onTouchEnd={() => setIsFolderHovered(false)}
        >
          <div className={styles.thumbnail_box}>
            {projectsAndColors[0].project.thumbnailURL ? (
              <img
                src={projectsAndColors[0].project.thumbnailURL}
                alt='thumbnail'
                className={styles.thumbnail}
                loading='lazy'
              />
            ) : (
              <img src='/sai_default_thumbnail.webp' alt='thumbnail' className={styles.thumbnail} loading='lazy' />
            )}
            <div className={`${styles.type}`}>
              <span>{projectsAndColors[0].project.type}等</span>
            </div>
            <div className={styles.date}>
              <FontAwesomeIcon icon={faCalendar} style={{ marginRight: '.3rem' }} />
              {`${CalcFiscalYear(japanTimeOfLeader)}年度`}
            </div>
          </div>
          <div className={styles.description_area}>
            <div className={styles.title}>{projectsAndColors[0].project.title}</div>
            <div className={styles.authors}>
              <span className={styles.author}>
                {/* First Authorのみ表示 */}
                <div>
                  <FontAwesomeIcon icon={faUser} style={{ color: '#222' }} />
                </div>
                <p>{uniqueAuthors.length > 0 ? uniqueAuthors[0] : ''}</p>
              </span>
              {uniqueAuthors.length > 1 ? <React.Fragment>et al.</React.Fragment> : ''}
            </div>
            {uniqueTags.length > 0 ? (
              <div className={styles.tags}>
                {uniqueTags.map((tag, k) => (
                  <span key={`dProjTag${k}`}>
                    <FontAwesomeIcon icon={faTag} style={{ color: '#8a8a8a' }} />
                    {tag}
                  </span>
                ))}
              </div>
            ) : (
              <></>
            )}
            <div className={styles.comment}>
              <p>
                <span className={styles.icon_box}>
                  <FontAwesomeIcon
                    icon={currentFolderIcon}
                    style={{
                      color: `${isOpen ? '#0BAF8E' : '#8a8a8a'}`,
                      marginRight: '.2rem',
                    }}
                  />
                </span>
                {!isOpen
                  ? `${isUsingPhone ? 'タップ' : 'クリック'}して展開`
                  : `${isUsingPhone ? 'タップ' : 'クリック'}して格納`}
              </p>
            </div>
          </div>
        </button>
      </div>
      {/* 展開時のみ表示 */}
      {isOpen ? (
        projectsAndColors.map((projectAndColor, i) => {
          const japanTime = ConvertToJST(projectAndColor.project.date);
          return (
            <Link href={`/project/${projectAndColor.project.id}`} className={styles.project_link} key={i}>
              <div className={`${styles.project} ${styles.in_group}`}>
                <div className={styles.thumbnail_box}>
                  {projectAndColor.project.thumbnailURL ? (
                    <img
                      src={projectAndColor.project.thumbnailURL}
                      alt='thumbnail'
                      className={styles.thumbnail}
                      loading='lazy'
                    />
                  ) : (
                    <img
                      src='/sai_default_thumbnail.webp'
                      alt='thumbnail'
                      className={styles.thumbnail}
                      loading='lazy'
                    />
                  )}
                </div>
                {projectAndColor.project.type ? (
                  // propsより、type毎に割り当てられた色をセットする
                  <div className={`${styles.type} unique-type${projectAndColor.uniqueColorNumber}`}>
                    <span>{projectAndColor.project.type}</span>
                  </div>
                ) : (
                  <></>
                )}
                <div className={styles.date}>
                  <FontAwesomeIcon icon={faCalendar} style={{ marginRight: '.3rem' }} />
                  {`${CalcFiscalYear(japanTime)}年度`}
                </div>
                <div className={styles.description_area}>
                  <div className={styles.title}>{projectAndColor.project.title}</div>
                  <div className={styles.authors}>
                    {projectAndColor.project.authors.map((author, k) => (
                      <span className={styles.author} key={`dProjAuthor${k}`}>
                        <div>
                          <FontAwesomeIcon icon={faUser} style={{ color: '#222' }} />
                        </div>
                        <p>{author.name}</p>
                      </span>
                    ))}
                  </div>
                  {projectAndColor.project.tags.length > 0 ? (
                    <div className={styles.tags}>
                      {projectAndColor.project.tags.map((tag, k) => (
                        <span key={`dProjTag${k}`}>
                          <FontAwesomeIcon icon={faTag} style={{ color: '#8a8a8a' }} />
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <></>
                  )}
                  <div className={styles.book}>
                    <div>
                      <FontAwesomeIcon icon={faBookOpen} style={{ color: '#222' }} />
                    </div>
                    <p>
                      {`${projectAndColor.project.bookTitle ? `${projectAndColor.project.bookTitle}` : ``}${
                        projectAndColor.project.volume ? `, Vol.${projectAndColor.project.volume}` : ``
                      }${projectAndColor.project.number ? `, ${projectAndColor.project.number}` : ``}${
                        projectAndColor.project.pageStart && projectAndColor.project.pageEnd
                          ? `, pp.${projectAndColor.project.pageStart}-${projectAndColor.project.pageEnd}`
                          : ``
                      }`}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          );
        })
      ) : (
        <></>
      )}
    </React.Fragment>
  );
}
