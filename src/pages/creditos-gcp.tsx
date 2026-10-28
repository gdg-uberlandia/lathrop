import Head from "next/head";

import styles from "@/styles/GcpCredits.module.css";

const pdfUrl = `/files/${encodeURIComponent("Resgate seus Créditos do GCP - Passo a Passo.pdf")}`;

const missions = [
  {
    href: "https://g.dev/credits/devfest-triangulo-01",
    label: "Missão 1 - 7:00 - 11:00",
  },
  {
    href: "https://g.dev/credits/devfest-triangulo-02",
    label: "Missão 2 - 11:00 - 15:00",
  },
  {
    href: "https://g.dev/credits/devfest-triangulo-03",
    label: "Missão 3 - 15:00 - 19:00",
  },
];

export default function GcpCreditsPage() {
  return (
    <div className={styles.page}>
      <Head>
        <title>Resgate seus Créditos do GCP | DevFest Triângulo</title>
        <meta
          name="description"
          content="Confira o passo a passo para ativar seus créditos do Google Cloud e participe das três missões do DevFest Triângulo."
        />
        <link
          rel="canonical"
          href="https://devfesttriangulo.com.br/creditos-gcp"
        />
      </Head>
      <main className="mx-auto w-full max-w-5xl space-y-8 px-4 py-8 sm:px-6 sm:py-12">
        <header className="space-y-3">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Resgate seus Créditos do GCP
          </h1>
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.link} inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4`}
          >
            Abrir o passo a passo em uma nova aba
            <span aria-hidden="true">↗</span>
          </a>
        </header>

        <iframe
          src={pdfUrl}
          title="Resgate seus Créditos do GCP - Passo a Passo"
          className={`${styles.pdf} h-[75dvh] min-h-[24rem] w-full rounded-xl border`}
        />

        <section aria-label="Recursos e missões" className="space-y-6">
          <p
            className={`${styles.callout} rounded-xl p-5 text-lg leading-relaxed font-medium sm:p-6`}
          >
            Acesse o{" "}
            <a
              href="https://developers.google.com/solutions/catalog"
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.link} underline underline-offset-4`}
            >
              catálogo de soluções e arquiteturas
            </a>{" "}
            do Google para desenvolvedores e confira nossa coleção de recursos
            para desenvolvedores e soluções de integração entre produtos
          </p>

          <div className="grid gap-3 md:grid-cols-3">
            {missions.map((mission) => (
              <a
                key={mission.href}
                href={mission.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.mission}
              >
                {mission.label}
                <span aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
