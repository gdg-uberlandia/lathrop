/*eslint-disable*/
import React from "react";
import { useRouter } from 'next/router'
// reactstrap components
import { Nav, NavItem, NavLink, Container } from "reactstrap";
import styles from "../../styles/Footer.module.css";
import configValues from '../../helpers/config'
import LogoWTM from "assets/images/LogoWTM";
import Logo from "components/logo";
interface FooterProps { }

const Footer: React.FC<FooterProps> = ({ }) => {
  const router = useRouter()
  const generateRef = (ref: string) => {
    return (router.pathname != '/') ? `/${ref}` : ref;
  }

  return (
    <>
      <Container>
        <Nav className={styles.FooterContent}>
          <NavItem>
            <NavLink active href={generateRef("#")}>

              {Logo({ height: 120 })}
            </NavLink>
          </NavItem>
          {/*<NavItem>
            <NavLink href={generateRef("#speakers")}>Palestrantes</NavLink>
  </NavItem>*/}
          {/*<NavItem>
            <NavLink href={generateRef("#sponsors")}>Patrocinadores</NavLink>
          </NavItem>
          */}
          {(configValues.midiaKit) ? <NavItem>
            <NavLink target="_blank" href={configValues.midiaKit}>Mídia Kit</NavLink>
          </NavItem> : <></>}
          <NavItem className={styles.FooterRegister}>
            <NavLink target="_blank" href={configValues.eventLinkRegistrationUrl}>Se cadastrar</NavLink>
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
