import {
  AdminFormPage,
  AdminLoadingState,
} from "@/components/admin/admin-page";
import { ScheduleForm } from "@/components/admin/schedule/schedule-form";
import { useSchedule } from "@/hooks/useSchedule";
import { ScheduleTrack, scheduleTrackSchema } from "@/contracts/schedule";
import { useRouter } from "next/router";

export default function AddSchedulePage() {
  const { createSchedule, loading } = useSchedule();
  const router = useRouter();
  const type = ["talk", "opening", "break", "closing"].includes(
    String(router.query.type),
  )
    ? (router.query.type as "talk" | "opening" | "break" | "closing")
    : undefined;
  const parsedTrack = scheduleTrackSchema.safeParse(router.query.track);
  return (
    <AdminFormPage
      title="Adicionar horário"
      description="Organize o intervalo e as atividades exibidas na programação."
      backHref="/admin/schedule"
      backLabel="Voltar para programação"
    >
      {!router.isReady ? (
        <AdminLoadingState label="Preparando o formulário..." />
      ) : (
        <ScheduleForm
          onSubmit={createSchedule}
          loading={loading}
          initialValues={{
            type,
            startTime:
              typeof router.query.start === "string"
                ? router.query.start
                : undefined,
            endTime:
              typeof router.query.end === "string"
                ? router.query.end
                : undefined,
            track: parsedTrack.success
              ? (parsedTrack.data as ScheduleTrack)
              : undefined,
          }}
        />
      )}
    </AdminFormPage>
  );
}
