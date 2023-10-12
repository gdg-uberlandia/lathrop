/*eslint-disable*/
import { Sponsor } from "models/sponsor";
import {
    Container,
    Row,
    Col,
} from "reactstrap";
import _supports from '../../hooks/userSupports';
import { SponsorLevel } from "models/sponsor-level";
import SponsorCard from "./sponsor-card";

import styles from './Sponsors.module.css'

interface StringMap { [key: string]: any; }

const SPONSORS_LIST: string[] = ["superior", "diamond", "golden", "silver", "bronze", "ruby", "ametista", "support", "staff"];

interface SponsorsSectionProps {
    sponsors: { [key: string]: SponsorLevel },
}

const SponsorsSection: React.FC<SponsorsSectionProps> = ({ sponsors }) => {
    const supports: StringMap = _supports;

    const mapSponsorLevel = (sponsorLevel: SponsorLevel, isStaff: boolean) => {
        if (sponsorLevel?.items?.length > 0)
            return (
                <section key={sponsorLevel.id}>
                    <h4>
                        {sponsorLevel.name}
                    </h4>
                    <Row>
                        <div className={isStaff ? styles.StaffWrapper : styles.SponsorWrapper}>
                            {sponsorLevel.items.map((item) => (
                                <SponsorCard key={item.id} isStaff={isStaff} {...item} />
                            ))}
                        </div>
                    </Row>
                </section>
            )
        return <></>
    }


    return (
        <Container>
            <section className={styles.SponsorSection}>
                <Container>
                    <Row>
                        <Col lg={4} sm={12}>
                            <h2>
                                Patrocinadores
                            </h2>
                        </Col>
                    </Row>
                </Container>

                {sponsors && (
                    <Container fluid>
                        <div id="sponsors">
                            {SPONSORS_LIST.map((el) => {
                                if (sponsors[el] != null)
                                    return mapSponsorLevel(sponsors[el], el === "staff")
                            })}
                            
                            {/*<h4>
                                Organização
                            </h4>

                            <div>
                                <Row>

                                    <div className={styles.SponsorWrapper}>
                                        {
                                            supports.items.map((item: Sponsor) => mapSponsorCard(item, false))
                                        }
                                    </div>
                                </Row>
                            </div>*/}
                        </div>
                    </Container>
                )}
            </section>
        </Container>
    );
}

export default SponsorsSection;

