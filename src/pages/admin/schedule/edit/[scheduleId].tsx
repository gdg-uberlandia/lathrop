import {
  AdminEmptyState,
  AdminFormPage,
  AdminLoadingState,
} from "@/components/admin/admin-page";
import { ScheduleForm } from "@/components/admin/schedule/schedule-form";
import { ScheduleEntry } from "@/contracts/schedule";
import { useSchedule } from "@/hooks/useSchedule";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EditSchedulePage() {
  const router = useRouter();
  const { loading, readSchedule, updateSchedule } = useSchedule();
  const [schedule, setSchedule] = useState<ScheduleEntry | null>(null);
  useEffect(() => {
    if (typeof router.query.scheduleId === "string")
      void readSchedule(router.query.scheduleId).then(setSchedule);
  }, [readSchedule, router.query.scheduleId]);
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
        <ScheduleForm
          schedule={schedule}
          loading={loading}
          onSubmit={async (data) => {
            const result = await updateSchedule(data);
            if (result) await router.push("/admin/schedule");
          }}
        />
      )}
    </AdminFormPage>
  );
}
