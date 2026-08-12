import { Button } from "@/assets/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/assets/components/ui/table";
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
import DeleteDialog from "@/components/admin/delete-dialog";
import { Tag } from "@/contracts/tag";
import { useAdminListState } from "@/hooks/useAdminListState";
import { useTags } from "@/hooks/useTags";
import { Pencil, Tags, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import {
  adminDestinationWithReturnTo,
  adminPathWithReturnTo,
} from "@/lib/admin-return-path";
export default function TagsPage() {
  const router = useRouter();
  const { tags, loading, error, fetchTags, updateTag, removeTag } = useTags();
  const [selected, setSelected] = useState<Tag | null>(null);
  const [status, setStatus] = useState("all");
  const list = useAdminListState();
  const filtered = useMemo(
    () =>
      tags.filter(
        (item) =>
          (status === "all" || String(item.active) === status) &&
          `${item.name} ${item.description}`
            .toLowerCase()
            .includes(list.search.toLowerCase()),
      ),
    [tags, status, list.search],
  );
  const pagination = list.paginate(
    list.sortItems(filtered, {
      name: (item) => item.name,
      order: (item) => item.order,
      xp: (item) => item.xpAwarded ?? 0,
      status: (item) => Number(item.active),
    }),
  );
  return (
    <>
      <main className="p-4 sm:p-6">
        <AdminPageHeader
          title="Tags"
          description="Gerencie descobertas por QR consumidas pela Pokedex."
          count={tags.length}
          icon={Tags}
          action={{
            href: adminPathWithReturnTo("/admin/tags/add-tag", router.asPath),
            label: "Cadastrar tag",
          }}
        />
        <AdminListToolbar search={list.search} onSearchChange={list.setSearch}>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-10 rounded-lg border px-3 text-sm"
          >
            <option value="all">Todas</option>
            <option value="true">Ativas</option>
            <option value="false">Inativas</option>
          </select>
        </AdminListToolbar>
        {error && (
          <AdminErrorState message={error} onRetry={() => void fetchTags()} />
        )}
        {loading && !tags.length ? (
          <AdminLoadingState />
        ) : !filtered.length ? (
          <AdminEmptyState
            title="Nenhuma tag encontrada"
            description="Cadastre a primeira tag do evento."
          />
        ) : (
          <AdminTableContainer>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Imagem</TableHead>
                  <TableHead>
                    <AdminSortButton
                      label="Nome"
                      active={list.sort === "name"}
                      direction={list.direction}
                      onClick={() => list.toggleSort("name")}
                    />
                  </TableHead>
                  <TableHead>
                    <AdminSortButton
                      label="Ordem"
                      active={list.sort === "order"}
                      direction={list.direction}
                      onClick={() => list.toggleSort("order")}
                    />
                  </TableHead>
                  <TableHead>
                    <AdminSortButton
                      label="XP"
                      active={list.sort === "xp"}
                      direction={list.direction}
                      onClick={() => list.toggleSort("xp")}
                    />
                  </TableHead>
                  <TableHead>
                    <AdminSortButton
                      label="Status"
                      active={list.sort === "status"}
                      direction={list.direction}
                      onClick={() => list.toggleSort("status")}
                    />
                  </TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagination.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Image
                        src={item.imageUrl}
                        alt=""
                        width={40}
                        height={40}
                        className="size-10 rounded-lg object-contain"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.order}</TableCell>
                    <TableCell>{item.xpAwarded ?? "—"}</TableCell>
                    <TableCell>
                      <button
                        onClick={() =>
                          void updateTag({
                            id: item.id,
                            qrId: item.qrId,
                            name: item.name,
                            description: item.description,
                            imageUrl: item.imageUrl,
                            active: !item.active,
                            order: item.order,
                            xpAwarded: item.xpAwarded,
                          })
                        }
                      >
                        <AdminStatusBadge
                          active={item.active}
                          activeLabel="Ativa"
                          inactiveLabel="Inativa"
                        />
                      </button>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          variant="secondary"
                          aria-label={`Editar ${item.name}`}
                          onClick={() =>
                            router.push(
                              adminDestinationWithReturnTo(
                                `/admin/tags/edit/${item.id}`,
                                router.asPath,
                              ),
                            )
                          }
                        >
                          <Pencil />
                        </Button>
                        <Button
                          size="icon"
                          variant="secondary"
                          aria-label={`Excluir ${item.name}`}
                          onClick={() => setSelected(item)}
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <AdminPagination {...pagination} onPageChange={list.setPage} />
          </AdminTableContainer>
        )}
      </main>
      <DeleteDialog
        open={!!selected}
        title={`Excluir ${selected?.name ?? "tag"}?`}
        description="Esta ação não pode ser desfeita."
        onClose={() => setSelected(null)}
        onConfirm={async () => {
          if (selected) await removeTag(selected.id);
          setSelected(null);
        }}
      />
    </>
  );
}
