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
  AdminStatusBadge,
  AdminTableContainer,
} from "@/components/admin/admin-page";
import { useSpeakers } from "@/hooks/useSpeakers";
import { useTalks } from "@/hooks/useTalks";
import { Talk } from "@/contracts/talk";
import { Pencil, Presentation, Trash2 } from "lucide-react";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

const formatLabels = {
  talk: "Talk",
  panel: "Painel",
  keynote: "Keynote",
} as const;
export default function TalksPage() {
  const router = useRouter();
  const { talks, removeTalk, loading, error, fetchTalks } = useTalks();
  const { speakers } = useSpeakers();
  const [selected, setSelected] = useState<Talk | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const names = useMemo(
    () => new Map(speakers.map((speaker) => [speaker.id, speaker.name])),
    [speakers],
  );
  const filteredTalks = useMemo(() => {
    const term = search.trim().toLocaleLowerCase("pt-BR");
    return talks.filter((talk) => {
      const matchesStatus =
        status === "all" || String(talk.isActive) === status;
      const matchesSearch =
        !term ||
        [talk.title, talk.category, formatLabels[talk.format]]
          .filter(Boolean)
          .some((value) => value!.toLocaleLowerCase("pt-BR").includes(term));
      return matchesStatus && matchesSearch;
    });
  }, [search, status, talks]);
  return (
    <>
      <div className="p-4 sm:p-6">
        <AdminPageHeader
          title="Palestras"
          description="Organize conteúdos, formatos e participantes."
          count={talks.length}
          icon={Presentation}
          action={{
            href: "/admin/talks/add-talk",
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
              <TableHeader className="bg-devGray-dark">
                <TableRow>
                  <TableHead className="text-white">Título</TableHead>
                  <TableHead className="text-white">Formato</TableHead>
                  <TableHead className="text-white">Palestrantes</TableHead>
                  <TableHead className="text-white">Status</TableHead>
                  <TableHead />
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTalks.map((talk) => (
                  <TableRow key={talk.id}>
                    <TableCell className="text-white/80">
                      {talk.title}
                    </TableCell>
                    <TableCell className="text-white/80">
                      {formatLabels[talk.format]}
                    </TableCell>
                    <TableCell className="text-white/80">
                      {talk.speakerIds
                        .map((id) => names.get(id) ?? "Palestrante removido")
                        .join(", ")}
                    </TableCell>
                    <TableCell className="text-white/80">
                      <AdminStatusBadge
                        active={talk.isActive}
                        activeLabel="Ativa"
                        inactiveLabel="Inativa"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={() =>
                          router.push(`/admin/talks/edit/${talk.id}`)
                        }
                        aria-label={`Editar ${talk.title}`}
                      >
                        <Pencil />
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => setSelected(talk)}
                        aria-label={`Excluir ${talk.title}`}
                      >
                        <Trash2 />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
