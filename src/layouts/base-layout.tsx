import React, { ReactNode } from "react";
import Head from 'next/head'
// reactstrap components
import { Container } from "reactstrap";
import Footer from '../components/footers/footer'
import NavbarHome from '../components/navbar/home-navbar'
import configValues from "helpers/config";

interface BaseLayout {
    children: ReactNode;
}
//id="base-layout" className="main-content"
const BaseLayout: React.FC<BaseLayout> = ({ children }) => {

    return (
        <>
            <Head>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, shrink-to-fit=no"
                />
                <meta name="functions-insert-dynamic-og"></meta>
                <title>{configValues.name}</title>
            </Head>
            <main className="absolute-position">
                <NavbarHome />
                <div >
                    {children}
                </div>
                < Footer />
            </main>
        </>
    );
}



export default BaseLayout;
