import firebase from "firebase/compat/app";
import "firebase/compat/auth";

import { clientConfig } from "./config";


firebase.initializeApp(clientConfig);
const auth = firebase.auth();


export {
    auth
}