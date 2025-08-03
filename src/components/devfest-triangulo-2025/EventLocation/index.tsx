import configValues from "helpers/config";
import Image from "next/image";

import { toHumanDate } from "@helpers/date";
import EventIcon from "@public/devfest-2025/icons/event.svg";
import LocationIcon from "@public/devfest-2025/icons/location.svg";
import ScheduleIcon from "@public/devfest-2025/icons/schedule.svg";

import styles from "./EventLocation.module.css";
import clsx from "clsx";

interface EventLocationProps {
  className?: string;
}

export const EventLocation = ({ className }: EventLocationProps) => {
  return (
    <section className={clsx(styles.EventLocation, className)} id="place">
      <section className={styles.EventLocationHeader}>
        <h1 className={styles.Title}>
          <span>Onde</span> e <span>quando</span> tudo vai acontecer
        </h1>
        <p>
          O DevFest Triângulo 2025 já tem hora e lugar marcados, e tudo o que
          falta é você!
        </p>
      </section>

      <div className={styles.LocationContainer}>
        <aside>
          <div className={styles.LocationDescription}>
            <Image alt={""} src={LocationIcon} height={48} width={48} />

            <div className={styles.LocationAddress}>
              <span>
                <strong>{configValues.placeCity}</strong>
              </span>
              <span>{configValues.place}</span>
              <span>
                {configValues.placeAddress}, {configValues.placeCEP}
              </span>
            </div>
          </div>
          <div className={styles.LocationDescription}>
            <Image alt={""} src={EventIcon} height={48} width={48} />

            <div className={styles.LocationAddress}>
              <span>{toHumanDate(configValues.eventDate)}</span>
            </div>
          </div>
          <div className={styles.LocationDescription}>
            <Image alt={""} src={ScheduleIcon} height={48} width={48} />

            <div className={styles.LocationAddress}>
              <span>
                Das {configValues.eventStart} às {configValues.eventEnd}
              </span>
            </div>
          </div>
        </aside>

        <div className={styles.MapContainer}>
          <iframe
            className={styles.Map}
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3773.915425620083!2d-48.277814!3d-18.935137299999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94a44569d10a1e99%3A0xb4d4a2045116c3ee!2sGaudium%20Hall!5e0!3m2!1spt-BR!2sbr!4v1699709206505!5m2!1spt-BR!2sbr"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </section>
  );
};
