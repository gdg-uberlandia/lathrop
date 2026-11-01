import { useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, RefreshCw, UserRound } from "lucide-react";
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
import type { ParticipantStatistics } from "@/lib/participant-statistics";
const date = (v: string | null) =>
  v
    ? new Date(v).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })
    : "—";
const number = (n: number) => n.toLocaleString("pt-BR");
const labels: Record<string, string> = {
  mission: "Missão",
  company: "Visita a empresa",
  tag: "Tag",
  confirmed: "Confirmado",
  absent: "Ausente",
  pending: "Aguardando confirmação",
  onboarding_grant: "Bônus de onboarding",
  xp_conversion: "Conversão de XP",
  reward_redemption: "Resgate de brinde",
  completed: "Concluído",
  failed: "Reprovado",
  "in-progress": "Em andamento",
};
function History({
  title,
  description,
  headers,
  rows,
}: {
  title: string;
  description?: string;
  headers: string[];
  rows: { id: string; cells: ReactNode[] }[];
}) {
  const [page, setPage] = useState(1);
  const pageCount = Math.max(1, Math.ceil(rows.length / 15)),
    safePage = Math.min(page, pageCount);
  return (
    <section className="admin-surface min-w-0 overflow-hidden rounded-xl">
      <header className="border-b border-slate-200 p-4">
        <h2 className="font-semibold text-slate-900">
          {title}{" "}
          <span className="text-sm font-normal text-slate-500">
            ({number(rows.length)})
          </span>
        </h2>
        {description && (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        )}
      </header>
      {!rows.length ? (
        <p className="p-5 text-sm text-slate-500">
          Nenhum registro neste evento.
        </p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  {headers.map((h) => (
                    <th
                      scope="col"
                      key={h}
                      className="whitespace-nowrap px-4 py-3 font-medium text-slate-500"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.slice((safePage - 1) * 15, safePage * 15).map((r) => (
                  <tr key={r.id} className="border-t border-slate-100">
                    {r.cells.map((cell, i) => (
                      <td key={i} className="px-4 py-3 text-slate-800">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <AdminPagination
            page={safePage}
            pageCount={pageCount}
            total={rows.length}
            onPageChange={setPage}
          />
        </>
      )}
    </section>
  );
}
export default function ParticipantStatisticsPage() {
  const router = useRouter(),
    { isAdmin } = useAuth();
  const participantId =
    typeof router.query.participantId === "string"
      ? router.query.participantId
      : "";
  const query = useQuery({
    queryKey: ["admin", "pokedex-participant", participantId],
    enabled: isAdmin && router.isReady && Boolean(participantId),
    queryFn: ({ signal }) =>
      adminApiRequest<ParticipantStatistics>(
        `/api/v1/pokedex-participants/${encodeURIComponent(participantId)}`,
        { signal },
      ),
  });
  const data = query.data;
  const [ticketCategory, setTicketCategory] = useState("all");
  return (
    <main className="space-y-6 p-4 sm:p-6 lg:p-7">
      <Link
        href="/admin/pokedex?section=Ganhadores"
        className="inline-flex items-center gap-2 text-sm font-medium text-blue-700 hover:underline"
      >
        <ArrowLeft className="size-4" />
        Voltar aos ganhadores
      </Link>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <AdminPageHeader
          title={data?.profile.name ?? "Estatísticas do participante"}
          description="Participação individual em todo o evento."
          icon={UserRound}
        />
        <Button
          variant="outline"
          disabled={query.isFetching || !participantId}
          onClick={() => void query.refetch()}
        >
          <RefreshCw
            className={`mr-2 size-4 ${query.isFetching ? "animate-spin" : ""}`}
          />
          Atualizar
        </Button>
      </div>
      {query.isPending && !query.error && (
        <AdminLoadingState label="Carregando as estatísticas do participante…" />
      )}
      {query.error && (
        <AdminErrorState
          message={getAdminApiErrorMessage(
            query.error,
            "Não foi possível carregar o participante.",
          )}
          onRetry={() => void query.refetch()}
        />
      )}
      {data && (
        <>
          <section
            className="admin-surface rounded-xl p-5"
            aria-label="Perfil do participante"
          >
            <dl className="grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
              {[
                ["E-mail", data.profile.email || "Não informado"],
                ["Empresa", data.profile.company ?? "Não informada"],
                ["Cargo", data.profile.role ?? "Não informado"],
                ["Papel", data.profile.accessRoles.join(", ")],
                ["Cadastro", date(data.profile.createdAt)],
                [
                  "Onboarding",
                  data.profile.onboardingCompleted ? "Concluído" : "Pendente",
                ],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-slate-500">{label}</dt>
                  <dd className="mt-1 break-words font-medium text-slate-900">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-5 text-xs text-slate-500">
              {data.environment} · {data.eventId} · Consultado em{" "}
              {date(data.updatedAt)} · Horários de Brasília. Última atualização
              do perfil: {date(data.profile.updatedAt)}.
            </p>
          </section>
          <section
            aria-label="Resumo da participação"
            className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
          >
            {[
              ["XP registrado", data.metrics.xp],
              ["XP já convertido", data.metrics.convertedXp],
              ["Saldo atual de tickets", data.metrics.ticketBalance],
              ["Conexões aceitas", data.metrics.connections],
              ["Missões concluídas", data.metrics.missions],
              ["Empresas visitadas", data.metrics.companies],
              ["Tags descobertas", data.metrics.tags],
              ["Avaliações de palestras", data.metrics.ratings],
              ["Brindes resgatados (unidades)", data.metrics.redeemed],
              ["Tickets gastos em brindes", data.metrics.ticketsSpent],
              ["Prêmios confirmados", data.metrics.wins],
              ["Conexões pendentes", data.metrics.pendingConnections],
            ].map(([label, value]) => (
              <div key={String(label)} className="admin-surface rounded-xl p-4">
                <p className="text-sm text-slate-500">{label}</p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">
                  {number(Number(value))}
                </p>
              </div>
            ))}
          </section>
          <p className="text-sm text-slate-600">
            Os dados abrangem todo o evento. XP e tickets mostram os valores
            atuais do perfil; as contagens de atividades são calculadas a partir
            dos registros de conclusão.
          </p>
          <History
            title="Prêmios ganhos"
            headers={["Prêmio", "Confirmação"]}
            rows={data.wins.map((w) => ({
              id: w.id,
              cells: [w.prizeName, date(w.confirmedAt)],
            }))}
          />
          <History
            title="Histórico de sorteios"
            description="Inclui seleções confirmadas, ausências e candidatos aguardando confirmação."
            headers={["Prêmio", "Resultado", "Selecionado em", "Resolvido em"]}
            rows={data.attempts.map((r) => ({
              id: r.id,
              cells: [
                r.prizeName,
                labels[r.status] ?? r.status,
                date(r.selectedAt),
                date(r.resolvedAt),
              ],
            }))}
          />
          <History
            title="Atividades concluídas"
            headers={["Atividade", "Tipo", "XP recebido", "Conclusão"]}
            rows={data.activities.map((r) => ({
              id: r.id,
              cells: [
                r.name,
                labels[r.type] ?? r.type,
                number(r.xp),
                date(r.completedAt),
              ],
            }))}
          />
          <History
            title="Brindes resgatados"
            headers={[
              "Brinde",
              "Quantidade",
              "Tickets gastos",
              "Primeiro resgate",
              "Último resgate",
            ]}
            rows={data.redemptions.map((r) => ({
              id: r.id,
              cells: [
                r.name,
                number(r.quantity),
                number(r.ticketsSpent),
                date(r.firstRedeemedAt),
                date(r.lastRedeemedAt),
              ],
            }))}
          />
          <label className="block text-sm text-slate-600">
            <span className="mb-2 block">Filtrar movimentações de tickets</span>
            <select
              className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-slate-800"
              value={ticketCategory}
              onChange={(event) => setTicketCategory(event.target.value)}
            >
              <option value="all">Todas as movimentações</option>
              <option value="credit">Bônus e conversões de XP</option>
              <option value="reward">Resgates de brindes</option>
              <option value="raffle">Prêmios de sorteios</option>
              <option value="correction">
                Correções de saldo e outros registros
              </option>
            </select>
          </label>
          <History
            key={ticketCategory}
            title="Movimentações de tickets"
            description="Entradas aumentam o saldo; saídas consomem tickets. Brindes e prêmios de sorteios são operações distintas."
            headers={[
              "Movimentação",
              "Entrada / saída",
              "Detalhe",
              "Tickets",
              "XP convertido",
              "Data",
            ]}
            rows={data.tickets
              .filter(
                (r) =>
                  ticketCategory === "all" || r.category === ticketCategory,
              )
              .map((r) => ({
                id: r.id,
                cells: [
                  r.label,
                  r.direction,
                  r.detail ?? "—",
                  `${r.delta > 0 ? "+" : ""}${number(r.delta)}`,
                  number(r.convertedXp),
                  date(r.createdAt),
                ],
              }))}
          />
          <History
            title="Avaliações de palestras"
            description="Notas de 1 a 5 atribuídas por este participante."
            headers={[
              "Palestra",
              "Palestrante",
              "Conteúdo",
              "Compreensão",
              "Data",
            ]}
            rows={data.ratings.map((r) => ({
              id: r.id,
              cells: [
                r.title,
                r.speaker,
                r.content,
                r.comprehension,
                date(r.completedAt),
              ],
            }))}
          />
          <History
            title="Resultados de quizzes"
            description="Último resultado registrado por missão, com o total de tentativas."
            headers={[
              "Missão",
              "Tentativas",
              "Resultado",
              "Acertos",
              "Atualização",
            ]}
            rows={data.quizAttempts.map((r) => ({
              id: r.id,
              cells: [
                r.name,
                r.attempts,
                labels[r.outcome] ?? (r.outcome || "Não informado"),
                r.score !== null
                  ? `${r.score}${r.questions !== null ? ` / ${r.questions}` : ""}`
                  : "—",
                date(r.updatedAt),
              ],
            }))}
          />
        </>
      )}
    </main>
  );
}
