import { Ticket } from "@/components/devfest-triangulo-2025/Tickets/Ticket";

export const Tickets = () => {
  return (
    <section
      className="w-full py-16 text-center"
      aria-label="Opções de ingresso"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-center gap-10 xl:flex-nowrap xl:gap-6">
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
        <Ticket name="Básico, mas incrível" price={170} batch={2} />
        <Ticket
          name="Combo Completo"
          price={210}
          withShirt
          batch={2}
          bestValue
        />
      </div>
    </section>
  );
};
