import "../styles/globals.css";
import type { AppContext, AppInitialProps } from "next/app";

import React, { ReactNode } from "react";
import { NextComponentType } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

import GoogleAnalytics from "../components/google-analytics";
import { AppLayoutProps } from "../../types";

const AuthProvider = dynamic(() =>
  import("context/AuthContext").then((module) => module.AuthProvider),
);

const MyApp: NextComponentType<AppContext, AppInitialProps, AppLayoutProps> = (
  props: AppLayoutProps,
) => {
  const { Component, pageProps } = props;
  const router = useRouter();

  const Layout =
    Component.layout ||
    (({ children }: { children: ReactNode }) => <>{children}</>);

  const page = (
    <>
      <GoogleAnalytics />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );

  const requiresAuth =
    router.pathname === "/login" || router.pathname.startsWith("/admin");

  return requiresAuth ? <AuthProvider>{page}</AuthProvider> : page;
};

export default MyApp;
