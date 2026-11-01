import type { ReactNode } from "react";
export { DataTable } from "../admin-data-table";
const number = (n: number) => n.toLocaleString("pt-BR");
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
