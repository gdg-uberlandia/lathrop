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
  AdminTableContainer,
} from "@/components/admin/admin-page";
import { useSponsors } from "@/hooks/useSponsors";
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
  const [search, setSearch] = useState("");
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
        superior: "border-1 border-devBlue-dark text-white",
        diamond: "border-1 border-blue-300 text-white",
        gold: "border-1 border-yellow-500 text-white",
        silver: "border-1 border-gray-300 text-white",
        bronze: "border-1 border-orange-400 text-white",
        iron: "border-1 border-gray-500 text-white",
        ruby: "border-1 border-red-500 text-white",
        support: "border-1 border-teal-500 text-white",
      }[levelName] || "border-1 border-devGreen-light text-white"
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
              <TableHeader className="bg-devGray-dark text-white">
                <TableRow>
                  <TableHead className="p-3 text-white w-24 text-center">
                    Nível
                  </TableHead>
                  <TableHead className="p-3 text-white ">Nome</TableHead>
                  <TableHead className="p-3 text-white text-center w-14"></TableHead>
                  <TableHead className="p-3 text-white text-center w-14"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRows.map((sponsor) => (
                  <TableRow key={sponsor.id}>
                    <TableCell className="p-3 text-white/80 font-medium text-center">
                      <span
                        className={`py-1 px-2 text-xs rounded-2xl ${getLevelColor(sponsor.level)}`}
                      >
                        {getSponsorLevel(sponsor.level)}
                      </span>
                    </TableCell>
                    <TableCell className="p-3 text-white/80 font-bold">
                      {sponsor.name}
                    </TableCell>
                    <TableCell className="px-3 text-white/80 text-right">
                      <Button
                        disabled={loading}
                        variant="secondary"
                        size="icon"
                        className="size-8 text-devGreen-dark hover:text-devGreen bg-transparent p-0"
                        onClick={() =>
                          router.push(
                            `/admin/sponsors/edit/${sponsor.levelName}?id=${sponsor.id}`,
                          )
                        }
                        aria-label={`Editar ${sponsor.name}`}
                      >
                        <Pencil />
                      </Button>
                    </TableCell>
                    <TableCell className="px-3 text-white/80 text-right">
                      <Button
                        variant="secondary"
                        size="icon"
                        disabled={loading}
                        className="size-8 text-devRed-dark hover:text-devRed bg-transparent p-0"
                        onClick={() => handleOpenDialogDelete(sponsor)}
                        aria-label={`Excluir ${sponsor.name}`}
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
        open={dialogDeleteOpen}
        onClose={() => setDialogDeleteOpen(false)}
        onConfirm={handleDelete}
      />
    </>
  );
}
