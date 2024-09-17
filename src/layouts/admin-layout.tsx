import React, { ReactNode } from "react";
import { useRouter } from "next/router";
// reactstrap components
import { Container } from "reactstrap";
// core components
// import Navbar from "../components/navbar";
// import Footer from "../components/footer";
// import Sidebar from "../components/sidebar";


interface AdminLayout {
    children: ReactNode;
}

const AdminLayout: React.FC<AdminLayout> = function ({ children }) {
    let mainContentRef = React.createRef();

    return (
        <>
            {children}
        </>
    );
}



export default AdminLayout;
