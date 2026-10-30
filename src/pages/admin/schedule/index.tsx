import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  ScheduleDraggable,
  ScheduleDroppable,
  ScheduleDropTarget,
} from "@/components/admin/schedule/schedule-drag-drop";
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
  FilterX,
  FileDown,
  FileImage,
  FileSpreadsheet,
  Globe2,
  Loader2,
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
  opening_keynote: "Keynote de abertura",
  break: "Intervalo",
  closing: "Encerramento",
  closing_keynote: "Keynote de encerramento",
} as const;
const trackBorderStyles: Record<ScheduleTrack, string> = {
  MINAS: "!border-amber-200 hover:!border-amber-300",
  CURADO: "!border-red-200 hover:!border-red-300",
  CANASTRA: "!border-pink-200 hover:!border-pink-300",
  TRANCA: "!border-blue-200 hover:!border-blue-300",
  COMUNIDADE: "!border-emerald-200 hover:!border-emerald-300",
  COMUNIDADE_2: "!border-teal-200 hover:!border-teal-300",
  LOUNGE_SENIOR: "!border-violet-200 hover:!border-violet-300",
};
const scheduleGridStyle = {
  gridTemplateColumns: `88px repeat(${SCHEDULE_TRACKS.length}, minmax(0, 1fr))`,
};
const trackLabels = new Map(
  SCHEDULE_TRACKS.map((track) => [track.value, track.label]),
);
const intervalLabel = (item: ScheduleEntry) =>
  `${formatTime(item.startAt)}–${formatTime(item.endAt)}`;
const scheduleActions = [
  {
    href: "/admin/schedule/add-schedule",
    label: "Adicionar atividade",
  },
  {
    href: "/admin/schedule/add-block",
    label: "Cadastrar bloco",
    variant: "secondary",
  },
  {
    href: "/admin/schedule/preview",
    label: "Prévia pública",
    variant: "secondary",
    icon: Eye,
  },
] as const;

export default function Schedules() {
  const router = useRouter();
  const {
    schedule,
    moveSchedule,
    moving,
    deleteSchedule,
    loading,
    error: scheduleError,
    fetchSchedule,
  } = useSchedule();
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
  const [draggedTitle, setDraggedTitle] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor),
  );
  const [moveFeedback, setMoveFeedback] = useState<{
    error: boolean;
    message: string;
  } | null>(null);
  async function handleDragEnd({ active, over }: DragEndEvent) {
    setDraggedTitle(null);
    if (!over || moving) return;
    const item = active.data.current?.item as ScheduleEntry | undefined;
    const target = over.data.current?.target as ScheduleDropTarget | undefined;
    if (!item || !target || item.id === target.item?.id) return;
    setMoveFeedback(null);
    try {
      await moveSchedule({
        id: item.id,
        targetId: target.item?.id,
        startTime: target.startTime,
        endTime: target.endTime,
        track: target.track,
        expectedUpdatedAt: item.updatedAt.toISOString(),
        targetUpdatedAt: target.item?.updatedAt.toISOString(),
      });
      setMoveFeedback({
        error: false,
        message: target.item
          ? "Atividades trocadas de horário."
          : "Atividade movida com sucesso.",
      });
    } catch (error) {
      setMoveFeedback({
        error: true,
        message:
          error instanceof Error
            ? error.message
            : "Não foi possível mover a atividade.",
      });
    }
  }
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
      ("title" in item.activity
        ? item.activity.title
        : (talkNames.get(item.activity.talkId) ?? "Carregando palestra...")),
    [talkNames, workspaceEntries],
  );
  const speakersFor = useCallback(
    (item: ScheduleEntry) =>
      workspaceEntries.get(item.id)?.speakerNames ??
      ("talkId" in item.activity
        ? (talkSpeakers.get(item.activity.talkId) ?? [])
        : []),
    [talkSpeakers, workspaceEntries],
  );
  const conflicts = useMemo(() => {
    const talkById = new Map(talks.map((talk) => [talk.id, talk]));
    const details = new Map<string, string[]>();
    const addReason = (item: ScheduleEntry, reason: string) => {
      const current = details.get(item.id) ?? [];
      if (!current.includes(reason)) details.set(item.id, [...current, reason]);
    };
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
          "talkId" in item.activity ? talkById.get(item.activity.talkId) : null;
        const otherTalk =
          "talkId" in other.activity
            ? talkById.get(other.activity.talkId)
            : null;
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
        if (sameTalk) {
          addReason(
            item,
            `A mesma palestra também está programada em ${intervalLabel(other)}.`,
          );
          addReason(
            other,
            `A mesma palestra também está programada em ${intervalLabel(item)}.`,
          );
        }
        if (sameTrack) {
          const reasonFor = (
            current: ScheduleEntry,
            conflicting: ScheduleEntry,
          ) => {
            if (conflicting.track === null)
              return `“${name(conflicting)}” é uma atividade geral em ${intervalLabel(conflicting)} e ocupa todas as trilhas.`;
            if (current.track === null)
              return `Esta atividade geral sobrepõe “${name(conflicting)}” em ${intervalLabel(conflicting)}, na trilha ${trackLabels.get(conflicting.track)}.`;
            return `“${name(conflicting)}” também ocupa a trilha ${trackLabels.get(conflicting.track)} em ${intervalLabel(conflicting)}.`;
          };
          addReason(item, reasonFor(item, other));
          addReason(other, reasonFor(other, item));
        }
        if (sharedSpeaker && itemTalk && otherTalk) {
          const sharedNames = itemTalk.speakerIds
            .filter((speakerId) => otherTalk.speakerIds.includes(speakerId))
            .map((speakerId) => speakerNames.get(speakerId) ?? "Palestrante")
            .join(", ");
          addReason(
            item,
            `${sharedNames} também participa de “${name(other)}” no mesmo horário.`,
          );
          addReason(
            other,
            `${sharedNames} também participa de “${name(item)}” no mesmo horário.`,
          );
        }
      }
    });
    return details;
  }, [name, schedule, speakerNames, talks]);
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
          startAt: item.startAt.toISOString(),
          endAt: item.endAt.toISOString(),
          trackId: item.track,
          description:
            "talkId" in item.activity
              ? (talks.find(
                  (talk) =>
                    "talkId" in item.activity &&
                    talk.id === item.activity.talkId,
                )?.description ?? "")
              : "",
          track: item.track
            ? (SCHEDULE_TRACKS.find((track) => track.value === item.track)
                ?.label ?? item.track)
            : "Geral",
          type: typeLabel[item.activity.type],
          title: name(item),
          speakers: speakersFor(item).join(", "),
        })),
    [name, schedule, speakersFor, talks],
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
    <ScheduleDraggable
      item={item}
      title={name(item)}
      disabled={moving || loading}
    >
      <article
        className={cn(
          "group flex min-w-0 min-h-32 flex-col rounded-xl border-2 bg-white p-2 shadow-sm transition hover:shadow-md",
          item.track
            ? trackBorderStyles[item.track]
            : "!border-slate-200 hover:!border-slate-300",
        )}
      >
        <div className="flex flex-wrap items-center justify-between gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            {typeLabel[item.activity.type]}
          </span>
          <div className="flex shrink-0 items-center gap-1">
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
          <div className="mt-2 rounded-lg border !border-amber-200 bg-amber-50 p-2 text-amber-800">
            <p className="flex items-center gap-1 text-xs font-semibold">
              <TriangleAlert className="size-3.5 shrink-0" /> Conflito na
              programação
            </p>
            <ul className="mt-1 space-y-1 pl-4 text-xs leading-4">
              {conflicts.get(item.id)?.map((reason) => (
                <li key={reason} className="list-disc">
                  {reason}
                </li>
              ))}
            </ul>
          </div>
        )}
      </article>
    </ScheduleDraggable>
  );

  return (
    <>
      <main
        aria-busy={moving}
        ref={(element) => {
          if (element) element.inert = moving;
        }}
        className="min-w-0 max-w-full p-4 sm:p-6"
      >
        <AdminPageHeader
          title="Programação"
          description="Monte o cronograma por horário e trilha; atividades gerais ocupam toda a grade."
          count={schedule.length}
          icon={CalendarDays}
          action={scheduleActions}
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
              <SelectItem value="opening_keynote">
                Keynotes de abertura
              </SelectItem>
              <SelectItem value="break">Intervalos</SelectItem>
              <SelectItem value="closing">Encerramentos</SelectItem>
              <SelectItem value="closing_keynote">
                Keynotes de encerramento
              </SelectItem>
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
        <p className="mt-3 text-sm text-slate-500">
          Arraste pelo botão Mover para um espaço vago ou sobre outra atividade
          para trocar os horários.
        </p>
        {moveFeedback && (
          <p
            role={moveFeedback.error ? "alert" : "status"}
            className={cn(
              "mt-3 rounded-lg border p-3 text-sm",
              moveFeedback.error
                ? "border-red-200 bg-red-50 text-red-800"
                : "border-emerald-200 bg-emerald-50 text-emerald-800",
            )}
          >
            {moveFeedback.error && "Não foi possível realizar a ação: "}
            {moveFeedback.message}
          </p>
        )}
        <DndContext
          sensors={sensors}
          onDragStart={({ active }) => {
            const item = active.data.current?.item as ScheduleEntry | undefined;
            setDraggedTitle(item ? name(item) : null);
          }}
          onDragCancel={() => setDraggedTitle(null)}
          onDragEnd={handleDragEnd}
        >
          <DragOverlay>
            {draggedTitle ? (
              <div className="max-w-56 rounded-xl border border-blue-300 bg-white p-3 text-sm font-semibold text-slate-900 shadow-lg">
                {draggedTitle}
              </div>
            ) : null}
          </DragOverlay>
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
            <section className="admin-surface mt-4 min-w-0 max-w-full overflow-hidden rounded-xl">
              <div className="hidden w-full lg:block">
                <div className="w-full min-w-0 [overflow-wrap:anywhere]">
                  <header
                    style={scheduleGridStyle}
                    className="grid border-b !border-slate-200 bg-slate-50"
                  >
                    <div className="min-w-0 px-2 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Horário
                    </div>
                    {SCHEDULE_TRACKS.map((track) => (
                      <div
                        key={track.value}
                        className="border-l !border-slate-200 min-w-0 px-1 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-600"
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
                        style={scheduleGridStyle}
                        className="grid border-b !border-slate-200 last:border-b-0"
                      >
                        <div className="min-w-0 bg-slate-50/60 px-2 py-4">
                          <p className="font-semibold text-slate-900">
                            {start}
                          </p>
                          <p className="text-xs text-slate-500">até {end}</p>
                          {!general && (
                            <Button
                              asChild
                              variant="ghost"
                              size="sm"
                              className="mt-2 h-auto flex-wrap px-0 py-1 text-xs text-slate-500 hover:bg-white hover:text-blue-700"
                            >
                              <Link href={duplicateHref(first)}>
                                <Copy className="size-3.5" /> Duplicar
                              </Link>
                            </Button>
                          )}
                        </div>
                        {general ? (
                          <ScheduleDroppable
                            id={`general-${start}-${end}`}
                            target={{
                              startTime: start,
                              endTime: end,
                              track: null,
                              item: general,
                            }}
                            disabled={moving || loading}
                            style={{ gridColumn: "2 / -1" }}
                            className="border-l !border-slate-200 p-3"
                          >
                            {card(general)}
                          </ScheduleDroppable>
                        ) : (
                          SCHEDULE_TRACKS.map((track) => {
                            const item = items.find(
                              (entry) => entry.track === track.value,
                            );
                            return (
                              <ScheduleDroppable
                                key={track.value}
                                id={`${start}-${end}-${track.value}`}
                                target={{
                                  startTime: start,
                                  endTime: end,
                                  track: track.value,
                                  item,
                                }}
                                disabled={moving || loading}
                                className="border-l !border-slate-200 p-1"
                              >
                                {item ? (
                                  card(item)
                                ) : (
                                  <Button
                                    asChild
                                    variant="ghost"
                                    className="h-full min-h-32 w-full min-w-0 whitespace-normal px-1 text-xs border border-dashed !border-slate-200 text-slate-400 hover:!border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                                  >
                                    <Link
                                      href={addHref(start, end, track.value)}
                                    >
                                      <Plus className="size-3 shrink-0" />{" "}
                                      Adicionar
                                    </Link>
                                  </Button>
                                )}
                              </ScheduleDroppable>
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
                        {(items.some((item) => item.track === null)
                          ? [null]
                          : SCHEDULE_TRACKS.map((track) => track.value)
                        ).map((track) => {
                          const item = items.find(
                            (entry) => entry.track === track,
                          );
                          return (
                            <ScheduleDroppable
                              key={track ?? "general"}
                              id={`mobile-${start}-${end}-${track}`}
                              target={{
                                startTime: start,
                                endTime: end,
                                track,
                                item,
                              }}
                              disabled={moving || loading}
                            >
                              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                {track
                                  ? SCHEDULE_TRACKS.find(
                                      (entry) => entry.value === track,
                                    )?.label
                                  : "Atividade geral"}
                              </p>
                              {item ? (
                                card(item)
                              ) : (
                                <Button
                                  asChild
                                  variant="ghost"
                                  className="min-h-16 w-full border border-dashed !border-slate-200"
                                >
                                  <Link
                                    href={addHref(
                                      start,
                                      end,
                                      track ?? undefined,
                                    )}
                                  >
                                    <Plus className="size-4" /> Adicionar
                                  </Link>
                                </Button>
                              )}
                            </ScheduleDroppable>
                          );
                        })}
                      </div>
                    </section>
                  );
                })}
              </div>
            </section>
          )}
        </DndContext>
      </main>
      {moving && (
        <div className="fixed inset-0 z-[100] flex cursor-wait items-center justify-center bg-white/60 p-6">
          <div
            role="status"
            aria-live="polite"
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-4 text-sm font-medium text-slate-900 shadow-lg"
          >
            <Loader2
              aria-hidden="true"
              className="size-5 shrink-0 animate-spin text-blue-600"
            />
            Executando alteração na programação...
          </div>
        </div>
      )}
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
