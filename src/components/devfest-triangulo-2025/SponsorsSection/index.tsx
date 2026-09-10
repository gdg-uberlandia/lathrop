import { Presentation } from "../Presentation";
import Image from "next/image";
import MiniCheese from "@/public/devfest-2025/mini-cheese.svg";
import { Tag } from "../Tag";
import { SponsorCategory, type SponsorLevel } from "@/models/sponsor";
import configValues from "@/helpers/config";

const sponsorSizeClasses: Record<string, string> = {
  "superior:horizontal": "h-[142.8px] w-[380.8px]",
  "superior:vertical": "size-[176.8px]",
  "diamond:horizontal": "h-[122.4px] w-[319.6px]",
  "diamond:vertical": "size-[156.4px]",
  "gold:horizontal": "h-[105.4px] w-[265.2px]",
  "gold:vertical": "size-[139.4px]",
  "silver:horizontal": "h-[88.4px] w-[224.4px]",
  "silver:vertical": "size-[122.4px]",
  "bronze:horizontal": "h-[74.8px] w-[193.8px]",
  "bronze:vertical": "size-[105.4px]",
  "iron:horizontal": "h-[64.6px] w-[166.6px]",
  "iron:vertical": "size-[91.8px]",
  "ruby:horizontal": "h-[54.4px] w-[149.6px]",
  "ruby:vertical": "size-[81.6px]",
  "support:horizontal": "h-[54.4px] w-[149.6px]",
  "support:vertical": "size-[81.6px]",
};

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
        text: "Patrocine o DevFest Triângulo",
        href: configValues.eventLinkSponsorshipUrl,
      }}
      className={className}
      id="sponsors"
    >
      {!!sponsors.length && (
        <div className="mt-5 flex max-w-full flex-col gap-4">
          <span className="mb-2 flex items-center justify-center gap-3">
            <Image
              src={MiniCheese}
              alt="Ilustração de um pedaço de queijo amarelo com buracos, em estilo simples e colorido, sobre um fundo preto."
            />
            <h2 className="text-3xl font-bold text-devWhite-ice">
              Patrocinadores
            </h2>
          </span>

          {payingSponsors.map((sponsorLevel) => (
            <SponsorLevel key={sponsorLevel.id} sponsorLevel={sponsorLevel} />
          ))}

          {!!staffSponsor && (
            <article className="my-5 flex flex-col gap-3">
              <span className="mb-4 flex items-center justify-center gap-3">
                <Image
                  src={MiniCheese}
                  alt="Ilustração de um pedaço de queijo amarelo com buracos, em estilo simples e colorido, sobre um fundo preto."
                />
                <h2 className="text-xl font-bold text-devWhite-ice">
                  Empresas que investem em seus{" "}
                  <span className="text-devBlue-dark">colaboradores</span>
                </h2>
              </span>

              <div className="flex flex-wrap justify-center gap-12">
                {staffSponsor.items.map((item) => (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    key={item.logo}
                    className="transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-devBlue-dark motion-reduce:transition-none"
                  >
                    <div className="relative h-20 w-[120px]">
                      <Image
                        className="object-contain"
                        src={item.logo}
                        alt={item.name}
                        fill
                        sizes="120px"
                        // style={{ filter: "grayscale(1)" }}
                      />
                    </div>
                  </a>
                ))}
              </div>
            </article>
          )}

          {!!caravans && (
            <article className="my-5 flex flex-col gap-3">
              <span className="mb-4 flex items-center justify-center gap-3">
                <Image
                  src={MiniCheese}
                  alt="Ilustração de um pedaço de queijo amarelo com buracos, em estilo simples e colorido, sobre um fundo preto."
                />
                <h2 className="text-xl font-bold text-devWhite-ice">
                  Release
                  <span className="text-devBlue-dark">Trains</span>
                </h2>
              </span>
              <p>Caravanas confirmadas para o DevFest Triângulo</p>

              <div className="flex flex-wrap justify-center gap-5">
                {caravans.items.map((item) => (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    key={item.logo}
                    className="mx-auto transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-devBlue-dark motion-reduce:transition-none"
                  >
                    <div className="relative h-20 w-[120px]">
                      <Image
                        className="object-contain"
                        src={item.logo}
                        alt={item.name}
                        fill
                        sizes="120px"
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
    <div className="my-3 flex w-full">
      {items.length > 0 && (
        <section className="flex w-full flex-col items-center">
          <Tag>{name}</Tag>
          <div className="mt-4 flex w-full flex-row flex-wrap items-center justify-center gap-x-16 gap-y-5">
            {items.map((item) => (
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                key={item.name}
                className="transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-devBlue-dark motion-reduce:transition-none"
              >
                <div
                  className={`relative max-w-[90vw] ${sponsorSizeClasses[`${item.level}:${item.format}`] ?? "h-[88.4px] w-[224.4px]"}`}
                >
                  <Image
                    className="object-contain"
                    src={item.logo}
                    alt={item.name}
                    fill
                    sizes="320px"
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
