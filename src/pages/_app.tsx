import '../styles/globals.css'
import type { AppContext, AppInitialProps, AppProps } from 'next/app'

import React, { ReactNode } from "react";
import { NextComponentType, NextPageContext } from 'next';


import { AppLayoutProps } from '../../types';
import ErrorBoundary from '../components/error-boundary';

const MyApp: NextComponentType<AppContext, AppInitialProps, AppLayoutProps> = (
  props: AppLayoutProps,
) => {
  const { Component, pageProps } = props;

  const Layout = Component.layout || (({ children }: { children: ReactNode }) => <>{children}</>);

  return (<React.Fragment>

    <Layout>
      <ErrorBoundary>
        <Component {...pageProps} />
      </ErrorBoundary>
    </Layout>
  </React.Fragment>);


};

export default MyApp;
