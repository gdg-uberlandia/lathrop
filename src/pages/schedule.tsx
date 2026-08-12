import { getSchedule } from "@/back-features/schedule";
import { getSchedulePublication } from "@/back-features/schedule-publication";
import { getSpeakersByIds } from "@/back-features/speakers";
import { getTalksByIds } from "@/back-features/talks";
import { Header } from "@/components/devfest-triangulo-2025/Header";
import { ScheduleEntry, SCHEDULE_TRACKS } from "@/contracts/schedule";
import { PublicSpeaker, toPublicSpeaker } from "@/contracts/speaker";
import { PublicTalk, toPublicTalk } from "@/contracts/talk";
import BaseLayout from "@/layouts/base-layout";

type SerializedSchedule = Omit<
  ScheduleEntry,
  "startAt" | "endAt" | "createdAt" | "updatedAt"
> & { startAt: string; endAt: string; createdAt: string; updatedAt: string };
const formatTime = (value: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  }).format(new Date(value));

export default function SchedulePage({
  schedule,
  talks,
  speakers,
  published,
}: {
  schedule: SerializedSchedule[];
  talks: PublicTalk[];
  speakers: PublicSpeaker[];
  published: boolean;
}) {
  const talkMap = new Map(talks.map((talk) => [talk.id, talk]));
  const speakerMap = new Map(speakers.map((speaker) => [speaker.id, speaker]));
  const trackNames = new Map(
    SCHEDULE_TRACKS.map((track) => [track.value, track.label]),
  );
  const slots = Array.from(
    schedule
      .filter((item) => item.active)
      .reduce((groups, item) => {
        const key = `${item.startAt}-${item.endAt}`;
        groups.set(key, [...(groups.get(key) ?? []), item]);
        return groups;
      }, new Map<string, SerializedSchedule[]>()),
  ).map(([, items]) => items);

  const content = (item: SerializedSchedule) => {
    const talk =
      "talkId" in item.activity ? talkMap.get(item.activity.talkId) : null;
    const prefix =
      item.activity.type === "opening"
        ? "Abertura"
        : item.activity.type === "opening_keynote"
          ? "Keynote de abertura"
          : item.activity.type === "closing"
            ? "Encerramento"
            : item.activity.type === "closing_keynote"
              ? "Keynote de encerramento"
              : null;
    const title =
      "title" in item.activity
        ? item.activity.title
        : (talk?.title ?? "Palestra removida");
    const names =
      talk?.speakerIds.map((id) => speakerMap.get(id)?.name).filter(Boolean) ??
      [];
    return (
      <>
        <div className="flex flex-wrap items-center gap-2">
          {prefix && (
            <span className="rounded-full bg-blue-500/15 px-2.5 py-1 text-xs font-semibold text-blue-300">
              {prefix}
            </span>
          )}
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
        {talk?.description && (
          <p className="mt-2 text-sm text-white/60">{talk.description}</p>
        )}
        {names.length > 0 && (
          <p className="mt-3 text-sm text-white/80">{names.join(" · ")}</p>
        )}
      </>
    );
  };

  return (
    <BaseLayout>
      <Header isRoot={false} />
      <main className="mx-auto min-h-screen max-w-7xl px-5 py-16 text-white">
        <header className="mb-12 max-w-2xl">
          <h1 className="text-4xl font-bold">Programação do evento</h1>
          <p className="mt-3 text-white/60">
            Confira os horários, trilhas e conteúdos do DevFest Triângulo.
          </p>
        </header>
        <div className="space-y-8">
          {slots.map((items) => {
            const first = items[0];
            const general = items.find((item) => item.track === null);
            return (
              <section key={`${first.startAt}-${first.endAt}`}>
                <header className="mb-3 text-lg font-semibold text-white/80">
                  {formatTime(first.startAt)}–{formatTime(first.endAt)}
                </header>
                {general ? (
                  <article className="rounded-2xl border border-white/10 bg-white/5 p-6">
                    {content(general)}
                  </article>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                    {items.map((item) => (
                      <article
                        key={item.id}
                        className="rounded-2xl border border-white/10 bg-white/5 p-5"
                      >
                        <span className="mb-4 inline-flex rounded-full border border-white/10 px-3 py-1 text-xs text-white/70">
                          {item.track ? trackNames.get(item.track) : "Geral"}
                        </span>
                        {content(item)}
                      </article>
                    ))}
                  </div>
                )}
              </section>
            );
          })}
          {(!published || slots.length === 0) && (
            <p className="rounded-2xl border border-white/10 p-8 text-center text-white/60">
              A programação será publicada em breve.
            </p>
          )}
        </div>
      </main>
    </BaseLayout>
  );
}

export async function getServerSideProps() {
  try {
    const publication = await getSchedulePublication();
    if (!publication.published) {
      return {
        props: { schedule: [], talks: [], speakers: [], published: false },
      };
    }
    const schedule = await getSchedule();
    const visibleSchedule = schedule.filter((item) => item.active);
    const scheduledTalkIds = new Set(
      visibleSchedule.flatMap((item) =>
        "talkId" in item.activity ? [item.activity.talkId] : [],
      ),
    );
    const scheduledTalks = await getTalksByIds([...scheduledTalkIds]);
    const scheduledSpeakerIds = new Set(
      scheduledTalks.flatMap((talk) => talk.speakerIds),
    );
    return {
      props: {
        schedule: visibleSchedule.map((item) => ({
          ...item,
          startAt: item.startAt.toISOString(),
          endAt: item.endAt.toISOString(),
          createdAt: item.createdAt.toISOString(),
          updatedAt: item.updatedAt.toISOString(),
        })),
        talks: scheduledTalks.map(toPublicTalk),
        speakers: (await getSpeakersByIds([...scheduledSpeakerIds])).map(
          toPublicSpeaker,
        ),
        published: publication.published,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: { schedule: [], talks: [], speakers: [], published: false },
    };
  }
}
