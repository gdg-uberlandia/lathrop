import { Ticket } from "@/components/devfest-triangulo-2025/Tickets/Ticket";

export const Tickets = () => {
  return (
    <section className="w-full py-16 text-center">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-center gap-10">
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
      </div>
    </section>
  );
};
