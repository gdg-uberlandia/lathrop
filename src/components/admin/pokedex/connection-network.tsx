import { useState } from "react";
import { ParticipantAnalyticsLink } from "./participant-link";
import { useQuery } from "@tanstack/react-query";
import { adminApiRequest } from "@/lib/admin-api/client";
import { getAdminApiErrorMessage } from "@/lib/admin-api/errors";
import { AdminErrorState } from "@/components/admin/admin-page";
import type { ConnectionNetwork as Network } from "@/lib/connection-network";
import type { DashboardFilters } from "@/lib/pokedex-dashboard";
import { Panel, Cards, DataTable } from "./dashboard-ui";
import { useDashboardExplorer } from "./dashboard-explorer";
export function ConnectionNetwork({
  data,
  filters,
}: {
  data: Network;
  filters: DashboardFilters;
}) {
  const [focus, setFocus] = useState(""),
    explore = useDashboardExplorer();
  const query = useQuery({
    queryKey: ["admin", "pokedex-network", filters, focus],
    enabled: Boolean(focus),
    queryFn: ({ signal }) =>
      adminApiRequest<Network>("/api/v1/pokedex-network", {
        signal,
        query: { ...filters, focusId: focus },
      }),
  });
  const network = focus ? (query.data ?? data) : data,
    graph = network.graph;
  const points = new Map(
    graph.nodes.map((node, i) => {
      const center = graph.focusId === node.id,
        angle = (i / Math.max(1, graph.nodes.length)) * Math.PI * 2;
      return [
        node.id,
        {
          x: center ? 320 : 320 + Math.cos(angle) * (190 + (i % 3) * 12),
          y: center ? 230 : 230 + Math.sin(angle) * (175 + (i % 3) * 10),
        },
      ];
    }),
  );
  return (
    <div className="space-y-5">
      <Cards
        items={[
          [
            "Conexões na rede",
            data.edges,
            "Pares únicos entre perfis da base selecionada",
          ],
          [
            "Pessoas conectadas",
            data.connected,
            "Ao menos uma conexão aceita no período",
          ],
          ["Sem conexões no recorte", data.isolated, "Perfis com grau zero"],
          [
            "Grupos conectados",
            data.components,
            "Componentes com ao menos duas pessoas",
          ],
          [
            "Maior grupo",
            data.largestComponent,
            "Inclui componente isolado se não houver conexões",
          ],
          [
            "Média de conexões",
            Number(data.averageDegree.toFixed(2)),
            "Duas pontas por conexão, divididas pela base",
          ],
        ]}
      />
      <Panel
        title="Mapa da rede"
        description="Visualização limitada para manter a leitura. Os indicadores e o ranking usam toda a rede do recorte."
      >
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            {graph.nodes.length} de {graph.totalNodes} perfis ·{" "}
            {graph.edges.length} de {graph.totalEdges} ligações entre os perfis
            da amostra
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              className="text-sm text-blue-700 hover:underline"
              onClick={() => setFocus("")}
            >
              Visão geral
            </button>
            <button
              type="button"
              className="text-sm text-blue-700 hover:underline"
              onClick={() =>
                explore({
                  segment: "network",
                  value: "isolated",
                  title: "Sem conexões no recorte",
                })
              }
            >
              Ver pessoas sem conexões
            </button>
          </div>
        </div>
        {query.isFetching && focus && (
          <p role="status" className="text-xs text-slate-500">
            Carregando a rede selecionada…
          </p>
        )}
        {query.error && (
          <AdminErrorState
            message={getAdminApiErrorMessage(
              query.error,
              "Erro ao carregar rede.",
            )}
            onRetry={() => void query.refetch()}
          />
        )}
        <svg
          viewBox="0 0 640 460"
          className="w-full rounded-xl bg-slate-50"
          role="img"
          aria-label="Mapa ilustrativo de conexões aceitas. Selecione uma pessoa para explorar sua rede."
        >
          {graph.edges.map((e) => {
            const a = points.get(e.source)!,
              b = points.get(e.target)!;
            return (
              <line
                key={e.source + e.target}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke="#93c5fd"
                strokeOpacity=".35"
              />
            );
          })}
          {graph.nodes.map((node) => {
            const p = points.get(node.id)!;
            return (
              <circle
                key={node.id}
                cx={p.x}
                cy={p.y}
                r={
                  graph.focusId === node.id
                    ? 12
                    : Math.min(10, 4 + Math.sqrt(node.degree) / 2)
                }
                fill={
                  ["#2563eb", "#10b981", "#f59e0b", "#8b5cf6"][
                    node.component % 4
                  ]
                }
                tabIndex={0}
                role="button"
                aria-label={`${node.name}, ${node.degree} conexões. Explorar rede.`}
                onClick={() => setFocus(node.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setFocus(node.id);
                  }
                }}
                className="cursor-pointer focus:stroke-slate-900 focus:stroke-2"
              >
                <title>
                  {node.name} · {node.degree} conexões
                </title>
              </circle>
            );
          })}
        </svg>
        <p className="mt-3 text-xs text-slate-500">
          Amostra de até 60 pessoas e 300 ligações. Na visão geral, inclui os
          maiores graus; ao selecionar uma pessoa, mostra sua vizinhança.
          Posições e distâncias são ilustrativas. Cores distinguem grupos
          conectados, com reutilização de cores.
        </p>
      </Panel>
      <Panel title="Participantes com mais conexões no recorte">
        <DataTable
          searchable
          headers={["Participante", "Conexões", "Rede", "Perfil"]}
          rows={data.leaders.map((p) => ({
            key: p.id,
            search: p.name,
            cells: [
              p.name,
              p.degree,
              <button
                key="network"
                type="button"
                className="text-blue-700 hover:underline"
                onClick={() => setFocus(p.id)}
              >
                Explorar rede
              </button>,
              <ParticipantAnalyticsLink key="profile" id={p.id}>
                Ver estatísticas
              </ParticipantAnalyticsLink>,
            ],
          }))}
        />
      </Panel>
      <Panel title="Conexões entre interesses declarados distintos">
        <p className="text-3xl font-semibold text-slate-900">
          {data.crossInterestEdges}{" "}
          <span className="text-sm font-normal text-slate-500">
            de {data.comparableEdges} conexões comparáveis
          </span>
        </p>
        <p className="mt-3 text-sm text-slate-500">
          Pares em que ambos informaram interesses, mas não têm interesses em
          comum. Isto não comprova diversidade de comunidades nem influência. Há{" "}
          {data.externalEdges} conexões com uma ponta fora do papel selecionado;
          elas não entram nesta rede.
        </p>
      </Panel>
    </div>
  );
}
