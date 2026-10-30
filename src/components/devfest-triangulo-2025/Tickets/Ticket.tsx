import Image from "next/image";

import MiniCheese from "@/public/devfest-2025/mini-cheese.svg";
import SellIcon from "@/public/icons/sell.svg";
import TicketBackground from "@/assets/images/ticket.svg";
import configValues from "@/helpers/config";
import clsx from "clsx";
import { PrimaryCta } from "../ui/PrimaryCta";

interface TicketProps {
  name: string;
  price: number;
  withShirt?: boolean;
  soldOut?: boolean;
  bestValue?: boolean;
  batch?: number;
  priceBadge?: string;
}

export const Ticket = ({
  name,
  price,
  withShirt = false,
  soldOut = false,
  bestValue = false,
  batch,
  priceBadge,
}: TicketProps) => {
  const formattedPrice = price ? `R$${price},00` : "";

  return (
    <article className="relative min-h-[724px] w-full min-w-[280px] max-w-[410px] overflow-hidden rounded-lg px-[30px] py-[82px] text-xs sm:px-10">
      <Image
        src={TicketBackground}
        alt=""
        fill
        sizes="(min-width: 460px) 410px, 100vw"
        className="pointer-events-none object-fill"
      />

      <div className="relative z-10 mb-3 flex flex-col items-center justify-center gap-2">
        <div className="flex items-center gap-4">
          <Image
            src={MiniCheese}
            alt="Ilustração de um pedaço de queijo amarelo com buracos, em estilo simples e colorido, sobre um fundo preto."
          />
          <p className="text-2xl">{name}</p>
        </div>
        {soldOut ? (
          <span className="text-[2.5rem] leading-[3.75rem] text-devGray">
            Esgotado
          </span>
        ) : (
          <div className="mb-2 flex items-center">
            {batch && (
              <span className="mr-2 rounded-full bg-devGray px-4 py-2 text-sm text-devWhite-ice">
                {batch}º Lote
              </span>
            )}
            {priceBadge && (
              <div className="mr-2 w-40 rounded-full bg-white/10 px-1 py-1 text-2xl">
                {priceBadge}
              </div>
            )}
            <span
              className={clsx(
                "bg-devfest-gradient bg-clip-text text-[2.5rem] leading-[3.75rem] text-transparent",
                soldOut && "bg-none text-devGray",
              )}
            >
              {formattedPrice}
            </span>
            {bestValue && (
              <Image
                className={clsx(
                  "-ml-[5px] h-auto max-w-full rounded-full border-2 border-devGray-dark bg-devGreen-dark p-2",
                  soldOut && "bg-devGray",
                )}
                alt=""
                src={SellIcon}
                height={44}
                width={44}
              />
            )}
          </div>
        )}

        <ul
          className={clsx(
            "mb-6 flex w-full list-none flex-col gap-4 p-0 text-left text-lg",
            soldOut && "text-white/40",
          )}
        >
          {[
            "Café da manhã",
            "Lanche da tarde",
            "Acesso aos palcos",
            "Acesso às empresas",
            "Brindes",
            "Certificado de participação",
          ].map((benefit) => (
            <li
              key={benefit}
              className="relative pl-[22px] before:absolute before:left-0 before:top-[7px] before:size-3 before:rounded-full before:bg-devfest-gradient before:content-['']"
            >
              {benefit}
            </li>
          ))}
          {withShirt && (
            <li
              className={clsx(
                "relative pl-[22px] before:absolute before:left-0 before:top-[7px] before:size-3 before:rounded-full before:bg-devfest-gradient before:content-['']",
                !soldOut && "font-bold text-devYellow-dark",
              )}
            >
              Camiseta oficial do evento
            </li>
          )}
        </ul>

        <div
          className={clsx(
            "mb-2 w-full border-t-2 border-dashed border-devGray",
            !withShirt && "mt-[43px]",
          )}
        />

        <PrimaryCta
          href={configValues.eventLinkRegistrationUrl}
          target="_blank"
          className="w-[194px]"
          disabled={soldOut}
          rel="noreferrer"
        >
          {soldOut ? "Esgotado" : "Comprar ingressos"}
        </PrimaryCta>
      </div>
    </article>
  );
};
