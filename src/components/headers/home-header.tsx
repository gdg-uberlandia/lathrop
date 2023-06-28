/*eslint-disable*/
import React, { useState, useEffect } from "react";

import styles from 'styles/Home.module.css';
import configValues from "helpers/config";
import { Col, Row } from "reactstrap";
import Theme from "helpers/theme";

interface HomeHeaderProps {
}


const HomeHeader: React.FC = ({ }) => {

    const bgImageFullTheme = {
        backgroundImage: `url(${Theme.bgImageFull})`,
    }

    return (
        <>
            <div className={styles.BgWrap}>
                <div className={styles.BgImageFull} style={bgImageFullTheme} />
            </div>
            <div className={styles.MainInnerFull}>
                {/**/}
                <div className={styles.MainInnerFullContent}>
                    <div className={styles.MainInnerFullDescription}>
                        <h1>
                            {configValues.formattedDate}
                        </h1>
                        <h3>On-line e ao vivo</h3>
                        <a className={styles.RegisterButton} href={configValues.eventLinkRegistrationUrl}>
                            Inscreva-se
                        </a>
                    </div>
                </div>
            </div >
        </>
    );
}

export default HomeHeader;

/*

*/