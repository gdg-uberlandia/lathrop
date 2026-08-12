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
import { useAdminListState } from "@/hooks/useAdminListState";
import { Speaker } from "@/contracts/speaker";
import { shouldBypassImageOptimization } from "@/helpers/image";
import { Megaphone, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

export default function Speakers() {
  const router = useRouter();
  const {
    speakers,
    removeSpeaker,
    updateSpeaker,
    loading,
    error,
    fetchSpeakers,
  } = useSpeakers();
  const [speaker, setSpeaker] = useState<Speaker | null>(null);
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
  const [visibility, setVisibility] = useState("all");
  const filteredSpeakers = useMemo(() => {
    const term = search.trim().toLocaleLowerCase("pt-BR");
    return speakers.filter((item) => {
      const matchesStatus =
        visibility === "all" || String(item.isVisible) === visibility;
      const matchesSearch =
        !term ||
        [item.name, item.company, item.title]
          .filter(Boolean)
          .some((value) => value!.toLocaleLowerCase("pt-BR").includes(term));
      return matchesStatus && matchesSearch;
    });
  }, [search, speakers, visibility]);
  const pagination = paginate(
    sortItems(filteredSpeakers, {
      name: (item) => item.name,
      company: (item) => item.company ?? "",
      status: (item) => Number(item.isVisible),
    }),
  );

  return (
    <>
      <div className="p-4 sm:p-6">
        <AdminPageHeader
          title="Palestrantes"
          description="Gerencie quem participa da programação."
          count={speakers.length}
          icon={Megaphone}
          action={{
            href: "/admin/speakers/add-speaker",
            label: "Cadastrar palestrante",
          }}
        />
        <AdminListToolbar search={search} onSearchChange={setSearch}>
          <select
            aria-label="Filtrar por visibilidade"
            value={visibility}
            onChange={(event) => setVisibility(event.target.value)}
            className="h-10 rounded-lg border border-white/10 bg-background px-3 text-sm"
          >
            <option value="all">Todos</option>
            <option value="true">Visíveis</option>
            <option value="false">Ocultos</option>
          </select>
        </AdminListToolbar>
        {error && (
          <AdminErrorState
            message={error}
            onRetry={() => void fetchSpeakers()}
          />
        )}
        {loading && speakers.length === 0 ? (
          <AdminLoadingState />
        ) : filteredSpeakers.length === 0 ? (
          <AdminEmptyState
            title={
              search ? "Nenhum resultado" : "Nenhum palestrante cadastrado"
            }
            description={
              search
                ? "Tente buscar por outro nome, cargo ou empresa."
                : "Cadastre a primeira pessoa palestrante do evento."
            }
            action={
              !search
                ? {
                    href: "/admin/speakers/add-speaker",
                    label: "Cadastrar palestrante",
                  }
                : undefined
            }
          />
        ) : (
          <AdminTableContainer>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead />
                  <TableHead>
                    <AdminSortButton
                      label="Nome"
                      active={sort === "name"}
                      direction={direction}
                      onClick={() => toggleSort("name")}
                    />
                  </TableHead>
                  <TableHead>
                    <AdminSortButton
                      label="Cargo / empresa"
                      active={sort === "company"}
                      direction={direction}
                      onClick={() => toggleSort("company")}
                    />
                  </TableHead>
                  <TableHead>
                    <AdminSortButton
                      label="Visível"
                      active={sort === "status"}
                      direction={direction}
                      onClick={() => toggleSort("status")}
                    />
                  </TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagination.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Image
                        src={item.photoUrl ?? "/default-speaker.png"}
                        unoptimized={shouldBypassImageOptimization(
                          item.photoUrl,
                        )}
                        width={40}
                        height={40}
                        alt={`Foto de ${item.name}`}
                        className="size-10 rounded-full object-cover"
                      />
                    </TableCell>
                    <TableCell className="text-white/80">{item.name}</TableCell>
                    <TableCell className="text-white/80">
                      {[item.title, item.company].filter(Boolean).join(" · ") ||
                        "—"}
                    </TableCell>
                    <TableCell className="text-white/80">
                      <button
                        type="button"
                        disabled={loading}
                        title="Alterar visibilidade"
                        onClick={() =>
                          void updateSpeaker({
                            id: item.id,
                            name: item.name,
                            company: item.company,
                            title: item.title,
                            miniBio: item.miniBio,
                            photoUrl: item.photoUrl,
                            socialMedia: item.socialMedia,
                            isVisible: !item.isVisible,
                          })
                        }
                      >
                        <AdminStatusBadge
                          active={item.isVisible}
                          activeLabel="Visível"
                          inactiveLabel="Oculto"
                        />
                      </button>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="secondary"
                          size="icon"
                          onClick={() =>
                            router.push(`/admin/speakers/edit/${item.id}`)
                          }
                          aria-label={`Editar ${item.name}`}
                        >
                          <Pencil />
                        </Button>
                        <Button
                          variant="secondary"
                          size="icon"
                          onClick={() => setSpeaker(item)}
                          aria-label={`Excluir ${item.name}`}
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
        open={Boolean(speaker)}
        onClose={() => setSpeaker(null)}
        onConfirm={async () => {
          if (speaker) await removeSpeaker(speaker.id);
          setSpeaker(null);
        }}
      />
    </>
  );
}
