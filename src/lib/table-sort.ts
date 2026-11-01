export type TableSortValue = string | number | null;
export function tableSortValue(value: string | number): TableSortValue {
  if (typeof value === "number") return value;
  const text = value.trim();
  const date = text.match(
    /^(\d{2})\/(\d{2})\/(\d{4})(?:,?\s+(\d{2}):(\d{2})(?::(\d{2}))?)?$/,
  );
  if (date)
    return Date.UTC(
      +date[3],
      +date[2] - 1,
      +date[1],
      +(date[4] ?? 0),
      +(date[5] ?? 0),
      +(date[6] ?? 0),
    );
  if (/^[+−-]?[\d.,]+\s*(?:%|p\.p\.)?$/.test(text)) {
    const normalized = text
      .replace(/[\s%]/g, "")
      .replace(/p\.p\.$/, "")
      .replace("−", "-");
    const n = Number(
      normalized.includes(",")
        ? normalized.replace(/\./g, "").replace(",", ".")
        : normalized.replace(/\.(?=\d{3}(?:\D|$))/g, ""),
    );
    if (Number.isFinite(n)) return n;
  }
  return text === "—" || text === "" ? null : text;
}
const collator = new Intl.Collator("pt-BR", {
  numeric: true,
  sensitivity: "base",
});
export function compareTableValues(
  a: TableSortValue,
  b: TableSortValue,
  direction: "asc" | "desc",
) {
  if (a === null) return b === null ? 0 : 1;
  if (b === null) return -1;
  const value =
    typeof a === "number" && typeof b === "number"
      ? a - b
      : collator.compare(String(a), String(b));
  return direction === "asc" ? value : -value;
}
