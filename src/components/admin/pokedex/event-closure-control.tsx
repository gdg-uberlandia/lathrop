import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/assets/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/assets/components/ui/alert-dialog";
import { adminApiRequest } from "@/lib/admin-api/client";
import { Panel } from "./dashboard-ui";
type Status = { eventClosed: boolean; closedAt: string | null };
export function EventClosureControl() {
  const status = useQuery({
    queryKey: ["admin", "event-status"],
    queryFn: () => adminApiRequest<Status>("/api/v1/event-status"),
  });
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  async function close() {
    setPending(true);
    setError("");
    try {
      const result = await adminApiRequest<Status>("/api/v1/event-status", {
        method: "POST",
        body: { action: "close" },
      });
      if (!result.eventClosed) throw new Error("Encerramento não confirmado.");
      await status.refetch();
      setOpen(false);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Não foi possível encerrar o evento.",
      );
    } finally {
      setPending(false);
    }
  }
  return (
    <Panel
      title="Operação do evento"
      description="O encerramento bloqueia novas missões, tags, avaliações e conexões, preservando o histórico, XP e tickets já registrados."
    >
      {status.data?.eventClosed ? (
        <p role="status">
          Evento encerrado
          {status.data.closedAt
            ? ` em ${new Date(status.data.closedAt).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })} (Brasília)`
            : ""}
          .
        </p>
      ) : (
        <Button
          variant="destructive"
          disabled={!status.data || pending}
          onClick={() => setOpen(true)}
        >
          Encerrar evento
        </Button>
      )}
      {status.isError && (
        <p role="alert">
          Não foi possível consultar o status.{" "}
          <button onClick={() => void status.refetch()}>
            Tentar novamente
          </button>
        </p>
      )}
      <AlertDialog
        open={open}
        onOpenChange={(value) => {
          if (!pending) setOpen(value);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Encerrar o evento?</AlertDialogTitle>
            <AlertDialogDescription>
              Novas missões, tags, avaliações e conexões serão bloqueadas para
              todos. As realizações anteriores serão preservadas. Este painel
              não oferece reabertura.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {error && <p role="alert">{error}</p>}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>Cancelar</AlertDialogCancel>
            <Button
              variant="destructive"
              disabled={pending}
              onClick={() => void close()}
            >
              {pending ? "Encerrando…" : "Confirmar encerramento"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Panel>
  );
}
