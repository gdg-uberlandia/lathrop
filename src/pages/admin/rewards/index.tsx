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
import { useAdminListState } from "@/hooks/useAdminListState";
import { useRewards } from "@/hooks/useRewards";
import { shouldBypassImageOptimization } from "@/helpers/image";
import { Package, Pencil } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  adminDestinationWithReturnTo,
  adminPathWithReturnTo,
} from "@/lib/admin-return-path";
import { useMemo, useState } from "react";

export default function RewardsPage() {
  const router = useRouter();
  const { rewards, loading, error, fetchRewards, updateReward } = useRewards();
  const [status, setStatus] = useState("all");
  const list = useAdminListState();
  const filtered = useMemo(
    () =>
      rewards.filter(
        (item) =>
          (status === "all" ||
            (status === "active" ? item.active : !item.active)) &&
          `${item.name} ${item.description}`
            .toLocaleLowerCase("pt-BR")
            .includes(list.search.toLocaleLowerCase("pt-BR")),
      ),
    [rewards, status, list.search],
  );
  const pagination = list.paginate(
    list.sortItems(filtered, {
      name: (item) => item.name,
      order: (item) => item.order,
      tickets: (item) => item.ticketCost,
      stock: (item) => item.stock,
    }),
  );
  return (
    <main className="min-w-0 p-4 sm:p-6">
      <AdminPageHeader
        title="Brindes da Pokédex"
        description="Gerencie os brindes disponíveis para troca por tickets na lojinha."
        count={rewards.length}
        icon={Package}
        action={{
          href: adminPathWithReturnTo(
            "/admin/rewards/add-reward",
            router.asPath,
          ),
          label: "Cadastrar brinde",
        }}
      />
      <AdminListToolbar search={list.search} onSearchChange={list.setSearch}>
        <select
          aria-label="Disponibilidade dos brindes"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="h-10 rounded-lg border px-3 text-sm"
        >
          <option value="all">Todos os brindes</option>
          <option value="active">Ativos</option>
          <option value="inactive">Inativos</option>
        </select>
      </AdminListToolbar>
      {error && (
        <AdminErrorState message={error} onRetry={() => void fetchRewards()} />
      )}
      {loading && !rewards.length ? (
        <AdminLoadingState />
      ) : !filtered.length ? (
        <AdminEmptyState
          title="Nenhum brinde encontrado"
          description={
            rewards.length
              ? "Altere a busca ou os filtros."
              : "Cadastre o primeiro brinde da lojinha."
          }
        />
      ) : (
        <AdminTableContainer>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Imagem</TableHead>
                {(
                  [
                    ["name", "Brinde"],
                    ["tickets", "Tickets"],
                    ["stock", "Estoque"],
                    ["order", "Ordem"],
                  ] as const
                ).map(([key, label]) => (
                  <TableHead key={key}>
                    <AdminSortButton
                      label={label}
                      active={list.sort === key}
                      direction={list.direction}
                      onClick={() => list.toggleSort(key)}
                    />
                  </TableHead>
                ))}
                <TableHead>Limite por participante</TableHead>
                <TableHead>Disponibilidade</TableHead>
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
                      unoptimized={shouldBypassImageOptimization(item.imageUrl)}
                      className="size-10 rounded-lg object-contain"
                    />
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{item.name}</p>
                    <p className="max-w-xs text-xs text-slate-500">
                      {item.description}
                    </p>
                  </TableCell>
                  <TableCell>{item.ticketCost}</TableCell>
                  <TableCell>
                    {item.stock === 0 ? "Esgotado" : item.stock}
                  </TableCell>
                  <TableCell>{item.order}</TableCell>
                  <TableCell>{item.redemptionLimit ?? "Sem limite"}</TableCell>
                  <TableCell>
                    <button
                      type="button"
                      disabled={loading}
                      aria-label={`${item.active ? "Desativar" : "Ativar"} ${item.name}`}
                      onClick={() =>
                        void updateReward({
                          id: item.id,
                          name: item.name,
                          description: item.description,
                          imageUrl: item.imageUrl,
                          ticketCost: item.ticketCost,
                          stock: item.stock,
                          redemptionLimit: item.redemptionLimit,
                          order: item.order,
                          active: !item.active,
                          expectedUpdatedAt: item.updatedAt.toISOString(),
                        })
                      }
                    >
                      <AdminStatusBadge
                        active={item.active}
                        activeLabel="Ativo"
                        inactiveLabel="Inativo"
                      />
                    </button>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="icon"
                      variant="secondary"
                      aria-label={`Editar ${item.name}`}
                      disabled={loading}
                      onClick={() =>
                        router.push(
                          adminDestinationWithReturnTo(
                            `/admin/rewards/edit/${item.id}`,
                            router.asPath,
                          ),
                        )
                      }
                    >
                      <Pencil />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <AdminPagination {...pagination} onPageChange={list.setPage} />
        </AdminTableContainer>
      )}
    </main>
  );
}
