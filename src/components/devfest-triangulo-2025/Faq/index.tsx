import React from "react";

import { Presentation } from "../Presentation";
import { FaqItem } from "./components/FaqItem";

type FaqProps = React.HTMLAttributes<HTMLDivElement>;

export const Faq = ({ className, id, ...rest }: FaqProps) => {
  const headingId = id ? `${id}-title` : "faq-title";

  return (
    <section
      className={className}
      id={id}
      aria-labelledby={headingId}
      {...rest}
    >
      <Presentation
        headingId={headingId}
        title={
          <>
            <span>Perguntas</span> Frequentes
          </>
        }
        subtitle="Ficou com dúvida? A gente pensou nisso também! Confira as respostas para as perguntas mais frequentes e venha pro DevFest com tudo resolvido."
      />

      <div className="mx-auto grid w-full max-w-7xl gap-4 px-4 pb-10 sm:px-6 sm:pb-16 lg:px-8">
        <FaqItem
          title="O evento será presencial, online ou híbrido?"
          content="O DevFest Triângulo 2025 será presencial, proporcionando uma experiência completa de networking, palestras e atividades interativas no local."
        />
        <FaqItem
          title="Terei direito a certificado de participação?"
          content="Sim! Todos os participantes que comparecerem ao evento presencial e fizerem o check-in na entrada terão direito ao certificado de participação. As instruções para emissão serão enviadas por e-mail em até 7 dias após o evento."
        />
        <FaqItem
          title="Vai ter transmissão ao vivo das palestras?"
          content="Não. O DevFest Triângulo 2025 será um evento totalmente presencial, e não haverá transmissão ao vivo das palestras. Recomendamos garantir sua presença para aproveitar todo o conteúdo e as experiências oferecidas no local."
        />
        <FaqItem
          title="O evento oferece coffee break ou almoço?"
          content="O DevFest Triângulo 2025 oferecerá coffee break com café da manhã e lanche da tarde para todos os participantes. O almoço não está incluído, mas haverá um intervalo para que o participante possa sair e almoçar."
        />
        <FaqItem
          title="Tem estacionamento no local?"
          content="O Gaudium Hall não disponibiliza estacionamento próprio. Os participantes poderão utilizar as ruas próximas ao local para estacionar. Recomendamos chegar com antecedência para encontrar vagas com mais facilidade."
        />
        <FaqItem
          title="Quais são as trilhas ou temas abordados?"
          content={
            <>
              O DevFest Triângulo 2025 contará com 4 trilhas simultâneas,
              abordando temas diversos e atuais do universo da tecnologia. Entre
              os principais assuntos estão:
              <br />
              <ul>
                <li>Flutter</li>
                <li>Inteligência Artificial</li>
                <li>Cloud Computing</li>
                <li>Dados</li>
                <li>E muito mais!</li>
              </ul>
              As trilhas foram pensadas para atender diferentes perfis de
              desenvolvedores e entusiastas da tecnologia, com conteúdos
              práticos, inspiradores e relevantes para o mercado atual.
            </>
          }
        />
        <FaqItem
          title="Vou conseguir conversar com os palestrantes?"
          content="Sim! Os palestrantes estarão disponíveis durante o evento e você poderá interagir com eles após as sessões, nos intervalos e também em momentos de networking. Aproveite a oportunidade para tirar dúvidas, trocar ideias e fazer conexões!"
        />
        <FaqItem
          title="Como posso participar da comunidade Google Developer Groups (GDG)?"
          content={
            <>
              Você pode participar da comunidade durante o ano todo! No GDG,
              promovemos encontros, eventos, conteúdos e muita troca de
              conhecimento entre pessoas desenvolvedoras e entusiastas de
              tecnologia.
              <br />
              Para ficar por dentro de tudo o que está rolando, entre no nosso
              grupo do WhatsApp:{" "}
              <a
                href="https://chat.whatsapp.com/Ip9b9cJhIVl9A6yi4DAfk1"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://chat.whatsapp.com/Ip9b9cJhIVl9A6yi4DAfk1
              </a>
            </>
          }
        />
        <FaqItem
          title="Terei contato com recrutadores ou empresas parceiras?"
          content="Sim! Durante o evento, você poderá interagir com recrutadores e representantes de empresas parceiras nos stands disponíveis no local. É uma ótima oportunidade para fazer networking, conhecer oportunidades de carreira e se conectar com o mercado de tecnologia."
        />
        <FaqItem
          title="O local é acessível para pessoas com deficiência?"
          content="Sim! O Gaudium Hall possui acesso e estrutura adaptada para pessoas com deficiência, garantindo conforto e inclusão para todos os participantes."
        />
        <FaqItem
          title="Posso transferir minha inscrição para outra pessoa?"
          content="Sim! A transferência da inscrição para outra pessoa é permitida até o dia 29 de outubro. Importante: se o ingresso incluir camiseta, o tamanho não poderá ser alterado na transferência."
        />
      </div>
    </section>
  );
};
