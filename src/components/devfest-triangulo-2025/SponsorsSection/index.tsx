import { Presentation } from "../Presentation";
import Image from "next/image";
import MiniCheese from "@/public/devfest-2025/mini-cheese.svg";
import { Tag } from "../Tag";
import styles from "./SponsorsSection.module.css";
import { SponsorCategory, type SponsorLevel } from "@/models/sponsor";
import configValues from "@/helpers/config";
import clsx from "clsx";

interface SponsorsSectionsProps extends React.HTMLAttributes<HTMLDivElement> {
  sponsors: Array<SponsorLevel>;
}

export const SponsorsSection = ({
  className,
  sponsors = [],
}: SponsorsSectionsProps) => {
  const staffSponsor = sponsors.find(
    ({ items }) => items[0]?.level === SponsorCategory.STAFF,
  );
  const caravans = sponsors.find(
    ({ items }) => items[0]?.level === SponsorCategory.CARAVANS,
  );

  const payingSponsors = sponsors
    .filter(
      ({ items }) =>
        items[0]?.level !== SponsorCategory.CARAVANS &&
        items[0]?.level !== SponsorCategory.STAFF,
    )
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <Presentation
      title={
        <>
          <span>Marcas</span> que acreditam no poder da tecnologia e da
          comunidade têm lugar garantido
        </>
      }
      subtitle={
        <>
          <span>Seja um patrocinador</span> do melhor festival de tecnologia da
          América Latina e conecte sua marca a milhares de mentes curiosas,
          criativas e apaixonadas por inovação. No DevFest, sua empresa não só
          ganha visibilidade, ela se torna parte ativa da transformação do
          ecossistema tech!
        </>
      }
      button={{
        text: "Quero apoiar o DevFest",
        href: configValues.eventLinkSponsorshipUrl,
      }}
      className={className}
      id="sponsors"
    >
      {!!sponsors.length && (
        <div className="flex flex-col gap-4 mt-5 max-w-full ">
          <span className="flex align-items-center justify-content-center gap-3 mb-2">
            <Image
              src={MiniCheese}
              alt="Ilustração de um pedaço de queijo amarelo com buracos, em estilo simples e colorido, sobre um fundo preto."
            />
            <p>Patrocinadores</p>
          </span>

          {payingSponsors.map((sponsorLevel) => (
            <SponsorLevel key={sponsorLevel.id} sponsorLevel={sponsorLevel} />
          ))}

          {!!staffSponsor && (
            <article className="my-5 flex flex-column gap-3 ">
              <span className="flex align-items-center justify-content-center gap-3 mb-4">
                <Image
                  src={MiniCheese}
                  alt="Ilustração de um pedaço de queijo amarelo com buracos, em estilo simples e colorido, sobre um fundo preto."
                />
                <p>
                  Empresas que investem em seus{" "}
                  <span className={styles.TextBlue}>colaboradores</span>
                </p>
              </span>

              <div className="flex gap-12 flex-wrap justify-center">
                {staffSponsor.items.map((item) => (
                  <a href={item.url} target="_blank" key={item.logo}>
                    <div className="max-h-[80px] size-28 relative ">
                      <Image
                        className={clsx(styles.SponsorImage)}
                        src={item.logo}
                        alt={item.name}
                        fill
                        // style={{ filter: "grayscale(1)" }}
                      />
                    </div>
                  </a>
                ))}
              </div>
            </article>
          )}

          {!!caravans && (
            <article className="my-5 flex flex-column gap-3 ">
              <span className="flex align-items-center justify-content-center gap-3 mb-4">
                <Image
                  src={MiniCheese}
                  alt="Ilustração de um pedaço de queijo amarelo com buracos, em estilo simples e colorido, sobre um fundo preto."
                />
                <p>
                  Release
                  <span className={styles.TextBlue}>Trains</span>
                </p>
              </span>
              <p>Caravanas confirmadas para o DevFest Triângulo</p>

              <div className="d-flex gap-5 flex-wrap justify-center">
                {caravans.items.map((item) => (
                  <a
                    href={item.url}
                    target="_blank"
                    key={item.logo}
                    className="mx-auto"
                  >
                    <div className={styles.StaffImageWrapper}>
                      <Image
                        className={styles.SponsorImage}
                        src={item.logo}
                        alt={item.name}
                        fill
                      />
                    </div>
                  </a>
                ))}
              </div>
            </article>
          )}
        </div>
      )}
    </Presentation>
  );
};

interface SponsorLevelProps {
  sponsorLevel: SponsorLevel;
}

const SponsorLevel = ({ sponsorLevel: { name, items } }: SponsorLevelProps) => {
  return (
    <div className="my-3 flex">
      {items.length > 0 && (
        <section className="flex flex-col items-center w-full">
          <Tag>{name}</Tag>
          <div className="flex flex-row flex-wrap gap-x-16 gap-y-5 items-center justify-center w-full">
            {items.map((item) => (
              <a href={item.url} target="_blank" key={item.name}>
                <div
                  className={`w-48 h-24 relative max-h-[80px] max-w-full ${styles[item.level]}`}
                >
                  <Image
                    className={clsx(styles.SponsorImage)}
                    src={item.logo}
                    alt={item.name}
                    fill
                    // style={{ filter: "grayscale(1)" }}
                  />
                </div>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
