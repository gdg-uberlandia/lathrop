import {
  AdminEmptyState,
  AdminFormPage,
  AdminLoadingState,
} from "@/components/admin/admin-page";
import { RaffleForm } from "@/components/admin/raffles/raffle-form";
import { Raffle } from "@/contracts/raffle";
import { useRaffles } from "@/hooks/useRaffles";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
export default function EditRafflePage() {
  const router = useRouter();
  const { fetchRaffle, updateRaffle, loading } = useRaffles();
  const [raffle, setRaffle] = useState<Raffle | null>(null);
  const [resolved, setResolved] = useState(false);
  useEffect(() => {
    if (typeof router.query.raffleId !== "string") return;
    setResolved(false);
    void fetchRaffle(router.query.raffleId)
      .then(setRaffle)
      .finally(() => setResolved(true));
  }, [fetchRaffle, router.query.raffleId]);
  return (
    <AdminFormPage
      title="Editar prêmio"
      description="Campos operacionais do sorteio são somente leitura."
      backHref="/admin/raffles"
      backLabel="Voltar para prêmios"
    >
      {!resolved ? (
        <AdminLoadingState />
      ) : !raffle ? (
        <AdminEmptyState
          title="Prêmio não encontrado"
          description="O registro pode ter sido removido."
        />
      ) : (
        <RaffleForm
          raffle={raffle}
          loading={loading}
          onSubmit={async (value) => {
            if (await updateRaffle(value)) await router.push("/admin/raffles");
          }}
        />
      )}
    </AdminFormPage>
  );
}
