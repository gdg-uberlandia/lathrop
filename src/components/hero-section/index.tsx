import Image from "next/image"
import Title from '../../../public/banner/title.png'
import SchedulerIcon from '../../../public/icons/scheduler.svg'
import GlobalIcon from '../../../public/icons/global.svg'
import ArrowIcon from '../../../public/icons/arrow.png'

import styles from './styles.module.css'
import configValues from "helpers/config"

export const HeroSection = () => {
  return (
    <section className={styles.Section}>
      <div className={styles.Content}>
        <article className={styles.Texts}> 
          <Image alt='Devfest Triângulo 2023' src={Title} loading="eager" layout="responsive" />

          <footer className={styles.IconSection}>
            <span className={styles.IconItem}>
              <Image alt='Um calendário na cor amarela feito em traços de giz' src={SchedulerIcon} width={44} height={32} />
              <p>02 de Dezembro</p>
            </span>

            <span className={styles.IconItem}>
              <Image alt='Um globo terrestre na cor amarela feito em traços de giz' src={GlobalIcon} width={44} height={32} />
              <p>Uberlândia - MG</p>
            </span>
          </footer>
        </article>

        <aside className={styles.Aside}>
          <p>Inscreva-se</p>
          <a href={configValues.eventLinkRegistrationUrl} target="_blank" className={styles.AsideButton}>
            Garantir meu ingresso
          </a>
          <Image className={styles.ArrowIcon} alt='Uma seta amarela feita em traços de giz apontando para o canto superior esquerdo' src={ArrowIcon} height={44} width={40} objectFit="cover" />
        </aside>
      </div>
    </section>
  )
}