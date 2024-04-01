import { Container } from "reactstrap"
import Image from "next/image"
import LocationImg from './assets/cdl.png'

import styles from './styles.module.css'
import configValues from "helpers/config"

export const EventLocationSection = () => {
  return (
    <Container className={styles.EventLocation} id='local'>
      <h2>
        Local
      </h2>

      <div className={styles.LocationContainer}>
        <aside>
          <article className={styles.LocationDescription}>
            <strong>{configValues.place}</strong>
            <p className={styles.LocationAddress}>
              {configValues.placeAddress}
            </p>
          </article>
          <Image
            alt={`Fachada do ${configValues.place}`}
            className={styles.LocationImg}
            src={LocationImg}
            height={247}
          />
        </aside>

        <iframe className={styles.Map} src="https://maps.google.com/maps?width=600&amp;height=400&amp;hl=en&amp;q=Cdl uberlandia&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed" width="600" height="450" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>

      </div>
    </Container>
  )
}