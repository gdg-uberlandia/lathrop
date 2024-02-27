/*eslint-disable*/
import React from "react";
import { useRouter } from 'next/router'
// reactstrap components
import { Nav, NavItem, NavLink, Container } from "reactstrap";
import styles from "./Footer.module.css";
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
            <NavLink aria-label="Ir para o início" active href={generateRef("#")}>

              {Logo({ width: 300 })}
            </NavLink>
          </NavItem>
          {/*<NavItem>
            <NavLink href={generateRef("#speakers")}>Palestrantes</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href={generateRef("#sponsors")}>Patrocinadores</NavLink>
          </NavItem>
          
          {/*(configValues.midiaKit) ? <NavItem>
            <NavLink target="_blank" href="https://docs.google.com/document/d/16duFqXn39gR0rs2l-YOZ2UbDEUnG96YMD5mVvQZI_MQ/edit?usp=sharing">Código de conduta</NavLink>
</NavItem> : <></>*/}
          {(configValues.midiaKit) ? <NavItem>
            <NavLink target="_blank" style={{ color: 'var(--soft-green)' }} href={configValues.midiaKit}>Seja um patrocinador</NavLink>
          </NavItem> : <></>}

          <NavItem className={styles.FooterRegister}>
            <NavLink target="_blank" href={configValues.eventLinkRegistrationUrl}>Inscreva-se</NavLink>
          </NavItem>
          {/*<NavItem>
            <NavLink href="#">Organizadores</NavLink>
  </NavItem>
          */}
        </Nav>
      </Container>
    </>
  );
};

export default Footer;
