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
        backgrroundPosition: Theme.bgImageFullPosition,
        backgroundSize: Theme.bgImageFullSize,
    }

    return (
        <>
            <div className={styles.BgWrap}>
                <div className={styles.BgImageFull} />
            </div>
            <div className={styles.MainInnerFull}>
                <div className={styles.MainInnerFullDescription}>
                    <div style={{ paddingBottom: '30px', textAlign: 'center' }}>
                        <h1>{configValues.placeCity}</h1>
                        <h1>{configValues.formattedDate}</h1>
                    </div>
                    <div>
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