import { useDashboardExplorer } from "./dashboard-explorer";
import { useState } from "react";
import type { CompanyReachData } from "@/lib/company-reach";
const n = (v: number) =>
  v.toLocaleString("pt-BR", { maximumFractionDigits: 1 });
export function CompanyReach({ data }: { data: CompanyReachData }) {
  const explore = useDashboardExplorer();
  const [selected, setSelected] = useState("");
  const [search, setSearch] = useState("");
  const [hour, setHour] = useState("");
  const matches = data.companies.filter((c) =>
    c.name
      .toLocaleLowerCase("pt-BR")
      .includes(search.toLocaleLowerCase("pt-BR")),
  );
  const current = matches.find((c) => c.id === selected) ?? matches[0];
  const detail = current?.hourly.find((h) => h.hour === hour);
  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          [
            "Visitantes únicos",
            n(data.reached),
            "Pessoas que visitaram ao menos uma empresa",
          ],
          [
            "Alcance dos estandes",
            `${n(data.reach)}%`,
            `${n(data.reached)} de ${n(data.base)} perfis da base selecionada`,
          ],
          [
            "Empresas por pessoa",
            n(data.averageCompanies),
            "Média na base, incluindo quem não visitou estandes",
          ],
        ].map(([label, value, description]) => (
          <div key={label} className="rounded-xl bg-emerald-50 p-4">
            <p className="text-xs text-emerald-800">{label}</p>
            <p className="my-2 text-2xl font-semibold text-emerald-950">
              {value}
            </p>
            <p className="text-xs text-emerald-800">{description}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">
            Alcance por empresa
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Selecione uma empresa para explorar horários e visitantes em comum.
          </p>
          <label className="my-4 block">
            <span className="sr-only">Buscar empresa no gráfico</span>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar empresa…"
              className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm"
            />
          </label>
          <div className="max-h-[480px] space-y-2 overflow-y-auto p-1">
            {matches.map((c, i) => (
              <button
                type="button"
                key={c.id}
                onClick={() => {
                  setSelected(c.id);
                  setHour("");
                }}
                aria-pressed={current?.id === c.id}
                className={`w-full rounded-xl border p-3 text-left transition focus:outline-none focus:ring-2 focus:ring-emerald-600 ${current?.id === c.id ? "border-emerald-300 bg-emerald-50" : "border-transparent hover:bg-slate-50"}`}
              >
                <div className="mb-2 flex items-center gap-2 text-sm">
                  <span className="w-5 text-xs text-slate-400">{i + 1}</span>
                  <span className="flex-1 font-medium text-slate-800">
                    {c.name}
                  </span>
                  <strong>{n(c.visitors)}</strong>
                  <span className="w-16 text-right text-xs text-slate-500">
                    {n(c.reach)}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full bg-emerald-500"
                    style={{ width: `${c.reach}%` }}
                  />
                </div>
              </button>
            ))}
          </div>
          {!matches.length && (
            <p className="py-4 text-sm text-slate-500">
              Nenhuma empresa encontrada.
            </p>
          )}
        </div>
        <div className="rounded-xl border border-slate-200 p-4">
          {current ? (
            <>
              <button
                type="button"
                className="mb-3 text-sm font-medium text-blue-700 hover:underline"
                onClick={() =>
                  explore({
                    segment: "company",
                    value: current.id,
                    title: `Visitantes de ${current.name}`,
                  })
                }
              >
                Ver participantes
              </button>
              <h3 className="font-semibold text-slate-900">{current.name}</h3>
              <p className="mt-1 text-sm text-slate-500">
                {n(current.visitors)} visitantes únicos · {n(current.reach)}% da
                base
              </p>
              <h4 className="mt-6 text-xs font-medium text-slate-600">
                Visitantes por horário com registros
              </h4>
              <div className="mt-3 overflow-x-auto pb-2">
                <div className="flex h-40 min-w-max items-end gap-2">
                  {current.hourly.map((h) => (
                    <button
                      type="button"
                      key={h.hour}
                      onClick={() => setHour(h.hour)}
                      onFocus={() => setHour(h.hour)}
                      title={`${h.hour.replace("T", " às ")}h: ${h.people} visitantes`}
                      aria-label={`${h.hour.replace("T", " às ")}h: ${h.people} visitantes únicos`}
                      className="flex h-full w-14 flex-col items-center justify-end rounded p-1 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    >
                      <span className="mb-1 text-xs font-semibold text-slate-700">
                        {h.people}
                      </span>
                      <span
                        className="w-8 rounded-t bg-emerald-500"
                        style={{
                          height: `${(h.people / Math.max(1, ...current.hourly.map((b) => b.people))) * 95}px`,
                        }}
                      />
                      <span className="mt-2 whitespace-nowrap text-[9px] text-slate-500">
                        {h.hour.slice(8, 10)}/{h.hour.slice(5, 7)}{" "}
                        {h.hour.slice(11)}h
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <p role="status" className="min-h-5 text-xs text-slate-500">
                {detail
                  ? `${detail.hour.replace("T", " às ")}h: ${detail.people} visitantes únicos.`
                  : current.hourly.length
                    ? "Clique em uma coluna para ver o horário."
                    : "Sem visitas no período selecionado."}
              </p>
              <h4 className="mb-3 mt-6 text-xs font-medium text-slate-600">
                Visitantes que também passaram por outras empresas
              </h4>
              <div className="space-y-3">
                {current.overlaps.slice(0, 4).map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between gap-3 text-sm"
                  >
                    <span className="text-slate-600">{c.name}</span>
                    <strong className="whitespace-nowrap text-slate-800">
                      {n(c.people)}{" "}
                      <span className="text-xs font-normal text-slate-500">
                        ({n(c.percent)}%)
                      </span>
                    </strong>
                  </div>
                ))}
              </div>
              {!current.overlaps.length && (
                <p className="text-xs text-slate-500">
                  Nenhuma visita em comum registrada.
                </p>
              )}
              <p className="mt-4 text-xs text-slate-500">
                Percentuais de sobreposição usam os visitantes de {current.name}{" "}
                como base; a mesma pessoa pode visitar várias empresas.
              </p>
            </>
          ) : (
            <p className="text-sm text-slate-500">
              Selecione uma empresa para visualizar os detalhes.
            </p>
          )}
        </div>
      </div>
      <div>
        <h3 className="mb-4 text-sm font-semibold text-slate-800">
          Quantas empresas cada pessoa visitou?
        </h3>
        <div className="grid gap-3 sm:grid-cols-5">
          {data.coverage.map((c) => (
            <div
              key={c.label}
              className="rounded-lg border border-slate-200 p-3"
            >
              <p className="text-xs text-slate-500">{c.label}</p>
              <p className="mt-2 text-xl font-semibold text-slate-900">
                {n(c.people)}
              </p>
              <div className="my-2 h-1.5 rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{ width: `${c.percent}%` }}
                />
              </div>
              <p className="text-xs text-slate-500">{n(c.percent)}% da base</p>
            </div>
          ))}
        </div>
      </div>
      <p className="text-xs text-slate-500">
        Visitas representam conclusões registradas na Pokédex, não permanência
        no estande. Pessoas são únicas por empresa e período; os totais por
        empresa não devem ser somados como pessoas únicas do evento.
      </p>
    </div>
  );
}
