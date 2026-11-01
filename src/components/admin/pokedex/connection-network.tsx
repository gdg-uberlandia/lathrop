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
        title="Participantes na rede"
        description="Conexões reais entre participantes, apresentadas em listas e indicadores."
      >
        <div className="flex flex-wrap gap-4">
          <button
            type="button"
            className="text-sm text-blue-700 hover:underline"
            onClick={() =>
              explore({
                segment: "network",
                value: "connected",
                title: "Participantes com conexões",
              })
            }
          >
            Ver participantes conectados
          </button>
          <button
            type="button"
            className="text-sm text-blue-700 hover:underline"
            onClick={() =>
              explore({
                segment: "network",
                value: "isolated",
                title: "Participantes sem conexões",
              })
            }
          >
            Ver participantes sem conexões
          </button>
        </div>
        {query.isFetching && focus && (
          <p role="status" className="mt-3 text-xs text-slate-500">
            Carregando conexões…
          </p>
        )}
        {query.error && (
          <AdminErrorState
            message={getAdminApiErrorMessage(
              query.error,
              "Erro ao carregar conexões.",
            )}
            onRetry={() => void query.refetch()}
          />
        )}
        {focus && graph.focusId === focus && (
          <div className="mt-4">
            <h3 className="mb-3 font-medium">
              Conexões de{" "}
              {graph.nodes.find((n) => n.id === graph.focusId)?.name ??
                "participante"}
            </h3>
            <DataTable
              searchable
              headers={["Participante", "Conexões no evento", "Estatísticas"]}
              rows={graph.nodes
                .filter((n) => n.id !== graph.focusId)
                .map((n) => ({
                  key: n.id,
                  search: n.name,
                  cells: [
                    n.name,
                    n.degree,
                    <ParticipantAnalyticsLink key="profile" id={n.id}>
                      Ver estatísticas
                    </ParticipantAnalyticsLink>,
                  ],
                }))}
            />
            <p className="mt-2 text-xs text-slate-500">
              Mostrando {Math.max(0, graph.nodes.length - 1)} de{" "}
              {Math.max(0, graph.totalNodes - 1)} conexões desta pessoa.
            </p>
          </div>
        )}
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
