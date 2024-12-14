/* eslint-disable @next/next/no-img-element */
import React, { cache } from 'react';
import { faFilePdf, faLink, faTag } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import parse from 'html-react-parser';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Project } from '@/components/DefaultStructure';
import { fetchProjects } from '@/components/GASFetch';
import { ConvertToJST, DisplayDefaultDateString } from '@/components/JSTConverter';
import CopyButton from '@/components/client_parts/CopyButton';
import { getJsonLd, getJsonLdScript } from '@/components/common/JsonLd';
import SEO from '@/components/common/SEO';
import ProjectLeftSidebar from '@/components/project_detail/ProjectLeftSidebar';
import ProjectRightSidebar from '@/components/project_detail/ProjectRightSidebar';
import styles from '@/styles/app/projects/project.module.scss';

// プロジェクト取得・一致判定を行う
const getProject = cache(async (slug: string) => {
  const projectList = await fetchProjects();
  const project: Project | undefined = projectList.find((c: { id: string }) => {
    const cid = String(c.id);
    return cid === slug;
  });
  if (!project) notFound();
  return {
    project: project,
    projects: projectList,
  };
});

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { project } = await getProject(params.slug);
  const plainText = project.abstract.replaceAll(/<\/?[^>]+(>|$)/g, '').replaceAll('\\n+', ' ');
  return SEO({
    title: project.title,
    description: plainText.length > 100 ? plainText.substring(0, 99) + '...' : plainText,
    url: `/project/${params.slug}`,
    imageUrl: undefined,
  });
}

const InfoItem = ({ title, content }: { title: string; content: React.ReactNode }) => (
  <div>
    <h3 className={styles.information_section_title}>{title}</h3>
    <div>{content}</div>
  </div>
);

const renderSection = (title: string, content: string, className: string, isHTML = false) => {
  if (!content) return null;
  return (
    <>
      <h2 id={title.toLowerCase()} className={styles.section_name}>
        {title}
      </h2>
      <div className={className}>{isHTML ? parse(content) : content}</div>
    </>
  );
};

export default async function Page({ params }: { params: { slug: string } }) {
  const { project, projects } = await getProject(params.slug);

  // キーワードの部分一致またはタイトルの部分一致、ファーストオーサーが一致(同じ表記)の場合、関連プロジェクトとなる
  const filteredRelativeProject = projects.filter(
    (item) =>
      (project?.tags.some((tag) =>
        item.tags.some((itemTag) => tag.name !== '' && itemTag.name.toLowerCase().includes(tag.name.toLowerCase())),
      ) ||
        project?.title.toLowerCase().includes(item.title.toLowerCase()) ||
        (item.authors.length > 0 && project.authors.length > 0 && item.authors[0].name === project.authors[0].name)) &&
      project?.id !== item.id,
  );

  const japanTime = ConvertToJST(project!.date);
  const plainText = project!.abstract.replaceAll(/<\/?[^>]+(>|$)/g, '').replaceAll('\\n+', ' ');
  const jsonLd = getJsonLd(
    true,
    `${project!.title}`,
    plainText.length > 100 ? plainText.substring(0, 99) + '...' : plainText,
    `/project/${project.id}`,
  );

  // 時間を表示用にフォーマット
  const displayDate = DisplayDefaultDateString(japanTime);

  return (
    <>
      <div className={styles.main} id='project-detail'>
        {getJsonLdScript(jsonLd)}
        <section className={styles.project}>
          <div id='top' className={styles.project_card}>
            {project.type ? (
              <div className={styles.type}>
                <span>{project.type}</span>
              </div>
            ) : (
              <></>
            )}

            <h1 className={styles.title}>{project.title}</h1>
            <div className={styles.authors}>
              {project.authors.map((item, i) => (
                <span key={i} className={styles.author}>
                  {item.name}
                </span>
              ))}
            </div>
            {project.tags.length > 0 ? (
              <div className={styles.tags}>
                {project.tags.map((tag, j) => (
                  <span key={j}>
                    <FontAwesomeIcon icon={faTag} style={{ color: '#8a8a8a' }} />
                    {tag.name}
                  </span>
                ))}
              </div>
            ) : (
              <></>
            )}
            <div className={styles.links}>
              {project.url ? (
                <Link href={project.url} target='_blank' rel='noopener noreferrer' className={styles.url_box_link}>
                  <div className={styles.url_box}>
                    <FontAwesomeIcon
                      icon={faLink}
                      style={{
                        color: '#ffffff',
                        position: 'absolute',
                        width: '2rem',
                        fontSize: '2rem',
                        top: '.8rem',
                        left: '.8rem',
                        lineHeight: '1',
                      }}
                    />
                  </div>
                </Link>
              ) : (
                <></>
              )}
              {project.paperUrl ? (
                <Link href={project.paperUrl} target='_blank' rel='noopener noreferrer' className={styles.pdf_box_link}>
                  <div className={styles.pdf_box}>
                    <FontAwesomeIcon
                      icon={faFilePdf}
                      style={{
                        color: '#ffffff',
                        position: 'absolute',
                        width: '2rem',
                        fontSize: '2rem',
                        top: '.85rem',
                        left: '1rem',
                        lineHeight: '1',
                      }}
                    />
                  </div>
                </Link>
              ) : (
                <></>
              )}
            </div>
          </div>

          <div className={styles.main_script}>
            {project.thumbnailURL ? (
              <div className={styles.thumbnail_box}>
                <Link href={project.thumbnailURL} target='_blank' rel='noopener noreferrer'>
                  <img src={project.thumbnailURL} alt='thumbnail' />
                </Link>
              </div>
            ) : (
              <></>
            )}

            {renderSection('Abstract', project.abstract, styles.abstract)}
            {renderSection('Poster', project.posterHTML, `${styles.slide_box} ${styles.poster}`, true)}
            {renderSection(
              'Presentation',
              project.presentationHTML,
              `${styles.slide_box} ${styles.presentation}`,
              true,
            )}
            {renderSection('Document', project.documentHTML, `${styles.slide_box} ${styles.document}`, true)}
            {renderSection('Misc', project.freeHTML, styles.slide_box, true)}

            {project.additionalImageURL.length > 0 ? (
              <>
                <h2 id='images' className={styles.section_name}>
                  Images
                </h2>
                <div className={styles.images_box}>
                  {project.additionalImageURL.map((item, j) => (
                    <Link href={`${item.name}`} key={j} target='_blank' rel='noopener noreferrer'>
                      <div className={styles.image} key={j}>
                        <img src={item.name} key={j} alt={`img_${j}`} />
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <></>
            )}

            <h2 id='information' className={styles.section_name}>
              Information
            </h2>
            <div className={styles.book_card}>
              <h3 className={styles.information_section_title}>Book Title</h3>
              <div>{project.bookTitle}</div>
              <div className={styles.flex_box}>
                <InfoItem title='Volume' content={project.volume} />
                <InfoItem title='Number' content={project.number} />
              </div>
              <div className={styles.flex_box}>
                <InfoItem
                  title='Date'
                  content={<time dateTime={japanTime.toISOString()}>{String(displayDate)}</time>}
                />
                <InfoItem title='Pages' content={`${project.pageStart}-${project.pageEnd}`} />
              </div>
              <h3 className={styles.information_section_title}>
                Citation&nbsp;
                <CopyButton text={project.citation} />
              </h3>
              <div>{project.citation}</div>
            </div>
          </div>
          {/* 左サイドバー(目次) */}
          <ProjectLeftSidebar project={project} />
          {/* 右サイドバー(検索・関連プロジェクト) */}
          <ProjectRightSidebar filteredProjects={filteredRelativeProject} />
        </section>
      </div>
    </>
  );
}
