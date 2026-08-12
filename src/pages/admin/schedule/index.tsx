import { Button } from "@/assets/components/ui/button";
import { cn } from "@/assets/lib/utils";
import {
  AdminEmptyState,
  AdminErrorState,
  AdminListToolbar,
  AdminLoadingState,
  AdminPageHeader,
  AdminStatusBadge,
} from "@/components/admin/admin-page";
import DeleteDialog from "@/components/admin/delete-dialog";
import {
  ScheduleEntry,
  ScheduleTrack,
  SCHEDULE_TRACKS,
} from "@/contracts/schedule";
import { useSchedule } from "@/hooks/useSchedule";
import { useTalks } from "@/hooks/useTalks";
import { useSpeakers } from "@/hooks/useSpeakers";
import {
  CalendarDays,
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
const typeLabel = {
  talk: "Palestra",
  opening: "Abertura",
  break: "Intervalo",
  closing: "Encerramento",
} as const;
const trackBorderStyles: Record<ScheduleTrack, string> = {
  MINAS: "!border-amber-400 hover:!border-amber-500",
  CURADO: "!border-red-400 hover:!border-red-500",
  CANASTRA: "!border-pink-400 hover:!border-pink-500",
  TRANCA: "!border-blue-400 hover:!border-blue-500",
  COMUNIDADE: "!border-emerald-400 hover:!border-emerald-500",
};

export default function Schedules() {
  const router = useRouter();
  const { schedule, deleteSchedule, loading, error, fetchSchedule } =
    useSchedule();
  const { talks } = useTalks();
  const { speakers } = useSpeakers();
  const [selected, setSelected] = useState<ScheduleEntry | null>(null);
  const [search, setSearch] = useState("");
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
      item.activity.type === "break"
        ? item.activity.title
        : (talkNames.get(item.activity.talkId) ?? "Palestra removida"),
    [talkNames],
  );
  const speakersFor = useCallback(
    (item: ScheduleEntry) =>
      item.activity.type === "break"
        ? []
        : (talkSpeakers.get(item.activity.talkId) ?? []),
    [talkSpeakers],
  );
  const conflicts = useMemo(
    () =>
      new Set(
        schedule.flatMap((item, index) =>
          schedule
            .slice(index + 1)
            .flatMap((other) =>
              (item.track === null ||
                other.track === null ||
                item.track === other.track) &&
              item.startAt < other.endAt &&
              other.startAt < item.endAt
                ? [item.id, other.id]
                : [],
            ),
        ),
      ),
    [schedule],
  );
  const slots = useMemo(() => {
    const term = search.trim().toLocaleLowerCase("pt-BR");
    const groups = schedule.reduce((map, item) => {
      const key = `${item.startAt.getTime()}-${item.endAt.getTime()}`;
      map.set(key, [...(map.get(key) ?? []), item]);
      return map;
    }, new Map<string, ScheduleEntry[]>());
    return Array.from(groups.values())
      .filter(
        (items) =>
          !term ||
          items.some((item) =>
            `${name(item)} ${speakersFor(item).join(" ")} ${item.track ?? "geral"} ${typeLabel[item.activity.type]}`
              .toLocaleLowerCase("pt-BR")
              .includes(term),
          ),
      )
      .sort((a, b) => a[0].startAt.getTime() - b[0].startAt.getTime());
  }, [schedule, search, name, speakersFor]);
  const addHref = (start: string, end: string, track?: ScheduleTrack) => ({
    pathname: "/admin/schedule/add-schedule",
    query: { start, end, type: "talk", ...(track ? { track } : {}) },
  });

  const card = (item: ScheduleEntry) => (
    <article
      className={cn(
        "group flex h-full min-h-32 flex-col rounded-xl border-2 bg-white p-3 shadow-sm transition hover:shadow-md",
        item.track
          ? trackBorderStyles[item.track]
          : "!border-slate-200 hover:!border-slate-300",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          {typeLabel[item.activity.type]}
        </span>
        <div className="flex items-center gap-1">
          <AdminStatusBadge
            active={item.active}
            activeLabel="Visível"
            inactiveLabel="Oculta"
          />
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
          action={{
            href: "/admin/schedule/add-schedule",
            label: "Adicionar atividade",
          }}
        />
        <AdminListToolbar search={search} onSearchChange={setSearch} />
        {error && (
          <AdminErrorState
            message={error}
            onRetry={() => void fetchSchedule()}
          />
        )}
        {loading && !schedule.length ? (
          <AdminLoadingState />
        ) : !slots.length ? (
          <AdminEmptyState
            title={
              search ? "Nenhuma atividade encontrada" : "Programação vazia"
            }
            description={
              search
                ? "Tente outro termo de busca."
                : "Adicione a primeira atividade do evento."
            }
            action={
              !search
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
                      {start}–{end}
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
