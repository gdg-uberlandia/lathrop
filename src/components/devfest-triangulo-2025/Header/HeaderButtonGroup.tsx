import clsx from "clsx";
import configValues from "helpers/config";
import styles from "./Header.module.css";

interface HeaderButtonGroup {
  hideSponsorship?: boolean;
  hideRegistration?: boolean;
}

export const HeaderButtonGroup = ({
  hideSponsorship = false,
  hideRegistration = false,
}: HeaderButtonGroup) => {
  return (
    <div className={styles.HeaderButtonGroup}>
      <a
        target="_blank"
        href={configValues.eventLinkSponsorshipUrl}
        className={clsx(
          styles.HeaderButton,
          styles.HeaderSponsorButton,
          hideSponsorship ? "hide-sm" : "",
        )}
      >
        Seja patrocinador
      </a>

      <a
        target="_blank"
        href={configValues.eventLinkRegistrationUrl}
        className={clsx(
          styles.HeaderButton,
          styles.HeaderSubscribeButton,
          hideRegistration ? "hide-sm" : "",
        )}
      >
        Inscreva-se
      </a>
    </div>
  );
};
