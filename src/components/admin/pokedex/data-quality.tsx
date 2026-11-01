import { ParticipantAnalyticsLink } from "./participant-link";
import type { DataQuality as Quality } from "@/lib/data-quality";
import { Panel, Cards } from "./dashboard-ui";
export function DataQuality({ data }: { data: Quality }) {
  return (
    <div className="space-y-5">
      <Cards
        items={[
          [
            "Verificações executadas",
            data.executed,
            "Regras explícitas de consistência",
          ],
          [
            "Verificações com divergências",
            data.failed,
            "Não é a contagem de pessoas afetadas",
          ],
          ["Verificações com erro", data.errors, "Casos que exigem revisão"],
        ]}
      />
      <Panel
        title="Qualidade e consistência dos dados"
        description="Diagnóstico somente leitura. Nenhuma correção, exclusão ou mesclagem é executada automaticamente."
      >
        <p className="mb-5 text-sm text-slate-500">
          Ações são verificadas no período selecionado, sempre após as 08h.
          Conferências de cadastro, estoque, saldos e resumos usam os snapshots
          atuais e o histórico contábil completo quando indicado. Em filtros por
          papel, perfis ausentes não podem ser atribuídos a um papel.
        </p>
        <div className="space-y-3">
          {data.checks.map((q) => (
            <details
              key={q.code}
              className="rounded-xl border border-slate-200 p-4"
            >
              <summary className="flex cursor-pointer flex-wrap items-center gap-3 text-sm">
                <span
                  className={`rounded px-2 py-1 text-xs font-medium ${!q.count ? "bg-emerald-50 text-emerald-700" : q.level === "error" ? "bg-red-50 text-red-700" : q.level === "warning" ? "bg-amber-50 text-amber-900" : "bg-blue-50 text-blue-700"}`}
                >
                  {!q.count
                    ? "Sem divergência"
                    : q.level === "error"
                      ? "Revisar"
                      : q.level === "warning"
                        ? "Atenção"
                        : "Informação"}
                </span>
                <strong className="flex-1 text-slate-800">{q.title}</strong>
                <span className="text-slate-500">
                  {q.count} {q.unit}
                </span>
              </summary>
              <p className="mt-3 text-xs text-slate-500">Escopo: {q.scope}</p>
              <p className="my-3 text-sm text-slate-600">{q.description}</p>
              <ul className="space-y-2">
                {q.examples.map((e, i) => (
                  <li
                    key={e.id + i}
                    className="rounded-lg bg-slate-50 p-3 text-xs text-slate-600"
                  >
                    <p className="break-all font-mono">{e.id}</p>
                    <p className="mt-1">{e.detail}</p>
                    {e.participantId && (
                      <ParticipantAnalyticsLink id={e.participantId}>
                        Ver participante
                      </ParticipantAnalyticsLink>
                    )}
                  </li>
                ))}
              </ul>
              {q.count > 10 && (
                <p className="mt-3 text-xs text-slate-500">
                  Exibindo os primeiros 10 exemplos de {q.count} ocorrências.
                </p>
              )}
            </details>
          ))}
        </div>
        {!data.failed && (
          <p className="mt-4 text-sm text-emerald-700">
            Nenhuma divergência encontrada nas verificações executadas. Isso não
            constitui garantia sobre dados não verificados.
          </p>
        )}
      </Panel>
    </div>
  );
}
