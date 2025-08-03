import { SponsorLevel } from "models/sponsor-level";

import configValues from "@helpers/config";

import styles from "./Sponsors.module.css";

interface StringMap {
  [key: string]: any;
}

const SPONSORS_LIST: string[] = [
  "superior",
  "diamond",
  "golden",
  "silver",
  "bronze",
  "iron",
  "ruby",
  "ametista",
  "support",
  "staff",
];

interface SponsorsSectionProps {
  sponsors: { [key: string]: SponsorLevel } | [];
}

export const Sponsors = ({ sponsors }: SponsorsSectionProps) => {
  return (
    <>
      <section className={styles.Sponsors}>
        <h1 className={styles.Title}>
          <span>Marcas</span> que acreditam no poder da tecnologia e da
          comunidade têm lugar garantido
        </h1>
        <p>
          <span>Seja um patrocinador</span> do melhor festival de tecnologia da
          América Latina e conecte sua marca a milhares de mentes curiosas,
          criativas e apaixonadas por inovação. No DevFest, sua empresa não só
          ganha visibilidade, ela se torna parte ativa da transformação do
          ecossistema tech!
        </p>

        <a className={styles.Link} href={configValues.eventLinkSponsorshipUrl}>
          Quero apoiar o DevFest
        </a>
      </section>
    </>
  );
};
