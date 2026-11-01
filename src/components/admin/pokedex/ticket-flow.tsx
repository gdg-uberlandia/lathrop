import { useState } from "react";
import { ArrowRight, ArrowDown, CheckCircle2 } from "lucide-react";
import type { TicketFlowData } from "@/lib/ticket-flow";
const n = (v: number) => v.toLocaleString("pt-BR");
const signed = (v: number) => `${v > 0 ? "+" : ""}${n(v)}`;
export function TicketFlow({ data }: { data: TicketFlowData }) {
  const [selectedId, setSelectedId] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const selected = data.movements.find((m) => m.id === selectedId);
  const series = selected?.daily ?? data.daily;
  const detail = series.find((d) => d.date === selectedDate);
  const max = Math.max(1, ...series.map((d) => Math.abs(d.net)));
  const y = (value: number) => 110 - (value / max) * 75;
  const points = [
    `45,110`,
    ...series.map(
      (d, i) =>
        `${45 + ((i + 1) / Math.max(1, series.length)) * 490},${y(d.net)}`,
    ),
  ].join(" ");
  const color = selected?.direction === "out" ? "#e11d48" : "#2563eb";
  function movementColumn(direction: "in" | "out") {
    const total = direction === "in" ? data.incoming : data.outgoing;
    return (
      <div className="min-w-0 space-y-3">
        <h3
          className={`text-sm font-semibold ${direction === "in" ? "text-emerald-800" : "text-rose-800"}`}
        >
          {direction === "in" ? "Origem das entradas" : "Destino das saídas"}
        </h3>
        {data.movements
          .filter((m) => m.direction === direction)
          .map((m) => (
            <button
              type="button"
              key={m.id}
              aria-pressed={selectedId === m.id}
              onClick={() => {
                setSelectedId(selectedId === m.id ? "" : m.id);
                setSelectedDate("");
              }}
              className={`w-full rounded-xl border p-3 text-left transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${selectedId === m.id ? "border-blue-400 ring-1 ring-blue-300" : "border-slate-200 hover:border-slate-400"}`}
            >
              <div className="flex items-start justify-between gap-3">
                <span className="text-xs text-slate-600">{m.label}</span>
                <strong
                  className={`whitespace-nowrap text-base ${direction === "in" ? "text-emerald-700" : "text-rose-700"}`}
                >
                  {direction === "in" ? "+" : "−"}
                  {n(m.amount)}
                </strong>
              </div>
              <div className="my-2 h-1.5 rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full ${direction === "in" ? "bg-emerald-500" : "bg-rose-500"}`}
                  style={{ width: `${total ? (m.amount / total) * 100 : 0}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500">
                {n(m.transactions)} movimentos · {n(m.people)} pessoas ·{" "}
                {total ? ((m.amount / total) * 100).toFixed(1) : 0}% das{" "}
                {direction === "in" ? "entradas" : "saídas"}
              </p>
            </button>
          ))}
        {!data.movements.some((m) => m.direction === direction) && (
          <p className="py-4 text-sm text-slate-500">
            Nenhuma {direction === "in" ? "entrada" : "saída"} no período.
          </p>
        )}
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="grid items-center gap-4 lg:grid-cols-[1fr_190px_1fr]">
        {movementColumn("in")}
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-800 px-4 py-6 text-center text-white shadow-sm">
          <ArrowRight className="hidden size-6 opacity-60 lg:block" />
          <ArrowDown className="size-6 opacity-60 lg:hidden" />
          <p className="text-xs text-blue-100">Tickets no período</p>
          <p className="text-3xl font-semibold tracking-tight">
            {signed(data.net)}
          </p>
          <p className="text-xs text-blue-100">Variação líquida</p>
          <div className="mt-2 w-full space-y-2 border-t border-white/20 pt-3 text-xs">
            <p>
              Entradas: <strong>+{n(data.incoming)}</strong>
            </p>
            <p>
              Saídas: <strong>−{n(data.outgoing)}</strong>
            </p>
            <p>{n(data.transactions)} movimentações</p>
          </div>
          <ArrowRight className="hidden size-6 opacity-60 lg:block" />
          <ArrowDown className="size-6 opacity-60 lg:hidden" />
        </div>
        {movementColumn("out")}
      </div>
      <div className="rounded-xl bg-slate-50 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-800">
              Variação acumulada de tickets no período
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              {selected ? selected.label : "Todas as movimentações"} · Começa em
              zero e acumula apenas os movimentos do recorte.
            </p>
          </div>
          {selected && (
            <button
              type="button"
              className="text-xs font-medium text-blue-700 hover:underline"
              onClick={() => {
                setSelectedId("");
                setSelectedDate("");
              }}
            >
              Mostrar todos os movimentos
            </button>
          )}
        </div>
        {series.length ? (
          <>
            <svg
              viewBox="0 0 580 235"
              className="mt-3 w-full"
              role="img"
              aria-label={`Variação acumulada ${selected ? selected.label : ""}: ${signed(series[series.length - 1].net)} tickets.`}
            >
              <path d="M45 25V195H535" stroke="#cbd5e1" fill="none" />
              <line
                x1="45"
                x2="535"
                y1="110"
                y2="110"
                stroke="#94a3b8"
                strokeDasharray="4 4"
              />
              <text
                x="36"
                y="114"
                fontSize="10"
                textAnchor="end"
                fill="#64748b"
              >
                0
              </text>
              <text x="36" y="39" fontSize="10" textAnchor="end" fill="#64748b">
                +{n(max)}
              </text>
              <text
                x="36"
                y="189"
                fontSize="10"
                textAnchor="end"
                fill="#64748b"
              >
                −{n(max)}
              </text>
              <polyline
                points={points}
                stroke={color}
                strokeWidth="3"
                fill="none"
                strokeLinejoin="round"
              />
              {series.map((d, i) => (
                <g key={d.date}>
                  <circle
                    cx={45 + ((i + 1) / series.length) * 490}
                    cy={y(d.net)}
                    r="5"
                    fill={color}
                    tabIndex={0}
                    role="button"
                    aria-label={`${d.date}: variação diária ${signed(d.delta)}, acumulada ${signed(d.net)}`}
                    onFocus={() => setSelectedDate(d.date)}
                    onClick={() => setSelectedDate(d.date)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedDate(d.date);
                      }
                    }}
                    className="cursor-pointer focus:outline-none focus:stroke-slate-900 focus:stroke-2"
                  >
                    <title>
                      {d.date}: {signed(d.net)} acumulados
                    </title>
                  </circle>
                  {(series.length <= 5 ||
                    i === 0 ||
                    i === series.length - 1) && (
                    <text
                      x={45 + ((i + 1) / series.length) * 490}
                      y="217"
                      textAnchor="middle"
                      fontSize="10"
                      fill="#64748b"
                    >
                      {d.date.slice(8, 10)}/{d.date.slice(5, 7)}
                    </text>
                  )}
                </g>
              ))}
            </svg>
            <p role="status" className="min-h-5 text-xs text-slate-500">
              {detail
                ? `${detail.date.split("-").reverse().join("/")}: ${signed(detail.delta)} tickets no dia; ${signed(detail.net)} acumulados no período.`
                : "Selecione um ponto para ver a variação diária e acumulada."}
            </p>
            <details className="mt-3 text-xs text-slate-600">
              <summary className="cursor-pointer font-medium text-blue-700">
                Ver valores do gráfico
              </summary>
              <div className="mt-2 overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr>
                      <th scope="col" className="p-2">
                        Dia
                      </th>
                      <th scope="col" className="p-2">
                        Variação diária
                      </th>
                      <th scope="col" className="p-2">
                        Acumulado no período
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {series.map((d) => (
                      <tr key={d.date}>
                        <td className="p-2">
                          {d.date.split("-").reverse().join("/")}
                        </td>
                        <td className="p-2">{signed(d.delta)}</td>
                        <td className="p-2">{signed(d.net)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          </>
        ) : (
          <p className="py-6 text-sm text-slate-500">
            Sem movimentações no período.
          </p>
        )}
      </div>
      <div className="rounded-xl border border-slate-200 p-4">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-800">
          {data.reconciliation.difference === 0 && (
            <CheckCircle2 className="size-4 text-emerald-600" />
          )}
          Conferência dos tickets do evento
        </h3>
        <dl className="mt-3 grid gap-4 text-sm sm:grid-cols-3">
          {[
            ["Saldo atual dos perfis", data.reconciliation.currentBalance],
            [
              "Saldo pela soma das transações",
              data.reconciliation.recordedBalance,
            ],
            [
              "Diferença entre perfil e histórico",
              data.reconciliation.difference,
            ],
          ].map(([label, value]) => (
            <div key={String(label)}>
              <dt className="text-xs text-slate-500">{label}</dt>
              <dd className="mt-1 text-xl font-semibold text-slate-900">
                {n(Number(value))}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-xs text-slate-500">
          A conferência soma o saldo inicial na abertura (
          {n(data.reconciliation.openingBalance)} tickets) às{" "}
          {n(data.reconciliation.historyTransactions)} transações do evento
          disponíveis para os perfis selecionados, independentemente do período.
          Créditos anteriores à abertura compõem apenas o saldo inicial, sem
          entrar nos gráficos ou nos indicadores de movimentos do evento. O
          saldo atual não é um saldo histórico na data final do filtro.
          {data.reconciliation.undatedTransactions > 0
            ? ` Há ${n(data.reconciliation.undatedTransactions)} transações sem data que entram na conferência, mas não nos gráficos por período.`
            : ""}
        </p>
      </div>
      {data.movements.some((m) => m.direction === "neutral") && (
        <p className="text-xs text-slate-500">
          {n(
            data.movements
              .filter((m) => m.direction === "neutral")
              .reduce((s, m) => s + m.transactions, 0),
          )}{" "}
          registros sem alteração de saldo não aparecem nas entradas ou saídas.
        </p>
      )}
    </div>
  );
}
