import styles from "./styles.module.css";
import { Presentation } from "../Presentation";
import clsx from "clsx";

interface EventLocationProps extends React.HTMLAttributes<HTMLDivElement> {}

export const EventLocation = ({ className, ...props }: EventLocationProps) => {
  return (
    <div
      className={clsx(styles.EventLocation, className, "container")}
      {...props}
    >
      <Presentation
        title={
          <>
            <span>Onde</span> e <span>quando</span> tudo vai acontecer
          </>
        }
        subtitle="O DevFest Triângulo 2025 já tem hora e lugar marcados, e tudo o que falta é você!"
      />

      <div className={styles.LocationContainer}>
        <article className={styles.LocationInfoContainer}>
          <div className={styles.LocationInfo}>
            <div className={styles.LocationInfoIcon}>
              <svg
                width="24"
                height="25"
                viewBox="0 0 24 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 12.415C12.55 12.415 13.0208 12.2192 13.4125 11.8275C13.8042 11.4359 14 10.965 14 10.415C14 9.86504 13.8042 9.39421 13.4125 9.00254C13.0208 8.61087 12.55 8.41504 12 8.41504C11.45 8.41504 10.9792 8.61087 10.5875 9.00254C10.1958 9.39421 10 9.86504 10 10.415C10 10.965 10.1958 11.4359 10.5875 11.8275C10.9792 12.2192 11.45 12.415 12 12.415ZM12 19.765C14.0333 17.8984 15.5417 16.2025 16.525 14.6775C17.5083 13.1525 18 11.7984 18 10.615C18 8.79837 17.4208 7.31087 16.2625 6.15254C15.1042 4.99421 13.6833 4.41504 12 4.41504C10.3167 4.41504 8.89583 4.99421 7.7375 6.15254C6.57917 7.31087 6 8.79837 6 10.615C6 11.7984 6.49167 13.1525 7.475 14.6775C8.45833 16.2025 9.96667 17.8984 12 19.765ZM12 22.415C9.31667 20.1317 7.3125 18.0109 5.9875 16.0525C4.6625 14.0942 4 12.2817 4 10.615C4 8.11504 4.80417 6.12337 6.4125 4.64004C8.02083 3.15671 9.88333 2.41504 12 2.41504C14.1167 2.41504 15.9792 3.15671 17.5875 4.64004C19.1958 6.12337 20 8.11504 20 10.615C20 12.2817 19.3375 14.0942 18.0125 16.0525C16.6875 18.0109 14.6833 20.1317 12 22.415Z"
                  fill="white"
                />
              </svg>
            </div>

            <div className={styles.LocationInfoText}>
              <h3>Uberlândia - MG</h3>
              <p>Gaudium Hall</p>
              <p>Rua Anita, 25, Bairro Altamira, CEP 38411-122</p>
            </div>
          </div>

          <div className={styles.LocationInfo}>
            <div className={styles.LocationInfoIcon}>
              <svg
                width="24"
                height="25"
                viewBox="0 0 24 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.5 18.915C13.8 18.915 13.2083 18.6734 12.725 18.19C12.2417 17.7067 12 17.115 12 16.415C12 15.715 12.2417 15.1234 12.725 14.64C13.2083 14.1567 13.8 13.915 14.5 13.915C15.2 13.915 15.7917 14.1567 16.275 14.64C16.7583 15.1234 17 15.715 17 16.415C17 17.115 16.7583 17.7067 16.275 18.19C15.7917 18.6734 15.2 18.915 14.5 18.915ZM5 22.915C4.45 22.915 3.97917 22.7192 3.5875 22.3275C3.19583 21.9359 3 21.465 3 20.915V6.91504C3 6.36504 3.19583 5.89421 3.5875 5.50254C3.97917 5.11087 4.45 4.91504 5 4.91504H6V2.91504H8V4.91504H16V2.91504H18V4.91504H19C19.55 4.91504 20.0208 5.11087 20.4125 5.50254C20.8042 5.89421 21 6.36504 21 6.91504V20.915C21 21.465 20.8042 21.9359 20.4125 22.3275C20.0208 22.7192 19.55 22.915 19 22.915H5ZM5 20.915H19V10.915H5V20.915ZM5 8.91504H19V6.91504H5V8.91504Z"
                  fill="white"
                />
              </svg>
            </div>

            <div className={styles.LocationInfoText}>
              <p>22 de Novembro de 2025</p>
            </div>
          </div>

          <div className={styles.LocationInfo}>
            <div className={styles.LocationInfoIcon}>
              <svg
                width="20"
                height="21"
                viewBox="0 0 20 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.3 15.615L14.7 14.215L11 10.515V5.91504H9V11.315L13.3 15.615ZM10 20.915C8.61667 20.915 7.31667 20.6525 6.1 20.1275C4.88333 19.6025 3.825 18.89 2.925 17.99C2.025 17.09 1.3125 16.0317 0.7875 14.815C0.2625 13.5984 0 12.2984 0 10.915C0 9.53171 0.2625 8.23171 0.7875 7.01504C1.3125 5.79837 2.025 4.74004 2.925 3.84004C3.825 2.94004 4.88333 2.22754 6.1 1.70254C7.31667 1.17754 8.61667 0.915039 10 0.915039C11.3833 0.915039 12.6833 1.17754 13.9 1.70254C15.1167 2.22754 16.175 2.94004 17.075 3.84004C17.975 4.74004 18.6875 5.79837 19.2125 7.01504C19.7375 8.23171 20 9.53171 20 10.915C20 12.2984 19.7375 13.5984 19.2125 14.815C18.6875 16.0317 17.975 17.09 17.075 17.99C16.175 18.89 15.1167 19.6025 13.9 20.1275C12.6833 20.6525 11.3833 20.915 10 20.915ZM10 18.915C12.2167 18.915 14.1042 18.1359 15.6625 16.5775C17.2208 15.0192 18 13.1317 18 10.915C18 8.69837 17.2208 6.81087 15.6625 5.25254C14.1042 3.69421 12.2167 2.91504 10 2.91504C7.78333 2.91504 5.89583 3.69421 4.3375 5.25254C2.77917 6.81087 2 8.69837 2 10.915C2 13.1317 2.77917 15.0192 4.3375 16.5775C5.89583 18.1359 7.78333 18.915 10 18.915Z"
                  fill="white"
                />
              </svg>
            </div>

            <div className={styles.LocationInfoText}>
              <p>Das 9:00 às 19:00</p>
            </div>
          </div>
        </article>

        <div className={styles.Map}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3773.915425620083!2d-48.277814!3d-18.935137299999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94a44569d10a1e99%3A0xb4d4a2045116c3ee!2sGaudium%20Hall!5e0!3m2!1spt-BR!2sbr!4v1699709206505!5m2!1spt-BR!2sbr"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
};
