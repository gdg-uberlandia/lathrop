import { ActivityHeatmap } from "@/components/admin/pokedex/activity-heatmap";
import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, Download, RefreshCw } from "lucide-react";
import { Button } from "@/assets/components/ui/button";
import {
  AdminPageHeader,
  AdminErrorState,
  AdminLoadingState,
  AdminPagination,
} from "@/components/admin/admin-page";
import { useAuth } from "@/context/AuthContext";
import { adminApiRequest } from "@/lib/admin-api/client";
import { getAdminApiErrorMessage } from "@/lib/admin-api/errors";
import type { PokedexDashboard } from "@/lib/pokedex-dashboard";
import { dashboardCsv } from "@/lib/dashboard-csv";

const tabs = [
  "Visão geral",
  "Engajamento",
  "Empresas",
  "Brindes e tickets",
  "Avaliações",
  "Ganhadores",
] as const;
const number = (n: number) => n.toLocaleString("pt-BR");
const score = (n: number | null) =>
  n === null
    ? "—"
    : n.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
const dateTime = (v: string) =>
  new Date(v).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
const labels: Record<string, string> = {
  mission: "Missões",
  company: "Visitas a empresas",
  tag: "Tags descobertas",
  passed: "Aprovado",
  failed: "Reprovado",
  exhausted: "Tentativas esgotadas",
  unknown: "Não informado",
  completed: "Concluído",
  "in-progress": "Em andamento",
};
const inputClass =
  "h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500";
function Panel({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="admin-surface min-w-0 rounded-xl">
      <header className="border-b border-slate-200 p-4">
        <h2 className="font-semibold text-slate-900">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        )}
      </header>
      <div className="p-4">{children}</div>
    </section>
  );
}
function Cards({ items }: { items: [string, number, string][] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {items.map(([label, value, detail]) => (
        <div key={label} className="admin-surface rounded-xl p-5">
          <p className="text-sm text-slate-500">{label}</p>
          <p className="my-2 text-3xl font-semibold tracking-tight text-slate-950">
            {number(value)}
          </p>
          <p className="text-xs text-slate-500">{detail}</p>
        </div>
      ))}
    </div>
  );
}
function Bars({ items }: { items: { label: string; value: number }[] }) {
  const max = Math.max(1, ...items.map((i) => i.value));
  return (
    <div className="space-y-4">
      {items.map((i) => (
        <div key={i.label}>
          <div className="mb-1 flex justify-between gap-3 text-sm">
            <span className="text-slate-700">{i.label}</span>
            <strong>{number(i.value)}</strong>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-blue-600"
              style={{ width: `${(i.value / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
      {!items.length && (
        <p className="py-6 text-sm text-slate-500">
          Nenhum registro no período.
        </p>
      )}
    </div>
  );
}
function DataTable({
  headers,
  rows,
  searchable = false,
}: {
  headers: string[];
  rows: { key: string; search?: string; cells: ReactNode[] }[];
  searchable?: boolean;
}) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const normalized = (s: string) =>
    s
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase("pt-BR");
  const filtered = rows.filter(
    (r) => !search || normalized(r.search ?? "").includes(normalized(search)),
  );
  const pageCount = Math.max(1, Math.ceil(filtered.length / 15));
  const safePage = Math.min(page, pageCount);
  useEffect(() => setPage(1), [search]);
  return (
    <>
      {searchable && (
        <label className="mb-4 block">
          <span className="sr-only">Buscar na tabela</span>
          <input
            className={`${inputClass} w-full sm:max-w-md`}
            type="search"
            placeholder="Buscar por nome, prêmio ou e-mail…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr>
              {headers.map((h) => (
                <th
                  key={h}
                  scope="col"
                  className="whitespace-nowrap border-b border-slate-200 px-3 py-3 font-medium text-slate-500"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.slice((safePage - 1) * 15, safePage * 15).map((r) => (
              <tr
                key={r.key}
                className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
              >
                {r.cells.map((c, i) => (
                  <td key={i} className="px-3 py-3 text-slate-800">
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {!filtered.length && (
          <p className="py-8 text-center text-sm text-slate-500">
            Nenhum registro encontrado para os filtros selecionados.
          </p>
        )}
      </div>
      <AdminPagination
        page={safePage}
        pageCount={pageCount}
        total={filtered.length}
        onPageChange={setPage}
      />
    </>
  );
}
function exportWinners(data: PokedexDashboard) {
  const csv = dashboardCsv([
    ["Prêmio", "Ganhador", "E-mail", "Confirmação (Brasília)"],
    ...data.winners.map((w) => [
      w.prizeName,
      w.name,
      w.email ?? "Perfil indisponível",
      dateTime(w.confirmedAt),
    ]),
  ]);
  const url = URL.createObjectURL(
    new Blob([csv], { type: "text/csv;charset=utf-8;" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = "ganhadores-pokedex.csv";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export default function PokedexDashboardPage() {
  const { isAdmin } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<(typeof tabs)[number]>("Visão geral");
  useEffect(() => {
    const section = router.query.section;
    if (
      typeof section === "string" &&
      tabs.includes(section as (typeof tabs)[number])
    ) {
      setTab(section as (typeof tabs)[number]);
    }
  }, [router.query.section]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [role, setRole] = useState("all");
  const [filters, setFilters] = useState({ from: "", to: "", role: "all" });
  const invalid = Boolean(from && to && from > to);
  const query = useQuery({
    queryKey: ["admin", "pokedex-dashboard", filters],
    enabled: isAdmin,
    queryFn: ({ signal }) =>
      adminApiRequest<PokedexDashboard>("/api/v1/pokedex-dashboard", {
        signal,
        query: {
          from: filters.from || undefined,
          to: filters.to || undefined,
          role: filters.role,
        },
      }),
  });
  const data = query.data;
  return (
    <main className="space-y-6 p-4 sm:p-6 lg:p-7">
      <AdminPageHeader
        title="Dashboard Pokédex"
        description="Adesão, engajamento e resultados do evento."
        icon={BarChart3}
      />
      <form
        className="admin-surface flex flex-wrap items-end gap-3 rounded-xl p-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!invalid) setFilters({ from, to, role });
        }}
      >
        <label className="space-y-1 text-sm text-slate-600">
          <span className="block">De</span>
          <input
            className={inputClass}
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            max={to || undefined}
          />
        </label>
        <label className="space-y-1 text-sm text-slate-600">
          <span className="block">Até</span>
          <input
            className={inputClass}
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            min={from || undefined}
          />
        </label>
        <label className="space-y-1 text-sm text-slate-600">
          <span className="block">Papel</span>
          <select
            className={inputClass}
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            {[
              ["all", "Todos os papéis"],
              ["participant", "Participantes"],
              ["sponsor", "Patrocinadores"],
              ["reviewer", "Revisores"],
              ["staff", "Equipe"],
              ["editor", "Editores"],
              ["admin", "Administradores"],
            ].map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </label>
        <Button type="submit" disabled={invalid || query.isFetching}>
          Aplicar filtros
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setFrom("");
            setTo("");
            setRole("all");
            setFilters({ from: "", to: "", role: "all" });
          }}
        >
          Todo o evento
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={query.isFetching}
          onClick={() => void query.refetch()}
        >
          <RefreshCw
            className={`mr-2 size-4 ${query.isFetching ? "animate-spin" : ""}`}
          />
          Atualizar
        </Button>
        {invalid && (
          <p role="alert" className="w-full text-sm text-red-700">
            A data inicial deve ser anterior ou igual à final.
          </p>
        )}
      </form>
      {data && (
        <p className="text-xs text-slate-500">
          {data.environment} · {data.eventId} · Dados consultados em{" "}
          {dateTime(data.updatedAt)} · Cache de até 5 minutos · Horários de
          Brasília.
        </p>
      )}
      <nav
        aria-label="Seções do dashboard"
        className="flex gap-2 overflow-x-auto border-b border-slate-200 pb-2"
      >
        {tabs.map((t) => (
          <button
            type="button"
            key={t}
            aria-current={tab === t ? "page" : undefined}
            onClick={() => {
              setTab(t);
              void router.replace(
                {
                  pathname: router.pathname,
                  query: { ...router.query, section: t },
                },
                undefined,
                { shallow: true, scroll: false },
              );
            }}
            className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium ${tab === t ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"}`}
          >
            {t}
          </button>
        ))}
      </nav>
      {query.error && (
        <AdminErrorState
          message={getAdminApiErrorMessage(
            query.error,
            "Não foi possível carregar o dashboard.",
          )}
          onRetry={() => void query.refetch()}
        />
      )}
      {query.isPending && (
        <AdminLoadingState label="Calculando os indicadores da Pokédex…" />
      )}
      {data && (
        <>
          {tab === "Visão geral" && (
            <>
              <Cards
                items={[
                  [
                    "Perfis cadastrados",
                    data.base.profiles,
                    "Base até o fim do período, no papel selecionado",
                  ],
                  [
                    "Onboarding concluído",
                    data.base.onboarded,
                    `${data.base.profiles ? ((data.base.onboarded / data.base.profiles) * 100).toFixed(1) : 0}% da base selecionada`,
                  ],
                  [
                    "Usuários ativos",
                    data.metrics.active,
                    "Pessoas únicas com ação válida no período",
                  ],
                  [
                    "Atividades concluídas",
                    data.metrics.activities,
                    "Missões, visitas e tags no período",
                  ],
                  [
                    "Conexões aceitas",
                    data.metrics.connections,
                    "Pares com ao menos uma pessoa da base selecionada",
                  ],
                  [
                    "Pessoas que resgataram",
                    data.metrics.redeemers,
                    "Pessoas únicas com resgate no período",
                  ],
                ]}
              />
              <p className="text-sm text-slate-600">
                Ativo = concluiu atividade, aceitou conexão, avaliou palestra ou
                resgatou brinde. Cadastro e login, sozinhos, não contam como
                atividade. Esta métrica não indica quem está online agora.
              </p>
              <Panel
                title="Mapa de calor do evento"
                description="Descubra os horários de maior participação por tipo de atividade."
              >
                <ActivityHeatmap data={data.heatmap} />
              </Panel>
              <Panel
                title="Atividade por hora"
                description="Ações e pessoas únicas por hora com registros; uma pessoa pode aparecer em várias horas."
              >
                <div className="overflow-x-auto">
                  <div className="flex h-48 min-w-max items-end gap-2 pb-6">
                    {data.timeline.map((b) => (
                      <div
                        key={b.hour}
                        className="flex h-full w-16 flex-col justify-end text-center"
                      >
                        <span className="mb-1 text-xs font-medium text-slate-700">
                          {number(b.actions)}
                        </span>
                        <div
                          role="img"
                          aria-label={`${b.hour.replace("T", " às ")}h: ${b.actions} ações, ${b.active} pessoas`}
                          title={`${b.active} pessoas únicas`}
                          className="mx-auto w-9 rounded-t bg-blue-600"
                          style={{
                            height: `${Math.max(2, (b.actions / Math.max(1, ...data.timeline.map((x) => x.actions))) * 120)}px`,
                          }}
                        />
                        <span className="mt-2 whitespace-nowrap text-[10px] text-slate-500">
                          {b.hour.slice(8, 10)}/{b.hour.slice(5, 7)}{" "}
                          {b.hour.slice(11)}h
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                {!data.timeline.length && (
                  <p className="text-sm text-slate-500">
                    Nenhuma atividade no período.
                  </p>
                )}
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm text-blue-700">
                    Ver dados do gráfico
                  </summary>
                  <DataTable
                    headers={["Hora (Brasília)", "Ações", "Pessoas únicas"]}
                    rows={data.timeline.map((b) => ({
                      key: b.hour,
                      cells: [
                        b.hour.replace("T", " ") + "h",
                        number(b.actions),
                        number(b.active),
                      ],
                    }))}
                  />
                </details>
              </Panel>
            </>
          )}
          {tab === "Engajamento" && (
            <>
              <Cards
                items={[
                  [
                    "Novos perfis",
                    data.base.newProfiles,
                    "Criados no período selecionado",
                  ],
                  [
                    "XP atual da base",
                    data.base.xp,
                    "Saldo atual; não representa XP ganho no período",
                  ],
                  [
                    "Tickets atuais da base",
                    data.base.ticketBalance,
                    "Saldo atual dos perfis selecionados",
                  ],
                ]}
              />
              <div className="grid gap-5 lg:grid-cols-2">
                <Panel title="Participação por atividade">
                  <DataTable
                    headers={["Tipo", "Conclusões", "Pessoas únicas"]}
                    rows={data.activityTypes.map((r) => ({
                      key: r.type,
                      cells: [
                        labels[r.type],
                        number(r.count),
                        number(r.participants),
                      ],
                    }))}
                  />
                </Panel>
                <Panel title="Distribuição atual de XP">
                  <Bars
                    items={data.xpBands.map((x) => ({
                      label: x.label,
                      value: x.count,
                    }))}
                  />
                </Panel>
              </div>
              <Panel
                title="Missões e tags"
                description="Inclui atividades sem conclusões, para identificar menor adesão."
              >
                <DataTable
                  searchable
                  headers={["Atividade", "Tipo", "Conclusões"]}
                  rows={data.activities.map((r) => ({
                    key: `${r.type}:${r.id}`,
                    search: r.name,
                    cells: [r.name, labels[r.type], number(r.count)],
                  }))}
                />
              </Panel>
              <Panel
                title="Resultados registrados dos quizzes"
                description="Último resultado de cada participante por missão, atualizado no período; não é o histórico de todas as tentativas."
              >
                <Bars
                  items={data.outcomes.map((x) => ({
                    label: labels[x.outcome] ?? x.outcome,
                    value: x.count,
                  }))}
                />
              </Panel>
            </>
          )}
          {tab === "Empresas" && (
            <Panel
              title="Alcance dos estandes"
              description="Visitantes únicos no período. Alcance calculado sobre a base do papel selecionado."
            >
              <DataTable
                searchable
                headers={["Empresa", "Visitantes únicos", "Visitas", "Alcance"]}
                rows={data.companies.map((c) => ({
                  key: c.id,
                  search: c.name,
                  cells: [
                    c.name,
                    number(c.visitors),
                    number(c.visits),
                    `${c.reach.toFixed(1)}%`,
                  ],
                }))}
              />
            </Panel>
          )}
          {tab === "Brindes e tickets" && (
            <>
              <Cards
                items={[
                  [
                    "Unidades resgatadas",
                    data.metrics.redeemed,
                    "Cada unidade de brinde conta uma vez",
                  ],
                  [
                    "Tickets gastos em brindes",
                    data.rewards.reduce((s, r) => s + r.ticketsSpent, 0),
                    "Movimentos no período selecionado",
                  ],
                  [
                    "Tickets disponíveis agora",
                    data.base.ticketBalance,
                    "Saldo atual dos perfis selecionados",
                  ],
                ]}
              />
              <Panel
                title="Brindes"
                description="Estoque e disponibilidade são atuais, conforme o CRUD de brindes. Resgates e tickets seguem os filtros; sem datas, exibem o histórico acumulado."
              >
                <DataTable
                  headers={[
                    "Brinde",
                    "Disponibilidade atual",
                    "Estoque atual",
                    "Unidades resgatadas",
                    "Pessoas",
                    "Tickets gastos",
                  ]}
                  rows={data.rewards.map((r) => ({
                    key: r.id,
                    cells: [
                      r.name,
                      r.active ? "Ativo" : "Inativo",
                      number(r.stock),
                      number(r.redeemed),
                      number(r.redeemers),
                      number(r.ticketsSpent),
                    ],
                  }))}
                />
              </Panel>
            </>
          )}
          {tab === "Avaliações" && (
            <>
              <Cards
                items={[
                  ["Avaliações", data.metrics.ratings, "Registros no período"],
                  [
                    "Avaliadores únicos",
                    data.metrics.reviewers,
                    "Cada pessoa conta uma vez, mesmo avaliando várias palestras",
                  ],
                  [
                    "Palestras avaliadas",
                    data.talkRatings.filter((t) => t.count > 0).length,
                    "Palestras com ao menos uma avaliação",
                  ],
                ]}
              />
              <Panel
                title="Avaliações por palestra"
                description="Notas de 1 a 5. Considere o número de avaliadores ao comparar as médias. Um traço indica ausência de avaliações."
              >
                <DataTable
                  searchable
                  headers={[
                    "Palestra",
                    "Avaliações",
                    "Avaliadores únicos",
                    "Palestrante",
                    "Conteúdo",
                    "Compreensão",
                  ]}
                  rows={data.talkRatings.map((t) => ({
                    key: t.id,
                    search: t.title,
                    cells: [
                      t.title,
                      number(t.count),
                      number(t.reviewers),
                      score(t.speaker),
                      score(t.content),
                      score(t.comprehension),
                    ],
                  }))}
                />
              </Panel>
            </>
          )}
          {tab === "Ganhadores" && (
            <Panel
              title="Ganhadores dos sorteios"
              description="Somente ganhadores confirmados. Filtros de período usam a data de confirmação; candidatos pendentes e ausentes ficam de fora."
            >
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-slate-600">
                  {number(data.winners.length)} resultado(s) · E-mails
                  disponíveis somente no painel administrativo.
                </p>
                <Button
                  variant="outline"
                  disabled={!data.winners.length}
                  onClick={() => exportWinners(data)}
                >
                  <Download className="mr-2 size-4" />
                  Exportar resultados CSV
                </Button>
              </div>
              <DataTable
                searchable
                headers={[
                  "Prêmio",
                  "Ganhador",
                  "E-mail",
                  "Confirmação (Brasília)",
                  "Estatísticas",
                ]}
                rows={data.winners.map((w) => ({
                  key: w.id,
                  search: `${w.prizeName} ${w.name} ${w.email ?? ""}`,
                  cells: [
                    w.prizeName,
                    w.name,
                    w.email ? (
                      <a
                        href={`mailto:${w.email}`}
                        className="text-blue-700 hover:underline"
                      >
                        {w.email}
                      </a>
                    ) : (
                      <span className="text-slate-500">
                        Perfil indisponível
                      </span>
                    ),
                    dateTime(w.confirmedAt),
                    <Link
                      key="statistics"
                      href={`/admin/pokedex/participants/${encodeURIComponent(w.participantId)}`}
                      className="whitespace-nowrap font-medium text-blue-700 hover:underline"
                      aria-label={`Ver estatísticas de ${w.name}`}
                    >
                      Ver estatísticas
                    </Link>,
                  ],
                }))}
              />
            </Panel>
          )}
        </>
      )}
    </main>
  );
}
