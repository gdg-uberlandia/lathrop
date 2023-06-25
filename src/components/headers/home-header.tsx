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
        background: `url(${Theme.bgImageFull})`,
        backgroundPosition: Theme.bgImageFullPosition ?? 'left top',
        backgroundRepeat: 'no-repeat',
        backgroundSize: Theme.bgImageFullSize ?? 'cover',
    }

    return (
        <>
            <div className={styles.BgWrap}>
                <div className={styles.BgImageFull} style={bgImageFullTheme} />
                <div className={styles.BgImageMin} />
            </div>
            <div className={styles.MainInnerFull}>
                {/**/}
                <div className={styles.MainInnerFullContent}>
                    <Row className={styles.MainInnerFullDescription}>
                        <h1>
                            {(configValues.placeCity) ? `${configValues.placeCity} ,` : ''} {configValues.formattedDate}
                        </h1>
                        <h4>
                            {configValues.place}
                        </h4>
                    </Row>
                    <Row style={{ marginTop: '40px', textAlign: 'center' }}>
                        <Col>
                            <a className={styles.RegisterButton} href={configValues.eventLinkRegistrationUrl}>
                                Inscreva-se
                            </a>
                        </Col>
                    </Row>
                </div>
            </div >
            <section>
                <div className={styles.MainDescriptionMinWrapper}>
                    <div className={styles.MainDescriptionMin}>
                        <Row className={styles.MainInnerFullDescription}>
                            <h4>
                                {configValues.placeCity}, {configValues.formattedDate}
                            </h4>
                            <p>
                                {configValues.place}
                            </p>
                        </Row>
                        <Row style={{ marginTop: '15px' }}>
                            <Col> <a className={styles.RegisterButton} href={configValues.eventLinkRegistrationUrl}>Inscreva-se</a> </Col>
                        </Row>
                    </div>
                </div>
            </section>
        </>
    );
}

export default HomeHeader;

/*

*/