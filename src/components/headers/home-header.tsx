/*eslint-disable*/
import React, { useState } from "react";

import styles from './header.module.css'
import LogoGDG from "assets/images/LogoGDG";
import {
    Collapse,
    NavbarToggler,
    Nav,
    NavItem,
    NavLink,
  } from 'reactstrap';
import LogoMenu from "../../assets/images/MenuLogo"
import { CloseMenu } from "../../assets/images/CloseMenu"

const NAV_ITEMS = [
    {
        name: "O que é o Devfest?",
        ref: "#about",
    },
    {
        name: "Palestrantes",
        ref: "#speakers",
    },
    {
        name: "Patrocinadores",
        ref: "#sponsors",
    }
]

const HomeHeader = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);

    return (
        <header className={styles.Header}>
            <LogoGDG height={20} width={224} />

            <nav className={styles.HeaderNavContainer}>
                <ul className={styles.HeaderNav}>
                    {NAV_ITEMS.map(({ ref, name }) => (
                        <li key={name} className={styles.HeaderNavItem}>
                            <a href={ref}>
                                {name}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>

            <NavbarToggler className={styles.toggler_btn} onClick={toggle}>
                <LogoMenu color="rgba(0,0,0,.55)" />
            </NavbarToggler>

            <Collapse isOpen navbar className={[styles.Collapse, isOpen && styles.HeaderNavContainerOpened].join(' ')}>
                <NavbarToggler className={styles.toggler_btn} onClick={toggle}>
                    <CloseMenu />
                </NavbarToggler>

                <Nav navbar>
                    {NAV_ITEMS.map(({name, ref}, index) =>
                        <NavItem key={"nav-item-" + index} className={styles.HeaderNavItem} onClick={toggle}>
                            <NavLink href={ref}>
                                {name}
                            </NavLink>
                        </NavItem>
                    )}
                </Nav>
            </Collapse>

            <a className={styles.HeaderSubscribeButton}>
               Inscreva-se 
            </a>
        </header>
    );
}

export default HomeHeader;