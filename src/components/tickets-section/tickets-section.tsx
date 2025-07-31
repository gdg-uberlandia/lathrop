/*eslint-disable*/
import { TicketBatch } from "models/ticket-batch";
import { Container, Row } from "reactstrap";

import styles from "../../styles/Tickets.module.css";
import TicketCard from "./ticket-card";

import ticketList from "../../hooks/ticketBatches";
import configValues from "helpers/config";

const TicketsSection: React.FC = ({}) => {
  const mapTicketsBatch = (ticket: TicketBatch) => {
    const _classes = [styles.TicketItem];

    if (ticket.isOutOfSale()) _classes.push(styles.TicketItemOff);
    return (
      <li key={ticket.title} className={_classes.join(" ")}>
        <TicketCard ticket={ticket}></TicketCard>
      </li>
    );
  };
  const mailTo = `mailto:{configValues.email}`;

  return (
    <>
      <Container style={{ marginBottom: "60px" }}>
        <div id={styles.Tickets}>
          <h4>Ingressos</h4>
          <div>
            <Row style={{ justifyContent: "center" }}>
              <ul className={styles.TicketsList}>
                {ticketList.map(mapTicketsBatch)}
              </ul>
            </Row>
            <Row>
              <span className={styles.TicketsDisclaimer}>
                ** Temos condições especiais para caravanas e grupos de empresas
                a cada 5 pessoas.
                <a target="_blank" href={mailTo}>
                  {" "}
                  Para saber mais envie um e-mail para {configValues.email}
                </a>{" "}
              </span>
            </Row>
          </div>
        </div>
      </Container>
    </>
  );
};

export default TicketsSection;
