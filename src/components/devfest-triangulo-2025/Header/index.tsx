import { clsx } from "clsx";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { CloseMenu } from "@/assets/images/CloseMenu";
import { LogoGDG } from "@/assets/images/LogoGDG";
import LogoMenu from "@/assets/images/LogoMenu";

const NAV_ITEMS = [
  { name: "O que é o Devfest?", ref: "#about" },
  { name: "Patrocinadores", ref: "#sponsors" },
];

export const Header = ({ isRoot = true }: { isRoot?: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  const generateRef = (ref: string) => (isRoot ? ref : `/${ref}`);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const heroHasPassed = currentScrollY > window.innerHeight;

      setIsFixed(heroHasPassed);
      setIsVisible(
        !heroHasPassed || currentScrollY < lastScrollY.current || isOpen,
      );
      lastScrollY.current = currentScrollY;
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  return (
    <div
      className={clsx(
        "z-[1000] w-full bg-black transition-transform duration-300 motion-reduce:transition-none",
        isFixed ? "fixed inset-x-0 top-0" : "relative",
        isFixed && !isVisible && "-translate-y-full",
      )}
    >
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          aria-label="Ir para a página inicial"
          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-devBlue-dark"
        >
          <LogoGDG height={18} width={224} inverted />
        </Link>

        <nav
          className="hidden items-center md:flex"
          aria-label="Navegação principal"
        >
          <ul className="m-0 flex list-none items-center p-0">
            {NAV_ITEMS.map(({ ref, name }) => (
              <li key={name}>
                <Link
                  href={generateRef(ref)}
                  className="inline-flex cursor-pointer px-4 py-3 font-medium leading-none text-white transition-colors hover:text-devBlue-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-devBlue-dark motion-reduce:transition-none"
                >
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-2 text-devWhite-ice hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-devBlue-dark md:hidden"
          aria-label="Abrir menu"
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
        >
          <LogoMenu color="#f0f0f0" width={24} height={24} />
        </button>
      </header>

      <div
        id="mobile-navigation"
        className={clsx(
          "fixed inset-0 z-[1100] flex flex-col bg-black transition-transform duration-300 md:hidden motion-reduce:transition-none",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between px-6 py-5">
          <Link
            href="/"
            onClick={closeMenu}
            aria-label="Ir para a página inicial"
            tabIndex={isOpen ? 0 : -1}
          >
            <LogoGDG height={18} width={224} inverted />
          </Link>
          <button
            type="button"
            onClick={closeMenu}
            className="inline-flex cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-2 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-devBlue-dark"
            aria-label="Fechar menu"
            tabIndex={isOpen ? 0 : -1}
          >
            <CloseMenu color="#f0f0f0" width={24} height={24} />
          </button>
        </div>

        <nav className="px-6 py-8" aria-label="Navegação mobile">
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {NAV_ITEMS.map(({ name, ref }) => (
              <li key={name}>
                <Link
                  href={generateRef(ref)}
                  onClick={closeMenu}
                  className="flex items-center justify-between border-b border-white/10 px-3 py-4 text-lg font-medium text-white transition-colors hover:text-devBlue-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-devBlue-dark"
                  tabIndex={isOpen ? 0 : -1}
                >
                  {name}
                  <span aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};
