import configValues from "@helpers/config";

import styles from "./ExtraInfo.module.css";
import ToolTip from "../ToolTip";

export const ExtraInfo = () => {
  return (
    <>
      <section className={styles.ExtraInfo}>
        <h1 className={styles.Title}>
          <span>Garanta a sua vaga</span> no DevFest
        </h1>
        <p>
          O maior DevFest da América Latina está chegando, e o melhor é que você
          pode fazer parte disso tudo. Aprendizado, conexão, experiências únicas
          e muita inovação te esperam.
        </p>
        {/*  href={configValues.eventLinkRegistrationUrl} */}
        <ToolTip content="Em breve ⏳" position="bottom">
          <a className={styles.Link}>Garantir a minha vaga</a>
        </ToolTip>
      </section>
    </>
  );
};
