import { TicketBatch } from "@/models/ticket-batch";
import React from "react";

import styles from "../../styles/Tickets.module.css";

interface TicketProps {
  ticket: TicketBatch;
}

const TicketCard: React.FC<TicketProps> = ({ ticket }) => {
  const buttonClasses = ["DangerButton"];

  if (ticket.isOutOfSale()) buttonClasses.push("DisableButton");

  const mapPurchaseButton = () => {
    if (ticket.firstSaleDate > new Date()) {
      return (
        <>
          <span>* Não iniciado </span>
          <br />
          <span className={styles.TicketNotInitiadedDate}>
            {ticket.firstSaleDate.toLocaleDateString("pt-br")}
          </span>
        </>
      );
    } else
      return (
        <div>
          <a
            target="_blank"
            className={buttonClasses.join(" ")}
            rel="noreferrer"
            href={ticket.link}
          >
            Comprar
          </a>
        </div>
      );
  };

  return (
    <>
      <h4 className={styles.TicketItemTitle}>{ticket.title}</h4>
      <p className={styles.TicketItemDescription}>{ticket.description}</p>
      <p className={styles.TicketItemPrice}>R$ {ticket.value}</p>
      {mapPurchaseButton()}
    </>
  );
};

export default TicketCard;
