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
  AdminTableContainer,
  AdminSortButton,
} from "@/components/admin/admin-page";
import DeleteDialog from "@/components/admin/delete-dialog";
import { useSchedule } from "@/hooks/useSchedule";
import { useAdminListState } from "@/hooks/useAdminListState";
import { Schedule, SpeechTopicName } from "@/models/schedule";
import { CalendarDays, Pencil, Trash2, TriangleAlert } from "lucide-react";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

export default function Schedules() {
  const router = useRouter();
  const { schedule, deleteSchedule, loading, error, fetchSchedule } =
    useSchedule();
  const [selected, setSelected] = useState<Schedule | null>(null);
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
  const filteredSchedule = useMemo(() => {
    const term = search.trim().toLocaleLowerCase("pt-BR");
    if (!term) return schedule;
    return schedule.filter((item) =>
      [item.start, item.end, ...item.speeches.map((speech) => speech.title)]
        .filter(Boolean)
        .some((value) =>
          String(value).toLocaleLowerCase("pt-BR").includes(term),
        ),
    );
  }, [schedule, search]);
  const pagination = paginate(
    sortItems(filteredSchedule, {
      name: (item) => item.start,
      end: (item) => item.end,
    }),
  );
  const conflictingIds = useMemo(() => {
    const minutes = (value: string) => {
      const [hours, minute] = value.split(":").map(Number);
      return hours * 60 + minute;
    };
    return new Set(
      schedule.flatMap((item, index) =>
        schedule
          .slice(index + 1)
          .flatMap((other) =>
            minutes(item.start) < minutes(other.end) &&
            minutes(other.start) < minutes(item.end)
              ? [item.id, other.id]
              : [],
          ),
      ),
    );
  }, [schedule]);

  return (
    <>
      <main className="p-4 sm:p-6">
        <AdminPageHeader
          title="Programação"
          description="Organize horários, trilhas e atividades do evento."
          count={schedule.length}
          icon={CalendarDays}
          action={{
            href: "/admin/schedule/add-schedule",
            label: "Adicionar horário",
          }}
        />
        <AdminListToolbar search={search} onSearchChange={setSearch} />
        {error && (
          <AdminErrorState
            message={error}
            onRetry={() => void fetchSchedule()}
          />
        )}
        {loading && schedule.length === 0 ? (
          <AdminLoadingState />
        ) : filteredSchedule.length === 0 ? (
          <AdminEmptyState
            title={search ? "Nenhum resultado" : "Programação vazia"}
            description={
              search
                ? "Tente buscar por outro horário ou título."
                : "Adicione o primeiro horário da programação."
            }
            action={
              search
                ? undefined
                : {
                    href: "/admin/schedule/add-schedule",
                    label: "Adicionar horário",
                  }
            }
          />
        ) : (
          <AdminTableContainer>
            <Table>
              <TableHeader className="bg-devGray-dark">
                <TableRow>
                  <TableHead>
                    <AdminSortButton
                      label="Horário"
                      active={sort === "name"}
                      direction={direction}
                      onClick={() => toggleSort("name")}
                    />
                  </TableHead>
                  <TableHead className="text-white">Atividades</TableHead>
                  <TableHead className="text-white">Validação</TableHead>
                  <TableHead className="text-right text-white">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagination.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="whitespace-nowrap font-medium text-white/80">
                      {item.start}–{item.end}
                    </TableCell>
                    <TableCell>
                      {conflictingIds.has(item.id) ? (
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-200">
                          <TriangleAlert className="size-3.5" /> Conflito de
                          horário
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700">
                          <span className="size-1.5 rounded-full bg-emerald-500" />
                          Sem conflitos
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex max-w-3xl flex-wrap gap-2">
                        {item.speeches.map((speech) => (
                          <span
                            key={speech.id}
                            className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-sm text-white/70"
                          >
                            {speech.title ||
                              (speech.topic
                                ? SpeechTopicName[
                                    speech.topic as keyof typeof SpeechTopicName
                                  ]
                                : "Atividade sem título")}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="secondary"
                          size="icon"
                          aria-label={`Editar horário ${item.start}`}
                          onClick={() =>
                            router.push(`/admin/schedule/edit/${item.id}`)
                          }
                        >
                          <Pencil />
                        </Button>
                        <Button
                          variant="secondary"
                          size="icon"
                          aria-label={`Excluir horário ${item.start}`}
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
        title={`Excluir horário ${selected?.start ?? ""}?`}
        description="O horário e todas as atividades associadas serão removidos permanentemente."
        onClose={() => setSelected(null)}
        onConfirm={async () => {
          if (selected) await deleteSchedule(selected.id);
          setSelected(null);
        }}
      />
    </>
  );
}
