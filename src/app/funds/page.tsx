/* eslint-disable no-irregular-whitespace */
/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { faBookOpen, faLink, faTag, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { fetchFunds, fetchProjects } from '@/components/GASFetch';
import { PageMetadata } from '@/components/PageMetadata';
import SEO from '@/components/common/SEO';
import { Title } from '@/components/common/SubPageLayout';
import styles from '@/styles/app/funds/funds.module.scss';

const pageMeta: PageMetadata = {
  isArticle: false,
  title: 'Funds',
  description: 'SAI (髙田研究室)の研究費について',
  url: `/funds`,
  imageUrl: undefined,
};

export async function generateMetadata() {
  return SEO({
    title: pageMeta.title,
    description: pageMeta.description,
    url: pageMeta.url,
    imageUrl: pageMeta.imageUrl,
  });
}

export default async function DisplayFunds() {
  const fundList = await fetchFunds();
  const projectList = await fetchProjects();

  return (
    <div className={styles.main}>
      <Title color1='#5248E2' color2='#9750F4'>
        研究費
      </Title>
      <ul className={styles.fund_list}>
        {fundList.map((fund, i) => (
          <li className={styles.fund_item} key={i}>
            <div className={styles.detail_box}>
              <p className={styles.topic}>
                {fund.topic}
                {fund.url && (
                  <Link href={fund.url} target='_blank' rel='noopener' style={{ marginLeft: '.5rem' }}>
                    <FontAwesomeIcon
                      icon={faLink}
                      style={{
                        color: '#FA5F2F',
                        display: 'inline-block',
                        fontSize: '1.5rem',
                        width: '1.5rem',
                      }}
                    />
                  </Link>
                )}
              </p>
              <div className={styles.detail_padding}>
                {fund.fund_system.trim() && (
                  <p className={styles.detail}>
                    <span className={styles.detail_prefix}>助成事業名</span>
                    {fund.fund_system}
                  </p>
                )}
                {fund.investigator.trim() && (
                  <p className={styles.detail}>
                    <span className={styles.detail_prefix}>代表者名</span>
                    {fund.investigator}
                  </p>
                )}
                {fund.co_investigator.trim() && (
                  <p className={styles.detail}>
                    <span className={styles.detail_prefix}>分担者</span>
                    {fund.co_investigator}
                  </p>
                )}
                {fund.term.trim() && (
                  <p className={styles.detail}>
                    <span className={styles.detail_prefix}>助成期間</span>
                    {fund.term}
                  </p>
                )}
                {fund.amount.trim() && (
                  <p className={styles.detail}>
                    <span className={styles.detail_prefix}>配分額</span>
                    {fund.amount}
                  </p>
                )}
              </div>
            </div>
            <div className={styles.tags}>
              {fund.tags.map((tag, k) => (
                <span key={`dProjTag${k}`}>
                  <FontAwesomeIcon icon={faTag} style={{ color: '#8a8a8a' }} />
                  {tag.name}
                </span>
              ))}
            </div>
            <div>
              <ul className={styles.relative_projects}>
                {fund.projects.map((projectId, j) => {
                  const project = projectList.find((item) => item.id === projectId.name);
                  if (!project) return <React.Fragment key={j} />;

                  return (
                    <li key={j}>
                      <Link
                        href={`/project/${project.id}`}
                        target='_blank'
                        rel='noopener'
                        className={styles.r_project_link}
                      >
                        <div className={styles.r_project}>
                          <div className={styles.title}>{project.title}</div>
                          <div className={styles.authors}>
                            {project.authors.map((author, k) => (
                              <span className={styles.author} key={`dProjAuthor${k}`}>
                                <div>
                                  <FontAwesomeIcon
                                    icon={faUser}
                                    style={{
                                      color: '#222',
                                      fontSize: '0.8rem',
                                      width: '0.8rem',
                                    }}
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
                                    style={{
                                      color: '#8a8a8a',
                                      fontSize: '0.8rem',
                                      width: '0.8rem',
                                    }}
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
                                style={{
                                  color: '#222',
                                  fontSize: '0.7rem',
                                  width: '0.7rem',
                                  display: 'inline-block',
                                }}
                              />
                            </div>
                            <p>
                              {`${project.bookTitle ?? ``}${
                                project.volume && `, Vol.${project.volume}`
                              }${project.number && `, ${project.number}`}${
                                project.pageStart && project.pageEnd && `, pp.${project.pageStart}-${project.pageEnd}`
                              }`}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
