import Image from "next/image";

import { LogoGDG } from "@assets/images/LogoGDG";
import config from "@helpers/config";
import DevFest2022 from "@public/devfest-2025/devfest-2022.png";
import DevFest2023 from "@public/devfest-2025/devfest-2023.png";
import DevFest2024 from "@public/devfest-2025/devfest-2024.png";
import AndroidCheese from "@public/devfest-2025/footer-image.png";
import InstagramIcon from "@public/devfest-2025/icons/instagram-footer.svg";
import MailIcon from "@public/devfest-2025/icons/mail-footer.svg";

import styles from "./Footer.module.css";

export const Footer = () => {
  return (
    <section className={styles.Footer}>
      <Image alt="" src={AndroidCheese} className={styles.Media} />
      <div className={styles.LastEventLogos}>
        <Image alt="" src={DevFest2022} />
        <Image alt="" src={DevFest2023} />
        <Image alt="" src={DevFest2024} />
      </div>
      <footer className={styles.Links}>
        <LogoGDG height={18} width={224} inverted />{" "}
        <a href={config.codeOfConduct} target="_blank">
          Código de Conduta
        </a>
        <div className={styles.SocialIcons}>
          <a href={`mailto:${config.email}`} target="_blank">
            <Image
              alt="Ícone de um envelope fechado"
              src={MailIcon}
              width={24}
              height={24}
            />
          </a>
          <a href={config.socialMedia.instagram} target="_blank">
            <Image
              alt="Logomarca do Instagram"
              src={InstagramIcon}
              width={24}
              height={24}
            />
          </a>
        </div>
      </footer>
    </section>
  );
};
