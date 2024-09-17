import React from 'react';
import AdminLayout from '../../layouts/admin-layout';
import { Col, Row, Container } from 'reactstrap';


import { getTokens } from "next-firebase-auth-edge";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { clientConfig, serverConfig } from "../../utils/firebase/config";

interface HomePageProps { };


const HomePage = async ({ }: HomePageProps) => {
    const tokens = await getTokens(cookies(), {
        apiKey: clientConfig.apiKey,
        cookieName: serverConfig.cookieName,
        cookieSignatureKeys: serverConfig.cookieSignatureKeys,
        serviceAccount: serverConfig.serviceAccount,
    });

    if (!tokens) {
        notFound();
    }

    return (
        <>
            <Container>
                <p>
                    Only <strong>{tokens?.decodedToken.email}</strong> holds the magic key to this kingdom!
                </p>

            </Container>
        </>
    )
}
export async function getServerSideProps() {
    try {
        return {
            props: {}
        }
    } catch (error) {
        console.error(error)
        return ({ props: {} });
    }

}

HomePage.layout = AdminLayout;



export default HomePage
