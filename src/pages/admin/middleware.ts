import { NextRequest, NextResponse } from "next/server";
import { clientConfig, serverConfig } from "../../utils/firebase/config";
import { authMiddleware, redirectToHome, redirectToLogin } from "next-firebase-auth-edge";

const PUBLIC_PATHS = ['/login'];


export async function middleware(request: NextRequest) {
    return authMiddleware(request, {
        loginPath: "/api/login",
        logoutPath: "/api/logout",
        apiKey: clientConfig.apiKey,
        cookieName: serverConfig.cookieName,
        cookieSignatureKeys: serverConfig.cookieSignatureKeys,
        cookieSerializeOptions: serverConfig.cookieSerializeOptions,
        serviceAccount: serverConfig.serviceAccount,
        handleValidToken: async ({ token, decodedToken }, headers) => {
            console.log(' ehhhhhh aqui')
            if (PUBLIC_PATHS.includes(request.nextUrl.pathname)) {
                return redirectToHome(request);
            }

            return NextResponse.next({
                request: {
                    headers
                }
            });
        },
        handleInvalidToken: async (reason) => {
            console.info('Missing or malformed credentials', { reason });

            return redirectToLogin(request, {
                path: '/login',
                publicPaths: PUBLIC_PATHS
            });
        },
        handleError: async (error) => {
            console.error('Unhandled authentication error', { error });

            return redirectToLogin(request, {
                path: '/login',
                publicPaths: PUBLIC_PATHS
            });
        }
    });
}

export const config = {
    matcher: [
        "/",
        "/((?!_next|api|.*\\.).*)",
        "/api/login",
        "/api/logout",
    ],
};