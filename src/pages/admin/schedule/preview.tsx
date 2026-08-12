import { Button } from "@/assets/components/ui/button";
import { AdminPageHeader } from "@/components/admin/admin-page";
import { ArrowLeft, ExternalLink, Monitor } from "lucide-react";
import Link from "next/link";
import { useSchedule } from "@/hooks/useSchedule";
import { useTalks } from "@/hooks/useTalks";
import { useSpeakers } from "@/hooks/useSpeakers";
import { SCHEDULE_TRACKS } from "@/contracts/schedule";
import { useMemo } from "react";

const time = (value: Date) =>
  value.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  });

export default function SchedulePreviewPage() {
  const { schedule } = useSchedule();
  const { talks } = useTalks();
  const { speakers } = useSpeakers();
  const talkMap = useMemo(
    () => new Map(talks.map((item) => [item.id, item])),
    [talks],
  );
  const speakerMap = useMemo(
    () => new Map(speakers.map((item) => [item.id, item.name])),
    [speakers],
  );
  const slots = useMemo(
    () =>
      Array.from(
        schedule
          .filter((item) => item.active)
          .reduce((groups, item) => {
            const key = `${item.startAt.getTime()}-${item.endAt.getTime()}`;
            groups.set(key, [...(groups.get(key) ?? []), item]);
            return groups;
          }, new Map<string, typeof schedule>())
          .values(),
      ),
    [schedule],
  );
  return (
    <main className="p-4 sm:p-6">
      <Link
        href="/admin/schedule"
        className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft className="size-4" /> Voltar para programação
      </Link>
      <AdminPageHeader
        title="Prévia pública"
        description="Visualize o rascunho com todas as atividades marcadas como visíveis."
        icon={Monitor}
      />
      <div className="mt-4 flex justify-end">
        <Button
          asChild
          variant="outline"
          className="!border-slate-300 !bg-white !text-slate-700 hover:!bg-slate-50 hover:!text-slate-900"
        >
          <Link href="/schedule" target="_blank">
            <ExternalLink className="size-4" /> Abrir em nova aba
          </Link>
        </Button>
      </div>
      <section className="mt-4 overflow-hidden rounded-xl border !border-slate-200 bg-slate-950">
        <div className="flex items-center gap-2 border-b !border-slate-200 bg-slate-50 px-4 py-2">
          <span className="size-2.5 rounded-full bg-red-400" />
          <span className="size-2.5 rounded-full bg-amber-400" />
          <span className="size-2.5 rounded-full bg-emerald-400" />
          <span className="ml-3 truncate rounded-md bg-white px-3 py-1 text-xs text-slate-500 ring-1 ring-slate-200">
            /schedule
          </span>
        </div>
        <div className="min-h-[640px] bg-slate-950 p-5 !text-white md:p-10">
          <h2 className="text-3xl font-bold !text-white">
            Programação do evento
          </h2>
          <p className="mt-2 !text-slate-300">
            Confira os horários, trilhas e conteúdos do DevFest Triângulo.
          </p>
          <div className="mt-8 space-y-7">
            {slots.map((items) => {
              const first = items[0];
              return (
                <section key={`${first.startAt}-${first.endAt}`}>
                  <h3 className="mb-3 font-semibold !text-slate-200">
                    {time(first.startAt)}–{time(first.endAt)}
                  </h3>
                  <div
                    className={
                      items.some((item) => item.track === null)
                        ? "grid"
                        : "grid gap-3 md:grid-cols-2 xl:grid-cols-5"
                    }
                  >
                    {items.map((item) => {
                      const talk =
                        "title" in item.activity
                          ? null
                          : talkMap.get(item.activity.talkId);
                      const names = talk?.speakerIds
                        .map((id) => speakerMap.get(id))
                        .filter(Boolean)
                        .join(" · ");
                      return (
                        <article
                          key={item.id}
                          className="rounded-2xl border !border-white/10 bg-white/5 p-5 !text-white"
                        >
                          <span className="text-xs !text-slate-300">
                            {item.track
                              ? SCHEDULE_TRACKS.find(
                                  (track) => track.value === item.track,
                                )?.label
                              : "Geral"}
                          </span>
                          <h4 className="mt-3 font-semibold !text-white">
                            {"title" in item.activity
                              ? item.activity.title
                              : (talk?.title ?? "Palestra removida")}
                          </h4>
                          {names && (
                            <p className="mt-2 text-sm !text-slate-200">
                              {names}
                            </p>
                          )}
                        </article>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
