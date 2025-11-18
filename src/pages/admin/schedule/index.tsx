import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/assets/components/ui/table";
import { useSchedule } from "@/hooks/useSchedule";
import { useSpeakers } from "@/hooks/useSpeakers";
import {
  Schedule,
  Speeches,
  SpeechesPath,
  SpeechTopicName,
} from "@/models/schedule";
import AdminLayout from "layouts/admin-layout";
import {
  Calendar,
  CalendarPlus,
  Pencil,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

import Loading from "@/components/admin/loading-overlay";

export default function Schedules() {
  const router = useRouter();

  const { speakers } = useSpeakers();
  const { schedule, deleteSchedule, loading } = useSchedule();

  const [scheduleObj, setScheduleObj] = useState<Schedule | null>();
  const [dialogDeleteOpen, setDialogDeleteOpen] = useState(false);

  const speakersMap = new Map(speakers.map((speaker) => [speaker.id, speaker]));

  const handleOpenDialogDelete = (value: Schedule) => {
    if (!value) return;
    setScheduleObj(value);
    setDialogDeleteOpen(true);
  };

  const handleDelete = () => {
    if (!scheduleObj) return;
    deleteSchedule(scheduleObj.id);
    setScheduleObj(null);
    setDialogDeleteOpen(false);
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
        return "Área Comunidade";
    }
  };

  function generateKey(speech: Speeches, speakerId: string) {
    return `speech-${speech.path}-speaker-${speakerId}-${
      speech.speakerSlugs
        ? speech.speakerSlugs.map((slug) => slug).join("-")
        : speech.topic
    }`;
  }

  const findSpeakers = (speeches: Speeches) => {
    const speakers = speeches.speakerSlugs
      ? speeches.speakerSlugs.map((slug) => speakersMap.get(slug)!)
      : [];
    return speakers;
  };

  return (
    <AdminLayout>
      {loading && <Loading />}
      <div className="p-4">
        <div className="flex w-full items-center gap-2 justify-between">
          <div className="size-12 rounded-full bg-devGray-light/40 flex items-center justify-center">
            <Calendar />
          </div>
          <div className="grow">
            <h1 className="text-xl text-white/80">Programação</h1>
          </div>
          <Link
            href="schedule/add-schedule"
            className="text-white bg-devBlue-dark border-1 border-devBlue-dark hover:border-1 hover:border-white/60 size-12 flex items-center justify-center rounded-full"
          >
            <CalendarPlus />
          </Link>
        </div>

        <div className="mt-12">
          <Table className="rounded-xl overflow-hidden border-collapse">
            <TableCaption />
            <TableHeader className="bg-devGray-dark text-white">
              <TableRow>
                <TableHead className="p-3 text-white ">Início</TableHead>
                <TableHead className="p-3 text-white ">Título</TableHead>
                <TableHead className="p-3 text-white text-center"></TableHead>
                <TableHead className="p-3 text-white text-center"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedule.map((scheduleItem) => (
                <TableRow key={scheduleItem.id}>
                  <TableCell className="p-3 text-white/80 font-medium">
                    {scheduleItem.start}
                    <br />
                    {scheduleItem.end}
                  </TableCell>

                  <TableCell className="p-3 text-white/80 font-medium">
                    {scheduleItem.speeches.map((speech, index) => {
                      if (!speech.topic && !speech.path)
                        return <span key={index}></span>;

                      if (speech.topic && !speech.speakerSlugs) {
                        return (
                          <div
                            key={index}
                            className="p-3 text-white/80 my-3 rounded-2xl bg-devGray-dark relative grid grid-cols-12"
                          >
                            {
                              SpeechTopicName[
                                speech.topic as keyof typeof SpeechTopicName
                              ]
                            }
                          </div>
                        );
                      }

                      const pathStyle = {
                        [SpeechesPath.CANASTRA]:
                          "border-devPink-dark !outline-devPink-dark",
                        [SpeechesPath.CURADO]:
                          "border-devRed-dark !outline-devRed-dark",
                        [SpeechesPath.MINAS]:
                          "border-devYellow-dark !outline-devYellow-dark",
                        [SpeechesPath.TRANCA]:
                          "border-devBlue-dark !outline-devBlue-dark",
                        [SpeechesPath.COMMUNITY]:
                          "border-devGreen-dark !outline-devGreen-dark",
                      };
                      const speechSpeakers = findSpeakers(speech);

                      const speakerInfo = speechSpeakers.find(
                        (speaker) => speaker && speaker.tech,
                      );

                      return (
                        <div
                          key={index}
                          className={`my-3 rounded-2xl bg-devGray-dark relative grid grid-cols-12`}
                        >
                          {speech.path && (
                            <div
                              className={`flex col-span-1 min-h-20 h-full rounded-2xl border-1 items-center justify-center ${pathStyle[speech.path]}`}
                            >
                              <span
                                className={`px-3 py-2 -rotate-90 text-center`}
                              >
                                {getPathName(SpeechesPath[speech.path])}
                              </span>
                            </div>
                          )}
                          <div className="flex flex-col col-span-11 py-3 px-4">
                            <span className="font-semibold text-sm mb-3">
                              {speakerInfo?.topic}
                            </span>
                            <section>
                              {speechSpeakers.length > 0 ? (
                                speechSpeakers.map(
                                  (speaker) =>
                                    speaker && (
                                      <div
                                        key={generateKey(speech, speaker.id)}
                                        className="text-white/90 flex items-center gap-2 mb-3"
                                      >
                                        <Image
                                          src={speaker.photo!}
                                          alt={`Foto ${speaker.name}`}
                                          height={32}
                                          width={32}
                                          loading="lazy"
                                          className={`rounded-full outline outline-offset-2 outline-1 outline-white ${pathStyle[speech.path!]}`}
                                        />
                                        {speaker?.name}
                                      </div>
                                    ),
                                )
                              ) : (
                                <span>cavou</span>
                              )}
                            </section>
                          </div>
                        </div>
                      );
                    })}
                  </TableCell>

                  <TableCell className="px-3 text-white/80 text-right">
                    <Button
                      disabled={loading}
                      variant="secondary"
                      size="icon"
                      className="size-8 text-devGreen-dark hover:text-devGreen bg-transparent p-0"
                      onClick={() =>
                        router.push(`/admin/schedule/edit/${scheduleItem.id}`)
                      }
                    >
                      <Pencil />
                    </Button>
                  </TableCell>
                  <TableCell className="px-3 text-white/80 text-right">
                    <Button
                      variant="secondary"
                      size="icon"
                      disabled={loading}
                      className="size-8 text-devRed-dark hover:text-devRed bg-transparent p-0"
                      onClick={() => handleOpenDialogDelete(scheduleItem)}
                    >
                      <Trash2 />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <DeleteDialog
        open={dialogDeleteOpen}
        onClose={() => setDialogDeleteOpen(false)}
        onConfirm={handleDelete}
      />
    </AdminLayout>
  );
}

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/assets/components/ui/alert-dialog";
import { Button } from "@/assets/components/ui/button";
import Image from "next/image";

function DeleteDialog({
  open,
  onConfirm,
  onClose,
}: {
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const handleCancel = () => {
    onClose();
  };
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="border-1 border-white/40 p-5 !rounded-xl">
        <AlertDialogHeader>
          <AlertDialogTitle>
            <div className="size-12 rounded-full bg-devRed-dark text-devRed-light flex items-center justify-center mx-auto mb-4">
              <TriangleAlert />
            </div>
            Tem certeza que deseja realizar a exclusão?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. Isso irá remover permanentemente os
            dados do registro.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex grow gap-3">
          <AlertDialogCancel
            onClick={handleCancel}
            className="m-0 w-full rounded-xl text-white"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="m-0 w-full rounded-xl text-white bg-devRed-dark hover:bg-devRed"
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
