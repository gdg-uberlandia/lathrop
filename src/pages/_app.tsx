import "../styles/globals.css";
import type { AppContext, AppInitialProps } from "next/app";

import React, { ReactNode } from "react";
import { NextComponentType } from "next";

import GoogleAnalytics from "../components/google-analytics";
import { AppLayoutProps } from "../../types";
import { AuthProvider } from "context/AuthContext";

const MyApp: NextComponentType<AppContext, AppInitialProps, AppLayoutProps> = (
  props: AppLayoutProps,
) => {
  const { Component, pageProps } = props;

  const Layout =
    Component.layout ||
    (({ children }: { children: ReactNode }) => <>{children}</>);

  return (
    <AuthProvider>
      <GoogleAnalytics />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  );
};

export default MyApp;
