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
  AdminStatusBadge,
} from "@/components/admin/admin-page";
import { useMissions } from "@/hooks/useMissions";
import { useAdminListState } from "@/hooks/useAdminListState";
import { Mission } from "@/models/mission";
import { Target, Pencil, Trash2, QrCode } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

export default function Missions() {
  const router = useRouter();
  const {
    missions,
    removeMission,
    updateMission,
    error,
    loading,
    fetchMissions,
  } = useMissions();
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
  const filteredMissions = useMemo(() => {
    const term = search.trim().toLocaleLowerCase("pt-BR");
    return missions.filter((item) => {
      const matchesStatus = status === "all" || String(item.active) === status;
      const matchesSearch =
        !term ||
        `${item.title} ${item.description}`
          .toLocaleLowerCase("pt-BR")
          .includes(term);
      return matchesStatus && matchesSearch;
    });
  }, [missions, search, status]);
  const pagination = paginate(
    sortItems(filteredMissions, {
      name: (item) => item.title,
      description: (item) => item.description,
      qr: (item) => item.qrId ?? "",
      order: (item) => item.order,
      status: (item) => Number(item.active),
    }),
  );

  const [mission, setMission] = useState<Mission | null>();
  const [dialogDeleteOpen, setDialogDeleteOpen] = useState(false);

  const handleOpenDialogDelete = (value: Mission) => {
    if (!value) return;
    setMission(value);
    setDialogDeleteOpen(true);
  };

  const handleDelete = () => {
    if (!mission) return;
    removeMission(mission.id);
    setMission(null);
    setDialogDeleteOpen(false);
  };

  return (
    <>
      <div className="p-4 sm:p-6">
        <AdminPageHeader
          title="Missões"
          description="Configure desafios, validações e recompensas de XP."
          count={missions.length}
          icon={Target}
          action={{
            href: "/admin/missions/add-mission",
            label: "Cadastrar missão",
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
          <AdminErrorState
            message={error}
            onRetry={() => void fetchMissions()}
          />
        )}
        {loading && missions.length === 0 ? (
          <AdminLoadingState />
        ) : filteredMissions.length === 0 ? (
          <AdminEmptyState
            title={search ? "Nenhum resultado" : "Nenhuma missão cadastrada"}
            description={
              search
                ? "Tente outro termo de busca."
                : "Cadastre a primeira missão do evento."
            }
            action={
              !search
                ? {
                    href: "/admin/missions/add-mission",
                    label: "Cadastrar missão",
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
                  <TableHead className="p-3">Imagem</TableHead>
                  <TableHead className="p-3">
                    <AdminSortButton
                      label="Nome"
                      active={sort === "name"}
                      direction={direction}
                      onClick={() => toggleSort("name")}
                    />
                  </TableHead>
                  <TableHead className="p-3">
                    <AdminSortButton
                      label="Descrição"
                      active={sort === "description"}
                      direction={direction}
                      onClick={() => toggleSort("description")}
                    />
                  </TableHead>
                  <TableHead className="p-3">
                    <AdminSortButton
                      label="QR Code"
                      active={sort === "qr"}
                      direction={direction}
                      onClick={() => toggleSort("qr")}
                    />
                  </TableHead>
                  <TableHead className="p-3">
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
                {pagination.items.map((mission) => (
                  <TableRow key={mission.id}>
                    <TableCell className="p-3 text-white/80">
                      {mission.imageUrl ? (
                        <Image
                          src={mission.imageUrl}
                          alt={mission.title}
                          width={48}
                          height={48}
                          style={{
                            maxWidth: 48,
                            maxHeight: 48,
                            objectFit: "cover",
                            borderRadius: "4px",
                          }}
                        />
                      ) : (
                        <div className="w-12 h-12 bg-devGray-light/20 rounded flex items-center justify-center">
                          <Target className="w-6 h-6 text-white/40" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="p-3 text-white/80 font-medium">
                      {mission.title}
                    </TableCell>
                    <TableCell className="p-3 text-white/80 ">
                      <span>{mission.description}</span>
                    </TableCell>
                    <TableCell className="p-3 text-white/80 text-center">
                      {mission.validationType === "qr" && (
                        <QrCode className="inline-block text-devBlue-dark" />
                      )}
                    </TableCell>
                    <TableCell>
                      <button
                        type="button"
                        disabled={loading}
                        title="Alterar status"
                        onClick={() =>
                          void updateMission({
                            id: mission.id,
                            qrId: mission.qrId,
                            title: mission.title,
                            description: mission.description,
                            imageUrl: mission.imageUrl,
                            validationType: mission.validationType,
                            progressRequirement: mission.progressRequirement,
                            prerequisites: mission.prerequisites,
                            active: !mission.active,
                            order: mission.order,
                            xpAwarded: mission.xpAwarded,
                          })
                        }
                      >
                        <AdminStatusBadge
                          active={mission.active}
                          activeLabel="Ativa"
                          inactiveLabel="Inativa"
                        />
                      </button>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button
                          disabled={loading}
                          variant="secondary"
                          size="icon"
                          onClick={() =>
                            router.push(`/admin/missions/edit/${mission.id}`)
                          }
                          aria-label={`Editar ${mission.title}`}
                        >
                          <Pencil />
                        </Button>
                        <Button
                          variant="secondary"
                          size="icon"
                          disabled={loading}
                          onClick={() => handleOpenDialogDelete(mission)}
                          aria-label={`Excluir ${mission.title}`}
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
