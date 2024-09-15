import React from "react";
import AdminLayout from "../../layouts/admin-layout";
import { Container } from "reactstrap";

interface LoginPageProps {}

const LoginPage = ({}: LoginPageProps) => {
  return (
    <>
      <Container></Container>
    </>
  );
};
export async function getServerSideProps() {
  try {
    return {
      props: {},
    };
  } catch (error) {
    console.error(error);
    return { props: {} };
  }
}

LoginPage.layout = AdminLayout;

export default LoginPage;
