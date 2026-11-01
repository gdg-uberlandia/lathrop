import { useDashboardExplorer } from "./dashboard-explorer";
import { useState } from "react";
import type { EngagementDistributionData } from "@/lib/engagement-distribution";
const number = (n: number) =>
  n.toLocaleString("pt-BR", { maximumFractionDigits: 1 });
export function EngagementDistribution({
  data,
}: {
  data: EngagementDistributionData;
}) {
  const explore = useDashboardExplorer();
  const [selected, setSelected] = useState("Nenhuma ação");
  const band = data.bands.find((b) => b.label === selected) ?? data.bands[0];
  const colors = ["#cbd5e1", "#93c5fd", "#3b82f6", "#2563eb", "#1e3a8a"];
  const path = data.concentration
    .map((p) => `${40 + p.people * 2.8},${190 - p.actions * 1.6}`)
    .join(" ");
  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          [
            "Mediana de ações",
            number(data.median),
            "Metade da base realizou até esse volume",
          ],
          [
            "Percentil 90",
            number(data.p90),
            "90% da base realizou até esse volume",
          ],
          [
            "Concentração no topo",
            `${number(data.topShare)}%`,
            `${number(data.topCount)} pessoas: os 10% mais ativos, arredondados para cima`,
          ],
        ].map(([label, value, detail]) => (
          <div key={label} className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs text-slate-500">{label}</p>
            <p className="my-2 text-2xl font-semibold text-slate-950">
              {value}
            </p>
            <p className="text-xs text-slate-500">{detail}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <h3 className="mb-4 text-sm font-semibold text-slate-800">
            Participantes por volume de ações
          </h3>
          <div
            className="mb-5 flex h-7 overflow-hidden rounded-lg bg-slate-100"
            role="img"
            aria-label={data.bands
              .map((b) => `${b.label}: ${b.people} perfis`)
              .join("; ")}
          >
            {data.bands.map((b, i) => (
              <div
                key={b.label}
                style={{ width: `${b.percent}%`, background: colors[i] }}
              />
            ))}
          </div>
          <div className="space-y-2">
            {data.bands.map((b, i) => (
              <button
                type="button"
                key={b.label}
                onClick={() => {
                  setSelected(b.label);
                  explore({
                    segment: "band",
                    value: ["0", "1-5", "6-20", "21-50", "51+"][i],
                    title: b.label,
                  });
                }}
                aria-pressed={selected === b.label}
                className={`flex w-full items-center gap-3 rounded-lg p-3 text-left text-sm transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${selected === b.label ? "bg-blue-50 ring-1 ring-blue-200" : "hover:bg-slate-50"}`}
              >
                <span
                  className="size-3 shrink-0 rounded-sm"
                  style={{ background: colors[i] }}
                />
                <span className="flex-1 text-slate-700">{b.label}</span>
                <strong className="text-slate-900">{number(b.people)}</strong>
                <span className="w-14 text-right text-xs text-slate-500">
                  {number(b.percent)}%
                </span>
              </button>
            ))}
          </div>
          <p
            role="status"
            className="mt-4 rounded-lg border border-slate-200 p-3 text-sm text-slate-600"
          >
            {number(band.people)} de {number(data.profiles)} perfis estão na
            faixa “{band.label}”.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-800">
            Como as ações se distribuem entre as pessoas
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Quanto mais a curva se afasta da diagonal, maior a concentração em
            poucas pessoas.
          </p>
          <svg
            viewBox="0 0 360 235"
            className="mt-3 w-full"
            role="img"
            aria-label={`Curva de concentração. Os ${data.topCount} participantes mais ativos concentram ${number(data.topShare)}% das participações.`}
          >
            <path d="M40 30V190H320" fill="none" stroke="#cbd5e1" />
            <path d="M40 190L320 30" stroke="#94a3b8" strokeDasharray="5 5" />
            {data.totalParticipations > 0 && (
              <>
                <polygon points={`40,190 ${path} 320,190`} fill="#dbeafe" />
                <polyline
                  points={path}
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="3"
                />
              </>
            )}
            {[0, 50, 100].map((n) => (
              <g key={n}>
                <text
                  x={40 + n * 2.8}
                  y="207"
                  textAnchor="middle"
                  fontSize="10"
                  fill="#64748b"
                >
                  {n}%
                </text>
                <text
                  x="33"
                  y={194 - n * 1.6}
                  textAnchor="end"
                  fontSize="10"
                  fill="#64748b"
                >
                  {n}%
                </text>
              </g>
            ))}
            <text
              x="180"
              y="228"
              textAnchor="middle"
              fontSize="10"
              fill="#64748b"
            >
              Pessoas acumuladas, da menos para a mais ativa
            </text>
            <text x="45" y="18" fontSize="10" fill="#64748b">
              Participações acumuladas
            </text>
          </svg>
          {!data.totalParticipations && (
            <p className="text-sm text-slate-500">
              Nenhuma ação no período para calcular concentração.
            </p>
          )}
          <p className="mt-2 text-xs text-slate-500">
            Base: {number(data.profiles)} perfis no papel selecionado, incluindo
            os que não realizaram ações. A concentração no topo considera apenas
            as {number(data.active)} pessoas ativas.
          </p>
        </div>
      </div>
      <p className="text-xs text-slate-500">
        Ações incluem missões, empresas, tags, conexões aceitas, avaliações e
        resgates. Uma conexão conta uma participação para cada pessoa da base
        selecionada. Total: {number(data.totalParticipations)} participações.
      </p>
    </div>
  );
}
