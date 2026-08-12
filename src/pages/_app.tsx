import "../styles/globals.css";
import type { AppContext, AppInitialProps } from "next/app";

import React, { ReactNode } from "react";
import { NextComponentType } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Head from "next/head";

import GoogleAnalytics from "../components/google-analytics";
import { AppLayoutProps } from "../../types";

const AuthProvider = dynamic(() =>
  import("@/context/AuthContext").then((module) => module.AuthProvider),
);
const AdminQueryProvider = dynamic(() =>
  import("@/lib/admin-query").then((module) => module.AdminQueryProvider),
);
const AdminLayout = dynamic(() => import("@/layouts/admin-layout"));

const bootstrapPages = new Set(["/campaigns", "/sponsors"]);

const MyApp: NextComponentType<AppContext, AppInitialProps, AppLayoutProps> = (
  props: AppLayoutProps,
) => {
  const { Component, pageProps } = props;
  const router = useRouter();

  const Layout = router.pathname.startsWith("/admin")
    ? AdminLayout
    : Component.layout ||
      (({ children }: { children: ReactNode }) => <>{children}</>);

  const page = (
    <>
      {bootstrapPages.has(router.pathname) && (
        <Head>
          <link
            key="bootstrap-css"
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css"
          />
        </Head>
      )}
      <GoogleAnalytics />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );

  const requiresAuth =
    router.pathname === "/login" ||
    router.pathname === "/unauthorized" ||
    router.pathname.startsWith("/admin");

  return requiresAuth ? (
    <AuthProvider>
      <AdminQueryProvider>{page}</AdminQueryProvider>
    </AuthProvider>
  ) : (
    page
  );
};

export default MyApp;
