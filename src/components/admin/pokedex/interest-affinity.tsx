import { useState } from "react";
import type { InterestAffinity as Affinity } from "@/lib/interest-affinity";
import { Panel, DataTable } from "./dashboard-ui";
import { useDashboardExplorer } from "./dashboard-explorer";
const labels: Record<string, string> = {
  mission: "Missões",
  company: "Empresas",
  tag: "Tags",
  connection: "Conexões",
  rating: "Avaliações",
  redemption: "Brindes",
};
const pct = (n: number | null) => (n === null ? "—" : `${n.toFixed(1)}%`);
const pp = (n: number | null) =>
  n === null ? "Sem comparação" : `${n > 0 ? "+" : ""}${n.toFixed(1)} p.p.`;
export function InterestAffinity({ data }: { data: Affinity }) {
  const [selected, setSelected] = useState(""),
    [minimum, setMinimum] = useState(5),
    explore = useDashboardExplorer();
  const visible = data.interests.filter((i) => i.people >= minimum),
    current = visible.find((i) => i.id === selected) ?? visible[0];
  return (
    <div className="space-y-5">
      <Panel
        title="Interesses declarados e participação"
        description="Compara quem declarou cada interesse com pessoas que declararam outros interesses. É associação observada, não evidência de causa."
      >
        <p className="mb-4 text-sm text-slate-500">
          {data.declared} de {data.base} perfis informaram interesses ou
          habilidades; {data.missing} sem informação ficam fora das comparações.
          Uma pessoa pode pertencer a vários grupos.
        </p>
        <label className="text-sm text-slate-600">
          Mínimo de pessoas por interesse
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
            className="ml-3 w-20 rounded border p-2"
          />
        </label>
        <div className="mt-4 max-h-[480px] overflow-auto">
          <table className="w-full min-w-[650px] text-sm">
            <caption className="sr-only">
              Percentual das pessoas de cada interesse que fizeram cada ação.
            </caption>
            <thead className="sticky top-0 bg-white">
              <tr>
                <th scope="col" className="p-3 text-left">
                  Interesse
                </th>
                <th scope="col" className="p-3">
                  Pessoas
                </th>
                {Object.values(labels).map((label) => (
                  <th
                    scope="col"
                    key={label}
                    className="p-3 text-xs text-slate-500"
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((i) => (
                <tr
                  key={i.id}
                  className={current?.id === i.id ? "bg-blue-50" : ""}
                >
                  <th scope="row" className="p-2 text-left font-normal">
                    <button
                      type="button"
                      onClick={() => setSelected(i.id)}
                      className="font-medium text-blue-700 hover:underline"
                    >
                      {i.label}
                    </button>
                  </th>
                  <td className="p-2 text-center">{i.people}</td>
                  {i.actions.map((a) => (
                    <td key={a.kind} className="p-1">
                      <button
                        type="button"
                        onClick={() => setSelected(i.id)}
                        title={`${a.engaged}/${i.people} pessoas · Comparação ${a.comparison}/${i.comparisonPeople} · ${pp(a.difference)}`}
                        className="w-full rounded p-2 text-xs"
                        style={{
                          background: `rgba(37,99,235,${0.05 + (a.rate / 100) * 0.8})`,
                          color: a.rate > 60 ? "white" : "#334155",
                        }}
                      >
                        {pct(a.rate)}
                      </button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!visible.length && (
          <p className="py-4 text-sm text-slate-500">
            Nenhum interesse atende ao mínimo selecionado.
          </p>
        )}
      </Panel>
      {current && (
        <Panel
          title={`Grupo: ${current.label}`}
          description={`${current.people} pessoas neste grupo e ${current.comparisonPeople} em outros interesses declarados. Grupos de comparação variam conforme o interesse.`}
        >
          <button
            type="button"
            className="mb-4 text-sm font-medium text-blue-700 hover:underline"
            onClick={() =>
              explore({
                segment: "interest",
                value: current.id,
                title: `Interesse: ${current.label}`,
              })
            }
          >
            Ver participantes deste grupo
          </button>
          {(current.people < 5 || current.comparisonPeople < 5) && (
            <p className="mb-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
              Amostra pequena em pelo menos um dos grupos. Diferenças
              percentuais podem variar muito.
            </p>
          )}
          <DataTable
            headers={[
              "Ação",
              "Pessoas do grupo",
              "Taxa do grupo",
              "Taxa em outros interesses",
              "Diferença",
            ]}
            rows={current.actions.map((a) => ({
              key: a.kind,
              cells: [
                labels[a.kind],
                `${a.engaged}/${current.people}`,
                pct(a.rate),
                pct(a.comparisonRate),
                pp(a.difference),
              ],
            }))}
          />
          <h3 className="mb-3 mt-6 text-sm font-semibold text-slate-800">
            Visitas às empresas
          </h3>
          <DataTable
            headers={[
              "Empresa",
              "Visitantes do grupo",
              "Taxa do grupo",
              "Taxa em outros interesses",
              "Diferença",
            ]}
            rows={current.companies.map((a) => ({
              key: a.id,
              cells: [
                a.name,
                `${a.engaged}/${current.people}`,
                pct(a.rate),
                pct(a.comparisonRate),
                pp(a.difference),
              ],
            }))}
          />
          <p className="mt-3 text-xs text-slate-500">
            Diferença em pontos percentuais (p.p.). Pessoas sem interesses
            declarados não são tratadas como desinteressadas. Habilidades e
            identificadores legados são normalizados quando há equivalência
            conhecida.
          </p>
        </Panel>
      )}
    </div>
  );
}
