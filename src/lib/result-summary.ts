import type { ConnectionNetwork } from "./connection-network";
import type { RewardDemand } from "./reward-demand";
import type { DataQuality } from "./data-quality";
import type { InterestAffinity } from "./interest-affinity";
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
  network: ConnectionNetwork;
  rewardDemand: RewardDemand;
  quality: DataQuality;
  affinity: InterestAffinity;
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
  add(
    "network",
    "Alcance do networking",
    `${n(d.network.connected)} pessoas têm conexões no recorte; ${n(d.network.isolated)} não têm conexões dentro da base selecionada.`,
    `${n(d.network.edges)} pares únicos entre perfis do papel selecionado; laços externos ficam fora da rede.`,
    "Rede de conexões",
  );
  const candidates = d.affinity.interests
    .filter((i) => i.people >= 20 && i.comparisonPeople >= 20)
    .flatMap((i) =>
      i.actions
        .filter((a) => a.difference !== null && Math.abs(a.difference) >= 10)
        .map((a) => ({
          interest: i.label,
          people: i.people,
          comparisonPeople: i.comparisonPeople,
          ...a,
        })),
    )
    .sort((a, b) => Math.abs(b.difference!) - Math.abs(a.difference!));
  const affinity = candidates[0],
    kind: Record<string, string> = {
      mission: "missões",
      company: "visitas a empresas",
      tag: "tags",
      connection: "conexões",
      rating: "avaliações",
      redemption: "resgates",
    };
  if (affinity)
    add(
      "affinity",
      "Diferença exploratória entre interesses",
      `No grupo ${affinity.interest}, a taxa de ${kind[affinity.kind]} foi ${n(affinity.rate)}%, contra ${n(affinity.comparisonRate!)}% em outros interesses declarados.`,
      `Maior diferença absoluta entre os cruzamentos elegíveis. Grupos de ${n(affinity.people)} e ${n(affinity.comparisonPeople)} pessoas; mínimo 20 por grupo. Sem teste de significância ou inferência causal.`,
      "Afinidade",
      "attention",
    );
  if (d.quality.failed)
    add(
      "quality",
      "Pontos de consistência para revisão",
      `${n(d.quality.failed)} de ${n(d.quality.executed)} verificações apontaram ocorrências; ${n(d.quality.errors)} verificações possuem erros.`,
      `Unidades variam por regra. Não somamos as ocorrências como pessoas e não executamos correções automáticas.`,
      "Qualidade dos dados",
      "attention",
    );
  else
    add(
      "quality",
      "Conferências sem divergências",
      `As ${n(d.quality.executed)} verificações executadas não encontraram divergências.`,
      `Não é garantia sobre regras ou registros não verificados.`,
      "Qualidade dos dados",
    );
  return facts;
}
