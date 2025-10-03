/*eslint-disable*/
import { Sponsor, SponsorLevel } from "models/sponsor";
import { Container, Row, Col } from "reactstrap";
import _supports from "@/hooks/userSupports";
import SponsorCard from "./sponsor-card";

import styles from "./Sponsors.module.css";

interface StringMap {
  [key: string]: any;
}

const SPONSORS_LIST: string[] = [
  "superior",
  "diamond",
  "golden",
  "silver",
  "bronze",
  "iron",
  "ruby",
  "ametista",
  "support",
  "staff",
];

interface SponsorsSectionProps {
  sponsors: { [key: string]: SponsorLevel };
}

const SponsorsSection: React.FC<SponsorsSectionProps> = ({ sponsors }) => {
  return (
    <Container style={{ paddingLeft: "0px" }}>
      <section className={styles.SponsorSection}>
        <Container>
          <Row>
            <Col lg={4} sm={12}>
              <h2 className="gdg-line">Patrocinadores</h2>
            </Col>
          </Row>
        </Container>

        {sponsors && (
          <Container fluid>
            <div id="sponsors">
              {SPONSORS_LIST.map((el, i) => {
                const sponsorLevel = sponsors[el];
                const isStaff = el === "staff";

                if (sponsors[el] != null)
                  return (
                    <section key={el}>
                      <h4>{sponsorLevel.name}</h4>
                      <Row>
                        <div
                          className={
                            isStaff
                              ? styles.StaffWrapper
                              : styles.SponsorWrapper
                          }
                        >
                          {sponsorLevel.items.map((item) => (
                            <SponsorCard
                              key={item.name}
                              isStaff={isStaff}
                              {...item}
                            />
                          ))}
                        </div>
                      </Row>
                    </section>
                  );
              })}
            </div>
          </Container>
        )}
      </section>
    </Container>
  );
};

export default SponsorsSection;
