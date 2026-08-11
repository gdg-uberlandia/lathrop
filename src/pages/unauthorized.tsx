import { Button } from "@/assets/components/ui/button";
import { useAuth } from "context/AuthContext";
import { ShieldX } from "lucide-react";
import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function UnauthorizedPage() {
  const { user, isAdmin, loading, logout, refreshAdminRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady || loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (isAdmin) {
      const destination =
        typeof router.query.next === "string" &&
        router.query.next.startsWith("/admin")
          ? router.query.next
          : "/admin";
      router.replace(destination);
    }
  }, [isAdmin, loading, router, user]);

  if (loading || !user || isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Carregando...
      </div>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <section className="w-full max-w-md rounded-2xl border border-white/10 bg-devGray-dark p-8 text-center">
        <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-devRed-dark/20 text-devRed-dark">
          <ShieldX aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-bold text-white">Acesso não autorizado</h1>
        <p className="mt-3 text-sm text-white/70">
          A conta {user.email} está autenticada, mas não possui o papel de
          administrador.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <Button
            onClick={refreshAdminRole}
            className="rounded-xl bg-devBlue-dark text-white"
          >
            Atualizar permissão
          </Button>
          <Button
            variant="secondary"
            className="rounded-xl"
            onClick={async () => {
              await logout();
              await router.replace("/login");
            }}
          >
            Entrar com outra conta
          </Button>
        </div>
      </section>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async () => ({
  props: {},
});
