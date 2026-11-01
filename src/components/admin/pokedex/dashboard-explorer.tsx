import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useEffect,
} from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ParticipantAnalyticsLink } from "./participant-link";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { adminApiRequest } from "@/lib/admin-api/client";
import { getAdminApiErrorMessage } from "@/lib/admin-api/errors";
import {
  AdminPagination,
  AdminErrorState,
  AdminLoadingState,
} from "@/components/admin/admin-page";
import type {
  ExploreSelection,
  DashboardParticipantPage,
} from "@/lib/dashboard-explorer";
import type { DashboardFilters } from "@/lib/pokedex-dashboard";
const ExplorerContext = createContext<(selection: ExploreSelection) => void>(
  () => {},
);
export const useDashboardExplorer = () => useContext(ExplorerContext);
export function DashboardExplorerProvider({
  filters,
  children,
}: {
  filters: DashboardFilters;
  children: ReactNode;
}) {
  const [selection, setSelection] = useState<ExploreSelection | null>(null),
    [q, setQ] = useState(""),
    [page, setPage] = useState(1);
  useEffect(() => {
    setPage(1);
  }, [filters.from, filters.to, filters.role]);
  const query = useQuery({
    queryKey: ["admin", "pokedex-explorer", filters, selection, q, page],
    enabled: Boolean(selection),
    queryFn: ({ signal }) =>
      adminApiRequest<DashboardParticipantPage>("/api/v1/pokedex-explorer", {
        signal,
        query: {
          ...filters,
          segment: selection!.segment,
          value: selection?.value,
          q,
          page,
        },
      }),
  });
  return (
    <ExplorerContext.Provider
      value={(s) => {
        setSelection(s);
        setQ("");
        setPage(1);
      }}
    >
      {children}
      <Dialog.Root
        open={Boolean(selection)}
        onOpenChange={(open) => {
          if (!open) setSelection(null);
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/40" />
          <Dialog.Content className="fixed bottom-0 right-0 top-0 z-50 flex w-full max-w-2xl flex-col overflow-hidden bg-white shadow-2xl">
            <header className="border-b border-slate-200 p-5">
              <Dialog.Title className="pr-8 text-xl font-semibold text-slate-900">
                {selection?.title}
              </Dialog.Title>
              <Dialog.Description className="mt-2 text-sm text-slate-500">
                Participantes do recorte selecionado. Os filtros de período e
                papel do evento é mantida.
              </Dialog.Description>
              <Dialog.Close
                aria-label="Fechar participantes"
                className="absolute right-5 top-5 rounded p-1 text-slate-500 hover:bg-slate-100"
              >
                <X className="size-5" />
              </Dialog.Close>
              <label className="mt-4 block">
                <span className="sr-only">
                  Buscar participante por nome ou e-mail
                </span>
                <input
                  type="search"
                  value={q}
                  onChange={(e) => {
                    setQ(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Buscar por nome ou e-mail…"
                  className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm"
                  maxLength={200}
                />
              </label>
            </header>
            <div className="flex-1 overflow-y-auto p-5">
              {query.isPending && <AdminLoadingState />}
              {query.error && (
                <AdminErrorState
                  message={getAdminApiErrorMessage(
                    query.error,
                    "Erro ao consultar participantes.",
                  )}
                  onRetry={() => void query.refetch()}
                />
              )}
              <ul className="divide-y divide-slate-100">
                {query.data?.items.map((p) => (
                  <li
                    key={p.id}
                    className="flex items-center justify-between gap-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-slate-900">{p.name}</p>
                      <p className="break-all text-xs text-slate-500">
                        {p.email}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {p.actions} participações no período
                      </p>
                    </div>
                    <ParticipantAnalyticsLink id={p.id}>
                      Ver estatísticas
                    </ParticipantAnalyticsLink>
                  </li>
                ))}
              </ul>
              {query.data && !query.data.items.length && (
                <p className="py-5 text-sm text-slate-500">
                  Nenhum participante encontrado.
                </p>
              )}
            </div>
            {query.data && (
              <div className="border-t border-slate-200">
                <p className="px-5 pt-3 text-xs text-slate-500">
                  {query.data.total} participantes encontrados
                </p>
                <AdminPagination {...query.data} onPageChange={setPage} />
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </ExplorerContext.Provider>
  );
}
