import { buildStaticQrUrl } from "@/lib/static-qr-url";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Printer } from "lucide-react";
import { Button } from "@/assets/components/ui/button";
import { AdminPageHeader } from "@/components/admin/admin-page";
import { useTags } from "@/hooks/useTags";
import { useMissions } from "@/hooks/useMissions";
import { useCompanies } from "@/hooks/useCompanies";
import config from "@/helpers/config";
import {
  QR_SAMPLE,
  renderQrPrint,
  downloadQrA4Pdf,
  type PrintableQr,
  type QrPrintModel,
} from "@/lib/qr-print";

function PrintPreview({
  item,
  model,
}: {
  item: PrintableQr;
  model: QrPrintModel;
}) {
  const [preview, setPreview] = useState("");
  const [error, setError] = useState(false);
  useEffect(() => {
    let cancelled = false;
    setError(false);
    void renderQrPrint(item, model, config.name)
      .then((canvas) => {
        if (!cancelled) setPreview(canvas.toDataURL("image/png"));
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [item, model]);
  return (
    <div className="mx-auto w-full max-w-[300px]">
      {error ? (
        <p role="alert">Não foi possível carregar a prévia.</p>
      ) : preview ? (
        <Image
          src={preview}
          alt={`${item.kind}: ${item.title}. Modelo ${model}.`}
          width={1748}
          height={2480}
          unoptimized
          className="h-auto w-full"
        />
      ) : (
        <p role="status">Preparando prévia A5...</p>
      )}
    </div>
  );
}

export default function QrPrintPage() {
  const tags = useTags();
  const missions = useMissions();
  const companies = useCompanies();
  const model: QrPrintModel = "dual-border";
  const [selected, setSelected] = useState<string[]>([]);
  const [kind, setKind] = useState("all");
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const items = useMemo<PrintableQr[]>(
    () =>
      [
        ...tags.tags.map((t) => ({
          key: `tag-${t.id}`,
          kind: "Tag" as const,
          title: t.name,
          value: buildStaticQrUrl("tag", t.qrId),
          active: t.active,
        })),
        ...missions.missions
          .filter((m) => m.validationType === "qr" && m.qrId)
          .map((m) => ({
            key: `mission-${m.id}`,
            kind: "Missão" as const,
            title: m.title,
            value: buildStaticQrUrl("mission", m.qrId!),
            active: m.active,
          })),
        ...companies.companies.map((c) => ({
          key: `company-${c.id}`,
          kind: "Empresa" as const,
          title: c.name,
          value: buildStaticQrUrl("company", c.qrId),
          active: c.active,
        })),
      ].sort((a, b) => a.title.localeCompare(b.title, "pt-BR")),
    [tags.tags, missions.missions, companies.companies],
  );
  const visible = items.filter(
    (i) =>
      (kind === "all" || kind === i.kind) &&
      i.title
        .toLocaleLowerCase("pt-BR")
        .includes(search.toLocaleLowerCase("pt-BR")),
  );
  const chosen = items.filter((i) => selected.includes(i.key));
  const loading = tags.loading || missions.loading || companies.loading;
  const loadError = tags.error || missions.error || companies.error;
  const sample = chosen[0] ?? QR_SAMPLE;
  async function generate() {
    setBusy(true);
    setError("");
    try {
      await downloadQrA4Pdf(chosen, config.name);
    } catch {
      setError(
        "Não foi possível gerar o PDF. Tente novamente com menos itens.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="p-4 sm:p-6">
      <AdminPageHeader
        title="QR codes imprimíveis"
        description="Selecione os QR codes e exporte duas placas por folha A4 na horizontal."
        icon={Printer}
      />
      <section
        aria-labelledby="preview-heading"
        className="mt-6 rounded-2xl border !border-slate-200 bg-white p-4 sm:p-6"
      >
        <h2 id="preview-heading" className="text-lg font-semibold">
          Modelo da placa
        </h2>
        <p className="mb-4 mt-1 text-sm text-slate-600">
          Fundo branco, bordas roxa e amarela e título de até duas linhas. A
          prévia mostra o primeiro QR selecionado ou um exemplo. O PDF A4
          horizontal contém duas placas proporcionais ao A5, com margens de 1,5
          cm e uma linha fina para separá-las.
        </p>
        <PrintPreview item={sample} model={model} />
      </section>
      <section
        aria-labelledby="items-heading"
        className="mt-8 rounded-2xl border !border-slate-200 bg-white p-4 sm:p-6"
      >
        <h2 id="items-heading" className="text-lg font-semibold">
          Selecione os QR codes
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Missões sem validação por QR não aparecem nesta lista. Itens inativos
          estão identificados.
        </p>
        <div className="my-4 flex flex-wrap gap-3">
          <input
            aria-label="Buscar QR codes"
            placeholder="Buscar pelo título"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 min-w-0 rounded-lg border px-3"
          />
          <select
            aria-label="Tipo de QR code"
            value={kind}
            onChange={(e) => setKind(e.target.value)}
            className="h-10 rounded-lg border px-3"
          >
            <option value="all">Todos os tipos</option>
            {["Tag", "Missão", "Empresa"].map((k) => (
              <option key={k}>{k}</option>
            ))}
          </select>
          <Button
            variant="outline"
            disabled={busy || loading || !!loadError}
            onClick={() =>
              setSelected((old) => [
                ...new Set([...old, ...visible.map((i) => i.key)]),
              ])
            }
          >
            Selecionar filtrados
          </Button>
          <Button
            variant="ghost"
            disabled={busy}
            onClick={() => setSelected([])}
          >
            Limpar seleção
          </Button>
        </div>
        {loading && <p role="status">Carregando QR codes...</p>}
        {loadError && (
          <div role="alert" className="text-red-700">
            <p>{loadError}</p>
            <Button
              variant="outline"
              onClick={() => {
                void tags.fetchTags();
                void missions.fetchMissions();
                void companies.fetchCompanies();
              }}
            >
              Tentar novamente
            </Button>
          </div>
        )}
        {!loading && !loadError && !visible.length && (
          <p>Nenhum QR code encontrado.</p>
        )}
        <div className="max-h-[32rem] overflow-auto rounded-lg border !border-slate-200">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">
              QR codes disponíveis para impressão
            </caption>
            <thead className="sticky top-0 bg-slate-50 text-slate-600">
              <tr>
                <th scope="col" className="w-12 p-3">
                  <input
                    type="checkbox"
                    aria-label="Selecionar todos os QR codes filtrados"
                    disabled={busy || loading || !!loadError || !visible.length}
                    checked={
                      visible.length > 0 &&
                      visible.every((i) => selected.includes(i.key))
                    }
                    ref={(node) => {
                      if (node)
                        node.indeterminate =
                          visible.some((i) => selected.includes(i.key)) &&
                          !visible.every((i) => selected.includes(i.key));
                    }}
                    onChange={(e) =>
                      setSelected((old) =>
                        e.target.checked
                          ? [...new Set([...old, ...visible.map((i) => i.key)])]
                          : old.filter(
                              (key) => !visible.some((i) => i.key === key),
                            ),
                      )
                    }
                  />
                </th>
                <th scope="col" className="p-3">
                  Tipo
                </th>
                <th scope="col" className="p-3">
                  Título
                </th>
                <th scope="col" className="p-3">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {visible.map((i) => (
                <tr
                  key={i.key}
                  className={`border-t !border-slate-200 ${selected.includes(i.key) ? "bg-blue-50" : "bg-white"}`}
                >
                  <td className="p-3">
                    <input
                      id={`print-${i.key}`}
                      type="checkbox"
                      aria-label={`Selecionar ${i.kind}: ${i.title}`}
                      disabled={busy || loading || !!loadError}
                      checked={selected.includes(i.key)}
                      onChange={(e) =>
                        setSelected((old) =>
                          e.target.checked
                            ? [...new Set([...old, i.key])]
                            : old.filter((key) => key !== i.key),
                        )
                      }
                    />
                  </td>
                  <td className="whitespace-nowrap p-3">{i.kind}</td>
                  <td className="min-w-[180px] p-3">
                    <label
                      htmlFor={`print-${i.key}`}
                      className="cursor-pointer break-words font-medium"
                    >
                      {i.title}
                    </label>
                  </td>
                  <td className="whitespace-nowrap p-3">
                    {i.active ? "Ativo" : "Inativo"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <Button
            disabled={!chosen.length || busy || loading || !!loadError}
            onClick={() => void generate()}
          >
            <Printer className="mr-2 size-4" />
            {busy ? "Gerando PDF..." : "Exportar PDF A4 horizontal"}
          </Button>
          <span role="status" className="text-sm text-slate-600">
            {chosen.length} placa(s) · {Math.ceil(chosen.length / 2)} página(s)
            A4
          </span>
        </div>
        {error && (
          <p role="alert" className="mt-3 text-red-700">
            {error}
          </p>
        )}
        <p className="mt-4 text-xs text-slate-500">
          Imprima em tamanho real (100%), sem ajustar à página. Cada folha A4
          horizontal leva duas placas reduzidas proporcionalmente para respeitar
          as margens de 1,5 cm nos quatro lados. Se a seleção tiver quantidade
          ímpar, a última placa fica centralizada sozinha, sem linha divisória.
        </p>
      </section>
    </main>
  );
}
