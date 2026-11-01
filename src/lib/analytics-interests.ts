import type { DashboardRow } from "./pokedex-dashboard";
import { analyticsIds } from "./dashboard-context";
const aliases: Record<string, string> = {
  "front-end": "frontend",
  "back-end": "backend",
  "banco-de-dados": "databases",
  "inteligencia-artificial": "ai",
  dados: "data",
  qa: "testing",
  "testes-de-software": "testing",
  "ui-ux": "design",
  automacao: "automation",
  lideranca: "leadership",
  "metodologias-ageis": "agile",
};
const labels: Record<string, string> = {
  ai: "Inteligência artificial",
  cloud: "Cloud",
  web: "Web",
  mobile: "Mobile",
  data: "Dados",
  security: "Segurança",
  accessibility: "Acessibilidade",
  career: "Carreira",
  "open-source": "Open source",
  entrepreneurship: "Empreendedorismo",
  design: "Design e produto",
  frontend: "Frontend",
  backend: "Backend",
  devops: "DevOps e SRE",
  testing: "Testes e qualidade",
  architecture: "Arquitetura de software",
  databases: "Bancos de dados",
  "generative-ai": "IA generativa",
  "machine-learning": "Machine learning",
  iot: "Internet das coisas",
  games: "Games",
  automation: "Automação",
  leadership: "Liderança técnica",
  communities: "Comunidades",
  education: "Educação e mentoria",
  agile: "Métodos ágeis",
  observability: "Observabilidade",
  performance: "Performance",
  privacy: "Privacidade",
};
export const analyticsInterests = (p: DashboardRow) => [
  ...new Set(
    [...analyticsIds(p.interests), ...analyticsIds(p.skills)].map(
      (id) => aliases[id] ?? id,
    ),
  ),
];
export const interestLabel = (id: string) => labels[id] ?? id;
