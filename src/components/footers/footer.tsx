/*eslint-disable*/
import React from "react";
import LogoGDG from "../../assets/images/LogoGDG";
// reactstrap components
import { Nav, NavItem, NavLink } from "reactstrap";
import styles from "../../styles/Footer.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faSquareFacebook, faInstagram, faGithub } from '@fortawesome/free-brands-svg-icons';
interface FooterProps {}

const Footer: React.FC<FooterProps> = ({}) => {
  return (
    <>
      <Nav className={styles.footer_content}>
        <NavItem>
          <NavLink active href="#">
            <LogoGDG />
          </NavLink>
        </NavItem>
        {/*
          <NavItem>
            <NavLink href="#">Palestrantes</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#">Agenda</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#">Patrocinadores</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#">Organizadores</NavLink>
          </NavItem>
          <NavItem className={styles.footer_register}>
            <NavLink href="#">Se cadastrar</NavLink>
          </NavItem>*/}
        <NavItem>
          <NavLink className={styles.footer_content_social} href="https://www.facebook.com/gdg.uberlandia/">
            <FontAwesomeIcon className={styles.footer_content_social_icon} icon={faSquareFacebook} />Facebook</NavLink>
        </NavItem>
        <NavItem>
          <NavLink className={styles.footer_content_social} href="https://www.instagram.com/gdguberlandia/">
            <FontAwesomeIcon className={styles.footer_content_social_icon} icon={faInstagram} />Instagram</NavLink>
        </NavItem>
        <NavItem>
          <NavLink className={styles.footer_content_social} href="https://github.com/gdg-uberlandia/">
            <FontAwesomeIcon className={styles.footer_content_social_icon} icon={faGithub} /> Github</NavLink>
        </NavItem>
      </Nav>
    </>
  );
};

export default Footer;
