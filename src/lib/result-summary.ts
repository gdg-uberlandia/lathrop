import type { RewardDemand } from "./reward-demand";
export type ResultSummaryInput = {
  base: { profiles: number };
  metrics: {
    active: number;
    activities: number;
    ratings: number;
    reviewers: number;
  };
  timeline: { hour: string; actions: number; active: number }[];
  companyReach: {
    companies: { name: string; visitors: number; reach: number }[];
  };
  engagement: { topCount: number; topShare: number };
  rewardDemand: RewardDemand;
};
export type ResultInsight = {
  id: string;
  title: string;
  text: string;
  evidence: string;
  section: string;
  tone: "fact" | "attention";
};
const n = (v: number) =>
  v.toLocaleString("pt-BR", { maximumFractionDigits: 1 });
export function buildResultSummary(d: ResultSummaryInput): ResultInsight[] {
  const facts: ResultInsight[] = [];
  const add = (
    id: string,
    title: string,
    text: string,
    evidence: string,
    section: string,
    tone: ResultInsight["tone"] = "fact",
  ) => facts.push({ id, title, text, evidence, section, tone });
  add(
    "participation",
    "Amplitude da participação",
    `${n(d.metrics.active)} de ${n(d.base.profiles)} perfis realizaram uma ação válida no recorte (${n(d.base.profiles ? (d.metrics.active / d.base.profiles) * 100 : 0)}%).`,
    `Pessoas únicas; ${n(d.metrics.activities)} conclusões de atividades.`,
    "Engajamento",
  );
  const peak = [...d.timeline].sort(
    (a, b) => b.actions - a.actions || a.hour.localeCompare(b.hour),
  )[0];
  if (peak)
    add(
      "peak",
      "Horário de maior movimento",
      `${peak.hour.slice(8, 10)}/${peak.hour.slice(5, 7)} às ${peak.hour.slice(11)}h concentrou ${n(peak.actions)} ações e ${n(peak.active)} pessoas únicas.`,
      `Maior quantidade de ações em uma hora com registros, no horário de Brasília.`,
      "Visão geral",
    );
  if (d.engagement.topCount)
    add(
      "concentration",
      "Concentração das ações",
      `As ${n(d.engagement.topCount)} pessoas do grupo mais ativo concentraram ${n(d.engagement.topShare)}% das participações.`,
      `Grupo calculado como 10% das pessoas ativas, arredondado para cima; conexões contam para cada ponta da base.`,
      "Engajamento",
    );
  const company = d.companyReach.companies.find((c) => c.visitors > 0);
  if (company)
    add(
      "sponsor",
      "Maior alcance entre os estandes",
      `${company.name} teve ${n(company.visitors)} visitantes únicos, equivalentes a ${n(company.reach)}% da base.`,
      `Maior número de visitantes registrados; não representa tempo de permanência.`,
      "Empresas",
    );
  const reward = d.rewardDemand.rewards.find((r) => r.units > 0);
  if (reward)
    add(
      "reward",
      "Brinde com mais resgates",
      `${reward.name} registrou ${n(reward.units)} unidades (${n(reward.share)}% dos resgates do recorte), atendendo ${n(reward.people)} pessoas.`,
      `Quantidade de transações individuais de resgate; estoque inicial não é inferido.`,
      "Demanda por brindes",
    );
  add(
    "ratings",
    "Cobertura das avaliações",
    `${n(d.metrics.ratings)} ${d.metrics.ratings === 1 ? "avaliação foi feita" : "avaliações foram feitas"} por ${n(d.metrics.reviewers)} ${d.metrics.reviewers === 1 ? "pessoa" : "pessoas"} (${n(d.base.profiles ? (d.metrics.reviewers / d.base.profiles) * 100 : 0)}% da base).`,
    `Uma pessoa pode avaliar várias palestras. Notas não comprovam presença física.`,
    "Avaliações",
  );
  return facts;
}
