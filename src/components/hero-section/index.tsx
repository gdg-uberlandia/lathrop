import Image from "next/image"
import Title from '../../../public/banner/title.svg'
import SchedulerIcon from '../../../public/icons/scheduler.svg'
import GlobalIcon from '../../../public/icons/global.svg'
import ArrowIcon from '../../../public/icons/arrow.png'
import configValues from "helpers/config"

import styles from './styles.module.css'

export const HeroSection = () => {
  return (
    <section className={styles.Section}>
      <video muted loop={true} autoPlay={true} playsInline={true} onContextMenu={() => false} preload="metadata" className={styles.Video} src="/videos/last-year-video.mp4"></video>
      <div className={styles.Overlay}></div>
      <div className={styles.Content}>
        <Image alt='Devfest Triângulo 2023' src={Title} loading="eager" layout="responsive" height={83} width={216} />
        <aside className={styles.Aside}>
          <p className={styles.AsideText}>Inscreva-se</p>
          <a href={configValues.eventLinkRegistrationUrl} target="_blank" className={styles.AsideButton}>
            Garantir meu ingresso
          </a>
          <Image className={styles.ArrowIcon} alt='Uma seta amarela feita em traços de giz apontando para o canto superior esquerdo' src={ArrowIcon} height={44} width={40} objectFit="cover" />
        </aside>
        <footer className={styles.IconSection}>
          <span className={styles.IconItem}>
            <Image alt='Um calendário na cor amarela feito em traços de giz' src={SchedulerIcon} width={44} height={32} />
            <p>02 de Novembro</p>
          </span>

          <span className={styles.IconItem}>
            <Image alt='Um globo terrestre na cor amarela feito em traços de giz' src={GlobalIcon} width={44} height={32} />
            <p>Uberlândia - MG</p>
          </span>
        </footer>
      </div>




    </section>
  )
}