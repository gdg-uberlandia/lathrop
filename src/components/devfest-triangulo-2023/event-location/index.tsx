import { Container } from "reactstrap"

import styles from './styles.module.css'

const ADDRESS = 'R. Anita, 25 Altamira, Uberlândia - MG 38411-122'
const LOCATION_NAME = 'Gaudium Hall'

export const EventLocationSection = () => {
  return (
    <Container className={styles.EventLocation}>
      <h2>
        Local
      </h2> 

      <div className={styles.LocationContainer}>
        <article className={styles.LocationAddress}>
          <strong>{LOCATION_NAME}</strong>
          <p>
            {ADDRESS}
          </p>
        </article>

        <iframe className={styles.Map} src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3773.915425620083!2d-48.277814!3d-18.935137299999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94a44569d10a1e99%3A0xb4d4a2045116c3ee!2sGaudium%20Hall!5e0!3m2!1spt-BR!2sbr!4v1699709206505!5m2!1spt-BR!2sbr" width="600" height="450" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
      </div>
    </Container>
  )
}