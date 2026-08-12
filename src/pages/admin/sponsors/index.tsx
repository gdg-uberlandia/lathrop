import { Button } from "@/assets/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
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
  AdminTableContainer,
  AdminSortButton,
} from "@/components/admin/admin-page";
import { useSponsors } from "@/hooks/useSponsors";
import { useAdminListState } from "@/hooks/useAdminListState";
import { SponsorCategoryDisplayName } from "@/models/sponsor";
import { DollarSign, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

type TableRowType = {
  levelName: string;
  level: string;
  name: string;
  url: string;
  id: string;
};

export default function Sponsors() {
  const router = useRouter();
  const { sponsors, loading, removeSponsor, error, fetchSponsors } =
    useSponsors();
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
  const [level, setLevel] = useState("all");

  const [sponsor, setSponsor] = useState<TableRowType | null>();
  const [dialogDeleteOpen, setDialogDeleteOpen] = useState(false);

  const tableRows: TableRowType[] = sponsors.flatMap((group) =>
    group.items.map(
      (item) =>
        ({
          level: item.level,
          levelName: item.level,
          name: item.name,
          url: item.url,
          id: item.id,
        }) as TableRowType,
    ),
  );
  const filteredRows = useMemo(() => {
    const term = search.trim().toLocaleLowerCase("pt-BR");
    return tableRows.filter((item) => {
      const matchesLevel = level === "all" || item.level === level;
      const matchesSearch =
        !term ||
        `${item.name} ${item.level}`.toLocaleLowerCase("pt-BR").includes(term);
      return matchesLevel && matchesSearch;
    });
  }, [level, search, tableRows]);
  const pagination = paginate(
    sortItems(filteredRows, {
      name: (item) => item.name,
      level: (item) => item.level,
    }),
  );

  const handleOpenDialogDelete = (value: TableRowType) => {
    if (!value) return;
    setSponsor(value);
    setDialogDeleteOpen(true);
  };

  const handleDelete = () => {
    if (!sponsor) return;
    removeSponsor(sponsor.id);
    setSponsor(null);
    setDialogDeleteOpen(false);
  };

  const getLevelColor = (levelName: string) => {
    return (
      {
        superior: "bg-blue-50 text-blue-700 ring-blue-200",
        diamond: "bg-cyan-50 text-cyan-700 ring-cyan-200",
        gold: "bg-amber-50 text-amber-700 ring-amber-200",
        silver: "bg-slate-100 text-slate-600 ring-slate-200",
        bronze: "bg-orange-50 text-orange-700 ring-orange-200",
        iron: "bg-zinc-100 text-zinc-700 ring-zinc-200",
        ruby: "bg-red-50 text-red-700 ring-red-200",
        support: "bg-teal-50 text-teal-700 ring-teal-200",
      }[levelName] || "bg-emerald-50 text-emerald-700 ring-emerald-200"
    );
  };

  const getSponsorLevel = (levelName: string) => {
    return Object.entries(SponsorCategoryDisplayName).find(
      ([key]) => key === levelName,
    )?.[1];
  };

  return (
    <>
      <div className="p-4 sm:p-6">
        <AdminPageHeader
          title="Patrocinadores"
          description="Gerencie marcas apoiadoras e seus níveis."
          count={tableRows.length}
          icon={DollarSign}
          action={{
            href: "/admin/sponsors/add-sponsor",
            label: "Cadastrar patrocinador",
          }}
        />
        <AdminListToolbar search={search} onSearchChange={setSearch}>
          <select
            aria-label="Filtrar por nível"
            value={level}
            onChange={(event) => setLevel(event.target.value)}
            className="h-10 rounded-lg border border-white/10 bg-background px-3 text-sm"
          >
            <option value="all">Todos os níveis</option>
            {Object.entries(SponsorCategoryDisplayName).map(
              ([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ),
            )}
          </select>
        </AdminListToolbar>
        {error && (
          <AdminErrorState
            message={error}
            onRetry={() => void fetchSponsors()}
          />
        )}
        {loading && tableRows.length === 0 ? (
          <AdminLoadingState />
        ) : filteredRows.length === 0 ? (
          <AdminEmptyState
            title={
              search ? "Nenhum resultado" : "Nenhum patrocinador cadastrado"
            }
            description={
              search
                ? "Tente outro nome ou nível."
                : "Cadastre a primeira marca apoiadora do evento."
            }
            action={
              !search
                ? {
                    href: "/admin/sponsors/add-sponsor",
                    label: "Cadastrar patrocinador",
                  }
                : undefined
            }
          />
        ) : (
          <AdminTableContainer>
            <Table className="rounded-xl overflow-hidden border-collapse">
              <TableCaption />
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24 p-3">
                    <AdminSortButton
                      label="Nível"
                      active={sort === "level"}
                      direction={direction}
                      onClick={() => toggleSort("level")}
                    />
                  </TableHead>
                  <TableHead className="p-3">
                    <AdminSortButton
                      label="Nome"
                      active={sort === "name"}
                      direction={direction}
                      onClick={() => toggleSort("name")}
                    />
                  </TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagination.items.map((sponsor) => (
                  <TableRow key={sponsor.id}>
                    <TableCell className="p-3 text-white/80 font-medium text-center">
                      <span
                        className={`inline-flex rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getLevelColor(sponsor.level)}`}
                      >
                        {getSponsorLevel(sponsor.level)}
                      </span>
                    </TableCell>
                    <TableCell className="p-3 text-white/80 font-bold">
                      {sponsor.name}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button
                          disabled={loading}
                          variant="secondary"
                          size="icon"
                          onClick={() =>
                            router.push(
                              `/admin/sponsors/edit/${sponsor.levelName}?id=${sponsor.id}`,
                            )
                          }
                          aria-label={`Editar ${sponsor.name}`}
                        >
                          <Pencil />
                        </Button>
                        <Button
                          variant="secondary"
                          size="icon"
                          disabled={loading}
                          onClick={() => handleOpenDialogDelete(sponsor)}
                          aria-label={`Excluir ${sponsor.name}`}
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
        open={dialogDeleteOpen}
        onClose={() => setDialogDeleteOpen(false)}
        onConfirm={handleDelete}
      />
    </>
  );
}
