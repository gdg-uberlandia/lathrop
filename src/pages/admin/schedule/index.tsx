import {
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/assets/components/ui/table";
import { useSpeakers } from "@/hooks/useSpeakers";
import { useSchedule } from "@/hooks/useSchedule";
import AdminLayout from "layouts/admin-layout";
import {
  Calendar,
  TriangleAlert,
  Pencil,
  Trash2,
  CalendarPlus,
} from "lucide-react";
import Link from "next/link";
import { Speaker } from "@/models/speaker";
import { useState } from "react";
import { useRouter } from "next/router";
import { SpeechesPath } from "@/models/schedule";

import Loading from "@/components/admin/loading-overlay";
import admin from "pages/admin";

function Speakers() {
  const router = useRouter();
  const { speakers } = useSpeakers();

  const { schedule, loading: loadingSchedule } = useSchedule();

  const [speaker, setSpeaker] = useState<Speaker | null>();
  const [dialogDeleteOpen, setDialogDeleteOpen] = useState(false);

  const handleUpdateEvaluable = (speaker: Speaker) => {
    if (!speaker) return;
    speaker.canBeEvaluated = !speaker.canBeEvaluated;
    // updateSpeaker(speaker);
  };

  const handleOpenDialogDelete = (value: Speaker) => {
    if (!value) return;
    setSpeaker(value);
    setDialogDeleteOpen(true);
  };

  const handleDelete = () => {
    if (!speaker) return;
    // removeSpeaker(speaker.id);
    setSpeaker(null);
    setDialogDeleteOpen(false);
  };

  return (
    <>
      {loadingSchedule && <Loading />}
      <div className="p-4">
        <div className="flex w-full items-center gap-2 justify-between">
          <div className="size-12 rounded-full bg-devGray-light/40 flex items-center justify-center">
            <Calendar />
          </div>
          <div className="grow">
            <h1 className="text-xl text-white/80">Programação</h1>
          </div>
          <Link
            href="#"
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
              {schedule.map((schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell className="p-3 text-white/80 font-medium">
                    {schedule.start}
                    <br />
                    {schedule.end}
                  </TableCell>

                  <TableCell className="p-3 text-white/80 font-medium">
                    {schedule.speeches.map((speech, index) => {
                      if (!speech.topic && !speech.path)
                        return <span key={index}></span>;

                      if (speech.topic && !speech.speakerSlugs) {
                        return (
                          <div key={index} className="p-3 text-white/80 ">
                            {speech.topic}
                          </div>
                        );
                      }

                      const pathStyle = {
                        [SpeechesPath.CANASTRA]: "border-devPink-dark",
                        [SpeechesPath.CURADO]: "border-devRed-dark",
                        [SpeechesPath.MINAS]: "border-devYellow-dark",
                        [SpeechesPath.TRANCA]: "border-devBlue-dark",
                      };

                      return (
                        <div
                          key={index}
                          className={`p-4 my-3 rounded-xl bg-devGray-dark`}
                        >
                          {speech.path && (
                            <div
                              className={`mb-1 px-3 py-1 rounded-2xl w-fit text-white border-1 ${pathStyle[speech.path]}`}
                            >
                              {String(SpeechesPath[speech.path])}
                            </div>
                          )}

                          <div className="flex flex-wrap gap-4">
                            {speakers
                              .filter((sp) =>
                                speech.speakerSlugs?.includes(sp.id),
                              )
                              .map((sp) => (
                                <div className="px-2 py-1" key={sp.id}>
                                  <div className="w-full mb-3">{sp.topic}</div>
                                  <span className=" text-white/40">
                                    {sp.name}
                                  </span>
                                </div>
                              ))}
                          </div>
                        </div>
                      );
                    })}
                  </TableCell>

                  <TableCell className="px-3 text-white/80 text-right">
                    <Button
                      disabled={loadingSchedule}
                      variant="secondary"
                      size="icon"
                      className="size-8 text-devGreen-dark hover:text-devGreen bg-transparent p-0"
                      onClick={() =>
                        router.push(`/admin/speakers/edit/${schedule.id}`)
                      }
                    >
                      <Pencil />
                    </Button>
                  </TableCell>
                  <TableCell className="px-3 text-white/80 text-right">
                    <Button
                      variant="secondary"
                      size="icon"
                      disabled={loadingSchedule}
                      className="size-8 text-devRed-dark hover:text-devRed bg-transparent p-0"
                      // onClick={() => handleOpenDialogDelete(schedule)}
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
    </>
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
import { updateSpeaker } from "back-features/speakers";
import { open } from "fs";

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
            dados do palestrante.
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

Speakers.layout = AdminLayout;

export default Speakers;
