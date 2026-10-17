import type { GetServerSideProps } from "next";
import { isPushEnabled } from "@/back-features/push-config";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, Trash2 } from "lucide-react";
import { Button } from "@/assets/components/ui/button";
import { Input } from "@/assets/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/assets/components/ui/table";
import { Textarea } from "@/assets/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/assets/components/ui/alert-dialog";
import {
  AdminPageHeader,
  AdminLoadingState,
  AdminErrorState,
  AdminEmptyState,
  AdminListToolbar,
  AdminPagination,
  AdminTableContainer,
} from "@/components/admin/admin-page";
import { noticeInputSchema } from "@/contracts/notice";
import type { PublishedNotice } from "@/back-features/notices";
import { useAuth } from "@/context/AuthContext";
import { useAdminListState } from "@/hooks/useAdminListState";
import { adminApiRequest } from "@/lib/admin-api/client";
import { getAdminApiErrorMessage } from "@/lib/admin-api/errors";

const queryKey = ["admin", "notices"];
type FormValues = {
  title: string;
  body: string;
  link: string;
  sendPush: boolean;
};
const initial: FormValues = { title: "", body: "", link: "", sendPush: false };
const statusLabels = {
  disabled: "Publicado sem push",
  sending: "Envio iniciado — consulte novamente para acompanhar",
  completed: "Envio concluído",
  partial: "Push incompleto; o aviso está publicado",
};
export default function NoticesPage() {
  const { isAdmin } = useAuth();
  const client = useQueryClient();
  const list = useAdminListState();
  const form = useForm<FormValues>({ defaultValues: initial });
  const [draft, setDraft] = useState<ReturnType<
    typeof noticeInputSchema.parse
  > | null>(null);
  const [publicationId, setPublicationId] = useState<string | null>(null);
  const [selectedForDeletion, setSelectedForDeletion] =
    useState<PublishedNotice | null>(null);
  const [result, setResult] = useState<PublishedNotice | null>(null);
  const query = useQuery({
    queryKey,
    enabled: isAdmin,
    queryFn: ({ signal }) =>
      adminApiRequest<{ notices: PublishedNotice[]; pushConfigured: boolean }>(
        "/api/v1/notices",
        { signal },
      ),
  });
  const mutation = useMutation({
    mutationFn: (body: ReturnType<typeof noticeInputSchema.parse>) =>
      adminApiRequest<PublishedNotice>("/api/v1/notices", {
        method: "POST",
        body,
      }),
    onSuccess: (notice) => {
      client.setQueryData<{
        notices: PublishedNotice[];
        pushConfigured: boolean;
      }>(
        queryKey,
        (current) =>
          current && {
            ...current,
            notices: [
              notice,
              ...current.notices.filter((item) => item.id !== notice.id),
            ],
          },
      );
      setResult(notice);
      setDraft(null);
      setPublicationId(null);
      form.reset(initial);
    },
  });
  const remove = useMutation({
    mutationFn: (id: string) =>
      adminApiRequest<{ id: string }>(
        `/api/v1/notices/${encodeURIComponent(id)}`,
        {
          method: "DELETE",
        },
      ),
    onSuccess: ({ id }) => {
      client.setQueryData<{
        notices: PublishedNotice[];
        pushConfigured: boolean;
      }>(
        queryKey,
        (current) =>
          current && {
            ...current,
            notices: current.notices.filter((item) => item.id !== id),
          },
      );
      setSelectedForDeletion(null);
      setResult((current) => (current?.id === id ? null : current));
    },
  });
  const filtered = (query.data?.notices ?? []).filter((notice) =>
    `${notice.title} ${notice.body}`
      .toLocaleLowerCase("pt-BR")
      .includes(list.search.toLocaleLowerCase("pt-BR")),
  );
  const pagination = list.paginate(filtered);
  const error = query.error || mutation.error || remove.error;
  return (
    <main className="space-y-6 p-4 sm:p-6">
      <AdminPageHeader
        title="Avisos"
        description="Publique avisos na Pokedex e envie push aos participantes inscritos."
        icon={Bell}
        count={query.data?.notices.length}
      />
      <form
        className="admin-surface space-y-4 rounded-xl border p-5"
        onSubmit={form.handleSubmit((values) => {
          const id = publicationId ?? crypto.randomUUID();
          const parsed = noticeInputSchema.safeParse({ ...values, id });
          if (!parsed.success) {
            form.setError("root", {
              message:
                "Informe um título de 3 a 100 caracteres, mensagem de até 3.000 e um link interno válido.",
            });
            return;
          }
          form.clearErrors();
          mutation.reset();
          setPublicationId(id);
          setDraft(parsed.data);
        })}
      >
        <h2 className="text-lg font-semibold">Publicar aviso</h2>
        <div>
          <label
            htmlFor="notice-title"
            className="mb-1 block text-sm font-medium"
          >
            Título
          </label>
          <Input
            id="notice-title"
            required
            minLength={3}
            maxLength={100}
            {...form.register("title")}
          />
        </div>
        <div>
          <label
            htmlFor="notice-body"
            className="mb-1 block text-sm font-medium"
          >
            Mensagem
          </label>
          <Textarea
            id="notice-body"
            required
            maxLength={3000}
            rows={5}
            {...form.register("body")}
          />
        </div>
        <div>
          <label
            htmlFor="notice-link"
            className="mb-1 block text-sm font-medium"
          >
            Link na Pokedex (opcional)
          </label>
          <Input
            id="notice-link"
            placeholder="/talks"
            maxLength={500}
            {...form.register("link")}
          />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            disabled={!query.data?.pushConfigured}
            {...form.register("sendPush")}
          />
          Enviar também notificação push
        </label>
        <p className="text-sm text-slate-500">
          O aviso fica disponível para todos na Pokedex. Push é enviado somente
          a dispositivos inscritos de perfis participant.
        </p>
        {form.formState.errors.root && (
          <p role="alert" className="text-sm text-red-700">
            {form.formState.errors.root.message}
          </p>
        )}
        <Button type="submit" disabled={mutation.isPending || !query.data}>
          Publicar agora
        </Button>
      </form>
      {result && (
        <p
          role="status"
          className="rounded-xl border bg-green-50 p-4 text-sm text-green-900"
        >
          Aviso publicado. {statusLabels[result.pushStatus]}.
          {result.sendPush &&
            ` ${result.sent} envios aceitos, ${result.failed} falhas, ${result.skipped} não processados. Aceite não confirma entrega ou leitura.`}
        </p>
      )}
      {error && (
        <AdminErrorState
          message={getAdminApiErrorMessage(error, "Erro ao carregar avisos")}
          onRetry={() => {
            mutation.reset();
            remove.reset();
            void query.refetch();
          }}
        />
      )}
      <section>
        <h2 className="text-lg font-semibold">Avisos publicados</h2>
        <AdminListToolbar
          search={list.search}
          onSearchChange={list.setSearch}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => void query.refetch()}
        >
          Atualizar resultados
        </Button>
        {query.isPending ? (
          <AdminLoadingState />
        ) : !filtered.length ? (
          <AdminEmptyState
            title="Nenhum aviso encontrado"
            description="Publique um aviso usando o formulário acima."
          />
        ) : (
          <AdminTableContainer>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Mensagem</TableHead>
                  <TableHead>Destino</TableHead>
                  <TableHead>Publicação</TableHead>
                  <TableHead>Push</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagination.items.map((notice) => (
                  <TableRow key={notice.id}>
                    <TableCell className="min-w-40 max-w-64 whitespace-normal break-words font-medium">
                      {notice.title}
                    </TableCell>
                    <TableCell className="min-w-64 max-w-md whitespace-normal break-words">
                      <p className="whitespace-pre-wrap">{notice.body}</p>
                    </TableCell>
                    <TableCell className="max-w-48 whitespace-normal break-words">
                      {notice.link || "—"}
                    </TableCell>
                    <TableCell>
                      <time
                        dateTime={notice.createdAt}
                        className="whitespace-nowrap text-xs text-slate-500"
                      >
                        {new Date(notice.createdAt).toLocaleString("pt-BR", {
                          timeZone: "America/Sao_Paulo",
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </time>
                    </TableCell>
                    <TableCell className="min-w-48 max-w-64 whitespace-normal">
                      <p className="text-sm">
                        {statusLabels[notice.pushStatus]}
                      </p>
                      {notice.sendPush && (
                        <p className="mt-1 text-xs text-slate-500">
                          {notice.sent} aceitos · {notice.failed} falhas ·{" "}
                          {notice.skipped} não processados
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="secondary"
                        size="icon"
                        disabled={remove.isPending || mutation.isPending}
                        aria-label={`Excluir aviso: ${notice.title}`}
                        onClick={() => {
                          remove.reset();
                          setSelectedForDeletion(notice);
                        }}
                      >
                        <Trash2 aria-hidden="true" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <AdminPagination {...pagination} onPageChange={list.setPage} />
          </AdminTableContainer>
        )}
      </section>
      <AlertDialog
        open={Boolean(selectedForDeletion)}
        onOpenChange={(open) => {
          if (!open && !remove.isPending) setSelectedForDeletion(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir este aviso?</AlertDialogTitle>
            <AlertDialogDescription>
              “{selectedForDeletion?.title}” será removido do painel e da
              Pokedex. Push já enviado não pode ser recolhido, e envios em
              andamento podem terminar. Esta ação não pode ser desfeita pelo
              painel.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {remove.error && (
            <p role="alert" className="text-sm text-red-700">
              {getAdminApiErrorMessage(
                remove.error,
                "Não foi possível excluir o aviso",
              )}
            </p>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={remove.isPending}>
              Cancelar
            </AlertDialogCancel>
            <Button
              variant="destructive"
              disabled={remove.isPending || !selectedForDeletion}
              onClick={() => {
                if (selectedForDeletion) remove.mutate(selectedForDeletion.id);
              }}
            >
              {remove.isPending ? "Excluindo…" : "Excluir aviso"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog
        open={Boolean(draft)}
        onOpenChange={(open) => {
          if (!open && !mutation.isPending) setDraft(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Publicar este aviso?</AlertDialogTitle>
            <AlertDialogDescription>
              O aviso ficará disponível para todos na Pokedex.
              {draft?.sendPush
                ? " Também será enviado push aos dispositivos inscritos. Aguarde a conclusão do envio."
                : " Não será enviado push."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="max-h-60 space-y-2 overflow-y-auto">
            <p className="font-semibold">{draft?.title}</p>
            <p className="whitespace-pre-wrap break-words text-sm">
              {draft?.body}
            </p>
          </div>
          {mutation.error && (
            <p role="alert" className="text-sm text-red-700">
              {getAdminApiErrorMessage(
                mutation.error,
                "Não foi possível publicar",
              )}
            </p>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={mutation.isPending}>
              Cancelar
            </AlertDialogCancel>
            <Button
              disabled={mutation.isPending || !draft}
              onClick={() => {
                if (draft) mutation.mutate(draft);
              }}
            >
              {mutation.isPending ? "Publicando…" : "Confirmar publicação"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  if (!isPushEnabled()) return { notFound: true };
  return { props: {} };
};
