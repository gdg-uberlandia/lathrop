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
      {/* <a
        target="_blank"
        href={configValues.eventLinkSponsorshipUrl}
        className={clsx(
          styles.HeaderButton,
          styles.HeaderSponsorButton,
          hideSponsorship ? "hide-sm" : "",
        )}
      >
        Seja patrocinador
      </a> */}

      <a
        href={"https://pokedex.devfesttriangulo.com.br/profile"}
        className={clsx(
          styles.HeaderButton,
          styles.HeaderSubscribeButton,
          hideRegistration ? "hide-sm" : "",
        )}
      >
        Pokedex
      </a>
    </div>
  );
};
