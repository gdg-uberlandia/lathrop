import styles from "./ExtraInfo.module.css";

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

        <a className={styles.Link} href="">
          Garantir a mina vaga
        </a>
      </section>
    </>
  );
};
