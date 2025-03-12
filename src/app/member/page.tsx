/* eslint-disable no-irregular-whitespace */
/* eslint-disable @next/next/no-img-element */
import { CSSProperties } from 'react';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faEarthAmericas, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { Member } from '@/components/DefaultStructure';
import { fetchMembers } from '@/components/GASFetch';
import { PageMetadata } from '@/components/PageMetadata';
import { generateWebsiteStructure } from '@/components/common/JsonLd';
import SEO from '@/components/common/SEO';
import { Title } from '@/components/common/SubPageLayout';
import CreateNameQuery, { CreateOtherNameMap } from '@/libs/NameQueryCreator';
import styles from '@/styles/app/member/member.module.scss';

const pageMeta: PageMetadata = {
  isArticle: false,
  title: 'Member',
  description: 'SAI (髙田研究室)のメンバー一覧',
  url: `/member`,
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

export default async function DisplayMember() {
  const memberList = await fetchMembers();

  // 教員の抽出
  const sortedMemberWithTeacher = memberList?.filter((element) => element.belonging.toLowerCase().includes('教員'));

  // 卒業生と修了生の抽出
  const sortedMemberWithGraduation = memberList?.filter(
    (element) => element.belonging.toLowerCase().includes('卒') || element.belonging.toLowerCase().includes('修'),
  );

  // 上2つに当てはまらなかったメンバーを抽出
  const sortedEnrolledMember = memberList?.filter((element) => {
    return (
      !sortedMemberWithGraduation?.some((sortedMember) => sortedMember.id === element.id) &&
      !sortedMemberWithTeacher?.some((sortedMember) => sortedMember.id === element.id)
    );
  });

  // 上の3つのグループをそれぞれ関数で描画する
  const displayingMember = (name: string, members: Member[] | undefined) => {
    return (
      <div className={styles.result_box}>
        <h2>{name}</h2>
        {members!.map((item, i) => (
          <div key={i} className={styles.member}>
            <div className={styles.member_content}>
              <div className={styles.left}>
                <div className={styles.name}>
                  {/* ()で括られた文字列の中身をリスト化し、","で結合する。*/}
                  {/* 全角スペースは半角スペースに置き換える。 */}
                  <span title={`${item.otherName && '異体字等: ' + CreateOtherNameMap(item)?.join(',')}`}>
                    {item.name}
                  </span>
                  {item.homepage && (
                    <Link
                      target='_blank'
                      rel='noopener noreferrer'
                      href={`${item.homepage}`}
                      title='個人ホームページ'
                      style={{ marginLeft: '.6rem' }}
                    >
                      <FontAwesomeIcon icon={faEarthAmericas} style={inlineIconStyle} />
                    </Link>
                  )}
                  {item.githubId && (
                    <Link
                      target='_blank'
                      rel='noopener noreferrer'
                      href={`https://github.com/${item.githubId}`}
                      title={`GitHub(${item.githubId})`}
                      style={{ marginLeft: '.6rem' }}
                    >
                      <FontAwesomeIcon icon={faGithub} style={inlineIconStyle} />
                    </Link>
                  )}
                </div>
                <div className={styles.english_name}>{item.englishName}</div>
              </div>
              <div className={styles.middle}>
                <div className={styles.belonging}>{item.belonging}</div>
                <div className={styles.classification}>{item.classification}</div>
              </div>
            </div>

            <div className={styles.right}>
              {/* プロジェクトページで検索させる */}
              {/* 名前・英語名のスペースを詰める。英語は順序を入れ替えたものも用意 */}
              {/* 異体字等も同様に検索対象に含める */}
              <Link
                href={`/project?mode=author&q=${CreateNameQuery(item)}`}
                className={styles.search_link}
                title='プロジェクトを検索'
              >
                <FontAwesomeIcon icon={faMagnifyingGlass} style={magnifyStyle} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.main}>
      {generateWebsiteStructure(pageMeta)}
      <Title color1='#d36134' color2='#d4d113'>
        メンバー
      </Title>
      <div className={styles.list_box}>
        {displayingMember('教員', sortedMemberWithTeacher)}
        {displayingMember('在籍中', sortedEnrolledMember)}
        {displayingMember('卒業/修了', sortedMemberWithGraduation)}
      </div>
    </div>
  );
}

const inlineIconStyle: CSSProperties = {
  display: 'inline-block',
  fontSize: '1.2rem',
  width: '1.2rem',
};

const magnifyStyle: CSSProperties = {
  color: 'white',
  fill: 'white',
  display: 'block',
  fontSize: '1.2rem',
  width: '1.2rem',
};
