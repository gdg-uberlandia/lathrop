import {
  analyticsIds,
  analyticsText,
  analyticsNumber,
  type DashboardContext,
} from "./dashboard-context";
import { timestamp } from "./event-statistics-time";
export type QualityExample = {
  id: string;
  participantId?: string;
  detail: string;
};
export type QualityCheck = {
  code: string;
  title: string;
  level: "error" | "warning" | "info";
  scope: string;
  unit: string;
  count: number;
  description: string;
  examples: QualityExample[];
};
export function buildDataQuality(c: DashboardContext) {
  const checks: QualityCheck[] = [],
    allRoles = !c.filters.role || c.filters.role === "all";
  const check = (
    code: string,
    title: string,
    level: QualityCheck["level"],
    scope: string,
    unit: string,
    description: string,
    examples: QualityExample[],
  ) =>
    checks.push({
      code,
      title,
      level,
      scope,
      unit,
      count: examples.length,
      description,
      examples: examples.slice(0, 10),
    });
  const fields: Record<string, string> = {
    activityCompletions: "completedAt",
    "talk-ratings": "completedAt",
    ticketTransactions: "createdAt",
    missionAttempts: "updatedAt",
    raffleAttempts: "selectedAt",
  };
  const selected = (name: string) =>
    c
      .rows(name)
      .filter(
        (r) =>
          (c.eligible(r) ||
            (allRoles && !c.allProfiles.has(analyticsText(r.participantId)))) &&
          c.inPeriod(r[fields[name]]),
      );
  const orphan: QualityExample[] = [],
    undated: QualityExample[] = [];
  for (const [name, field] of Object.entries(fields))
    for (const r of c.rows(name)) {
      if (
        !timestamp(r[field]) &&
        (c.eligible(r) ||
          (allRoles && !c.allProfiles.has(analyticsText(r.participantId))))
      )
        undated.push({
          id: r.id,
          participantId: c.allowed.has(analyticsText(r.participantId))
            ? analyticsText(r.participantId)
            : undefined,
          detail: `${name}: data ausente ou inválida; não entra nas estatísticas cronológicas.`,
        });
      else if (
        allRoles &&
        c.inPeriod(r[field]) &&
        !c.allProfiles.has(analyticsText(r.participantId))
      )
        orphan.push({
          id: r.id,
          detail: `${name}: perfil referenciado não existe.`,
        });
    }
  check(
    "orphan-profiles",
    "Registros sem perfil correspondente",
    "error",
    "Período",
    "registros",
    "Não é possível atribuir papel a perfis ausentes; esta checagem integral fica disponível em Todos os papéis.",
    orphan,
  );
  check(
    "undated",
    "Registros sem data válida",
    "warning",
    "Base selecionada, sem data atribuível",
    "registros",
    "Registros sem data são excluídos dos gráficos; não inferimos que aconteceram durante o evento.",
    undated,
  );
  const references: QualityExample[] = [];
  const maps: Record<string, Set<string>> = {
    mission: new Set(c.rows("missions").map((r) => r.id)),
    company: new Set(c.rows("companies").map((r) => r.id)),
    tag: new Set(c.rows("tags").map((r) => r.id)),
  };
  for (const r of selected("activityCompletions"))
    if (!maps[analyticsText(r.activityType)]?.has(analyticsText(r.activityId)))
      references.push({
        id: r.id,
        participantId: analyticsText(r.participantId),
        detail: "Atividade não encontrada no catálogo atual.",
      });
  const talks = new Set(c.rows("talks").map((r) => r.id));
  for (const r of selected("talk-ratings"))
    if (!talks.has(analyticsText(r.talkId)))
      references.push({
        id: r.id,
        participantId: analyticsText(r.participantId),
        detail: "Palestra não encontrada no catálogo atual.",
      });
  check(
    "missing-catalog",
    "Referências ausentes no catálogo atual",
    "warning",
    "Período",
    "registros",
    "Uma referência ausente pode resultar de remoção posterior do catálogo; exige revisão, não comprova falha da ação.",
    references,
  );
  const duplicates: QualityExample[] = [];
  for (const name of ["activityCompletions", "talk-ratings"]) {
    const seen = new Set<string>();
    for (const r of selected(name)) {
      const key =
        name === "activityCompletions"
          ? JSON.stringify([r.participantId, r.activityType, r.activityId])
          : JSON.stringify([r.participantId, r.talkId]);
      if (seen.has(key))
        duplicates.push({
          id: r.id,
          participantId: analyticsText(r.participantId),
          detail: `${name}: registro adicional para a mesma chave lógica.`,
        });
      seen.add(key);
    }
  }
  check(
    "duplicate-actions",
    "Conclusões ou avaliações com chave repetida",
    "error",
    "Período",
    "registros adicionais",
    "Conta apenas os registros excedentes por participante e atividade/palestra.",
    duplicates,
  );
  const emails = new Map<string, string>(),
    duplicateEmails: QualityExample[] = [];
  for (const p of c.profiles) {
    const email = analyticsText(p.email).trim().toLowerCase();
    if (email && emails.has(email))
      duplicateEmails.push({
        id: p.id,
        participantId: p.id,
        detail: `Outro perfil usa o mesmo e-mail: ${emails.get(email)}.`,
      });
    else if (email) emails.set(email, p.id);
  }
  check(
    "duplicate-emails",
    "Perfis com e-mail repetido",
    "warning",
    "Cadastro atual",
    "perfis adicionais",
    "Comparação sem diferenciar maiúsculas e minúsculas; não presume que perfis possam ser mesclados.",
    duplicateEmails,
  );
  const pairs = new Set<string>(),
    badConnections: QualityExample[] = [];
  for (const r of c
    .rows("connections")
    .filter((r) => r.status === "accepted" && c.inPeriod(r.acceptedAt))) {
    const raw = Array.isArray(r.participantIds) ? r.participantIds : [],
      pair = analyticsIds(r.participantIds).sort();
    if (!pair.some((id) => c.allowed.has(id)) && !allRoles) continue;
    const key = JSON.stringify(pair);
    if (
      raw.length !== 2 ||
      pair.length !== 2 ||
      pair.some((id) => !c.allProfiles.has(id)) ||
      pairs.has(key)
    )
      badConnections.push({
        id: r.id,
        detail: "Par inválido, perfil ausente ou conexão aceita repetida.",
      });
    pairs.add(key);
  }
  check(
    "invalid-connections",
    "Conexões aceitas inconsistentes",
    "error",
    "Período",
    "registros",
    "Verifica duas pessoas diferentes, existência dos perfis e unicidade do par.",
    badConnections,
  );
  const badScores = selected("talk-ratings")
    .filter((r) =>
      ["speakerRating", "contentRating", "comprehensionRating"].some(
        (k) =>
          typeof r[k] !== "number" ||
          !Number.isInteger(r[k]) ||
          (r[k] as number) < 1 ||
          (r[k] as number) > 5,
      ),
    )
    .map((r) => ({
      id: r.id,
      participantId: analyticsText(r.participantId),
      detail: "Há nota ausente ou fora da escala inteira de 1 a 5.",
    }));
  check(
    "invalid-ratings",
    "Avaliações com notas inválidas",
    "error",
    "Período",
    "avaliações",
    "A análise aprofundada das notas descarta valores inválidos de cada dimensão.",
    badScores,
  );
  const balances = new Map<string, number>();
  for (const r of c.rows("ticketTransactions")) {
    const id = analyticsText(r.participantId);
    if (c.allowed.has(id))
      balances.set(
        id,
        (balances.get(id) ?? 0) + analyticsNumber(r.ticketDelta),
      );
  }
  check(
    "ticket-balances",
    "Saldos de tickets divergentes do histórico",
    "error",
    "Saldo atual e histórico completo",
    "perfis",
    "Conferência contábil inclui o saldo de abertura; não inclui ações anteriores às 08h nos gráficos.",
    c.profiles
      .filter(
        (p) => analyticsNumber(p.ticketBalance) !== (balances.get(p.id) ?? 0),
      )
      .map((p) => ({
        id: p.id,
        participantId: p.id,
        detail: `Saldo atual ${analyticsNumber(p.ticketBalance)}; soma do histórico ${balances.get(p.id) ?? 0}.`,
      })),
  );
  const expected = new Map(
    c.profiles.map((p) => [
      p.id,
      {
        connectionsCount: 0,
        companiesVisitedCount: 0,
        tagsDiscoveredCount: 0,
        missionsCompletedCount: 0,
      },
    ]),
  );
  for (const r of c.rows("activityCompletions")) {
    const item = expected.get(analyticsText(r.participantId));
    if (!item) continue;
    const key = (
      {
        company: "companiesVisitedCount",
        tag: "tagsDiscoveredCount",
        mission: "missionsCompletedCount",
      } as const
    )[analyticsText(r.activityType) as "company" | "tag" | "mission"];
    if (key) item[key]++;
  }
  for (const r of c.rows("connections"))
    if (r.status === "accepted")
      for (const id of analyticsIds(r.participantIds)) {
        const item = expected.get(id);
        if (item) item.connectionsCount++;
      }
  const summaries = new Map(
      c
        .rows("participantSummaries")
        .map((r) => [analyticsText(r.participantId), r]),
    ),
    missingSummaries: QualityExample[] = [],
    wrongSummaries: QualityExample[] = [];
  for (const p of c.profiles) {
    const summary = summaries.get(p.id);
    if (!summary) {
      if (
        p.onboardingCompleted &&
        (analyticsIds(p.accessRoles).length
          ? analyticsIds(p.accessRoles)
          : ["participant"]
        ).includes("participant")
      )
        missingSummaries.push({
          id: p.id,
          participantId: p.id,
          detail:
            "Perfil participante com onboarding concluído e sem resumo materializado.",
        });
      continue;
    }
    const differences = Object.entries(expected.get(p.id)!).filter(
      ([key, value]) => analyticsNumber(summary[key]) !== value,
    );
    if (differences.length)
      wrongSummaries.push({
        id: summary.id,
        participantId: p.id,
        detail: differences
          .map(
            ([key, value]) =>
              `${key}: resumo ${analyticsNumber(summary[key])}, registros ${value}`,
          )
          .join("; "),
      });
  }
  check(
    "missing-summaries",
    "Resumos materializados ausentes",
    "info",
    "Snapshot atual",
    "perfis",
    "O dashboard calcula ações a partir dos registros; não corrige resumos automaticamente.",
    missingSummaries,
  );
  check(
    "wrong-summaries",
    "Contadores do resumo divergentes",
    "warning",
    "Snapshot atual e histórico completo",
    "perfis",
    "Compara o resumo atual com todas as conclusões e conexões aceitas do evento; esta conferência não mede participação do período.",
    wrongSummaries,
  );
  check(
    "invalid-stock",
    "Estoque atual inválido",
    "error",
    "Catálogo atual",
    "brindes",
    "Estoque deve ser um inteiro não negativo; não usamos uma quantidade oficial anterior ao CRUD.",
    c
      .rows("rewards")
      .filter(
        (r) =>
          typeof r.stock !== "number" ||
          !Number.isInteger(r.stock) ||
          r.stock < 0,
      )
      .map((r) => ({
        id: r.id,
        detail: "Estoque ausente, fracionário ou negativo.",
      })),
  );
  const orphanWinners = c
    .rows("raffles")
    .filter(
      (r) =>
        r.status === "drawn" &&
        c.inPeriod(r.drawnAt) &&
        !c.allProfiles.has(analyticsText(r.winnerId)) &&
        allRoles,
    )
    .map((r) => ({
      id: r.id,
      detail: "Ganhador confirmado sem perfil correspondente.",
    }));
  check(
    "orphan-winners",
    "Ganhadores sem perfil disponível",
    "warning",
    "Período",
    "sorteios",
    "O resultado histórico é preservado, mas o e-mail não pode ser recuperado do perfil.",
    orphanWinners,
  );
  return {
    checks,
    failed: checks.filter((q) => q.count > 0).length,
    executed: checks.length,
    errors: checks.filter((q) => q.level === "error" && q.count > 0).length,
    warnings: checks.filter((q) => q.level === "warning" && q.count > 0).length,
  };
}
export type DataQuality = ReturnType<typeof buildDataQuality>;
