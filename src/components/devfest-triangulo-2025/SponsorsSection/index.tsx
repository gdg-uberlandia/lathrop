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
  const staffSponsor = sponsors.find(({ id }) => id === SponsorCategory.STAFF);
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
        <div className="d-grid gap-4 mt-5">
          <span className="d-flex align-items-center justify-content-center gap-3 mb-3">
            <Image
              src={MiniCheese}
              alt="Ilustração de um pedaço de queijo amarelo com buracos, em estilo simples e colorido, sobre um fundo preto."
            />
            <p>Patrocinadores</p>
          </span>

          {sponsors
            .filter(({ id, name }) => id !== SponsorCategory.STAFF && name)
            .map((sponsorLevel) => (
              <SponsorLevel key={sponsorLevel.id} sponsorLevel={sponsorLevel} />
            ))}

          {!!staffSponsor && (
            <article className="mt-5 d-grid gap-3 mb-5">
              <span className="d-flex align-items-center justify-content-center gap-3 mb-4">
                <Image
                  src={MiniCheese}
                  alt="Ilustração de um pedaço de queijo amarelo com buracos, em estilo simples e colorido, sobre um fundo preto."
                />
                <p>
                  Empresas que investem em seus{" "}
                  <span className={styles.TextBlue}>colaboradores</span>
                </p>
              </span>

              <div className="flex gap-3 flex-wrap justify-center">
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
    <>
      {items.length > 0 && (
        <section className="d-flex align-items-center flex-column gap-4 mb-4">
          <Tag>{name}</Tag>

          <div className="flex gap-5 flex-wrap justify-center">
            {items.map((item) => (
              <a href={item.url} target="_blank" key={item.name}>
                <div className="size-64 relative max-h-[90px]">
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
    </>
  );
};
