import { useRouter } from "next/router";
import type { ResultInsight } from "@/lib/result-summary";
import { Panel } from "./dashboard-ui";
export function ResultSummary({
  data,
  updatedAt,
}: {
  data: ResultInsight[];
  updatedAt: string;
}) {
  const router = useRouter();
  return (
    <Panel
      title="Resumo automático dos resultados"
      description="Fatos calculados a partir dos filtros aplicados, com a base de comparação explícita. Não usa um modelo externo nem envia dados a outro serviço."
    >
      <p className="mb-5 text-xs text-slate-500">
        Consulta de{" "}
        {new Date(updatedAt).toLocaleString("pt-BR", {
          timeZone: "America/Sao_Paulo",
        })}
        . O botão Atualizar do dashboard respeita o cache informado na tela.
      </p>
      <div className="grid gap-4 lg:grid-cols-2">
        {data.map((insight) => (
          <article
            key={insight.id}
            className={`rounded-xl border p-4 ${insight.tone === "attention" ? "border-amber-200 bg-amber-50/50" : "border-slate-200 bg-slate-50/50"}`}
          >
            <h3 className="font-semibold text-slate-900">{insight.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              {insight.text}
            </p>
            <p className="mt-3 text-xs leading-relaxed text-slate-500">
              {insight.evidence}
            </p>
            <button
              type="button"
              className="mt-4 text-sm font-medium text-blue-700 hover:underline"
              onClick={() =>
                void router.replace(
                  {
                    pathname: router.pathname,
                    query: { ...router.query, section: insight.section },
                  },
                  undefined,
                  { shallow: true, scroll: false },
                )
              }
            >
              Explorar {insight.section.toLocaleLowerCase("pt-BR")}
            </button>
          </article>
        ))}
      </div>
    </Panel>
  );
}
