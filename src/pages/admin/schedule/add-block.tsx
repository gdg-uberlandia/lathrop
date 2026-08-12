import { AdminFormPage } from "@/components/admin/admin-page";
import { ScheduleBlockForm } from "@/components/admin/schedule/schedule-block-form";
import { useSchedule } from "@/hooks/useSchedule";
import { useRouter } from "next/router";

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
      <ScheduleBlockForm
        loading={loading}
        onSubmit={async (value) => {
          const created = await createScheduleBlock(value);
          if (created) await router.push("/admin/schedule");
        }}
      />
    </AdminFormPage>
  );
}
