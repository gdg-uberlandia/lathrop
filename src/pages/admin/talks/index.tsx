import { Button } from "@/assets/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/assets/components/ui/table";
import DeleteDialog from "@/components/admin/delete-dialog";
import {
  AdminEmptyState,
  AdminErrorState,
  AdminListToolbar,
  AdminLoadingState,
  AdminPageHeader,
  AdminPagination,
  AdminStatusBadge,
  AdminSortButton,
  AdminTableContainer,
} from "@/components/admin/admin-page";
import { useSpeakers } from "@/hooks/useSpeakers";
import { useTalks } from "@/hooks/useTalks";
import { useAdminListState } from "@/hooks/useAdminListState";
import { Talk, TALK_FORMAT_LABELS } from "@/contracts/talk";
import { Pencil, Presentation, Trash2 } from "lucide-react";
import { useRouter } from "next/router";
import {
  adminDestinationWithReturnTo,
  adminPathWithReturnTo,
} from "@/lib/admin-return-path";
import { useMemo, useState } from "react";

export default function TalksPage() {
  const router = useRouter();
  const { talks, removeTalk, updateTalk, loading, error, fetchTalks } =
    useTalks();
  const { speakers } = useSpeakers();
  const [selected, setSelected] = useState<Talk | null>(null);
  const {
    search,
    setSearch,
    setPage,
    paginate,
    sort,
    direction,
    toggleSort,
    sortItems,
  } = useAdminListState();
  const [status, setStatus] = useState("all");
  const [format, setFormat] = useState("all");
  const [evaluation, setEvaluation] = useState("all");
  const names = useMemo(
    () => new Map(speakers.map((speaker) => [speaker.id, speaker.name])),
    [speakers],
  );
  const filteredTalks = useMemo(() => {
    const term = search.trim().toLocaleLowerCase("pt-BR");
    return talks.filter((talk) => {
      const matchesStatus =
        status === "all" || String(talk.isActive) === status;
      const matchesFormat = format === "all" || talk.format === format;
      const matchesEvaluation =
        evaluation === "all" || talk.evaluationStatus === evaluation;
      const matchesSearch =
        !term ||
        [talk.title, talk.category, TALK_FORMAT_LABELS[talk.format]]
          .filter(Boolean)
          .some((value) => value!.toLocaleLowerCase("pt-BR").includes(term));
      return (
        matchesStatus && matchesFormat && matchesEvaluation && matchesSearch
      );
    });
  }, [evaluation, format, search, status, talks]);
  const pagination = paginate(
    sortItems(filteredTalks, {
      name: (item) => item.title,
      format: (item) => item.format,
      speakers: (item) =>
        item.speakerIds.map((id) => names.get(id) ?? "").join(" "),
      status: (item) => Number(item.isActive),
    }),
  );
  return (
    <>
      <div className="p-4 sm:p-6">
        <AdminPageHeader
          title="Palestras"
          description="Organize conteúdos, formatos e participantes."
          count={talks.length}
          icon={Presentation}
          action={{
            href: adminPathWithReturnTo("/admin/talks/add-talk", router.asPath),
            label: "Cadastrar palestra",
          }}
        />
        <AdminListToolbar search={search} onSearchChange={setSearch}>
          <select
            aria-label="Filtrar por status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="h-10 rounded-lg border border-white/10 bg-background px-3 text-sm"
          >
            <option value="all">Todas</option>
            <option value="true">Ativas</option>
            <option value="false">Inativas</option>
          </select>
          <select
            aria-label="Filtrar por formato"
            value={format}
            onChange={(event) => setFormat(event.target.value)}
            className="h-10 rounded-lg border border-white/10 bg-background px-3 text-sm"
          >
            <option value="all">Todos os formatos</option>
            <option value="talk">Palestra</option>
            <option value="panel">Painel</option>
            <option value="keynote">Keynote</option>
          </select>
          <select
            aria-label="Filtrar por avaliação"
            value={evaluation}
            onChange={(event) => setEvaluation(event.target.value)}
            className="h-10 rounded-lg border border-white/10 bg-background px-3 text-sm"
          >
            <option value="all">Todas as avaliações</option>
            <option value="locked">Bloqueada</option>
            <option value="open">Aberta</option>
            <option value="closed">Encerrada</option>
          </select>
        </AdminListToolbar>
        {error && (
          <AdminErrorState message={error} onRetry={() => void fetchTalks()} />
        )}
        {loading && talks.length === 0 ? (
          <AdminLoadingState />
        ) : filteredTalks.length === 0 ? (
          <AdminEmptyState
            title={search ? "Nenhum resultado" : "Nenhuma palestra cadastrada"}
            description={
              search
                ? "Tente outro termo de busca."
                : "Cadastre a primeira palestra da programação."
            }
            action={
              !search
                ? { href: "/admin/talks/add-talk", label: "Cadastrar palestra" }
                : undefined
            }
          />
        ) : (
          <AdminTableContainer>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <AdminSortButton
                      label="Título"
                      active={sort === "name"}
                      direction={direction}
                      onClick={() => toggleSort("name")}
                    />
                  </TableHead>
                  <TableHead>
                    <AdminSortButton
                      label="Formato"
                      active={sort === "format"}
                      direction={direction}
                      onClick={() => toggleSort("format")}
                    />
                  </TableHead>
                  <TableHead>
                    <AdminSortButton
                      label="Palestrantes"
                      active={sort === "speakers"}
                      direction={direction}
                      onClick={() => toggleSort("speakers")}
                    />
                  </TableHead>
                  <TableHead>
                    <AdminSortButton
                      label="Status"
                      active={sort === "status"}
                      direction={direction}
                      onClick={() => toggleSort("status")}
                    />
                  </TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagination.items.map((talk) => (
                  <TableRow key={talk.id}>
                    <TableCell className="text-white/80">
                      {talk.title}
                    </TableCell>
                    <TableCell className="text-white/80">
                      {TALK_FORMAT_LABELS[talk.format]}
                    </TableCell>
                    <TableCell className="text-white/80">
                      {talk.speakerIds
                        .map((id) => names.get(id) ?? "Palestrante removido")
                        .join(", ")}
                    </TableCell>
                    <TableCell className="text-white/80">
                      <button
                        type="button"
                        disabled={loading}
                        title="Alterar status"
                        onClick={() =>
                          void updateTalk({
                            id: talk.id,
                            title: talk.title,
                            description: talk.description,
                            category: talk.category,
                            format: talk.format,
                            speakerIds: talk.speakerIds,
                            evaluationStatus: talk.evaluationStatus,
                            isActive: !talk.isActive,
                          })
                        }
                      >
                        <AdminStatusBadge
                          active={talk.isActive}
                          activeLabel="Ativa"
                          inactiveLabel="Inativa"
                        />
                      </button>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="secondary"
                          size="icon"
                          onClick={() =>
                            router.push(
                              adminDestinationWithReturnTo(
                                `/admin/talks/edit/${talk.id}`,
                                router.asPath,
                              ),
                            )
                          }
                          aria-label={`Editar ${talk.title}`}
                        >
                          <Pencil />
                        </Button>
                        <Button
                          variant="secondary"
                          size="icon"
                          onClick={() => setSelected(talk)}
                          aria-label={`Excluir ${talk.title}`}
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <AdminPagination {...pagination} onPageChange={setPage} />
          </AdminTableContainer>
        )}
      </div>
      <DeleteDialog
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        onConfirm={async () => {
          if (selected) await removeTalk(selected.id);
          setSelected(null);
        }}
      />
    </>
  );
}
