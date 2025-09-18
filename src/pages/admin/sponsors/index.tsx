import {
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/assets/components/ui/table";
import AdminLayout from "layouts/admin-layout";
import {
  DollarSign,
  TriangleAlert,
  Pencil,
  Trash2,
  HandCoins,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";

import Loading from "@/components/admin/loading-overlay";
import { useSponsors } from "@/hooks/useSponsors";

type TableRowType = {
  levelName: string;
  level: string;
  name: string;
  url: string;
  id: string;
};

export default function Sponsors() {
  const router = useRouter();
  const { sponsors, error, loading, removeSponsor } = useSponsors();

  const [sponsor, setSponsor] = useState<TableRowType | null>();
  const [dialogDeleteOpen, setDialogDeleteOpen] = useState(false);

  const tableRows: TableRowType[] = sponsors.flatMap((group) =>
    group.items.map(
      (item) =>
        ({
          levelName: group.id,
          level: group.name,
          name: item.name,
          url: item.url,
          id: item.id,
        }) as TableRowType,
    ),
  );

  const handleOpenDialogDelete = (value: TableRowType) => {
    if (!value) return;
    setSponsor(value);
    setDialogDeleteOpen(true);
  };

  const handleDelete = () => {
    if (!sponsor) return;
    removeSponsor({ sponsorId: sponsor.id, sponsorLevel: sponsor.levelName });
    setSponsor(null);
    setDialogDeleteOpen(false);
  };

  return (
    <AdminLayout>
      {loading && <Loading />}
      <div className="p-4">
        <div className="flex w-full items-center gap-2 justify-between">
          <div className="size-12 rounded-full bg-devGray-light/40 flex items-center justify-center">
            <DollarSign />
          </div>
          <div className="grow">
            <h1 className="text-xl text-white/80">Patrocinadores</h1>
          </div>
          <Link
            href="/admin/sponsors/add-sponsors"
            className="text-white bg-devBlue-dark border-1 border-devBlue-dark hover:border-1 hover:border-white/60 size-12 flex items-center justify-center rounded-full"
          >
            <HandCoins />
          </Link>
        </div>

        <div className="mt-12">
          <Table className="rounded-xl overflow-hidden border-collapse">
            <TableCaption />
            <TableHeader className="bg-devGray-dark text-white">
              <TableRow>
                <TableHead className="p-3 text-white w-24">Level</TableHead>
                <TableHead className="p-3 text-white ">Nome</TableHead>
                <TableHead className="p-3 text-white text-center w-14"></TableHead>
                <TableHead className="p-3 text-white text-center w-14"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableRows.map((sponsor) => (
                <TableRow key={sponsor.id}>
                  <TableCell className="p-3 text-white/80 font-medium">
                    {sponsor.level}
                  </TableCell>
                  <TableCell className="p-3 text-white/80 ">
                    {sponsor.name}
                  </TableCell>
                  <TableCell className="px-3 text-white/80 text-right">
                    <Button
                      disabled={loading}
                      variant="secondary"
                      size="icon"
                      className="size-8 text-devGreen-dark hover:text-devGreen bg-transparent p-0"
                      onClick={() =>
                        router.push(`/admin/sponsors/edit/${sponsor.id}`)
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
                      onClick={() => handleOpenDialogDelete(sponsor)}
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
            dados de nossos registros do evento.
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
