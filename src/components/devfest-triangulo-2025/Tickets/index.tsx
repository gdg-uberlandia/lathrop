import styles from "./Ticket.module.css";

import { Ticket } from "@/components/devfest-triangulo-2025/Tickets/Ticket";

export const Tickets = () => {
  return (
    <section className="m-4">
      <section className={styles.TicketsWrapper}>
        <Ticket
          name="Deploy no Escuro"
          price={135}
          priceBadge="Full Package"
          withShirt
          soldOut
        />
        {/* <Ticket
          name="Deploy no Escuro"
          price={100}
          priceBadge="Minimal Build"
          soldOut
        /> */}
        <Ticket name="Básico, mas incrível" price={135} batch={1} />
        <Ticket
          name="Combo Completo"
          price={170}
          withShirt
          batch={1}
          bestValue
        />
      </section>
    </section>
  );
};
