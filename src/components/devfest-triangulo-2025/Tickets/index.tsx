import styles from "./Ticket.module.css";

import { Ticket } from "@/components/devfest-triangulo-2025/Tickets/Ticket";

export const Tickets = () => {
  return (
    <section className="m-4">
      <section className={styles.TicketsWrapper}>
        <Ticket
          name="Deploy no Escuro"
          price={100}
          withShirt
          bestValue
          soldOut
        />
        <Ticket name="Combo Completo" price={130} withShirt batch={1} />
        <Ticket name="Básico, mas incrível" price={100} batch={1} />
      </section>
    </section>
  );
};
