import {
  AdminFormPage,
  AdminLoadingState,
} from "@/components/admin/admin-page";
import { ScheduleForm } from "@/components/admin/schedule/schedule-form";
import { useSchedule } from "@/hooks/useSchedule";
import {
  ScheduleTrack,
  scheduleTimeSchema,
  scheduleTrackSchema,
} from "@/contracts/schedule";
import { useRouter } from "next/router";

export default function AddSchedulePage() {
  const { createSchedule, loading } = useSchedule();
  const router = useRouter();
  const type = [
    "talk",
    "opening",
    "opening_keynote",
    "break",
    "closing",
    "closing_keynote",
  ].includes(String(router.query.type))
    ? (router.query.type as
        | "talk"
        | "opening"
        | "opening_keynote"
        | "break"
        | "closing"
        | "closing_keynote")
    : undefined;
  const parsedTrack = scheduleTrackSchema.safeParse(router.query.track);
  const parsedStart = scheduleTimeSchema.safeParse(router.query.start);
  const parsedEnd = scheduleTimeSchema.safeParse(router.query.end);
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
          onSubmit={async (value) => {
            const created = await createSchedule(value);
            if (created) await router.push("/admin/schedule");
          }}
          loading={loading}
          initialValues={{
            type,
            startTime: parsedStart.success ? parsedStart.data : undefined,
            endTime: parsedEnd.success ? parsedEnd.data : undefined,
            track: parsedTrack.success
              ? (parsedTrack.data as ScheduleTrack)
              : undefined,
          }}
        />
      )}
    </AdminFormPage>
  );
}
