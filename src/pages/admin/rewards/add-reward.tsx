import { AdminFormPage } from "@/components/admin/admin-page";
import { RewardForm } from "@/components/admin/rewards/reward-form";
import { useRewards } from "@/hooks/useRewards";
import { resolveAdminReturnTo } from "@/lib/admin-return-path";
import { useRouter } from "next/router";
export default function AddRewardPage() {
  const router = useRouter();
  const returnTo = resolveAdminReturnTo(
    router.query.returnTo,
    "/admin/rewards",
  );
  const { addReward, loading } = useRewards();
  return (
    <AdminFormPage
      title="Cadastrar brinde"
      description="Cadastre um brinde para troca por tickets na Pokédex."
      backHref={returnTo}
      backLabel="Voltar para brindes"
    >
      <RewardForm
        loading={loading}
        onSubmit={async (value) => {
          if (await addReward(value)) await router.push(returnTo);
        }}
      />
    </AdminFormPage>
  );
}
