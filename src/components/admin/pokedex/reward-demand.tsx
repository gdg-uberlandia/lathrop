import { useState } from "react";
import type { RewardDemand as Demand } from "@/lib/reward-demand";
import { Panel, Cards, Bars, DataTable } from "./dashboard-ui";
import { useDashboardExplorer } from "./dashboard-explorer";
export function RewardDemand({ data }: { data: Demand }) {
  const [selected, setSelected] = useState("");
  const current =
      data.rewards.find((r) => r.id === selected) ?? data.rewards[0],
    explore = useDashboardExplorer();
  return (
    <div className="space-y-5">
      <Cards
        items={[
          [
            "Unidades resgatadas",
            data.units,
            "Movimentos no período selecionado",
          ],
          ["Pessoas atendidas", data.people, "Cada pessoa conta uma vez"],
          [
            "Média de unidades por pessoa",
            Number(data.averagePerPerson.toFixed(2)),
            "Entre as pessoas que resgataram",
          ],
        ]}
      />
      <Panel
        title="Demanda por brinde"
        description="Selecione um item para explorar os horários e as pessoas atendidas."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-2">
            {data.rewards.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setSelected(r.id)}
                aria-pressed={current?.id === r.id}
                className={`w-full rounded-lg border p-3 text-left ${current?.id === r.id ? "border-amber-300 bg-amber-50" : "border-slate-100 hover:bg-slate-50"}`}
              >
                <div className="flex justify-between gap-3 text-sm">
                  <span>{r.name}</span>
                  <strong>
                    {r.units}{" "}
                    <span className="text-xs font-normal text-slate-500">
                      ({r.share.toFixed(1)}%)
                    </span>
                  </strong>
                </div>
                <div className="mt-2 h-2 rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-amber-500"
                    style={{ width: `${r.share}%` }}
                  />
                </div>
              </button>
            ))}
          </div>
          {current && (
            <div className="rounded-xl bg-slate-50 p-4">
              <h3 className="font-semibold">{current.name}</h3>
              <p className="my-3 text-sm text-slate-500">
                {current.people} pessoas · {current.unitsPerHour.toFixed(1)}{" "}
                unidades/h na janela observada · Máximo de{" "}
                {current.maxPerPerson} unidades por pessoa
              </p>
              <Bars
                items={current.hourly.map((h) => ({
                  label: h.hour.replace("T", " ") + "h",
                  value: h.units,
                }))}
              />
              <button
                type="button"
                className="mt-4 text-sm font-medium text-blue-700 hover:underline"
                onClick={() =>
                  explore({
                    segment: "reward",
                    value: current.id,
                    title: `Pessoas que resgataram ${current.name}`,
                  })
                }
              >
                Ver pessoas que resgataram
              </button>
            </div>
          )}
        </div>
        <p className="mt-4 text-xs text-slate-500">
          A participação percentual usa as unidades resgatadas no período.
          Velocidade calculada em {data.observedHours.toFixed(1)} horas entre o
          primeiro e o último resgate do recorte, com mínimo de uma hora. Não é
          previsão de demanda.
        </p>
      </Panel>
      <Panel title="Resgates e disponibilidade atual">
        <DataTable
          headers={[
            "Brinde",
            "Unidades",
            "Pessoas",
            "Tickets gastos",
            "Custo médio realizado",
            "Estoque atual",
            "Situação atual",
          ]}
          rows={data.rewards.map((r) => ({
            key: r.id,
            cells: [
              r.name,
              r.units,
              r.people,
              r.ticketsSpent,
              r.averageTicketCost.toFixed(1),
              r.stock ?? "Indisponível",
              r.stock === 0 ? "Sem estoque" : r.active ? "Ativo" : "Inativo",
            ],
          }))}
        />
        <p className="mt-4 text-xs text-slate-500">
          Estoque e situação vêm do CRUD atual. Não inferimos estoque inicial
          nem o horário de esgotamento.
        </p>
      </Panel>
      <Panel title="Distribuição dos brindes entre as pessoas atendidas">
        <Bars
          items={data.distribution.map((r) => ({
            label: r.label,
            value: r.people,
          }))}
        />
      </Panel>
    </div>
  );
}
