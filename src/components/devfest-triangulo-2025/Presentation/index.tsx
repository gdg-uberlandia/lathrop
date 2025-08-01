import Image from "next/image";

import BusinesCenter from "@public/devfest-2025/icons/business_center.svg";
import ChildCare from "@public/devfest-2025/icons/child_care.svg";
import Handshake from "@public/devfest-2025/icons/handshake.svg";
import Mic from "@public/devfest-2025/icons/mic.svg";
import Trophy from "@public/devfest-2025/icons/trophy.svg";

import styles from "./Presentation.module.css";

type Tag = { icon: string; text: string };

const tags: Tag[] = [
  { icon: Mic, text: "Palestras inspiradoras" },
  { icon: BusinesCenter, text: "Estandes de empresas" },
  { icon: Trophy, text: "Dinâmicas interativas" },
  { icon: Handshake, text: "Networking sem fronteiras" },
  { icon: ChildCare, text: "Área kids" },
];

export const Presentation = () => {
  return (
    <section className={styles.Presentation}>
      <h1 className={styles.Title}>
        Onde mentes curiosas se conectam e{" "}
        <span>o futuro é programado em comunidade</span>
      </h1>
      <p>
        O DevFest é um super festival de tecnologia feito por e para a
        comunidade, com o apoio do Google Developer Groups (GDG). É onde ideias
        ganham vida, conexões acontecem e o futuro da tecnologia é construído
        com colaboração, diversidade e muita energia criativa.
      </p>
      <p>
        Se você ama tecnologia, adora aprender e quer fazer parte de algo
        transformador, esse evento é pra você!
      </p>

      <section className={styles.TagList}>
        {tags.map((tag, idx) => (
          <div key={idx} className={styles.Tag}>
            <Image src={tag.icon} alt="" />
            {tag.text}
          </div>
        ))}
      </section>
      <a className={styles.Link} href="">
        Fazer parte do DevFest
      </a>
    </section>
  );
};
