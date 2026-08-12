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
  AdminTableContainer,
} from "@/components/admin/admin-page";
import DeleteDialog from "@/components/admin/delete-dialog";
import { Raffle } from "@/contracts/raffle";
import { useAdminListState } from "@/hooks/useAdminListState";
import { useRaffles } from "@/hooks/useRaffles";
import { Gift, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
const statusLabel = {
  pending: "Pendente",
  awaiting_confirmation: "Aguardando confirmação",
  drawn: "Sorteado",
} as const;
export default function RafflesPage() {
  const router = useRouter();
  const { raffles, loading, error, fetchRaffles, updateRaffle, removeRaffle } =
    useRaffles();
  const [selected, setSelected] = useState<Raffle | null>(null);
  const [status, setStatus] = useState("all");
  const list = useAdminListState();
  const filtered = useMemo(
    () =>
      raffles.filter(
        (item) =>
          (status === "all" || item.status === status) &&
          `${item.prizeName} ${item.description ?? ""}`
            .toLowerCase()
            .includes(list.search.toLowerCase()),
      ),
    [raffles, status, list.search],
  );
  const pagination = list.paginate(filtered);
  return (
    <>
      <main className="p-4 sm:p-6">
        <AdminPageHeader
          title="Prêmios para sorteio"
          description="Cadastre o catálogo; a execução do sorteio acontece na Pokedex."
          count={raffles.length}
          icon={Gift}
          action={{
            href: "/admin/raffles/add-raffle",
            label: "Cadastrar prêmio",
          }}
        />
        <AdminListToolbar search={list.search} onSearchChange={list.setSearch}>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-10 rounded-lg border px-3 text-sm"
          >
            <option value="all">Todos</option>
            <option value="pending">Pendentes</option>
            <option value="awaiting_confirmation">Em andamento</option>
            <option value="drawn">Sorteados</option>
          </select>
        </AdminListToolbar>
        {error && (
          <AdminErrorState
            message={error}
            onRetry={() => void fetchRaffles()}
          />
        )}
        {loading && !raffles.length ? (
          <AdminLoadingState />
        ) : !filtered.length ? (
          <AdminEmptyState
            title="Nenhum prêmio encontrado"
            description="Cadastre o primeiro prêmio."
          />
        ) : (
          <AdminTableContainer>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Imagem</TableHead>
                  <TableHead>Prêmio</TableHead>
                  <TableHead>Ordem</TableHead>
                  <TableHead>Sorteio</TableHead>
                  <TableHead>Ativo</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagination.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt=""
                          width={40}
                          height={40}
                          className="size-10 rounded-lg object-contain"
                        />
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      {item.prizeName}
                    </TableCell>
                    <TableCell>{item.order}</TableCell>
                    <TableCell>{statusLabel[item.status]}</TableCell>
                    <TableCell>
                      <button
                        disabled={item.status !== "pending"}
                        onClick={() =>
                          void updateRaffle({
                            id: item.id,
                            prizeName: item.prizeName,
                            description: item.description,
                            imageUrl: item.imageUrl,
                            order: item.order,
                            active: !item.active,
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
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          variant="secondary"
                          onClick={() =>
                            router.push(`/admin/raffles/edit/${item.id}`)
                          }
                        >
                          <Pencil />
                        </Button>
                        <Button
                          size="icon"
                          variant="secondary"
                          disabled={item.status !== "pending"}
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
        title={`Excluir ${selected?.prizeName ?? "prêmio"}?`}
        description="Somente prêmios pendentes podem ser excluídos."
        onClose={() => setSelected(null)}
        onConfirm={async () => {
          if (selected) await removeRaffle(selected.id);
          setSelected(null);
        }}
      />
    </>
  );
}
