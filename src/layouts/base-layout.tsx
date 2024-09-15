import React, { ReactNode } from "react";
import Head from "next/head";
import Footer from "../components/footers/footer";
import configValues from "helpers/config";
import { Open_Sans } from "next/font/google";

const open = Open_Sans({ subsets: ["latin"], variable: "--font-open-sans" });

interface BaseLayout {
  children: ReactNode;
}

//id="base-layout" className="main-content"
const BaseLayout: React.FC<BaseLayout> = ({ children }) => {
  const favicon = `${configValues.organizedBy}/favicon.ico`;

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <meta name="functions-insert-dynamic-og"></meta>
        <link rel="icon" href={favicon} sizes="any" />
        <title>{configValues.name}</title>
      </Head>

      <main className={`${open.variable} font-sans absolute-position`}>
        {children}
        <Footer />
      </main>
    </>
  );
};

export default BaseLayout;
