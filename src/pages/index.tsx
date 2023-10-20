import React, { useEffect } from "react";
import BaseLayout from "../layouts/base-layout";
import { Speaker } from "models/speaker";
import { Schedule } from "models/schedule";
import { getSponsors } from 'back-features/sponsors';
import { getSpeaker } from 'back-features/speakers';
import { SponsorLevel } from "models/sponsor-level";

import styles from "styles/Home.module.css";
import HomeHeader from "../components/headers/home-header";
import SpeakerSection from "components/speakers-section/speakers-section";
import SponsorsSection from "components/sponsors-section/sponsors-section";
import CountdownTimer from "components/devfest-triangulo-2023/countdown/countdown-timer";
import OlderEvenstsSection from "components/devfest-triangulo-2023/older-events-section/older-events-section";


import ErrorBoundary from '../components/error-boundary';

// https://alvarotrigo.com/blog/css-animations-scroll/

interface HomePageProps {
  speakers: Array<Speaker>;
  sponsors: { [key: string]: SponsorLevel };
  schedule: Array<Schedule>;
}

const Home = ({ speakers, sponsors, schedule }: HomePageProps) => {
  const reveal = () => {
    var reveals = document.querySelectorAll(".Section");
    for (var i = 0; i < reveals.length; i++) {
      var windowHeight = window.innerHeight;
      var elementTop = reveals[i].getBoundingClientRect().top;
      var elementVisible = 150;
      if (elementTop < windowHeight - elementVisible) {
        reveals[i].classList.add("active");
      } else {
        reveals[i].classList.remove("active");
      }
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", reveal);

    return () => window.removeEventListener('scroll', reveal)
  }, []);

  return (
    <>
      {/*
    <section className={styles.Section}>
          <ScheduleSection speakers={speakers} schedule={schedule} />
        </section>
  */}
      <ErrorBoundary>
        <HomeHeader />
        <CountdownTimer />

        <section className={`${styles.Section} Section`}>
          <OlderEvenstsSection />
        </section>

        <section className={`${styles.Section} Section`}>
          <SpeakerSection speakers={speakers} />
        </section>

        <section className={`${styles.Section} Section`}>
          <SponsorsSection sponsors={sponsors} />
        </section>
      </ErrorBoundary>
    </>
  );
};

export async function getServerSideProps() {
  try {
    return {
      "props": {
          "speakers": [
            {
              "miniBio": "Luciano é bacharel em ciências da computação, especialista em tecnologias de cloud e inteligência artificial. Possui 18 anos de experiência como engenheiro de software, tendo trabalhado com o desenvolvimento de sistemas operacionais, soluções embarcadas e produtos de IA para cloud. Hoje atua como Developer Advocate de Cloud AI no Google. Luciano acredita que a tecnologia pode até mudar a vida das pessoas, mas só as pessoas podem mudar o mundo.",
              "name": "Luciano Martins",
              "topic": "A jornada do  desenvolvedor enriquecida por  Inteligência Artificial",
              "tech": "Machine Learning",
              "id": 1,
              "company": "Google",
              "photo": "https://firebasestorage.googleapis.com/v0/b/devfest-triangulo-2023.appspot.com/o/speakers%2Fspeakers%2Fluciano.png?alt=media",
              "title": "Developer Advocate, Machine Learning at Google Cloud",
              "key": "GqVeXf4LRVaSd5DvW3Mn"
            },
            {
              "miniBio": "Com mais de 13 anos de experiência na indústria de tecnologia e atuando como Desenvolvedora Líder Mobile na @Thoughtworks, minha jornada me levou a dominar uma variedade de linguagens e estruturas, o que me permitiu criar experiências móveis excepcionais, especialmente em Android usando Kotlin.  Em 2022, fui selecionada para participar do programa Road to GDE onde aprendi como desenvolver e fornecer conteúdo técnico de alta qualidade, além de obter informações valiosas sobre o programa Google Developer Experts.  Em julho de 2023, tive a honra de ser selecionada como Embaixadora Women Techmakers, um programa que reconhece e apoia mulheres líderes na indústria tecnológica.   Sou apaixonada por usar minhas habilidades e experiência para orientar e inspirar pessoas a seguir carreiras em tecnologia. Estou muito feliz em ter a oportunidade de aplicar minhas habilidades e experiência para causar um impacto positivo no mundo!",
              "name": "Ana Ludmila de Oliveira",
              "topic": "Explorando as Novidades do Android: Aprimore seus Aplicativos para uma Experiência Premium",
              "title": "Lead Mobile Developer",
              "tech": "Mobile",
              "photo": "https://raw.githubusercontent.com/aludmila-gdev/aludmila-gdev.github.io/master/assets/images/aludmila-gdev/aludmilagdev-avatar.PNG",
              "company": "Thoughtworks",
              "key": "d5BOrx0Iz5zbvzHYmf4S"
            },
            {
              "miniBio": "Apaixonado por Tecnologia e Negócios, hoje sou Analista de Telecom na equipe do Centro de Desenvolvimento de Tecnologia da Engenharia de Redes da Algar Telecom, sendo responsável pelo desenvolvimento e homologação de novos equipamentos e produtos para compor o portfólio da empresa. Estou cursando Mestrado em Ciências da Computação na UFU, com ênfase em Sistemas e Segurança.",
              "name": "Lucas Montanheiro",
              "photo": "https://media.licdn.com/dms/image/C4E03AQHhBlzqzjfoSQ/profile-displayphoto-shrink_800_800/0/1656470526110?e=1701907200&v=beta&t=fADPXAQgKkabspNEa4nK0Li9_XkC-uL2Sz2e-8AKmbU",
              "company": "Algar Telecom",
              "title": "Analista de Telecom",
              "topic": "Ataques Hackers Recentes e a Autenticação em Dois Fatores",
              "tech": "Tecnologias Web, Segurança",
              "key": "tTNxpdGfPCQecZEPsGaP"
            },
            {
              "tech": "Testes de Sotftware",
              "miniBio": "Minha experiência com testes de software iniciou em 2001 (primeiro emprego), e de 2006 pra cá, com foco em Automação de Testes e DevOps. Já trabalhei em empresas de segmento financeiro, telecom, marketing digital, programas de fidelidade, business intelligence e fintechs. Saí dos bastidores em 2016 com a missão de apoiar testadores de software a se tornarem ainda melhores por meio da educação e compartilhamento de experiências.",
              "name": "Fernando Papito",
              "topic": "Playwright, o primo rico do Cypress!",
              "photo": "https://media.licdn.com/dms/image/D4D03AQG6Yl57YL2_3w/profile-displayphoto-shrink_800_800/0/1693322690379?e=1702512000&v=beta&t=jqKhOLkxSWHTHqz1OppLZE3PqP5sZmFgbVFZoSqqjmM",
              "title": "QA Lead",
              "key": "zE9tzUiH5aFiAEQigqyD"
            }
          ],
          "sponsors": {
            "bronze": {
              "name": "Bronze",
              "items": [
                {
                  "name": "LuizaLabs",
                  "logo": "https://firebasestorage.googleapis.com/v0/b/devfest-triangulo-2023.appspot.com/o/sponsors%2Fluizalabs.png?alt=media",
                  "url": "https://www.linkedin.com/company/luizalabs/"
                },
                {
                  "name": "LuizaLabs",
                  "logo": "https://firebasestorage.googleapis.com/v0/b/devfest-triangulo-2023.appspot.com/o/sponsors%2Fluizalabs.png?alt=media",
                  "url": "https://www.linkedin.com/company/luizalabs/"
                },
                {
                  "name": "LuizaLabs",
                  "logo": "https://firebasestorage.googleapis.com/v0/b/devfest-triangulo-2023.appspot.com/o/sponsors%2Fluizalabs.png?alt=media",
                  "url": "https://www.linkedin.com/company/luizalabs/"
                },
                {
                  "name": "LuizaLabs",
                  "logo": "https://firebasestorage.googleapis.com/v0/b/devfest-triangulo-2023.appspot.com/o/sponsors%2Fluizalabs.png?alt=media",
                  "url": "https://www.linkedin.com/company/luizalabs/"
                },
                {
                  "name": "LuizaLabs",
                  "logo": "https://firebasestorage.googleapis.com/v0/b/devfest-triangulo-2023.appspot.com/o/sponsors%2Fluizalabs.png?alt=media",
                  "url": "https://www.linkedin.com/company/luizalabs/"
                },
                
                {
                  "name": "Globo",
                  "logo": "https://firebasestorage.googleapis.com/v0/b/devfest-triangulo-2023.appspot.com/o/sponsors%2Fglobo.png?alt=media",
                  "url": "https://vempraglobo.g.globo"
                }
              ]
            },
            "diamond": {
              "name": "Diamante",
              "items": [
                {
                  "name": "Sankhya",
                  "logo": "https://firebasestorage.googleapis.com/v0/b/devfest-triangulo-2023.appspot.com/o/sponsors%2Fsankhya.png?alt=media",
                  "url": "https://www.sankhya.com.br"
                }
              ]
            },
            "golden": {
              "name": "Ouro",
              "items": []
            },
            "staff": {
              "name": "Empresas que investem em seus colaboradores",
              "items": [
                {
                  "name": "Up Brasil",
                  "logo": "https://firebasestorage.googleapis.com/v0/b/devfestcerrado2022.appspot.com/o/sponsors%2Fup.png?alt=media",
                  "url": "https://upbrasil.com/"
                }
              ]
            },
            "superior": {
              "items": [
                {
                  "name": "Google Developers",
                  "logo": "https://firebasestorage.googleapis.com/v0/b/devfestcerrado2022.appspot.com/o/sponsors%2Fgoogle-developers.png?alt=media",
                  "url": "https://developers.google.com"
                }
              ],
              "name": ""
            }
          },
          "schedule": [
            {
              start: "9:00",
              end: "9:20",
              speeches: [
                {
                  speakerSlug: "zE9tzUiH5aFiAEQigqyD",
                },
                {
                  topic: "A jornada do desenvolvedor enriquecida por Inteligência Artificial",
                }
              ]
           },
           {
              start: "9:20",
              end: "9:40",
              speeches: [
                {
                  speakerSlug: "Luciano Martins",
                  topic: "A jornada do desenvolvedor enriquecida por Inteligência Artificial",
                },
              ]
            },
            {
              start: "9:40",
              end: "10:00",
              speeches: [
                {
                  speakerSlug: "Luciano Martins",
                },
                {
                  topic: "A jornada do desenvolvedor enriquecida por Inteligência Artificial",
                }
              ]
            }
          ]
        }
    }
  } catch (error) {
    console.error(error);
    return { props: { speakers: [], sponsors: [] } };
  }
}


Home.layout = BaseLayout;

export default Home;
