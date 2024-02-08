/*eslint-disable*/
import React, { useState } from "react";

import styles from './header.module.css'
import {
    Collapse,
    NavbarToggler,
    Nav,
    NavItem,
    NavLink,
} from 'reactstrap';
import LogoMenu from "../../../assets/images/MenuLogo"
import { CloseMenu } from "../../../assets/images/CloseMenu"
import configValues from "helpers/config";
import LogoWTM from "assets/images/LogoWTM";

const NAV_ITEMS = [
    {
        name: "O que é o IWD?",
        ref: "#about",
    },
    /*{
        name: "Palestrantes",
        ref: "#speakers",
    },
    {
        name: "Patrocinadores",
        ref: "#sponsors",
    }*/
]

const HomeHeader = ({ isRoot = true }: { isRoot?: boolean }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);


    const generateRef = (ref: string) => {
        if (isRoot) return ref;

        return `/${ref}`;
    }

    return (
        <div className={styles.HeaderWrapper}>
            <header className={styles.Header}>
                {/*<img src="/wtm-uberlandia.png" width={224} />*/}

                <LogoWTM height={50} width={224} />

                <nav className={styles.HeaderNavContainer}>
                    <ul className={styles.HeaderNav}>
                        {NAV_ITEMS.map(({ ref, name }) => (
                            <li key={name} className={styles.HeaderNavItem}>
                                <a href={generateRef(ref)}>
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


                        {NAV_ITEMS.map(({ name, ref }, index) =>
                            <NavItem key={"nav-item-" + index} className={styles.HeaderNavItem} onClick={toggle}>
                                <NavLink href={generateRef(ref)}>
                                    {name}
                                </NavLink>
                            </NavItem>
                        )}
                    </Nav>
                </Collapse>

                <a target="_blank" href={configValues.eventLinkRegistrationUrl} className={styles.HeaderSubscribeButton}>
                    Inscreva-se
                </a>
            </header>

        </div>
    );
}

export default HomeHeader;