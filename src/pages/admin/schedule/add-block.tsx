import {
  AdminFormPage,
  AdminLoadingState,
} from "@/components/admin/admin-page";
import { ScheduleBlockForm } from "@/components/admin/schedule/schedule-block-form";
import { useSchedule } from "@/hooks/useSchedule";
import { useRouter } from "next/router";

const validTime = (value: unknown) =>
  typeof value === "string" && /^([01]\d|2[0-3]):(00|15|30|45)$/.test(value)
    ? value
    : undefined;

export default function AddScheduleBlockPage() {
  const { createScheduleBlock, loading } = useSchedule();
  const router = useRouter();

  return (
    <AdminFormPage
      title="Cadastrar bloco completo"
      description="Preencha as cinco trilhas de um intervalo de uma só vez."
      backHref="/admin/schedule"
      backLabel="Voltar para programação"
    >
      {!router.isReady ? (
        <AdminLoadingState label="Preparando o formulário..." />
      ) : (
        <ScheduleBlockForm
          initialValues={{
            startTime: validTime(router.query.start),
            endTime: validTime(router.query.end),
          }}
          loading={loading}
          onSubmit={async (value) => {
            const created = await createScheduleBlock(value);
            if (created) await router.push("/admin/schedule");
          }}
        />
      )}
    </AdminFormPage>
  );
}
