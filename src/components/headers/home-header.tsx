/*eslint-disable*/
import React, { useState, useEffect } from "react";

import styles from 'styles/Home.module.css';
import configValues from "helpers/config";
import { changeTimeZone, calcDateDistance } from "helpers/date";
import { Col, Row } from "reactstrap";

interface HomeHeaderProps {
}


const DATE_DISTANCE_LABELS: Record<string, string> = {
    days: 'dias',
    hours: 'horas',
    minutes: 'minutos',
    seconds: 'segundos',
}

const HomeHeader: React.FC = ({ }) => {
    const [_dateDistance, _setDateDistance] = useState({
        distance: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    } as Record<string, number>);

    useEffect(() => {
        const _interval = setInterval(function () {
            const _result = calcDateDistance(changeTimeZone(configValues.eventDate, 'America/Sao_Paulo'));

            if (_result.distance < 0) {
                clearInterval(_interval)
                return
            }

            _setDateDistance(_result);
        }, 1000);

        return () => {
            clearInterval(_interval)
        }
    }, [])


    return (
        <>
            <div className={styles.BgWrap}>
                <div className={styles.BgImageFull} />
                <div className={styles.BgImageMin} />
            </div>
            <div className={styles.MainInnerFull}>
                {/**/}
                <div className={styles.MainInnerFullContent}>
                    <Col className={styles.MainInnerFullDescription}>
                        <h1>
                            {configValues.placeCity}, {configValues.formattedDate}
                        </h1>
                        <h4>
                            {configValues.place}
                        </h4>
                    </Col>
                    <Row style={{ marginTop: '40px', textAlign: 'center' }}>
                        <Col> <a className={styles.RegisterButton} href={configValues.eventLinkRegistrationUrl}>Inscreva-se</a> </Col>
                    </Row>
                </div>
            </div >
            <section>
                <div className={styles.MainDescriptionMinWrapper}>

                    <div className={styles.MainDescriptionMin}>
                        <Col className={styles.MainInnerFullDescription}>
                            <h4>
                                {configValues.placeCity}, {configValues.formattedDate}
                            </h4>
                            <p>
                                {configValues.place}
                            </p>
                        </Col>
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