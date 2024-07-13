"use client";
import Header from "@/components/common/Header";
import "destyle.css";
import "./globals.css";
import Footer from "@/components/common/Footer";
import { GoogleAnalytics } from "@next/third-parties/google";
import { useRef } from "react";
import ScrollToTopButton from "@/components/common/ScrollToTopButton";
import NextTopLoader from "nextjs-toploader";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const containerRef = useRef(null);
  return (
    <html lang="ja">
      <head prefix="og: http://ogp.me/ns#">
        <meta name="theme-color" content="#fafafa" />
        <GoogleAnalytics gaId="G-EKY6C0HPHX" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <link rel="alternate" type="application/atom+xml" href="https://sai.ac/news/feed.xml" />
        <link rel="alternate" type="application/atom+xml" href="https://sai.ac/project/feed.xml" />
        {/* アイコンを設定 */}
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
        <meta name="msapplication-TileColor" content="#fafafa" />
        <link
          rel="apple-touch-icon"
          sizes="57x57"
          href="/apple-touch-icon-57x57.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="60x60"
          href="/apple-touch-icon-60x60.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="72x72"
          href="/apple-touch-icon-72x72.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href="/apple-touch-icon-76x76.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="114x114"
          href="/apple-touch-icon-114x114.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href="/apple-touch-icon-120x120.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href="/apple-touch-icon-144x144.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/apple-touch-icon-152x152.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon-180x180.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="36x36"
          href="/android-chrome-36x36.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="48x48"
          href="/android-chrome-48x48.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="72x72"
          href="/android-chrome-72x72.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="/android-chrome-96x96.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="128x128"
          href="/android-chrome-128x128.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="144x144"
          href="/android-chrome-144x144.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="152x152"
          href="/android-chrome-152x152.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/android-chrome-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="256x256"
          href="/android-chrome-256x256.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="384x384"
          href="/android-chrome-384x384.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="512x512"
          href="/android-chrome-512x512.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="36x36"
          href="/icon-36x36.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="48x48"
          href="/icon-48x48.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="72x72"
          href="/icon-72x72.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="/icon-96x96.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="128x128"
          href="/icon-128x128.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="144x144"
          href="/icon-144x144.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="152x152"
          href="/icon-152x152.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="160x160"
          href="/icon-160x160.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/icon-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="196x196"
          href="/icon-196x196.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="256x256"
          href="/icon-256x256.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="384x384"
          href="/icon-384x384.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="512x512"
          href="/icon-512x512.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/icon-16x16.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="24x24"
          href="/icon-24x24.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/icon-32x32.png"
        />
      </head>
      <body>
        {/* ページ読み込み時に上部で表示する */}
        <NextTopLoader
          color="#6973f8"
          template='<div style="height: .15rem;" class="bar" role="bar"><div class="peg"></div></div> 
                    <div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
          shadow={false}
          showSpinner={false}
          zIndex={20000}
        />
        <Header />
        <main ref={containerRef} id="top_main">
          {children}
          {/* フッターはスクロール対象 */}
          <Footer />
          <ScrollToTopButton containerRef={containerRef} />
        </main>
        <SpeedInsights />
        <div itemScope itemType="https://schema.org/WebSite">
          <meta itemProp="url" content="https://sai.ac/"/>
          <meta itemProp="name" content="SAI (髙田研究室)"/>
          <meta itemProp="alternateName" content="神戸高専 髙田研究室"/>
        </div>
      </body>
    </html>
  );
}
