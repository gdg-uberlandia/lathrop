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
import { ScheduleEntry, SCHEDULE_TRACKS } from "@/contracts/schedule";
import { useAdminListState } from "@/hooks/useAdminListState";
import { useSchedule } from "@/hooks/useSchedule";
import { useTalks } from "@/hooks/useTalks";
import { CalendarDays, Pencil, Trash2, TriangleAlert } from "lucide-react";
import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";
const typeLabel = {
  talk: "Palestra",
  opening: "Abertura",
  break: "Intervalo",
  closing: "Encerramento",
};
const trackNames = new Map(
  SCHEDULE_TRACKS.map((track) => [track.value, track.label]),
);
export default function Schedules() {
  const router = useRouter();
  const { schedule, deleteSchedule, loading, error, fetchSchedule } =
    useSchedule();
  const { talks } = useTalks();
  const [selected, setSelected] = useState<ScheduleEntry | null>(null);
  const list = useAdminListState();
  const talkNames = useMemo(
    () => new Map(talks.map((talk) => [talk.id, talk.title])),
    [talks],
  );
  const name = useCallback(
    (item: ScheduleEntry) =>
      item.activity.type === "break"
        ? item.activity.title
        : (talkNames.get(item.activity.talkId) ?? "Palestra removida"),
    [talkNames],
  );
  const filtered = useMemo(
    () =>
      schedule.filter((item) =>
        `${name(item)} ${item.track ? trackNames.get(item.track) : "geral"}`
          .toLowerCase()
          .includes(list.search.toLowerCase()),
      ),
    [schedule, list.search, name],
  );
  const pagination = list.paginate(filtered);
  const conflicts = useMemo(
    () =>
      new Set(
        schedule.flatMap((item, index) =>
          schedule
            .slice(index + 1)
            .flatMap((other) =>
              (item.track === null ||
                other.track === null ||
                item.track === other.track) &&
              item.startAt < other.endAt &&
              other.startAt < item.endAt
                ? [item.id, other.id]
                : [],
            ),
        ),
      ),
    [schedule],
  );
  return (
    <>
      <main className="p-4 sm:p-6">
        <AdminPageHeader
          title="Programação"
          description="Organize palestras e atividades por horário e trilha."
          count={schedule.length}
          icon={CalendarDays}
          action={{
            href: "/admin/schedule/add-schedule",
            label: "Adicionar atividade",
          }}
        />
        <AdminListToolbar
          search={list.search}
          onSearchChange={list.setSearch}
        />
        {error && (
          <AdminErrorState
            message={error}
            onRetry={() => void fetchSchedule()}
          />
        )}
        {loading && !schedule.length ? (
          <AdminLoadingState />
        ) : !filtered.length ? (
          <AdminEmptyState
            title="Programação vazia"
            description="Adicione a primeira atividade do evento."
          />
        ) : (
          <AdminTableContainer>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Horário</TableHead>
                  <TableHead>Atividade</TableHead>
                  <TableHead>Trilha</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagination.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="font-medium">
                        {new Intl.DateTimeFormat("pt-BR", {
                          timeStyle: "short",
                        }).format(item.startAt)}
                      </div>
                      <div className="text-xs text-slate-500">
                        até{" "}
                        {new Intl.DateTimeFormat("pt-BR", {
                          timeStyle: "short",
                        }).format(item.endAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>{name(item)}</div>
                      <div className="text-xs text-slate-500">
                        {typeLabel[item.activity.type]}
                      </div>
                      {conflicts.has(item.id) && (
                        <span className="mt-1 inline-flex items-center gap-1 text-xs text-amber-700">
                          <TriangleAlert className="size-3" /> Conflito na
                          trilha
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {item.track ? trackNames.get(item.track) : "Geral"}
                    </TableCell>
                    <TableCell>
                      <AdminStatusBadge
                        active={item.active}
                        activeLabel="Visível"
                        inactiveLabel="Oculta"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          variant="secondary"
                          onClick={() =>
                            router.push(`/admin/schedule/edit/${item.id}`)
                          }
                        >
                          <Pencil />
                        </Button>
                        <Button
                          size="icon"
                          variant="secondary"
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
        title="Excluir atividade?"
        description="A atividade será removida permanentemente da programação."
        onClose={() => setSelected(null)}
        onConfirm={async () => {
          if (selected) await deleteSchedule(selected.id);
          setSelected(null);
        }}
      />
    </>
  );
}
