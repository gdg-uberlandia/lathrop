import { AdminLoadingState } from "@/components/admin/admin-page";
import { useMissions } from "@/hooks/useMissions";
import { useSchedule } from "@/hooks/useSchedule";
import { useSpeakers } from "@/hooks/useSpeakers";
import { useSponsors } from "@/hooks/useSponsors";
import { useTalks } from "@/hooks/useTalks";
import { useCompanies } from "@/hooks/useCompanies";
import { useTags } from "@/hooks/useTags";
import { useRaffles } from "@/hooks/useRaffles";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  CheckCircle2,
  Flag,
  Mic2,
  TriangleAlert,
  Users,
  Tags,
  Gift,
} from "lucide-react";
import Link from "next/link";

const metricStyles = [
  { icon: Users, color: "bg-blue-50 text-blue-700 ring-blue-100" },
  { icon: Mic2, color: "bg-emerald-50 text-emerald-700 ring-emerald-100" },
  { icon: Building2, color: "bg-amber-50 text-amber-700 ring-amber-100" },
  { icon: Flag, color: "bg-red-50 text-red-700 ring-red-100" },
  { icon: Building2, color: "bg-violet-50 text-violet-700 ring-violet-100" },
  { icon: Tags, color: "bg-cyan-50 text-cyan-700 ring-cyan-100" },
  { icon: Gift, color: "bg-pink-50 text-pink-700 ring-pink-100" },
  { icon: CalendarDays, color: "bg-indigo-50 text-indigo-700 ring-indigo-100" },
];

function getTimestamp(value: unknown) {
  if (value instanceof Date) return value.getTime();
  if (typeof value === "string" || typeof value === "number") {
    const timestamp = new Date(value).getTime();
    return Number.isNaN(timestamp) ? 0 : timestamp;
  }
  if (value && typeof value === "object") {
    const serialized = value as {
      seconds?: number;
      _seconds?: number;
      toDate?: () => Date;
    };
    if (typeof serialized.toDate === "function") {
      return serialized.toDate().getTime();
    }
    const seconds = serialized.seconds ?? serialized._seconds;
    if (typeof seconds === "number") return seconds * 1_000;
  }
  return 0;
}

function Panel({
  title,
  action,
  children,
}: {
  title: string;
  action?: { label: string; href: string };
  children: React.ReactNode;
}) {
  return (
    <section className="admin-surface min-w-0 overflow-hidden rounded-xl">
      <header className="flex min-h-12 items-center justify-between border-b !border-slate-200 px-4 py-3">
        <h2 className="font-semibold text-slate-900">{title}</h2>
        {action && (
          <Link
            href={action.href}
            className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800"
          >
            {action.label}
            <ArrowRight className="size-3.5" />
          </Link>
        )}
      </header>
      {children}
    </section>
  );
}

export default function AdminIndex() {
  const { speakers, loading: loadingSpeakers } = useSpeakers();
  const { sponsors, loading: loadingSponsors } = useSponsors();
  const { talks, loading: loadingTalks } = useTalks();
  const { missions, loading: loadingMissions } = useMissions();
  const { schedule, loading: loadingSchedule } = useSchedule();
  const { companies, loading: loadingCompanies } = useCompanies();
  const { tags, loading: loadingTags } = useTags();
  const { raffles, loading: loadingRaffles } = useRaffles();
  const sponsorCount = sponsors.reduce(
    (total, level) => total + level.items.length,
    0,
  );
  const activeTalks = talks.filter((talk) => talk.isActive);
  const openTalks = talks.filter(
    (talk) => talk.isActive && talk.evaluationStatus === "open",
  );
  const inactiveTalks = talks.filter((talk) => !talk.isActive);
  const incompleteSpeakers = speakers.filter(
    (speaker) => !speaker.photoUrl || !speaker.miniBio,
  );
  const inactiveMissions = missions.filter((mission) => !mission.active);
  const scheduledTalkIds = new Set(
    schedule.flatMap((item) =>
      item.activity.type === "talk" ? [item.activity.talkId] : [],
    ),
  );
  const unscheduledTalks = activeTalks.filter(
    (talk) => !scheduledTalkIds.has(talk.id),
  );
  const totalTalks = Math.max(talks.length, 1);
  const activePercent = Math.round((activeTalks.length / totalTalks) * 100);
  const reviewPercent = Math.round((openTalks.length / totalTalks) * 100);
  const inactivePercent = Math.max(0, 100 - activePercent - reviewPercent);
  const loading =
    loadingSpeakers ||
    loadingSponsors ||
    loadingTalks ||
    loadingMissions ||
    loadingSchedule ||
    loadingCompanies ||
    loadingTags ||
    loadingRaffles;
  const metrics = [
    ["Palestrantes", speakers.length, "/admin/speakers"],
    ["Palestras ativas", activeTalks.length, "/admin/talks"],
    ["Patrocinadores", sponsorCount, "/admin/sponsors"],
    [
      "Missões ativas",
      missions.length - inactiveMissions.length,
      "/admin/missions",
    ],
    ["Companies", companies.length, "/admin/companies"],
    ["Tags ativas", tags.filter((tag) => tag.active).length, "/admin/tags"],
    ["Prêmios", raffles.length, "/admin/raffles"],
    ["Atividades", schedule.length, "/admin/schedule"],
  ] as const;
  const pendingItems = [
    {
      count: unscheduledTalks.length,
      label: "Palestras sem programação",
      description: "Ainda não possuem horário e trilha",
      href: "/admin/schedule",
      color: "bg-violet-50 text-violet-700",
      icon: CalendarDays,
    },
    {
      count: incompleteSpeakers.length,
      label: "Palestrantes incompletos",
      description: "Sem foto ou biografia",
      href: "/admin/speakers",
      color: "bg-blue-50 text-blue-700",
      icon: Users,
    },
    {
      count: openTalks.length,
      label: "Palestras em avaliação",
      description: "Aguardando revisão",
      href: "/admin/talks",
      color: "bg-emerald-50 text-emerald-700",
      icon: Mic2,
    },
    {
      count: inactiveTalks.length,
      label: "Palestras inativas",
      description: "Não aparecem na programação",
      href: "/admin/talks",
      color: "bg-amber-50 text-amber-700",
      icon: TriangleAlert,
    },
    {
      count: inactiveMissions.length,
      label: "Missões inativas",
      description: "Não disponíveis aos participantes",
      href: "/admin/missions",
      color: "bg-red-50 text-red-700",
      icon: Flag,
    },
  ];
  const recentItems = [
    ...talks.map((talk) => ({
      entity: "Palestra",
      item: talk.title,
      detail: talk.isActive ? "Ativa" : "Inativa",
      href: `/admin/talks/edit/${talk.id}`,
      createdAt: talk.createdAt,
    })),
    ...speakers.map((speaker) => ({
      entity: "Palestrante",
      item: speaker.name,
      detail: speaker.isVisible ? "Visível" : "Oculto",
      href: `/admin/speakers/edit/${speaker.id}`,
      createdAt: speaker.createdAt,
    })),
    ...missions.map((mission) => ({
      entity: "Missão",
      item: mission.title,
      detail: mission.active ? "Ativa" : "Inativa",
      href: `/admin/missions/edit/${mission.id}`,
      createdAt: mission.createdAt,
    })),
  ]
    .sort(
      (left, right) =>
        getTimestamp(right.createdAt) - getTimestamp(left.createdAt),
    )
    .slice(0, 5);

  if (loading && metrics.every(([, value]) => value === 0)) {
    return (
      <main className="p-4 sm:p-6 lg:p-7">
        <AdminLoadingState label="Preparando o painel..." />
      </main>
    );
  }

  return (
    <main className="p-4 sm:p-6 lg:p-7">
      <div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
            Visão geral
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Acompanhe o catálogo do evento e resolva pendências.
          </p>
        </div>
      </div>

      <section
        className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        aria-label="Resumo do evento"
      >
        {metrics.map(([label, value, href], index) => {
          const style = metricStyles[index];
          const Icon = style.icon;
          return (
            <Link
              key={label}
              href={href}
              className="admin-surface group flex items-center gap-4 rounded-xl p-4 transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
            >
              <div
                className={`flex size-11 items-center justify-center rounded-lg ring-1 ring-inset ${style.color}`}
              >
                <Icon className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-slate-500">{label}</p>
                <p className="mt-0.5 text-2xl font-semibold text-slate-950">
                  {value}
                </p>
              </div>
              <ArrowRight className="size-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-blue-600" />
            </Link>
          );
        })}
      </section>

      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(340px,0.85fr)_minmax(560px,1.45fr)]">
        <Panel
          title="Programação por status"
          action={{ label: "Ver palestras", href: "/admin/talks" }}
        >
          <div className="flex min-h-72 flex-col items-center justify-center gap-7 p-5 sm:flex-row xl:flex-col 2xl:flex-row">
            <div
              className="relative size-44 shrink-0 rounded-full"
              style={{
                background: `conic-gradient(#1769e0 0 ${activePercent}%, #22a447 ${activePercent}% ${Math.min(100, activePercent + reviewPercent)}%, #f5b400 ${Math.min(100, activePercent + reviewPercent)}% 100%)`,
              }}
              aria-label={`${activePercent}% ativas, ${reviewPercent}% em avaliação, ${inactivePercent}% inativas`}
            >
              <div className="absolute inset-10 flex flex-col items-center justify-center rounded-full bg-white">
                <strong className="text-2xl text-slate-950">
                  {talks.length}
                </strong>
                <span className="text-xs text-slate-500">palestras</span>
              </div>
            </div>
            <dl className="w-full max-w-xs space-y-3 text-sm">
              {[
                ["Ativas", activeTalks.length, activePercent, "bg-blue-600"],
                [
                  "Em avaliação",
                  openTalks.length,
                  reviewPercent,
                  "bg-emerald-500",
                ],
                [
                  "Inativas",
                  inactiveTalks.length,
                  inactivePercent,
                  "bg-amber-500",
                ],
              ].map(([label, count, percent, color]) => (
                <div
                  key={String(label)}
                  className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b !border-slate-100 pb-2 last:border-0"
                >
                  <dt className="flex items-center gap-2 text-slate-600">
                    <span className={`size-2 rounded-full ${color}`} />
                    {label}
                  </dt>
                  <dd className="font-medium text-slate-900">{count}</dd>
                  <dd className="w-9 text-right text-slate-500">{percent}%</dd>
                </div>
              ))}
            </dl>
          </div>
        </Panel>

        <Panel
          title="Programação"
          action={{ label: "Ver programação", href: "/admin/schedule" }}
        >
          {schedule.length === 0 ? (
            <div className="flex min-h-72 flex-col items-center justify-center p-6 text-center">
              <CalendarDays className="size-7 text-slate-300" />
              <p className="mt-3 text-sm font-medium text-slate-700">
                Nenhum horário cadastrado
              </p>
              <Link
                href="/admin/schedule/add-schedule"
                className="mt-2 text-sm text-blue-600"
              >
                Adicionar programação
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-left text-xs">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-4 py-2.5 font-medium">Horário</th>
                    <th className="px-4 py-2.5 font-medium">Atividade</th>
                    <th className="px-4 py-2.5 font-medium">Trilha</th>
                    <th className="px-4 py-2.5 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {schedule.slice(0, 7).map((slot) => {
                    const activity = slot.activity;
                    const activityName =
                      activity.type === "talk"
                        ? talks.find((talk) => talk.id === activity.talkId)
                            ?.title || "Palestra removida"
                        : activity.title;
                    return (
                      <tr key={slot.id} className="hover:bg-slate-50">
                        <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-700">
                          {new Intl.DateTimeFormat("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          }).format(slot.startAt)}
                        </td>
                        <td className="max-w-56 truncate px-4 py-3 text-slate-700">
                          {activityName}
                        </td>
                        <td className="px-4 py-3 text-slate-500">
                          {slot.track}
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1.5 text-emerald-700">
                            <span className="size-1.5 rounded-full bg-emerald-500" />
                            Confirmado
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Panel>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(560px,1.45fr)_minmax(320px,0.65fr)]">
        <Panel
          title="Cadastros recentes"
          action={{ label: "Ver cadastros", href: "/admin/talks" }}
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-xs">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Entidade</th>
                  <th className="px-4 py-2.5 font-medium">Item</th>
                  <th className="px-4 py-2.5 font-medium">Situação</th>
                  <th className="px-4 py-2.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentItems.map((item) => (
                  <tr key={`${item.entity}-${item.item}`}>
                    <td className="px-4 py-3 text-slate-500">{item.entity}</td>
                    <td className="max-w-72 truncate px-4 py-3 font-medium text-slate-800">
                      {item.item}
                    </td>
                    <td className="px-4 py-3 text-slate-500">{item.detail}</td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={item.href}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Abrir
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel
          title="Pendências"
          action={{ label: "Ver tudo", href: "/admin/talks" }}
        >
          <div className="divide-y divide-slate-100">
            {pendingItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3.5 hover:bg-slate-50"
              >
                <div
                  className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${item.color}`}
                >
                  <item.icon className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-800">
                    {item.label}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {item.description}
                  </p>
                </div>
                <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                  {item.count}
                </span>
                {item.count === 0 ? (
                  <CheckCircle2 className="size-4 text-emerald-500" />
                ) : (
                  <ArrowRight className="size-4 text-slate-300" />
                )}
              </Link>
            ))}
          </div>
        </Panel>
      </div>
    </main>
  );
}
