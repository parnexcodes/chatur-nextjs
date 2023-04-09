import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta
            name="description"
            content="chatur - generate human-like text"
          />
          <meta property="og:site_name" content="chatur.us" />
          <meta
            property="og:description"
            content="Generate Human text using chatGPT."
          />
          <meta property="og:title" content="chatur - generate human-like text" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="chatur - generate human-like text" />
          <meta
            name="twitter:description"
            content="chatur - generate human-like text"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
