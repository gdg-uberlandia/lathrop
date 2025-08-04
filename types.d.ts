import type {
  NextComponentType,
  NextPageContext,
  NextLayoutComponentType,
} from "next";
import type { AppProps } from "next/app";
import { ReactNode } from "react";

export type NextLayoutComponentType<P = {}> = NextComponentType<
  NextPageContext,
  any,
  P
> & {
  layout?: ReactNode;
};

type NextLayoutPage<P = {}, IP = P> = NextComponentType<
  NextPageContext,
  IP,
  P
> & {
  layout: ReactNode;
};

export type AppLayoutProps<P = {}> = AppProps & {
  Component: NextLayoutComponentType;
};
