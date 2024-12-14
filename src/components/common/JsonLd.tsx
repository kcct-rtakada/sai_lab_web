import { Article as JsonLDArticle, WebPage as JsonLDWebPage, WithContext } from 'schema-dts';
import { PageMetadata } from '../PageMetadata';

export function getJsonLd(
  isArticle: boolean,
  name: string | undefined,
  description: string | undefined,
  url: string | undefined = '',
): WithContext<JsonLDArticle | JsonLDWebPage> {
  const jsonLd: WithContext<JsonLDArticle | JsonLDWebPage> = {
    '@context': 'https://schema.org',
    '@type': isArticle ? 'Article' : 'WebPage',
    name: 'SAI (髙田研究室)',
    alternateName: '神戸高専 髙田研究室',
    headline: name ? `${name} - SAI` : 'SAI (髙田研究室)',
    description: description ?? '神戸高専 髙田研究室 (SAI)',
    mainEntityOfPage: `https://sai.ac${url}`,
    url: 'https://sai.ac',

    publisher: {
      '@type': 'Organization',
      name: 'SAI (神戸高専 髙田研究室)',
      logo: {
        '@type': 'ImageObject',
        url: `https://sai.ac/colorful_icon.png`,
      },
    },
  };

  return jsonLd;
}

export function getJsonLdScript(jsonLd: WithContext<JsonLDArticle | JsonLDWebPage>) {
  return (
    <script key='json-ld' type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
  );
}

export function generateWebsiteStructure(pageMeta: PageMetadata) {
  return (
    <script
      key='json-ld'
      type='application/ld+json'
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(getJsonLd(pageMeta.isArticle, pageMeta.title, pageMeta.description, pageMeta.url)),
      }}
    />
  );
}
