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
  AdminSortButton,
  AdminStatusBadge,
  AdminTableContainer,
} from "@/components/admin/admin-page";
import DeleteDialog from "@/components/admin/delete-dialog";
import { Company } from "@/contracts/company";
import { useAdminListState } from "@/hooks/useAdminListState";
import { useCompanies } from "@/hooks/useCompanies";
import { Building2, ImageOff, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { shouldBypassImageOptimization } from "@/helpers/image";
import { useRouter } from "next/router";
import {
  adminDestinationWithReturnTo,
  adminPathWithReturnTo,
} from "@/lib/admin-return-path";
import { useMemo, useState } from "react";

export default function CompaniesPage() {
  const router = useRouter();
  const {
    companies,
    loading,
    error,
    fetchCompanies,
    updateCompany,
    removeCompany,
  } = useCompanies();
  const [selected, setSelected] = useState<Company | null>(null);
  const [status, setStatus] = useState("all");
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
  const filtered = useMemo(() => {
    const term = search.trim().toLocaleLowerCase("pt-BR");
    return companies.filter(
      (item) =>
        (status === "all" || String(item.active) === status) &&
        (!term ||
          `${item.name} ${item.description ?? ""}`
            .toLocaleLowerCase("pt-BR")
            .includes(term)),
    );
  }, [companies, search, status]);
  const pagination = paginate(
    sortItems(filtered, {
      name: (item) => item.name,
      status: (item) => Number(item.active),
      xp: (item) => item.xpAwarded ?? 0,
    }),
  );
  return (
    <>
      <main className="p-4 sm:p-6">
        <AdminPageHeader
          title="Empresas"
          description="Gerencie empresas participantes das missões, separadamente dos patrocinadores."
          count={companies.length}
          icon={Building2}
          action={{
            href: adminPathWithReturnTo(
              "/admin/companies/add-company",
              router.asPath,
            ),
            label: "Cadastrar empresa",
          }}
        />
        <AdminListToolbar search={search} onSearchChange={setSearch}>
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
          <AdminErrorState
            message={error}
            onRetry={() => void fetchCompanies()}
          />
        )}
        {loading && companies.length === 0 ? (
          <AdminLoadingState />
        ) : filtered.length === 0 ? (
          <AdminEmptyState
            title={search ? "Nenhum resultado" : "Nenhuma empresa cadastrada"}
            description={
              search
                ? "Tente outro termo."
                : "Cadastre a primeira empresa do evento."
            }
            action={
              !search
                ? {
                    href: "/admin/companies/add-company",
                    label: "Cadastrar empresa",
                  }
                : undefined
            }
          />
        ) : (
          <AdminTableContainer>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Logo</TableHead>
                  <TableHead>Selo</TableHead>
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
                      label="XP"
                      active={sort === "xp"}
                      direction={direction}
                      onClick={() => toggleSort("xp")}
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
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagination.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Image
                        src={item.logoUrl}
                        alt={`Logo ${item.name}`}
                        width={40}
                        height={40}
                        unoptimized={shouldBypassImageOptimization(
                          item.logoUrl,
                        )}
                        className="size-10 rounded-lg object-contain"
                      />
                    </TableCell>
                    <TableCell>
                      {item.stampImageUrl ? (
                        <Image
                          src={item.stampImageUrl}
                          alt={`Selo ${item.name}`}
                          width={40}
                          height={40}
                          unoptimized={shouldBypassImageOptimization(
                            item.stampImageUrl,
                          )}
                          className="size-10 rounded-lg object-contain"
                        />
                      ) : (
                        <span
                          className="flex size-10 items-center justify-center rounded-lg bg-slate-100 text-slate-400"
                          title="Selo não cadastrado"
                        >
                          <ImageOff className="size-4" />
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="font-medium text-slate-800">
                      {item.name}
                    </TableCell>
                    <TableCell>{item.xpAwarded ?? "—"}</TableCell>
                    <TableCell>
                      <button
                        type="button"
                        disabled={loading}
                        onClick={() =>
                          void updateCompany({
                            id: item.id,
                            qrId: item.qrId,
                            name: item.name,
                            description: item.description,
                            logoUrl: item.logoUrl,
                            stampImageUrl: item.stampImageUrl,
                            active: !item.active,
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
                          variant="secondary"
                          size="icon"
                          aria-label={`Editar ${item.name}`}
                          onClick={() =>
                            router.push(
                              adminDestinationWithReturnTo(
                                `/admin/companies/edit/${item.id}`,
                                router.asPath,
                              ),
                            )
                          }
                        >
                          <Pencil />
                        </Button>
                        <Button
                          variant="secondary"
                          size="icon"
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
            <AdminPagination {...pagination} onPageChange={setPage} />
          </AdminTableContainer>
        )}
      </main>
      <DeleteDialog
        open={Boolean(selected)}
        title={`Excluir ${selected?.name ?? "empresa"}?`}
        description="A exclusão será bloqueada se esta empresa estiver vinculada a uma missão."
        onClose={() => setSelected(null)}
        onConfirm={async () => {
          if (selected) await removeCompany(selected.id);
          setSelected(null);
        }}
      />
    </>
  );
}
