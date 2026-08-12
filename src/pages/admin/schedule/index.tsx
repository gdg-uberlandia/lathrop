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
  AdminTableContainer,
} from "@/components/admin/admin-page";
import DeleteDialog from "@/components/admin/delete-dialog";
import { useSchedule } from "@/hooks/useSchedule";
import { Schedule, SpeechTopicName } from "@/models/schedule";
import { CalendarDays, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

export default function Schedules() {
  const router = useRouter();
  const { schedule, deleteSchedule, loading, error, fetchSchedule } =
    useSchedule();
  const [selected, setSelected] = useState<Schedule | null>(null);
  const [search, setSearch] = useState("");
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
                  <TableHead className="text-white">Horário</TableHead>
                  <TableHead className="text-white">Atividades</TableHead>
                  <TableHead className="text-right text-white">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSchedule.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="whitespace-nowrap font-medium text-white/80">
                      {item.start}–{item.end}
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
