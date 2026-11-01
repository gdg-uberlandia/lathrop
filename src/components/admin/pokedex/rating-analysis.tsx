import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ParticipantAnalyticsLink } from "./participant-link";
import type { RatingAnalysis as Analysis } from "@/lib/rating-analysis";
import { ratingDimensions } from "@/lib/rating-analysis";
import type { DashboardFilters } from "@/lib/pokedex-dashboard";
import { adminApiRequest } from "@/lib/admin-api/client";
import {
  AdminPagination,
  AdminLoadingState,
  AdminErrorState,
} from "@/components/admin/admin-page";
import { getAdminApiErrorMessage } from "@/lib/admin-api/errors";
import { Panel, DataTable } from "./dashboard-ui";
import { useDashboardExplorer } from "./dashboard-explorer";
const labels = {
  speakerRating: "Palestrante",
  contentRating: "Conteúdo",
  comprehensionRating: "Compreensão",
};
const score = (n: number | null) =>
  n === null ? "—" : n.toLocaleString("pt-BR", { maximumFractionDigits: 2 });
type Comments = {
  items: {
    id: string;
    participantId: string;
    name: string;
    comment: string;
    at: string;
  }[];
  page: number;
  pageCount: number;
  total: number;
};
export function RatingAnalysis({
  data,
  filters,
}: {
  data: Analysis;
  filters: DashboardFilters;
}) {
  const [dimension, setDimension] =
      useState<(typeof ratingDimensions)[number]>("contentRating"),
    [minimum, setMinimum] = useState(1),
    [selected, setSelected] = useState(""),
    [page, setPage] = useState(1);
  const explore = useDashboardExplorer();
  const visible = data.talks.filter(
      (t) => t.reviewers >= minimum && t.dimensions[dimension].mean !== null,
    ),
    current = data.talks.find((t) => t.id === selected);
  const comments = useQuery({
    queryKey: ["admin", "rating-comments", filters, selected, page],
    enabled: Boolean(selected),
    queryFn: ({ signal }) =>
      adminApiRequest<Comments>("/api/v1/pokedex-rating-comments", {
        signal,
        query: { ...filters, talkId: selected, page },
      }),
  });
  const select = (id: string) => {
    setSelected(id);
    setPage(1);
  };
  return (
    <div className="space-y-5">
      <Panel
        title="Análise das avaliações"
        description="Notas altas com poucos avaliadores devem ser interpretadas com cautela."
      >
        <div className="flex flex-wrap gap-4">
          <label className="text-sm text-slate-600">
            Dimensão
            <select
              className="ml-2 rounded border p-2"
              value={dimension}
              onChange={(e) => setDimension(e.target.value as typeof dimension)}
            >
              {ratingDimensions.map((d) => (
                <option key={d} value={d}>
                  {labels[d]}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm text-slate-600">
            Mínimo de avaliadores
            <input
              type="number"
              min="1"
              max="100000"
              value={minimum}
              onChange={(e) =>
                setMinimum(
                  Math.max(1, Math.min(100000, Number(e.target.value) || 1)),
                )
              }
              className="ml-2 w-20 rounded border p-2"
            />
          </label>
        </div>
        <p className="mt-4 text-sm text-slate-500">
          Compare as notas e o tamanho da amostra na tabela abaixo.
        </p>
      </Panel>
      <Panel title="Distribuição das notas e comentários">
        <DataTable
          headers={[
            "Palestra",
            "Avaliadores",
            "Média",
            "Mediana",
            "Desvio padrão",
            "Detalhes",
          ]}
          searchable
          rows={visible.map((t) => ({
            key: t.id,
            search: t.title,
            cells: [
              t.title,
              t.reviewers,
              score(t.dimensions[dimension].mean),
              score(t.dimensions[dimension].median),
              score(t.dimensions[dimension].deviation),
              <button
                key="select"
                type="button"
                onClick={() => select(t.id)}
                className="text-blue-700 hover:underline"
              >
                Ver distribuição e comentários
              </button>,
            ],
          }))}
        />
        {current && (
          <div className="mt-6 space-y-4 rounded-xl bg-slate-50 p-4">
            <h3 className="font-semibold text-slate-900">
              {current.title} · {labels[dimension]}
            </h3>
            <DataTable
              headers={["Nota", "Quantidade"]}
              rows={current.dimensions[dimension].distribution.map((d) => ({
                key: String(d.score),
                cells: [d.score, d.count],
              }))}
            />
            <button
              type="button"
              className="text-sm font-medium text-blue-700 hover:underline"
              onClick={() =>
                explore({
                  segment: "talk",
                  value: current.id,
                  title: `Avaliadores de ${current.title}`,
                })
              }
            >
              Ver avaliadores
            </button>
            <h4 className="pt-3 text-sm font-semibold">Comentários</h4>
            {comments.isPending && <AdminLoadingState />}
            {comments.error && (
              <AdminErrorState
                message={getAdminApiErrorMessage(
                  comments.error,
                  "Erro ao carregar comentários.",
                )}
                onRetry={() => void comments.refetch()}
              />
            )}
            <ul className="space-y-3">
              {comments.data?.items.map((r) => (
                <li
                  key={r.id}
                  className="rounded-lg border border-slate-200 bg-white p-3"
                >
                  <p className="whitespace-pre-wrap break-words text-sm text-slate-700">
                    {r.comment}
                  </p>
                  <p className="mt-2 text-xs text-slate-500">
                    <ParticipantAnalyticsLink id={r.participantId}>
                      {r.name}
                    </ParticipantAnalyticsLink>{" "}
                    ·{" "}
                    {new Date(r.at).toLocaleString("pt-BR", {
                      timeZone: "America/Sao_Paulo",
                    })}
                  </p>
                </li>
              ))}
            </ul>
            {comments.data && !comments.data.items.length && (
              <p className="text-sm text-slate-500">
                Sem comentários no recorte.
              </p>
            )}
            {comments.data && (
              <AdminPagination {...comments.data} onPageChange={setPage} />
            )}
          </div>
        )}
      </Panel>
    </div>
  );
}
