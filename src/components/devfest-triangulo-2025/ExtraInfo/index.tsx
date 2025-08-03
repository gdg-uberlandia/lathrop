import configValues from "@helpers/config";

import styles from "./ExtraInfo.module.css";
import { clsx } from "clsx";

interface ExtraInfoProps {
  className?: string;
}

export const ExtraInfo = ({ className }: ExtraInfoProps) => {
  return (
    <section className={clsx(styles.ExtraInfo, className)}>
      <h1 className={styles.Title}>
        <span>Garanta a sua vaga</span> no DevFest
      </h1>
      <p>
        O maior DevFest da América Latina está chegando, e o melhor é que você
        pode fazer parte disso tudo. Aprendizado, conexão, experiências únicas e
        muita inovação te esperam.
      </p>

      <a className={styles.Link} href={configValues.eventLinkRegistrationUrl}>
        Garantir a minha vaga
      </a>
    </section>
  );
};
