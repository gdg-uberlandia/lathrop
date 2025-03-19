import Image from "next/image"
import PlayIcon from '../../../../public/icons/play.svg'
import configValues from "helpers/config"

import styles from './styles.module.css'
import React from "react"
import ModalPlayer from "components/modal-player/modal-player"

export const HeroSection = () => {

  const [open, setOpen] = React.useState(false);

  const toggle = () => setOpen(!open);


  return (
    <section className={styles.Section}>
      <div className={styles.Content}>
        <div className={styles.InnerContent}>
          <div>
            {/*<h1 className={styles.H1}>Impact The Future</h1>
            <h3 className={styles.H3} > International Women&apos;s Day 2024</h3>
            <p style={{ paddingTop: '5px' }}>
              Mulheres na tecnologia que impactam
              o futuro <br />com as suas próprias <span className={styles.HighLightText}>ideias</span> e <span className={styles.HighLightText}>inovações</span>
            </p>*/}
          </div>
          <div className={styles.Aside} style={{marginTop: '400px', marginLeft: '-200px'}}>
            <a href={configValues.eventLinkRegistrationUrl} target="_blank" className={styles.AsideButton}>
              Garantir meu ingresso
            </a>

            <div className={styles.AsidePlayButton} onClick={() => { toggle(); }}>
              <Image alt='Botão de play para vídeo do evneto ano passado' src={PlayIcon} width={44} height={32} />
              <span >Confira o evento último ano</span>
            </div>
          </div>
        </div>
      </div>
      <ModalPlayer
        url="https://www.youtube.com/embed/uY9nDt4swuU?si=EvquzOhd_7EjRulP"
        open={open}
        toggle={() => {
          toggle()
        }}
      />
    </section >
  )
}