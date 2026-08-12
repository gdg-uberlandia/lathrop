import { AdminFormPage } from "@/components/admin/admin-page";
import { MissionsForm } from "@/components/admin/missions/missions-form";
import { useMissions } from "@/hooks/useMissions";
import { resolveAdminReturnTo } from "@/lib/admin-return-path";
import { useRouter } from "next/router";

export default function AddMissionPage() {
  const { addMission, loading } = useMissions();
  const router = useRouter();
  const returnTo = resolveAdminReturnTo(
    router.query.returnTo,
    "/admin/missions",
  );
  return (
    <AdminFormPage
      title="Cadastrar missão"
      description="Configure o desafio, a validação, a recompensa e a disponibilidade."
      backHref={returnTo}
      backLabel="Voltar para missões"
    >
      <MissionsForm
        loading={loading}
        onSubmit={async (mission) => {
          const result = await addMission(mission);
          if (result) await router.push(returnTo);
          return result;
        }}
      />
    </AdminFormPage>
  );
}
