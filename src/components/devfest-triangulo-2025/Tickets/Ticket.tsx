import Image from "next/image";
import styles from "./Ticket.module.css";

import MiniCheese from "@/public/devfest-2025/mini-cheese.svg";
import SellIcon from "@/public/icons/sell.svg";
import TShirtIcon from "@/public/icons/tshirt.svg";
import configValues from "helpers/config";
import clsx from "clsx";

interface TicketProps {
  name: string;
  price: number;
  withShirt?: boolean;
  soldOut?: boolean;
  bestValue?: boolean;
  batch?: number;
}

export const Ticket = ({
  name,
  price,
  withShirt = false,
  soldOut = false,
  bestValue = false,
  batch,
}: TicketProps) => {
  const formattedPrice = price ? `R$${price},00` : "";

  return (
    <>
      <article className={styles.TicketWrapper}>
        <header className="d-flex align-items-center justify-content-center gap-3 mb-3">
          <section className={styles.Title}>
            <Image
              src={MiniCheese}
              alt="Ilustração de um pedaço de queijo amarelo com buracos, em estilo simples e colorido, sobre um fundo preto."
            />
            <p>{name}</p>
          </section>
          <section className={styles.Price}>
            {batch && <span className={styles.PriceBatch}>{batch}º Lote</span>}
            <span
              className={clsx(
                styles.PriceValue,
                soldOut ? styles.SoldOutPrice : "",
              )}
            >
              {formattedPrice}
            </span>
            {bestValue && (
              <Image
                className={clsx(
                  styles.SellIcon,
                  soldOut ? styles.SoldOutSellIcon : "",
                )}
                alt=""
                src={SellIcon}
                height={44}
                width={44}
                objectFit="cover"
              />
            )}
          </section>

          {withShirt && (
            <div className={styles.Shirt}>
              <Image src={TShirtIcon} alt="" />
              Inclui a camiseta oficial
            </div>
          )}

          <ul className={styles.Benefits}>
            <li>Café da manhã</li>
            <li>Lanche da tarde</li>
            <li>Acesso aos palcos</li>
            <li>Acesso às empresas</li>
            <li>Brindes</li>
            <li>Certificado de participação</li>
          </ul>

          <div
            className={clsx(styles.Separator, withShirt ? "" : styles.NoShirt)}
          ></div>

          <a
            href={configValues.eventLinkRegistrationUrl}
            target="_blank"
            className={clsx(
              styles.TicketButton,
              soldOut ? styles.TicketButtonDisabled : "",
            )}
          >
            {soldOut ? "Esgotado" : "Comprar ingressos"}
          </a>
        </header>
      </article>
    </>
  );
};
