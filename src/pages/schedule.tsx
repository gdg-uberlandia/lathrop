import styles from "../styles/Schedule.module.css";

import { Speaker } from "models/speaker";

import { Header } from "@/components/devfest-triangulo-2025/Header";
import BaseLayout from "layouts/base-layout";
import Image from "next/image";
import {
  Schedule,
  Speeches,
  SpeechesPath,
  SpeechTopicName,
} from "@/models/schedule";
import { getAllSpeakers } from "back-features/speakers";
import { getSchedule } from "back-features/schedule";
import { TruncatedText } from "@/components/TruncatedText";
import CheeseIcon from "@/public/icons/cheese.svg";
import { useState } from "react";
import SpeakerModal from "@/components/devfest-triangulo-2025/Speakers/SpeakerModal";

interface SpeakersPageProps {
  schedule: Schedule[];
  speakers: Array<Speaker>;
}

const SchedulePage = ({ schedule, speakers }: SpeakersPageProps) => {
  const [speaker, setSpeaker] = useState<Speaker | null>();

  const speakersMap = new Map(speakers.map((speaker) => [speaker.id, speaker]));

  const findSpeakers = (speeches: Speeches) => {
    const speakers = speeches.speakerSlugs
      ? speeches.speakerSlugs.map((slug) => speakersMap.get(slug)!)
      : [];
    return speakers;
  };

  const getPathName = (path: SpeechesPath) => {
    switch (path) {
      case SpeechesPath.MINAS:
        return "Minas";
      case SpeechesPath.CURADO:
        return "Curado";
      case SpeechesPath.CANASTRA:
        return "Canastra";
      case SpeechesPath.TRANCA:
        return "Trança";
      case SpeechesPath.COMMUNITY:
        return "Arena Comunidade";
      default:
        return "Trilhas Integradas";
    }
  };

  function generateKey(speech: Speeches, speakerId: string) {
    return `speech-${speech.path}-speaker-${speakerId}-${
      speech.speakerSlugs
        ? speech.speakerSlugs.map((slug) => slug).join("-")
        : speech.topic
    }`;
  }

  return (
    <BaseLayout>
      <Header isRoot={false} />

      <div className={styles.ScheduleWrapper}>
        <section className="py-16">
          <h1 className={styles.Title}>
            Veja a <span>agenda</span> completa
          </h1>

          <p>
            Confira os horários, mergulhe nas 4 trilhas de conteúdo, conheça
            quem vai subir ao palco e descubra os temas que vão transformar sua
            visão sobre tecnologia.
          </p>
        </section>

        <div className="mt-12 flex justify-start flex-col text-left  text-lg  text-white/80 font-medium">
          {schedule.map((scheduleItem) => (
            <div key={scheduleItem.id} className="mb-16">
              <div className="p-3">
                {scheduleItem.start} - {scheduleItem.end}
              </div>

              <div className="text-white/80 font-medium flex flex-wrap gap-4">
                {scheduleItem.speeches.map((speech, index) => {
                  if (speech.topic && !speech.speakerSlugs) {
                    return (
                      <div
                        key={index}
                        className="p-6 text-lg text-white/80 my-3 rounded-2xl border-1 border-devGray relative w-full"
                      >
                        {
                          SpeechTopicName[
                            speech.topic as keyof typeof SpeechTopicName
                          ]
                        }
                      </div>
                    );
                  }

                  const speechSpeakers = findSpeakers(speech);
                  const speakerInfo = speechSpeakers.find((speaker) => speaker);

                  const getPathStyle = (path: string) => {
                    let pathStyle = "";
                    switch (path) {
                      case "MINAS":
                        pathStyle = "border-devYellow-dark";
                        break;
                      case "CURADO":
                        pathStyle = "border-devRed-dark";
                        break;
                      case "CANASTRA":
                        pathStyle = "border-devPink-dark";
                        break;
                      case "TRANCA":
                        pathStyle = "border-devBlue-dark";
                        break;
                      case "COMMUNITY":
                        pathStyle = "border-devGreen-dark";
                        break;
                    }
                    return pathStyle;
                  };

                  return (
                    <div
                      key={index}
                      className={`my-3 p-6 rounded-2xl border-1 border-devGray flex flex-col ${["keynote_start", "keynote_end"].includes(speech.topic) ? "" : "w-80"}`}
                    >
                      {(speech.path || speakerInfo) && (
                        <div
                          className={`rounded-full border-1 text-sm py-2 px-3 flex gap-2 w-fit ${speech.path ? getPathStyle(speech.path) : styles.Tag}`}
                        >
                          <Image
                            src={CheeseIcon}
                            alt={`Símbolo queijo`}
                            height={16}
                            width={14}
                            loading="lazy"
                          />
                          {speech.path
                            ? getPathName(SpeechesPath[speech.path])
                            : "Trilhas Integradas"}
                        </div>
                      )}
                      <div
                        className={`flex flex-col col-span-11 text-lg font-bold mt-10 mb-3 leading-tight  ${["keynote_start", "keynote_end"].includes(speech.topic) ? "" : "min-h-[13.5rem]"}`}
                      >
                        <span className="font-semibold mb-3">
                          {speech.title ? speech.title : speakerInfo?.topic}
                        </span>
                        <div className="font-normal mb-3 text-devGray-light">
                          {["keynote_start", "keynote_end"].includes(
                            speech.topic,
                          ) ? (
                            speakerInfo?.content!
                          ) : (
                            <TruncatedText
                              text={speakerInfo?.content!}
                              maxChars={124}
                            />
                          )}
                        </div>
                      </div>{" "}
                      <footer className="bottom-0">
                        {speechSpeakers.length &&
                          speechSpeakers.map((speaker) => (
                            <div key={generateKey(speech, speaker.id)}>
                              <SpeakerCard speaker={speaker} frameId={index} />
                            </div>
                          ))}
                      </footer>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </BaseLayout>
  );
};

const SpeakerCard = ({
  speaker,
  frameId,
}: {
  speaker: Speaker;
  frameId: number;
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const modalToggle = () => setModalOpen(!modalOpen);
  return (
    <>
      <div className="text-white/90 flex items-center gap-2 mb-3 justify-between w-full">
        <Image
          src={speaker.photo!}
          alt={`Foto ${speaker.name}`}
          height={32}
          width={32}
          loading="lazy"
          className={`rounded-full`}
        />
        <div className="flex flex-col flex-grow">
          <span className="text-sm font-bold">{speaker?.name}</span>
          <span className="text-xs font-normal text-devWhite-ice">
            {speaker?.company && `${speaker?.company} - `}
            {speaker?.title}
          </span>
        </div>
        <div onClick={modalToggle} className="cursor-pointer">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.4 18L5 16.6L14.6 7H6V5H18V17H16V8.4L6.4 18Z"
              fill="#4285F4"
            />
          </svg>
        </div>
      </div>
      <SpeakerModal
        index={frameId}
        speaker={speaker!}
        modalOpen={modalOpen}
        modalToggle={modalToggle}
      />
      <div>{}</div>
    </>
  );
};

export async function getServerSideProps() {
  try {
    return {
      props: {
        speakers: await getAllSpeakers(),
        schedule: await getSchedule(),
      },
    };
  } catch (error) {
    console.error(error);
    return { props: { speakers: [] } };
  }
}

export default SchedulePage;
