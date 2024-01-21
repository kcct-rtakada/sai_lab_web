import * as React from "react";
import Head from "next/head";

import { usePathname } from "next/navigation";

export default function SEO({
  pageTitle,
  pageDescription,
}: {
  pageTitle: string;
  pageDescription: string;
}) {
  const baseTitle = "SAI lab.";
  const baseDescription = "SAI lab. 高田研究室へようこそ";

  const title = pageTitle != null ? `${pageTitle} - ${baseTitle}` : baseTitle;

  const description =
    pageDescription != null ? pageDescription : baseDescription;

  const pathname = usePathname();
  const fqdn = "https://sai.ac";

  const path = fqdn + pathname;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1.0" />
        <meta name="description" content={description} />
        <meta property="og:url" content={path} />
        <meta property="og:title" content={title} />
        <meta property="og:site_name" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />

        <link rel="canonical" href={path} />
        <link rel="icon" href="/favicon.ico" id="favicon" />
        <link
          rel="shortcut icon"
          type="image/vnd.microsoft.icon"
          href="/favicon.ico"
        />
        <link rel="icon" type="image/vnd.microsoft.icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon-180x180.png"
        />
        <meta
          name="msapplication-square70x70logo"
          content="/site-tile-70x70.png"
        />
        <meta
          name="msapplication-square150x150logo"
          content="/site-tile-150x150.png"
        />
        <meta
          name="msapplication-wide310x150logo"
          content="/site-tile-310x150.png"
        />
        <meta
          name="msapplication-square310x310logo"
          content="/site-tile-310x310.png"
        />
      </Head>
    </>
  );
}
