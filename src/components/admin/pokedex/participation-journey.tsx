import type { ParticipationJourney as Journey } from "@/lib/participation-journey";
import { Panel, Bars } from "./dashboard-ui";
import { useDashboardExplorer } from "./dashboard-explorer";
const kinds: Record<string, string> = {
  mission: "Missão",
  company: "Visita a empresa",
  tag: "Tag",
  connection: "Conexão",
  rating: "Avaliação",
  redemption: "Resgate de brinde",
};
const groups: Record<string, string> = {
  activity: "Atividades",
  network: "Networking",
  redemption: "Brindes",
};
export function ParticipationJourney({ data }: { data: Journey }) {
  const explore = useDashboardExplorer();
  return (
    <div className="space-y-5">
      <Panel
        title="Marcos da participação"
        description="Caminhos independentes: uma pessoa pode aparecer em vários marcos, sem precisar seguir esta ordem."
      >
        <div className="space-y-4">
          {data.stages.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() =>
                explore({ segment: "journey", value: s.id, title: s.label })
              }
              className="block w-full rounded-xl p-3 text-left hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <div className="mb-2 flex justify-between gap-3 text-sm">
                <span className="font-medium text-slate-700">{s.label}</span>
                <strong>
                  {s.people.toLocaleString("pt-BR")}{" "}
                  <span className="font-normal text-slate-500">
                    ({s.percent.toFixed(1)}%)
                  </span>
                </strong>
              </div>
              <div className="h-5 rounded-md bg-slate-100">
                <div
                  className="h-full rounded-md"
                  style={{
                    width: `${s.percent}%`,
                    background: [
                      "#64748b",
                      "#2563eb",
                      "#3b82f6",
                      "#10b981",
                      "#f59e0b",
                      "#8b5cf6",
                    ][i],
                  }}
                />
              </div>
            </button>
          ))}
        </div>
        <p className="mt-4 text-xs text-slate-500">
          Percentuais sobre {data.base} perfis no papel selecionado. Onboarding
          é o estado atual do cadastro; os demais marcos usam ações do período.
        </p>
      </Panel>
      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Tempo até a primeira ação do recorte">
          <p className="text-4xl font-semibold text-blue-700">
            {data.medianMinutes === null
              ? "—"
              : data.medianMinutes.toLocaleString("pt-BR", {
                  maximumFractionDigits: 1,
                })}
            <span className="ml-2 text-sm font-normal text-slate-500">
              minutos de mediana
            </span>
          </p>
          <p className="mt-4 text-sm text-slate-500">
            Medido para {data.measuredPeople} pessoas. O relógio começa no
            cadastro ou no início do recorte, o que ocorrer depois. Para
            pré-cadastros, nunca começa antes das 08h do evento.
          </p>
        </Panel>
        <Panel title="Primeira ação observada">
          <Bars
            items={data.entry.map((e) => ({
              label: kinds[e.kind] ?? e.kind,
              value: e.people,
            }))}
          />
        </Panel>
      </div>
      <Panel title="Participação em mais de uma frente">
        <div className="grid gap-4 sm:grid-cols-3">
          {data.overlap.map((o) => (
            <div
              key={o.first + o.second}
              className="rounded-xl bg-slate-50 p-4"
            >
              <p className="text-sm text-slate-500">
                {groups[o.first]} + {groups[o.second]}
              </p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">
                {o.people}
              </p>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
