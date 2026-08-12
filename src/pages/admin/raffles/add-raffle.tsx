import { AdminFormPage } from "@/components/admin/admin-page";
import { RaffleForm } from "@/components/admin/raffles/raffle-form";
import { useRaffles } from "@/hooks/useRaffles";
import { resolveAdminReturnTo } from "@/lib/admin-return-path";
import { useRouter } from "next/router";
export default function AddRafflePage() {
  const router = useRouter();
  const returnTo = resolveAdminReturnTo(
    router.query.returnTo,
    "/admin/raffles",
  );
  const { addRaffle, loading } = useRaffles();
  return (
    <AdminFormPage
      title="Cadastrar prêmio"
      description="Adicione um prêmio ao catálogo do sorteio."
      backHref={returnTo}
      backLabel="Voltar para prêmios"
    >
      <RaffleForm
        loading={loading}
        onSubmit={async (value) => {
          if (await addRaffle(value)) await router.push(returnTo);
        }}
      />
    </AdminFormPage>
  );
}
