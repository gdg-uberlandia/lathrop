import { clsx } from "clsx";
import { HeaderButtonGroup } from "components/devfest-triangulo-2025/Header/HeaderButtonGroup";
import { useEffect, useState } from "react";
import { Collapse, Nav, NavbarToggler, NavItem, NavLink } from "reactstrap";

import { CloseMenu } from "@assets/images/CloseMenu";
import { LogoGDG } from "@assets/images/LogoGDG";
import LogoMenu from "@assets/images/LogoMenu";

import styles from "./Header.module.css";
import Link from "next/link";

const NAV_ITEMS = [
  {
    name: "O que é o Devfest?",
    ref: "#about",
  },
  // {
  //   name: "Palestrantes",
  //   ref: "#speakers",
  //   classes: "hide-md",
  // },
  // {
  //   name: "Agenda",
  //   ref: "#schedule",
  //   classes: "hide-md",
  // },
  {
    name: "Patrocinadores",
    ref: "#sponsors",
    classes: "hide-sm",
  },
  {
    name: "Local",
    ref: "#place",
    classes: "",
  },
];

export const Header = ({ isRoot = true }: { isRoot?: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const toggle = () => setIsOpen(!isOpen);
  const generateRef = (ref: string) => (isRoot ? ref : `/${ref}`);

  // useEffect(() => {
  //   const handleScroll = () => {
  //     const currentScrollY = window.scrollY;
  //     if (currentScrollY < lastScrollY) {
  //       setIsVisible(true);
  //     } else if (currentScrollY > lastScrollY) {
  //       setIsVisible(false);
  //     }

  //     setLastScrollY(currentScrollY);
  //   };

  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, [lastScrollY]);

  return (
    <header className={clsx(styles.Header, !isVisible && styles.HeaderHidden)}>
      <LogoGDG height={18} width={224} inverted />

      <nav className={styles.HeaderNavContainer}>
        <ul className={styles.HeaderNav}>
          {NAV_ITEMS.map(({ ref, name, classes }) => (
            <li
              key={name}
              className={clsx(styles.HeaderNavItem, classes ? classes : "")}
            >
              <Link href={generateRef(ref)}>{name}</Link>
            </li>
          ))}
        </ul>
        <HeaderButtonGroup hideSponsorship />
      </nav>

      <NavbarToggler className={styles.toggler_btn} onClick={toggle}>
        <LogoMenu color="#f0f0f0" width={24} height={24} />
      </NavbarToggler>

      <Collapse
        isOpen
        navbar
        className={[
          styles.Collapse,
          isOpen && styles.HeaderNavContainerOpened,
        ].join(" ")}
      >
        <div className={styles.CollapseHeader}>
          <LogoGDG height={18} width={224} inverted />
          <NavbarToggler className={styles.toggler_btn} onClick={toggle}>
            <CloseMenu color="#f0f0f0" width={24} height={24} />
          </NavbarToggler>
        </div>

        <div style={{ display: "flex", padding: "1rem 1.5rem" }}>
          <HeaderButtonGroup />
        </div>

        <Nav navbar className={styles.HeaderNavBar}>
          {NAV_ITEMS.map(({ name, ref }, index) => (
            <NavItem
              key={"nav-item-" + index}
              className={styles.HeaderNavItem}
              onClick={toggle}
            >
              <NavLink href={generateRef(ref)}>
                {name}
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <mask
                    id="mask0_8503_12621"
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="24"
                    height="24"
                  >
                    <rect width="24" height="24" fill="#D9D9D9" />
                  </mask>
                  <g mask="url(#mask0_8503_12621)">
                    <path
                      d="M16.175 13H4V11H16.175L10.575 5.4L12 4L20 12L12 20L10.575 18.6L16.175 13Z"
                      fill="#F0F0F0"
                    />
                  </g>
                </svg>
              </NavLink>
            </NavItem>
          ))}
        </Nav>
      </Collapse>

      <div className={styles.ButtonGroupMobileOnly}>
        <HeaderButtonGroup />
      </div>
    </header>
  );
};
