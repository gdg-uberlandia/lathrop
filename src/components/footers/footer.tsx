/*eslint-disable*/
import React from "react";
import { useRouter } from 'next/router'
import LogoGDG from "../../assets/images/LogoGDG";
// reactstrap components
import { Nav, NavItem, NavLink, Container } from "reactstrap";
import styles from "../../styles/Footer.module.css";
import configValues from '../../helpers/config'
interface FooterProps { }

const Footer: React.FC<FooterProps> = ({ }) => {
  const router = useRouter()
  const generateRef = (ref: string) => {
    return (router.pathname != '/') ? `/${ref}` : ref;
  }

  return (
    <>
      <Container fluid>
        <Nav className={styles.FooterContent}>
          <NavItem>
            <NavLink active href={generateRef("#")}>
              <LogoGDG />
            </NavLink>
          </NavItem>
          {/*<NavItem>
            <NavLink href={generateRef("#speakers")}>Palestrantes</NavLink>
  </NavItem>*/}
          <NavItem>
            <NavLink href={generateRef("#sponsors")}>Patrocinadores</NavLink>
          </NavItem>
          <NavItem className={styles.FooterRegister}>
            <NavLink href={configValues.eventLinkRegistrationUrl}>Se cadastrar</NavLink>
          </NavItem>
          {/*<NavItem>
            <NavLink href="#">Agenda</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#">Organizadores</NavLink>
  </NavItem>
          */}
        </Nav>
      </Container>
    </>
  );
};

export default Footer;
