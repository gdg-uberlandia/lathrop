/*eslint-disable*/
import { Sponsor } from "models/sponsor";
import {
    Container,
    Row,
    Col,
} from "reactstrap";
import _supports from '../../hooks/userSupports';


import styles from './Sponsors.module.css'
import SponsorCard from "./sponsor-card";
import { SponsorLevel } from "models/sponsor-level";


interface StringMap { [key: string]: any; }

const SPONSORS_LIST: string[] = ["superior", "diamond", "golden", "silver", "bronze", "ruby", "ametista", "support", "staff"];

interface SponsorsSectionProps {
    sponsors: { [key: string]: SponsorLevel },
}

const SponsorsSection: React.FC<SponsorsSectionProps> = ({ sponsors }) => {

    const supports: StringMap = _supports;

    const mapSponsorCard = (sponsor: Sponsor, isStaff: boolean) => {
        if (sponsor.logo)
            return (<Col key={sponsor.id}><SponsorCard {...sponsor} isStaff={isStaff}></SponsorCard></Col>)
        return <Col></Col>
    }

    const mapSponsorLevel = (sponsorLevel: SponsorLevel, isStaff: boolean) => {
        if (sponsorLevel?.items?.length > 0)
            return (<div key={sponsorLevel.id}>
                <h4>
                    {sponsorLevel.name}
                </h4>
                <Row>
                    <div className={isStaff ? styles.StaffWrapper : styles.SponsorWrapper}>
                        {
                            sponsorLevel.items.map((item) => mapSponsorCard(item, isStaff))
                        }
                    </div>
                </Row>
            </div>)
        return <></>
    }


    return (
        <>
            <Container>
                <div className={styles.SponsorSection}>
                    <Container style={{
                        marginLeft
                            : '0px'
                    }}>
                        <Row >

                            <Col lg={4} sm={12}><h1 style={{ paddingLeft: '10px' }}>Patrocinadores</h1></Col>
                        </Row>
                    </Container>

                    <Container fluid style={{ marginBottom: '100px', marginTop: '30px' }}>
                        <div id="sponsors">
                            {SPONSORS_LIST.map((el) => {

                                if (sponsors != null && sponsors[el] != null)
                                    return mapSponsorLevel(sponsors[el], el === "staff")
                                return <></>
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
                </div>
            </Container>
        </>
    );
}

export default SponsorsSection;

