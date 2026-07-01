import Image from "next/image";

import { LogoGDG } from "@/assets/images/LogoGDG";
import config from "@/helpers/config";
import DevFest2023 from "@/public/devfest-2025/devfest-2023.png";
import DevFest2022 from "@/public/devfest-2025/devfest-2022.png";
import DevFest2024 from "@/public/devfest-2025/devfest-2024.png";
import AndroidCheeseHalloween from "@/public/devfest-2026/android_queijo_.png";
import AndroidCheese from "@/public/devfest-2025/footer-image.png";
import LinkedinIcon from "@/public/devfest-2025/icons/linkedin-footer.svg";
import InstagramIcon from "@/public/devfest-2025/icons/instagram-footer.svg";
import MailIcon from "@/public/devfest-2025/icons/mail-footer.svg";

import styles from "./Footer.module.css";

export const Footer = () => {
  return (
    <section className={styles.Footer}>
      <Image
        alt="Um boneco amarelo estilizado, que lembra o logotipo do sistema operacional Android, acena com a mão esquerda levantada. O boneco tem um corpo cilíndrico, uma cabeça arredondada com duas pequenas antenas e duas pernas curtas e grossas. Há algumas manchas texturizadas em sua superfície, dando a impressão de ser feito de queijo. O boneco veste uma capa preta com o interior roxo e em seu peito há um símbolo de uma abóbara de halloween. O fundo da imagem é transparente, indicado pelo padrão quadriculado"
        src={AndroidCheeseHalloween}
        className={styles.Media}
      />

      <div className={styles.LastEventLogos}>
        <Image
          alt="Um boneco amarelo estilizado, que lembra o logotipo do sistema operacional Android, acena com a mão esquerda levantada. O boneco tem um corpo cilíndrico, uma cabeça arredondada com duas pequenas antenas e duas pernas curtas e grossas. Há algumas manchas texturizadas em sua superfície, dando a impressão de ser feito de um material rústico ou envelhecido. O fundo da imagem é transparente, indicado pelo padrão quadriculado"
          src={DevFest2022}
          height={100}
        />
        <Image
          alt="Ilustração de uma lanterna amarela com aparência rústica. No topo, um pequeno boneco amarelo, semelhante ao mascote do Android, acena no lugar do botão. A lanterna projeta um feixe de luz para baixo, revelando a silhueta branca e desgastada de um dinossauro Tiranossauro Rex. O fundo da imagem é transparente."
          src={DevFest2023}
          height={172}
        />
        <Image
          alt="Ilustração estilizada de um confronto entre um boneco amarelo, que lembra o mascote do Android, e a silhueta preta de um dinossauro T-Rex. O dinossauro avança com a boca aberta, enquanto o boneco amarelo está inclinado para trás, como se estivesse caindo ou em meio a uma luta. Ao fundo, um círculo branco com linhas curvas cinzas indica movimento. O fundo da imagem é transparente"
          src={DevFest2024}
          height={89}
        />
        <Image
          alt="Um boneco amarelo estilizado, que lembra o logotipo do sistema operacional Android, acena com a mão esquerda levantada. O boneco tem um corpo cilíndrico, uma cabeça arredondada com duas pequenas antenas e duas pernas curtas e grossas. Há algumas manchas texturizadas em sua superfície, dando a impressão de ser feito de um material rústico ou envelhecido. O fundo da imagem é transparente, indicado pelo padrão quadriculado"
          src={AndroidCheese}
          height={100}
        />
      </div>

      <footer>
        <LogoGDG height={18} width={224} inverted />
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
          <a href={config.socialMedia.linkedin} target="_blank">
            <Image
              alt="Logomarca do Linkedin"
              src={LinkedinIcon}
              width={24}
              height={24}
            />
          </a>
        </div>
        <a href={config.codeOfConduct} target="_blank" className={styles.Link}>
          Código de Conduta
        </a>
      </footer>
    </section>
  );
};
