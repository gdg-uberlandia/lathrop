import { Presentation } from "../Presentation";
import Image from "next/image";
import MiniCheese from "@public/devfest-2025/mini-cheese.svg";
import { Sponsor } from "models/sponsor";
import SponsorMock from "@public/devfest-2025/sponsor-mock.svg";
import { Tag } from "../Tag";
import styles from "./SponsorsSection.module.css";

interface SponsorsSectionsProps extends React.HTMLAttributes<HTMLDivElement> {
  sponsors: Array<Sponsor>;
}

export const SponsorsSection = ({
  className,
  sponsors,
}: SponsorsSectionsProps) => {
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
      className={className}
      id="sponsor"
    >
      <div className="d-grid gap-4 mt-5">
        <span className="d-flex align-items-center justify-content-center gap-3 mb-3">
          <Image
            src={MiniCheese}
            alt="Ilustração de um pedaço de queijo amarelo com buracos, em estilo simples e colorido, sobre um fundo preto."
          />
          <p>Patrocinadores</p>
        </span>

        <SponsorLevel level="Ouro" images={[SponsorMock, SponsorMock]} />
        <SponsorLevel level="Prata" images={[SponsorMock, SponsorMock]} />
        <SponsorLevel level="Bronze" images={[SponsorMock, SponsorMock]} />
        <SponsorLevel level="Ferro" images={[SponsorMock, SponsorMock]} />
        <SponsorLevel level="Apoiadores" images={[SponsorMock, SponsorMock]} />
        <SponsorLevel level="Parceiros" images={[SponsorMock, SponsorMock]} />

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

          <div className="d-flex gap-5 flex-wrap">
            <Image src={SponsorMock} alt="" />
            <Image src={SponsorMock} alt="" />
            <Image src={SponsorMock} alt="" />
            <Image src={SponsorMock} alt="" />
            <Image src={SponsorMock} alt="" />
            <Image src={SponsorMock} alt="" />
            <Image src={SponsorMock} alt="" />
            <Image src={SponsorMock} alt="" />
            <Image src={SponsorMock} alt="" />
            <Image src={SponsorMock} alt="" />
            <Image src={SponsorMock} alt="" />
            <Image src={SponsorMock} alt="" />
          </div>
        </article>
      </div>
    </Presentation>
  );
};

interface SponsorLevelProps {
  level: string;
  images: Array<string>;
}

const SponsorLevel = ({ level, images }: SponsorLevelProps) => {
  return (
    <section className="d-flex align-items-center flex-column gap-4 mb-4">
      <Tag>{level}</Tag>

      <div className="d-flex gap-5">
        {images.map((image, i) => (
          <Image key={i} src={image} alt="" />
        ))}
      </div>
    </section>
  );
};
