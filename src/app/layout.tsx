import Header from "@/components/Header";
import "normalize.css";
// import { Inter } from 'next/font/google'
import "./globals.css";

// const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <title>SAI lab.</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1.0" />
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
      </head>
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
