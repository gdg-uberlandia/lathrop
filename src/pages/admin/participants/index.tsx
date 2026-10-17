import Image from "next/image";
import { shouldBypassImageOptimization } from "@/helpers/image";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/assets/components/ui/alert-dialog";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserRound, Users } from "lucide-react";
import { Button } from "@/assets/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/assets/components/ui/table";
import {
  AdminPageHeader,
  AdminListToolbar,
  AdminLoadingState,
  AdminErrorState,
  AdminEmptyState,
  AdminPagination,
  AdminTableContainer,
} from "@/components/admin/admin-page";
import {
  ACCESS_ROLES,
  type AccessRole,
  type Participant,
  type ParticipantUpdate,
} from "@/contracts/participant";
import { useAuth } from "@/context/AuthContext";
import { useAdminListState } from "@/hooks/useAdminListState";
import { adminApiRequest } from "@/lib/admin-api/client";
import { getAdminApiErrorMessage } from "@/lib/admin-api/errors";

const key = ["admin", "participants"];
const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
function RoleEditor({
  participant,
  save,
  pending,
}: {
  participant: Participant;
  save: (value: ParticipantUpdate) => Promise<unknown>;
  pending: boolean;
}) {
  const [role, setRole] = useState<AccessRole | "">(
    participant.accessRoles.length === 1 ? participant.accessRoles[0] : "",
  );
  const [saved, setSaved] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const dirty =
    participant.accessRoles.length !== 1 || role !== participant.accessRoles[0];
  return (
    <>
      <fieldset disabled={pending} className="flex items-center gap-3">
        <legend className="sr-only">Papel de {participant.name}</legend>
        <select
          aria-label={`Papel de ${participant.name}`}
          value={role}
          onChange={(event) => {
            setRole(event.target.value as AccessRole);
            setSaved(false);
          }}
          className="h-10 rounded-lg border px-3 text-sm"
        >
          <option value="" disabled>
            Selecione um papel
          </option>
          {ACCESS_ROLES.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            disabled={pending || !dirty || !role}
            onClick={() => {
              setSaveError(null);
              setConfirmOpen(true);
            }}
          >
            Salvar papel
          </Button>
          {saved && (
            <span role="status" className="text-sm text-green-700">
              Papel salvo
            </span>
          )}
        </div>
      </fieldset>
      <AlertDialog
        open={confirmOpen}
        onOpenChange={(open) => {
          if (!pending) setConfirmOpen(open);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar alteração de papel?</AlertDialogTitle>
            <AlertDialogDescription>
              O papel de {participant.name} ({participant.email}) será alterado
              de {participant.accessRoles.join(", ")} para {role}. O papel
              anterior será substituído.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {saveError && (
            <p role="alert" className="text-sm text-red-700">
              {saveError}
            </p>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>Cancelar</AlertDialogCancel>
            <Button
              disabled={pending || !role}
              onClick={async () => {
                if (!role) return;
                setSaveError(null);
                try {
                  await save({ id: participant.id, accessRoles: [role] });
                  setSaved(true);
                  setConfirmOpen(false);
                } catch (error) {
                  setSaveError(
                    getAdminApiErrorMessage(error, "Erro ao salvar papel"),
                  );
                }
              }}
            >
              {pending ? "Salvando…" : "Confirmar alteração"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default function ParticipantsPage() {
  const { isAdmin } = useAuth();
  const client = useQueryClient();
  const list = useAdminListState();
  const query = useQuery({
    queryKey: key,
    enabled: isAdmin,
    queryFn: ({ signal }) =>
      adminApiRequest<Participant[]>("/api/v1/participants", { signal }),
  });
  const mutation = useMutation({
    mutationFn: (body: ParticipantUpdate) =>
      adminApiRequest<Participant>("/api/v1/participants", {
        method: "PATCH",
        body,
      }),
    onSuccess: (participant) =>
      client.setQueryData<Participant[]>(key, (current) =>
        current?.map((item) =>
          item.id === participant.id ? participant : item,
        ),
      ),
  });
  const filtered = (query.data ?? []).filter((item) =>
    normalize(`${item.name} ${item.email}`).includes(
      normalize(list.search.trim()),
    ),
  );
  const pagination = list.paginate(filtered);
  const error = query.error || mutation.error;
  return (
    <main className="p-4 sm:p-6">
      <AdminPageHeader
        title="Participantes"
        description="Busque por nome ou e-mail e gerencie os papéis de acesso na Pokedex."
        count={query.data?.length}
        icon={Users}
      />
      <p className="mt-4 text-sm text-slate-600">
        Cada perfil terá um único papel. Escolha participant para participar da
        jornada, receber XP e aparecer no ranking. O papel admin na Pokedex não
        provisiona acesso ao painel do site.
      </p>
      <AdminListToolbar search={list.search} onSearchChange={list.setSearch} />
      {error && (
        <AdminErrorState
          message={getAdminApiErrorMessage(
            error,
            "Erro ao processar participantes",
          )}
          onRetry={() => {
            mutation.reset();
            void query.refetch();
          }}
        />
      )}
      {query.isPending ? (
        <AdminLoadingState />
      ) : !filtered.length ? (
        <AdminEmptyState
          title="Nenhum participante encontrado"
          description="Confira o nome ou e-mail pesquisado."
        />
      ) : (
        <AdminTableContainer>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Foto</TableHead>
                <TableHead>Participante</TableHead>
                <TableHead>Papel na Pokedex</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pagination.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {item.avatarUrl ? (
                      <Image
                        src={item.avatarUrl}
                        unoptimized={shouldBypassImageOptimization(
                          item.avatarUrl,
                        )}
                        width={40}
                        height={40}
                        alt={`Foto de ${item.name}`}
                        className="size-10 rounded-full object-cover"
                      />
                    ) : (
                      <span
                        className="flex size-10 items-center justify-center rounded-full bg-slate-100 text-slate-400"
                        role="img"
                        aria-label={`${item.name} sem foto`}
                      >
                        <UserRound className="size-5" aria-hidden="true" />
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-slate-500">{item.email}</p>
                  </TableCell>
                  <TableCell>
                    <RoleEditor
                      key={item.id}
                      participant={item}
                      save={mutation.mutateAsync}
                      pending={mutation.isPending}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <AdminPagination {...pagination} onPageChange={list.setPage} />
        </AdminTableContainer>
      )}
    </main>
  );
}
