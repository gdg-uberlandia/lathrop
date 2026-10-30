import {
  AdminEmptyState,
  AdminFormPage,
  AdminLoadingState,
} from "@/components/admin/admin-page";
import { RewardForm } from "@/components/admin/rewards/reward-form";
import { Reward } from "@/contracts/reward";
import { useRewards } from "@/hooks/useRewards";
import { resolveAdminReturnTo } from "@/lib/admin-return-path";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
export default function EditRewardPage() {
  const router = useRouter();
  const returnTo = resolveAdminReturnTo(
    router.query.returnTo,
    "/admin/rewards",
  );
  const { fetchReward, updateReward, loading } = useRewards();
  const [reward, setReward] = useState<Reward | null>(null);
  const [resolved, setResolved] = useState(false);
  useEffect(() => {
    if (typeof router.query.rewardId !== "string") return;
    setResolved(false);
    void fetchReward(router.query.rewardId)
      .then(setReward)
      .finally(() => setResolved(true));
  }, [fetchReward, router.query.rewardId]);
  return (
    <AdminFormPage
      title="Editar brinde"
      description="Atualize os dados e o estoque disponível do brinde."
      backHref={returnTo}
      backLabel="Voltar para brindes"
    >
      {!resolved ? (
        <AdminLoadingState />
      ) : !reward ? (
        <AdminEmptyState
          title="Brinde não encontrado"
          description="O registro pode ter sido removido."
        />
      ) : (
        <RewardForm
          reward={reward}
          loading={loading}
          onSubmit={async (value) => {
            if (
              await updateReward({
                ...value,
                expectedUpdatedAt: reward.updatedAt.toISOString(),
              })
            )
              await router.push(returnTo);
          }}
        />
      )}
    </AdminFormPage>
  );
}
