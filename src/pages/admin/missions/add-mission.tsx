import { AdminFormPage } from "@/components/admin/admin-page";
import { MissionsForm } from "@/components/admin/missions/missions-form";
import { useMissions } from "@/hooks/useMissions";
import { useRouter } from "next/router";

export default function AddMissionPage() {
  const { addMission, loading } = useMissions();
  const router = useRouter();
  return (
    <AdminFormPage
      title="Cadastrar missão"
      description="Configure o desafio, a validação, a recompensa e a disponibilidade."
      backHref="/admin/missions"
      backLabel="Voltar para missões"
    >
      <MissionsForm
        loading={loading}
        onSubmit={async (mission) => {
          const result = await addMission(mission);
          if (result) await router.push("/admin/missions");
          return result;
        }}
      />
    </AdminFormPage>
  );
}
