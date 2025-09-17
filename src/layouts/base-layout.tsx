import configValues from "helpers/config";
import Head from "next/head";
import React, { ReactNode } from "react";

import { Footer } from "../components/devfest-triangulo-2025/Footer";

interface BaseLayout {
  children: ReactNode;
}

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
      <main className="absolute-position">
        {children}
        <Footer />
      </main>
    </>
  );
};

export default BaseLayout;
