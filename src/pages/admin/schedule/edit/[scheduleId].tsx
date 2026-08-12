import {
  AdminEmptyState,
  AdminFormPage,
  AdminLoadingState,
} from "@/components/admin/admin-page";
import { ScheduleForm } from "@/components/admin/schedule/schedule-form";
import { useSchedule } from "@/hooks/useSchedule";
import { Button } from "@/assets/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo } from "react";

export default function EditSchedulePage() {
  const router = useRouter();
  const { schedule: scheduleItems, loading, updateSchedule } = useSchedule();
  const scheduleId =
    typeof router.query.scheduleId === "string"
      ? router.query.scheduleId
      : null;
  const schedule = scheduleItems.find((item) => item.id === scheduleId) ?? null;
  const navigation = useMemo(() => {
    if (!schedule) return null;
    const ordered = [...scheduleItems].sort(
      (left, right) => left.startAt.getTime() - right.startAt.getTime(),
    );
    const index = ordered.findIndex((item) => item.id === schedule.id);
    return index < 0
      ? null
      : {
          previous: ordered[index - 1] ?? null,
          next: ordered[index + 1] ?? null,
          position: index + 1,
          total: ordered.length,
        };
  }, [schedule, scheduleItems]);
  return (
    <AdminFormPage
      title="Editar horário"
      description="Atualize o intervalo e as atividades da programação."
      backHref="/admin/schedule"
      backLabel="Voltar para programação"
    >
      {!schedule && loading ? (
        <AdminLoadingState />
      ) : !schedule ? (
        <AdminEmptyState
          title="Horário não encontrado"
          description="O registro pode ter sido removido ou o endereço está incorreto."
        />
      ) : (
        <>
          {navigation && (
            <nav
              aria-label="Navegação entre atividades"
              className="mb-4 flex items-center justify-between gap-3"
            >
              <Button
                asChild={Boolean(navigation.previous)}
                type="button"
                variant="outline"
                disabled={!navigation.previous}
                className="!border-slate-300 !bg-white !text-slate-700 hover:!bg-slate-50"
              >
                {navigation.previous ? (
                  <Link href={`/admin/schedule/edit/${navigation.previous.id}`}>
                    <ChevronLeft className="size-4" /> Anterior
                  </Link>
                ) : (
                  <span>
                    <ChevronLeft className="size-4" /> Anterior
                  </span>
                )}
              </Button>
              <span className="text-xs font-medium text-slate-500">
                {navigation.position} de {navigation.total}
              </span>
              <Button
                asChild={Boolean(navigation.next)}
                type="button"
                variant="outline"
                disabled={!navigation.next}
                className="!border-slate-300 !bg-white !text-slate-700 hover:!bg-slate-50"
              >
                {navigation.next ? (
                  <Link href={`/admin/schedule/edit/${navigation.next.id}`}>
                    Próxima <ChevronRight className="size-4" />
                  </Link>
                ) : (
                  <span>
                    Próxima <ChevronRight className="size-4" />
                  </span>
                )}
              </Button>
            </nav>
          )}
          <ScheduleForm
            key={schedule.id}
            schedule={schedule}
            loading={loading}
            onSubmit={async (data) => {
              const result = await updateSchedule(data);
              if (result) await router.push("/admin/schedule");
            }}
          />
        </>
      )}
    </AdminFormPage>
  );
}
