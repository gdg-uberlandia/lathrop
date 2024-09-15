import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import BaseLayout from "../layouts/base-layout";
import { Col, Row, Container } from "reactstrap";

const CampaignPage = ({}) => {
  const router = useRouter();
  const [name, setName] = useState("");

  useEffect(() => {
    const _name = router.query?.ogName?.toString() || "";
    setName(_name);
  });

  return (
    <>
      <div style={{ marginTop: "120px" }}>
        <Container fluid style={{ backgroundColor: "red" }}>
          <Row style={{ width: "100%", height: "600px", textAlign: "center" }}>
            <h1>Compartilhe para ganhar!</h1>

            <h3>Olá {name}</h3>
            <p>
              Quer tal compartilhar nas suas redes sociais e ter a chance de
              ganhar um Nest mini?
            </p>

            <p></p>

            <Col>
              <a
                href="https://twitter.com/share?ref_src=twsrc%5Etfw"
                className="twitter-share-button"
                data-size="large"
                data-text="Eu vou no Devfest Cerrado 2022 em Uberlândia! E consegui um cupom de desconto para você. Garanta seu ingresso! Nos vemos lá!!"
                data-url={`https://www.devfestcerrado.com.br=`}
                data-hashtags="devfestcerrado"
                data-lang="en"
                data-show-count="false"
              >
                Tweet
              </a>
              <script
                async
                src="https://platform.twitter.com/widgets.js"
                charSet="utf-8"
              ></script>
            </Col>
          </Row>
          <Row>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <img
                alt="imagem sorteio"
                width="600"
                height="300"
                src="/banner-campaign.png"
              />
            </div>
          </Row>
        </Container>
      </div>
    </>
  );
};

CampaignPage.layout = BaseLayout;

export default CampaignPage;
