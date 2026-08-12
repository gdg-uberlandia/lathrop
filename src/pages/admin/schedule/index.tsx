import { Button } from "@/assets/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/assets/components/ui/select";
import { cn } from "@/assets/lib/utils";
import {
  AdminEmptyState,
  AdminErrorState,
  AdminListToolbar,
  AdminLoadingState,
  AdminPageHeader,
} from "@/components/admin/admin-page";
import DeleteDialog from "@/components/admin/delete-dialog";
import {
  ScheduleEntry,
  ScheduleTrack,
  SCHEDULE_TRACKS,
} from "@/contracts/schedule";
import { useSchedule } from "@/hooks/useSchedule";
import { useScheduleWorkspace } from "@/hooks/useScheduleWorkspace";
import { useSchedulePublication } from "@/hooks/useSchedulePublication";
import {
  exportScheduleCsv,
  exportSchedulePdf,
  exportSchedulePng,
} from "@/lib/schedule-export";
import {
  CalendarDays,
  Copy,
  Eye,
  EyeOff,
  FilterX,
  FileDown,
  FileImage,
  FileSpreadsheet,
  Globe2,
  Pencil,
  Plus,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";

const formatTime = (value: Date) =>
  new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "America/Sao_Paulo",
  }).format(value);
const nextSlot = (start: Date, end: Date) => {
  const duration = end.getTime() - start.getTime();
  const nextStart = end;
  const nextEnd = new Date(end.getTime() + duration);
  if (nextEnd.getDate() !== end.getDate()) {
    return { start: formatTime(start), end: formatTime(end) };
  }
  return { start: formatTime(nextStart), end: formatTime(nextEnd) };
};
const typeLabel = {
  talk: "Palestra",
  opening: "Abertura",
  break: "Intervalo",
  closing: "Encerramento",
} as const;
const trackBorderStyles: Record<ScheduleTrack, string> = {
  MINAS: "!border-amber-200 hover:!border-amber-300",
  CURADO: "!border-red-200 hover:!border-red-300",
  CANASTRA: "!border-pink-200 hover:!border-pink-300",
  TRANCA: "!border-blue-200 hover:!border-blue-300",
  COMUNIDADE: "!border-emerald-200 hover:!border-emerald-300",
};

export default function Schedules() {
  const router = useRouter();
  const {
    schedule,
    deleteSchedule,
    updateScheduleVisibility,
    visibilityUpdatingId,
    loading,
    error: scheduleError,
    fetchSchedule,
  } = useSchedule(false);
  const {
    workspace,
    loading: workspaceLoading,
    error: workspaceError,
    refresh: refreshWorkspace,
  } = useScheduleWorkspace();
  const error = scheduleError || workspaceError;
  const talks = useMemo(() => workspace?.talks ?? [], [workspace]);
  const speakers = useMemo(() => workspace?.speakers ?? [], [workspace]);
  const workspaceEntries = useMemo(
    () => new Map(workspace?.entries.map((item) => [item.id, item]) ?? []),
    [workspace],
  );
  const {
    publication,
    loading: publicationLoading,
    setPublished,
  } = useSchedulePublication();
  const [selected, setSelected] = useState<ScheduleEntry | null>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [trackFilter, setTrackFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const talkNames = useMemo(
    () => new Map(talks.map((talk) => [talk.id, talk.title])),
    [talks],
  );
  const speakerNames = useMemo(
    () => new Map(speakers.map((speaker) => [speaker.id, speaker.name])),
    [speakers],
  );
  const talkSpeakers = useMemo(
    () =>
      new Map(
        talks.map((talk) => [
          talk.id,
          talk.speakerIds
            .map((speakerId) => speakerNames.get(speakerId))
            .filter((speakerName): speakerName is string =>
              Boolean(speakerName),
            ),
        ]),
      ),
    [speakerNames, talks],
  );
  const name = useCallback(
    (item: ScheduleEntry) =>
      workspaceEntries.get(item.id)?.title ??
      (item.activity.type === "break"
        ? item.activity.title
        : (talkNames.get(item.activity.talkId) ?? "Carregando palestra...")),
    [talkNames, workspaceEntries],
  );
  const speakersFor = useCallback(
    (item: ScheduleEntry) =>
      workspaceEntries.get(item.id)?.speakerNames ??
      (item.activity.type === "break"
        ? []
        : (talkSpeakers.get(item.activity.talkId) ?? [])),
    [talkSpeakers, workspaceEntries],
  );
  const conflicts = useMemo(() => {
    const talkById = new Map(talks.map((talk) => [talk.id, talk]));
    const conflictIds = new Set<string>();
    const ordered = [...schedule].sort(
      (left, right) => left.startAt.getTime() - right.startAt.getTime(),
    );
    ordered.forEach((item, index) => {
      for (let next = index + 1; next < ordered.length; next += 1) {
        const other = ordered[next];
        if (other.startAt >= item.endAt) break;
        const sameTrack =
          item.track === null ||
          other.track === null ||
          item.track === other.track;
        const itemTalk =
          item.activity.type === "break"
            ? null
            : talkById.get(item.activity.talkId);
        const otherTalk =
          other.activity.type === "break"
            ? null
            : talkById.get(other.activity.talkId);
        const sameTalk = Boolean(
          itemTalk && otherTalk && itemTalk.id === otherTalk.id,
        );
        const sharedSpeaker = Boolean(
          itemTalk &&
            otherTalk &&
            itemTalk.speakerIds.some((speakerId) =>
              otherTalk.speakerIds.includes(speakerId),
            ),
        );
        if (sameTrack || sameTalk || sharedSpeaker) {
          conflictIds.add(item.id);
          conflictIds.add(other.id);
        }
      }
    });
    return conflictIds;
  }, [schedule, talks]);
  const slots = useMemo(() => {
    const term = search.trim().toLocaleLowerCase("pt-BR");
    const groups = schedule.reduce((map, item) => {
      const key = `${item.startAt.getTime()}-${item.endAt.getTime()}`;
      map.set(key, [...(map.get(key) ?? []), item]);
      return map;
    }, new Map<string, ScheduleEntry[]>());
    return Array.from(groups.values())
      .filter((items) =>
        items.some((item) => {
          const matchesSearch =
            !term ||
            `${name(item)} ${speakersFor(item).join(" ")} ${item.track ?? "geral"} ${typeLabel[item.activity.type]}`
              .toLocaleLowerCase("pt-BR")
              .includes(term);
          const matchesType =
            typeFilter === "all" || item.activity.type === typeFilter;
          const matchesTrack =
            trackFilter === "all" ||
            (trackFilter === "general"
              ? item.track === null
              : item.track === trackFilter);
          const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === "visible" && item.active) ||
            (statusFilter === "hidden" && !item.active) ||
            (statusFilter === "conflict" && conflicts.has(item.id));
          return matchesSearch && matchesType && matchesTrack && matchesStatus;
        }),
      )
      .sort((a, b) => a[0].startAt.getTime() - b[0].startAt.getTime());
  }, [
    schedule,
    search,
    name,
    speakersFor,
    typeFilter,
    trackFilter,
    statusFilter,
    conflicts,
  ]);
  const hasFilters =
    typeFilter !== "all" || trackFilter !== "all" || statusFilter !== "all";
  const exportRows = useMemo(
    () =>
      schedule
        .filter((item) => item.active)
        .map((item) => ({
          time: `${formatTime(item.startAt)}–${formatTime(item.endAt)}`,
          track: item.track
            ? (SCHEDULE_TRACKS.find((track) => track.value === item.track)
                ?.label ?? item.track)
            : "Geral",
          type: typeLabel[item.activity.type],
          title: name(item),
          speakers: speakersFor(item).join(", "),
        })),
    [name, schedule, speakersFor],
  );
  const addHref = (start: string, end: string, track?: ScheduleTrack) => ({
    pathname: "/admin/schedule/add-schedule",
    query: { start, end, type: "talk", ...(track ? { track } : {}) },
  });
  const duplicateHref = (item: ScheduleEntry) => {
    const { start, end } = nextSlot(item.startAt, item.endAt);
    return {
      pathname: "/admin/schedule/add-block",
      query: { start, end },
    };
  };

  const card = (item: ScheduleEntry) => (
    <article
      className={cn(
        "group flex h-full min-h-32 flex-col rounded-xl border-2 bg-white p-3 shadow-sm transition hover:shadow-md",
        item.track
          ? trackBorderStyles[item.track]
          : "!border-slate-200 hover:!border-slate-300",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          {typeLabel[item.activity.type]}
        </span>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className={cn(
              "size-7",
              item.active ? "text-emerald-600" : "text-slate-400",
            )}
            title={item.active ? "Visível" : "Oculta"}
            aria-label={
              item.active ? `Ocultar ${name(item)}` : `Exibir ${name(item)}`
            }
            onClick={() => void updateScheduleVisibility(item.id, !item.active)}
            disabled={visibilityUpdatingId === item.id}
          >
            {item.active ? (
              <Eye className="size-4" />
            ) : (
              <EyeOff className="size-4" />
            )}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="size-7"
            aria-label={`Editar ${name(item)}`}
            onClick={() => router.push(`/admin/schedule/edit/${item.id}`)}
          >
            <Pencil className="size-3.5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="size-7 text-red-600"
            aria-label={`Excluir ${name(item)}`}
            onClick={() => setSelected(item)}
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      </div>
      <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-slate-900">
        {name(item)}
      </h3>
      {speakersFor(item).length > 0 && (
        <ul className="mt-2 space-y-0.5 text-xs text-slate-500">
          {speakersFor(item).map((speakerName) => (
            <li key={speakerName}>{speakerName}</li>
          ))}
        </ul>
      )}
      {conflicts.has(item.id) && (
        <p className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-amber-700">
          <TriangleAlert className="size-3.5" /> Conflito
        </p>
      )}
    </article>
  );

  return (
    <>
      <main className="p-4 sm:p-6">
        <AdminPageHeader
          title="Programação"
          description="Monte o cronograma por horário e trilha; atividades gerais ocupam toda a grade."
          count={schedule.length}
          icon={CalendarDays}
          action={[
            {
              href: "/admin/schedule/add-schedule",
              label: "Adicionar atividade",
            },
            {
              href: "/admin/schedule/add-block",
              label: "Cadastrar bloco completo",
              variant: "secondary",
            },
            {
              href: "/admin/schedule/preview",
              label: "Prévia pública",
              variant: "secondary",
              icon: Eye,
            },
          ]}
        />
        <section className="mt-4 flex flex-col gap-3 rounded-xl border !border-slate-200 bg-white p-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "flex size-9 items-center justify-center rounded-lg",
                publication?.published
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-slate-100 text-slate-500",
              )}
            >
              <Globe2 className="size-4" />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {publication?.published
                  ? "Programação publicada"
                  : "Programação em rascunho"}
              </p>
              <p className="text-xs text-slate-500">
                {publication?.publishedAt
                  ? `Última publicação: ${new Date(publication.publishedAt).toLocaleString("pt-BR")}`
                  : "Ainda não disponível publicamente."}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportScheduleCsv(exportRows)}
              disabled={!exportRows.length}
              className="!border-slate-300 !bg-white !text-slate-700"
            >
              <FileSpreadsheet className="size-4" /> CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportSchedulePng(exportRows)}
              disabled={!exportRows.length}
              className="!border-slate-300 !bg-white !text-slate-700"
            >
              <FileImage className="size-4" /> Imagem
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void exportSchedulePdf(exportRows)}
              disabled={!exportRows.length}
              className="!border-slate-300 !bg-white !text-slate-700"
            >
              <FileDown className="size-4" /> PDF
            </Button>
            <Button
              size="sm"
              disabled={publicationLoading || !exportRows.length}
              className={
                publication?.published
                  ? "!border-slate-700 !bg-slate-700 !text-white hover:!border-slate-800 hover:!bg-slate-800 hover:!text-white"
                  : "admin-primary-action !border-blue-600 !bg-blue-600 !text-white hover:!border-blue-700 hover:!bg-blue-700 hover:!text-white"
              }
              onClick={() => {
                const next = !publication?.published;
                if (
                  !next &&
                  !window.confirm("Retirar a programação do site público?")
                )
                  return;
                void setPublished(next);
              }}
            >
              <Globe2 className="size-4" />{" "}
              {publication?.published ? "Despublicar" : "Publicar"}
            </Button>
          </div>
        </section>
        <AdminListToolbar search={search} onSearchChange={setSearch}>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="h-10 w-full !border-slate-200 bg-white sm:w-40">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="talk">Palestras</SelectItem>
              <SelectItem value="opening">Aberturas</SelectItem>
              <SelectItem value="break">Intervalos</SelectItem>
              <SelectItem value="closing">Encerramentos</SelectItem>
            </SelectContent>
          </Select>
          <Select value={trackFilter} onValueChange={setTrackFilter}>
            <SelectTrigger className="h-10 w-full !border-slate-200 bg-white sm:w-40">
              <SelectValue placeholder="Trilha" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as trilhas</SelectItem>
              <SelectItem value="general">Atividade geral</SelectItem>
              {SCHEDULE_TRACKS.map((track) => (
                <SelectItem key={track.value} value={track.value}>
                  {track.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-10 w-full !border-slate-200 bg-white sm:w-40">
              <SelectValue placeholder="Situação" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as situações</SelectItem>
              <SelectItem value="visible">Visíveis</SelectItem>
              <SelectItem value="hidden">Ocultas</SelectItem>
              <SelectItem value="conflict">Com conflito</SelectItem>
            </SelectContent>
          </Select>
          {hasFilters && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-10 shrink-0 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              onClick={() => {
                setTypeFilter("all");
                setTrackFilter("all");
                setStatusFilter("all");
              }}
            >
              <FilterX className="size-4" /> Limpar filtros
            </Button>
          )}
        </AdminListToolbar>
        {error && (
          <AdminErrorState
            message={error}
            onRetry={() =>
              void Promise.all([fetchSchedule(), refreshWorkspace()])
            }
          />
        )}
        {(loading || workspaceLoading) && !schedule.length ? (
          <AdminLoadingState />
        ) : !slots.length ? (
          <AdminEmptyState
            title={
              search || hasFilters
                ? "Nenhuma atividade encontrada"
                : "Programação vazia"
            }
            description={
              search || hasFilters
                ? "Altere a busca ou os filtros selecionados."
                : "Adicione a primeira atividade do evento."
            }
            action={
              !search && !hasFilters
                ? {
                    href: "/admin/schedule/add-schedule",
                    label: "Adicionar atividade",
                  }
                : undefined
            }
          />
        ) : (
          <section className="admin-surface mt-4 overflow-hidden rounded-xl">
            <div className="hidden overflow-x-auto lg:block">
              <div className="min-w-[1100px]">
                <header className="grid grid-cols-[120px_repeat(5,minmax(0,1fr))] border-b !border-slate-200 bg-slate-50">
                  <div className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Horário
                  </div>
                  {SCHEDULE_TRACKS.map((track) => (
                    <div
                      key={track.value}
                      className="border-l !border-slate-200 px-3 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-600"
                    >
                      {track.label}
                    </div>
                  ))}
                </header>
                {slots.map((items) => {
                  const first = items[0];
                  const start = formatTime(first.startAt);
                  const end = formatTime(first.endAt);
                  const general = items.find((item) => item.track === null);
                  return (
                    <div
                      key={`${start}-${end}`}
                      className="grid grid-cols-[120px_repeat(5,minmax(0,1fr))] border-b !border-slate-200 last:border-b-0"
                    >
                      <div className="bg-slate-50/60 px-4 py-4">
                        <p className="font-semibold text-slate-900">{start}</p>
                        <p className="text-xs text-slate-500">até {end}</p>
                        {!general && (
                          <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            className="mt-2 h-7 px-2 text-xs text-slate-500 hover:bg-white hover:text-blue-700"
                          >
                            <Link href={duplicateHref(first)}>
                              <Copy className="size-3.5" /> Duplicar
                            </Link>
                          </Button>
                        )}
                      </div>
                      {general ? (
                        <div className="col-span-5 border-l !border-slate-200 p-3">
                          {card(general)}
                        </div>
                      ) : (
                        SCHEDULE_TRACKS.map((track) => {
                          const item = items.find(
                            (entry) => entry.track === track.value,
                          );
                          return (
                            <div
                              key={track.value}
                              className="border-l !border-slate-200 p-2"
                            >
                              {item ? (
                                card(item)
                              ) : (
                                <Button
                                  asChild
                                  variant="ghost"
                                  className="h-full min-h-32 w-full border border-dashed !border-slate-200 text-slate-400 hover:!border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                                >
                                  <Link href={addHref(start, end, track.value)}>
                                    <Plus className="mr-1 size-4" /> Adicionar
                                  </Link>
                                </Button>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="divide-y divide-slate-200 lg:hidden">
              {slots.map((items) => {
                const first = items[0];
                const start = formatTime(first.startAt);
                const end = formatTime(first.endAt);
                return (
                  <section key={`${start}-${end}`} className="p-4">
                    <h2 className="mb-3 font-semibold text-slate-900">
                      <span>
                        {start}–{end}
                      </span>
                      {items.every((item) => item.track !== null) && (
                        <Button
                          asChild
                          variant="ghost"
                          size="sm"
                          className="ml-2 h-7 px-2 text-xs text-slate-500"
                        >
                          <Link href={duplicateHref(first)}>
                            <Copy className="size-3.5" /> Duplicar
                          </Link>
                        </Button>
                      )}
                    </h2>
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div key={item.id}>
                          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                            {item.track
                              ? SCHEDULE_TRACKS.find(
                                  (track) => track.value === item.track,
                                )?.label
                              : "Atividade geral"}
                          </p>
                          {card(item)}
                        </div>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          </section>
        )}
      </main>
      <DeleteDialog
        open={!!selected}
        title="Excluir atividade?"
        description="A atividade será removida permanentemente da programação."
        onClose={() => setSelected(null)}
        onConfirm={async () => {
          if (selected) await deleteSchedule(selected.id);
          setSelected(null);
        }}
      />
    </>
  );
}
