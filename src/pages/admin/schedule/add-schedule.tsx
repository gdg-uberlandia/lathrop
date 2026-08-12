import { AdminFormPage } from "@/components/admin/admin-page";
import { ScheduleForm } from "@/components/admin/schedule/schedule-form";
import { useSchedule } from "@/hooks/useSchedule";

export default function AddSchedulePage() {
  const { createSchedule, loading } = useSchedule();
  return (
    <AdminFormPage
      title="Adicionar horário"
      description="Organize o intervalo e as atividades exibidas na programação."
      backHref="/admin/schedule"
      backLabel="Voltar para programação"
    >
      <ScheduleForm
        onSubmit={createSchedule}
        loading={loading}
        editing={false}
      />
    </AdminFormPage>
  );
}
