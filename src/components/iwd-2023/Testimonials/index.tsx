import Image from "next/image"
import { Col, Container, Row } from "reactstrap"
import styles from "./styles.module.css"
import { Card } from "./Card"

export const Testimonials = () => {
    return (
        <section className={styles.Testimonial__container}>
            <Container>
                <Row tag="header" className={styles.Testimonial__header}>
                    <h2 className={styles.Testimonial__title}>Fala aí, comunidade!</h2>
                    <Row tag="aside" noGutters>
                        <Col sm={12} lg={4} className={styles.Testimonial__img}>
                            <Image 
                                src="/iwd-2024/testimonials.png" 
                                loading="lazy" 
                                width={408} 
                                height={350} 
                                alt="Testimonials" 
                            />
                        </Col>

                        <Col sm={12} lg={4} className={styles.Testimonial__topTestimonial}>
                            <Card 
                                author="Poliana Gomes"
                                testimonial="Participar de um evento com várias mulheres líderes na área de tecnologia me fez sentir que tenho capacidade, vou progredir na minha carreira e todas nós juntas podemos inspirar mais mulheres a entrar na área de tecnologia, mostrando que podemos alcançar nossos objetivos." 
                            />
                        </Col>

                        <Col sm={12} lg={4} className={styles.Testimonial__topTestimonial}>
                            <Card 
                                author="Patthy"
                                testimonial="Sem dúvidas é um sonho participar da IWD, tenho acompanhado os eventos e postagens e é surreal, muitas informações, incentivos, tem a Elisabeth que nos trata como da família, eu simplesmente amo essa comunidade e tô Aki ansiosa. Bjos" 
                            />
                        </Col>
                    </Row>
                </Row>
                <Row tag="section" noGutters className={styles.Testimonial__section}>
                    <Col tag="article" sm={12} lg={4} className={styles.Testimonials__aside}>
                        <Card 
                            author="Aline Reis"
                            testimonial="Ver o impacto do movimento feminino na comunidade tech, é sempre bom ver o crescimento e espaço conquistado pelas mulheres, e a comunidade nos mostra isso de perto." 
                        />
                        <Card 
                            author="Bruna"
                            testimonial="A comunidade Women Techmaker me faz sentir que não estou sozinha, e participar do IWD 2023 me fez receber um gás para correr atrás de tudo que eu sonho para a minha carrerira em tecnologia." 
                        />
                    </Col>
                    <Col sm={12} lg={4} className={styles.Testimonials__main}>
                        <Card 
                            author="Izabela da Silva"
                            testimonial="O IWD trouxe pra mim um novo olhar para a tecnologia, ver palestras incríveis de mulheres extraordinárias, me deixou mais motivada e com coragem de seguir na área, foram momentos naquele dia de muita conexão, aprendizado e inspiração. Hoje em dia sinto falta de mulheres na área onde trabalho pois o IWD deu esse gostinho de ter um ambiente com muitas mulheres falando tecnicamente e sobre outras áreas dentro da tecnologia. Amei demais o evento passado e mal posso esperar pra esse ano novamente estar presente no IWD." 
                        />
                    </Col>
                    <Col sm={12} lg={4} />
                </Row>
            </Container>
        </section>
    )
}