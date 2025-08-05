import clsx from "clsx";
import configValues from "helpers/config";
import Image from "next/image";

import AndroidCheese from "@public/devfest-2025/android-cheese.png";
import Title from "@public/devfest-2025/devfest-logo.png";
import EventIcon from "@public/devfest-2025/event.svg";
import GDGLogo from "@public/devfest-2025/gdg-logo.png";
import SidePhoto from "@public/devfest-2025/hero-photo.png";
import LocationIcon from "@public/devfest-2025/location.svg";

import styles from "./Hero.module.css";
import ToolTip from "../ToolTip";

export const Hero = () => {
  return (
    <section className={styles.Hero} id="hero">
      <div className={styles.HeroSection}>
        <section className={styles.SectionSide}>
          <div className={styles.SidePhoto}>
            <Image
              alt="Imagem do DevFest triângulo de 2024"
              src={SidePhoto}
              priority={true}
              layout="responsive"
            />
          </div>
          <div className={styles.GDGLogo}>
            <Image
              alt="Logo da comunidade Google Developer Group"
              src={GDGLogo}
              loading="eager"
              width={125}
              height={125}
            />
          </div>
        </section>

        <section className={clsx(styles.SectionSide, styles.RightSide)}>
          <div className={styles.HeroLogo}>
            <Image
              alt="DevFest Triângulo 2025"
              src={Title}
              loading="eager"
              layout="responsive"
            />
            <ToolTip content="Em breve ⏳" position="bottom">
              {/* href={configValues.eventLinkRegistrationUrl} */}
              <a
                className={clsx(
                  styles.HeroButton,
                  styles.HeroSubscribeButton,
                  "hide-xsm",
                )}
              >
                Garantir minha vaga
              </a>
            </ToolTip>
            <div className={styles.Details}>
              <span>
                <Image
                  className={styles.Icon}
                  alt="Um círculo amarelo com ícone de calendário"
                  src={EventIcon}
                  loading="eager"
                  width={40}
                  height={40}
                />
                {configValues.formattedDate}
              </span>
              <span>
                <Image
                  className={styles.Icon}
                  alt="Um círculo amarelo com um marcador de lugar"
                  src={LocationIcon}
                  loading="eager"
                  width={40}
                  height={40}
                />
                Uberlândia - MG
              </span>
            </div>
          </div>
        </section>
      </div>

      <section className={styles.SectionOut}>
        <Image
          alt="DevFest Triângulo 2025"
          src={AndroidCheese}
          loading="eager"
          layout="responsive"
        />
      </section>
      <ToolTip content="Em breve ⏳" position="bottom">
        {/* href={configValues.eventLinkRegistrationUrl} */}
        <a
          className={clsx(
            styles.HeroButton,
            styles.HeroSubscribeButton,
            styles.HeroFooterButton,
            "show-xsm",
          )}
        >
          Garantir minha vaga
        </a>
      </ToolTip>
    </section>
  );
};
