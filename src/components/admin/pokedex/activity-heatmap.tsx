import { useState } from "react";
import type { ActivityHeatmapData } from "@/lib/activity-heatmap";
import { activityKinds } from "@/lib/activity-heatmap";
const labels = {
  mission: "Missões",
  company: "Empresas",
  tag: "Tags",
  connection: "Conexões",
  rating: "Avaliações",
  redemption: "Brindes",
};
export function ActivityHeatmap({ data }: { data: ActivityHeatmapData }) {
  const [selectedDay, setSelectedDay] = useState("");
  const [metric, setMetric] = useState<"actions" | "people">("actions");
  const [selected, setSelected] = useState<{
    kind: string;
    hour: number;
  } | null>(null);
  const current = data.find((d) => d.day === selectedDay) ?? data[0];
  if (!current)
    return (
      <p className="py-6 text-sm text-slate-500">
        Nenhuma atividade no período selecionado.
      </p>
    );
  const max = Math.max(1, ...current.cells.map((c) => c[metric]));
  const detail = current.cells.find(
    (c) => c.kind === selected?.kind && c.hour === selected.hour,
  );
  const dayLabel = (day: string) => day.split("-").reverse().join("/");
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-3xl font-semibold tracking-tight text-slate-950">
            {current.actions.toLocaleString("pt-BR")}{" "}
            <span className="text-sm font-normal text-slate-500">
              ações no dia
            </span>
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {current.people.toLocaleString("pt-BR")} pessoas únicas · Horários
            de Brasília
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <label className="text-xs text-slate-500">
            Dia
            <select
              value={current.day}
              onChange={(e) => {
                setSelectedDay(e.target.value);
                setSelected(null);
              }}
              className="mt-1 block h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800"
            >
              {data.map((d) => (
                <option key={d.day} value={d.day}>
                  {dayLabel(d.day)}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs text-slate-500">
            Medir
            <select
              value={metric}
              onChange={(e) =>
                setMetric(e.target.value as "actions" | "people")
              }
              className="mt-1 block h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800"
            >
              <option value="actions">Quantidade de ações</option>
              <option value="people">Pessoas únicas por célula</option>
            </select>
          </label>
        </div>
      </div>
      <div className="overflow-x-auto pb-2">
        <table className="w-full min-w-[880px] border-separate border-spacing-1 text-xs">
          <caption className="sr-only">
            Atividade por hora em {dayLabel(current.day)}. Selecione uma célula
            para ver ações e pessoas únicas.
          </caption>
          <thead>
            <tr>
              <th scope="col" className="text-left font-medium text-slate-500">
                Atividade
              </th>
              {current.hours.map((hour) => (
                <th
                  scope="col"
                  key={hour}
                  className="pb-2 text-center font-normal text-slate-400"
                >
                  {String(hour).padStart(2, "0")}h
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {activityKinds.map((kind) => (
              <tr key={kind}>
                <th
                  scope="row"
                  className="pr-3 text-left font-medium text-slate-600"
                >
                  {labels[kind]}
                </th>
                {current.cells
                  .filter((c) => c.kind === kind)
                  .map((cell) => {
                    const ratio = cell[metric] / max;
                    const active = detail === cell;
                    return (
                      <td key={cell.hour}>
                        <button
                          type="button"
                          onClick={() => setSelected({ kind, hour: cell.hour })}
                          onFocus={() => setSelected({ kind, hour: cell.hour })}
                          aria-pressed={active}
                          aria-label={`${labels[kind]}, ${cell.hour}h: ${cell.actions} ações, ${cell.people} pessoas únicas`}
                          title={`${cell.actions} ações · ${cell.people} pessoas`}
                          className={`h-9 w-full min-w-[26px] rounded-md text-[10px] font-medium transition hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${active ? "ring-2 ring-blue-600 ring-offset-2" : ""}`}
                          style={{
                            background: cell[metric]
                              ? `rgba(37,99,235,${0.12 + ratio * 0.88})`
                              : "#f1f5f9",
                            color: ratio > 0.55 ? "white" : "#334155",
                          }}
                        >
                          {cell[metric] || <span className="sr-only">0</span>}
                        </button>
                      </td>
                    );
                  })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
        <p role="status" className="min-h-5">
          {detail
            ? `${labels[detail.kind]} · ${dayLabel(current.day)} às ${detail.hour}h: ${detail.actions} ações e ${detail.people} pessoas únicas.`
            : "Clique ou navegue pelo teclado para explorar cada horário."}
        </p>
        <div className="flex items-center gap-2">
          <span>Menor</span>
          {[0.12, 0.35, 0.6, 0.8, 1].map((opacity) => (
            <span
              key={opacity}
              className="h-3 w-5 rounded-sm"
              style={{ background: `rgba(37,99,235,${opacity})` }}
            />
          ))}
          <span>Maior</span>
        </div>
      </div>
      <p className="text-xs text-slate-500">
        Células vazias representam zero registros. A escala é relativa ao maior
        valor do dia. Pessoas são únicas em cada célula e no total do dia; não
        some as células para obter pessoas únicas.
      </p>
    </div>
  );
}
