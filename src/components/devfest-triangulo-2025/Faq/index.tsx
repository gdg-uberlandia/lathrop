import React from "react";

import styles from "./styles.module.css";
import { Presentation } from "../Presentation";
import { FaqItem } from "./components/FaqItem";

interface FaqProps {
  className?: string;
}

export const Faq = ({ className }: FaqProps) => {
  return (
    <section className={className}>
      <Presentation
        title={
          <>
            <span>Perguntas</span> Frequentes
          </>
        }
        subtitle="Ficou com dúvida? A gente pensou nisso também! Confira as respostas para as perguntas mais frequentes e venha pro DevFest com tudo resolvido."
      />

      <div className={styles.FaqContainer}>
        <FaqItem
          title="O evento será presencial, online ou híbrido?"
          content="Claro! Em até 7 dias após o evento, o certificado será enviado para
            o e-mail cadastrado no momento da compra."
        />
        <FaqItem
          title="Terei direito a certificado de participação?"
          content="Claro! Em até 7 dias após o evento, o certificado será enviado para o e-mail cadastrado no momento da compra."
        />
        <FaqItem
          title="Vai ter transmissão ao vivo das palestras?"
          content="Colocar descrição aqui."
        />
        <FaqItem
          title="O evento oferece coffee break ou almoço?"
          content="Colocar descrição aqui."
        />
        <FaqItem
          title="Tem estacionamento no local?"
          content="Colocar descrição aqui."
        />
        <FaqItem
          title="Quais são as trilhas ou temas abordados?"
          content="Colocar descrição aqui."
        />
        <FaqItem
          title="Vou conseguir conversar com os palestrantes?"
          content="Colocar descrição aqui."
        />
        <FaqItem
          title="Como posso participar da comunidade Google Developer Groups (GDG)?"
          content="Colocar descrição aqui."
        />
        <FaqItem
          title="Terei contato com recrutadores ou empresas parceiras?"
          content="Colocar descrição aqui."
        />
        <FaqItem
          title="O local é acessível para pessoas com deficiência?"
          content="Colocar descrição aqui."
        />
        <FaqItem
          title="Posso transferir minha inscrição para outra pessoa?"
          content="Colocar descrição aqui."
        />
      </div>
    </section>
  );
};
