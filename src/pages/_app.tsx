import '../styles/globals.css'
import type { AppContext, AppInitialProps, AppProps } from 'next/app'

import React, { ReactNode } from "react";
import { NextComponentType, NextPageContext } from 'next';
import { Analytics } from '@vercel/analytics/react';


import { AppLayoutProps } from '../../types';

const MyApp: NextComponentType<AppContext, AppInitialProps, AppLayoutProps> = (
  props: AppLayoutProps,
) => {
  const { Component, pageProps } = props;

  const Layout = Component.layout || (({ children }: { children: ReactNode }) => <>{children}</>);

  return (<React.Fragment>
    <Layout>
      <Component {...pageProps} />
      <Analytics />
    </Layout>
  </React.Fragment>);


};

export default MyApp;
