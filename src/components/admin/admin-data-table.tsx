import { useEffect, useState, isValidElement, type ReactNode } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { AdminPagination } from "./admin-page";
import {
  tableSortValue,
  compareTableValues,
  type TableSortValue,
} from "@/lib/table-sort";
const inputClass =
  "h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500";
export function DataTable({
  headers,
  rows,
  searchable = false,
}: {
  headers: string[];
  rows: {
    key: string;
    search?: string;
    cells: ReactNode[];
    sortValues?: TableSortValue[];
  }[];
  searchable?: boolean;
}) {
  const [sort, setSort] = useState<{
    column: number;
    direction: "asc" | "desc";
  } | null>(null);
  function content(value: ReactNode): string {
    if (value === null || value === undefined || typeof value === "boolean")
      return "";
    if (typeof value === "string" || typeof value === "number")
      return String(value);
    if (Array.isArray(value)) return value.map(content).join(" ");
    if (isValidElement<{ children?: ReactNode }>(value))
      return content(value.props.children);
    return "";
  }
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const normalized = (s: string) =>
    s
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase("pt-BR");
  const filtered = rows.filter(
    (r) => !search || normalized(r.search ?? "").includes(normalized(search)),
  );
  const sorted = sort
    ? [...filtered].sort((a, b) => {
        const value = (r: typeof a) =>
          r.sortValues?.[sort.column] ??
          tableSortValue(
            typeof r.cells[sort.column] === "number"
              ? (r.cells[sort.column] as number)
              : content(r.cells[sort.column]),
          );
        return compareTableValues(value(a), value(b), sort.direction);
      })
    : filtered;
  const pageCount = Math.max(1, Math.ceil(sorted.length / 15));
  const safePage = Math.min(page, pageCount);
  useEffect(() => setPage(1), [search, sort]);
  return (
    <>
      {searchable && (
        <label className="mb-4 block">
          <span className="sr-only">Buscar na tabela</span>
          <input
            className={`${inputClass} w-full sm:max-w-md`}
            type="search"
            placeholder="Buscar por nome, prêmio ou e-mail…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr>
              {headers.map((h, column) => (
                <th
                  key={h}
                  scope="col"
                  aria-sort={
                    sort?.column === column
                      ? sort.direction === "asc"
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                  className="whitespace-nowrap border-b border-slate-200 px-3 py-3 font-medium text-slate-500"
                >
                  {[
                    "Ações",
                    "Estatísticas",
                    "Detalhes",
                    "Rede",
                    "Perfil",
                  ].includes(h) ? (
                    h
                  ) : (
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 text-left hover:text-blue-700"
                      onClick={() =>
                        setSort((s) => ({
                          column,
                          direction:
                            s?.column === column && s.direction === "asc"
                              ? "desc"
                              : "asc",
                        }))
                      }
                    >
                      {h}
                      {sort?.column === column ? (
                        sort.direction === "asc" ? (
                          <ArrowUp className="size-3" />
                        ) : (
                          <ArrowDown className="size-3" />
                        )
                      ) : (
                        <ArrowUpDown className="size-3" />
                      )}
                    </button>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.slice((safePage - 1) * 15, safePage * 15).map((r) => (
              <tr
                key={r.key}
                className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
              >
                {r.cells.map((c, i) => (
                  <td key={i} className="px-3 py-3 text-slate-800">
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {!filtered.length && (
          <p className="py-8 text-center text-sm text-slate-500">
            Nenhum registro encontrado para os filtros selecionados.
          </p>
        )}
      </div>
      <AdminPagination
        page={safePage}
        pageCount={pageCount}
        total={filtered.length}
        onPageChange={setPage}
      />
    </>
  );
}
