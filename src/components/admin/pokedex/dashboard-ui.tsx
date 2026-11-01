import { useEffect, useState, type ReactNode } from "react";
import { AdminPagination } from "@/components/admin/admin-page";
const number = (n: number) => n.toLocaleString("pt-BR");
const inputClass =
  "h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500";
export function Panel({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="admin-surface min-w-0 rounded-xl">
      <header className="border-b border-slate-200 p-4">
        <h2 className="font-semibold text-slate-900">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        )}
      </header>
      <div className="p-4">{children}</div>
    </section>
  );
}
export function Cards({ items }: { items: [string, number, string][] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {items.map(([label, value, detail]) => (
        <div key={label} className="admin-surface rounded-xl p-5">
          <p className="text-sm text-slate-500">{label}</p>
          <p className="my-2 text-3xl font-semibold tracking-tight text-slate-950">
            {number(value)}
          </p>
          <p className="text-xs text-slate-500">{detail}</p>
        </div>
      ))}
    </div>
  );
}
export function Bars({ items }: { items: { label: string; value: number }[] }) {
  const max = Math.max(1, ...items.map((i) => i.value));
  return (
    <div className="space-y-4">
      {items.map((i) => (
        <div key={i.label}>
          <div className="mb-1 flex justify-between gap-3 text-sm">
            <span className="text-slate-700">{i.label}</span>
            <strong>{number(i.value)}</strong>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-blue-600"
              style={{ width: `${(i.value / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
      {!items.length && (
        <p className="py-6 text-sm text-slate-500">
          Nenhum registro no período.
        </p>
      )}
    </div>
  );
}
export function DataTable({
  headers,
  rows,
  searchable = false,
}: {
  headers: string[];
  rows: { key: string; search?: string; cells: ReactNode[] }[];
  searchable?: boolean;
}) {
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
  const pageCount = Math.max(1, Math.ceil(filtered.length / 15));
  const safePage = Math.min(page, pageCount);
  useEffect(() => setPage(1), [search]);
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
              {headers.map((h) => (
                <th
                  key={h}
                  scope="col"
                  className="whitespace-nowrap border-b border-slate-200 px-3 py-3 font-medium text-slate-500"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.slice((safePage - 1) * 15, safePage * 15).map((r) => (
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
