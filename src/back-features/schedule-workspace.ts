import { getSchedule } from "@/back-features/schedule";
import { getSpeakersByIds } from "@/back-features/speakers";
import { getTalksByIds } from "@/back-features/talks";
import { SCHEDULE_TRACKS } from "@/contracts/schedule";

const typeLabels = {
  talk: "Palestra",
  opening: "Abertura",
  opening_keynote: "Keynote de abertura",
  break: "Intervalo",
  closing: "Encerramento",
  closing_keynote: "Keynote de encerramento",
} as const;

export async function getScheduleWorkspace() {
  const schedule = await getSchedule();
  const talkIds = schedule.flatMap((item) =>
    "talkId" in item.activity ? [item.activity.talkId] : [],
  );
  const talks = await getTalksByIds(talkIds);
  const speakers = await getSpeakersByIds(
    talks.flatMap((talk) => talk.speakerIds),
  );
  const talkMap = new Map(talks.map((talk) => [talk.id, talk]));
  const speakerMap = new Map(
    speakers.map((speaker) => [speaker.id, speaker.name]),
  );
  const entries = schedule.map((item) => {
    const talk =
      "talkId" in item.activity ? talkMap.get(item.activity.talkId) : null;
    return {
      id: item.id,
      title:
        "title" in item.activity
          ? item.activity.title
          : (talk?.title ?? "Palestra removida"),
      speakerNames:
        talk?.speakerIds
          .map((id) => speakerMap.get(id))
          .filter((name): name is string => Boolean(name)) ?? [],
      typeLabel: typeLabels[item.activity.type],
      trackLabel: item.track
        ? (SCHEDULE_TRACKS.find((track) => track.value === item.track)?.label ??
          item.track)
        : "Geral",
    };
  });
  return { schedule, talks, speakers, entries };
}
