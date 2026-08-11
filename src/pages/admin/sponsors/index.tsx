import { Button } from "@/assets/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/assets/components/ui/table";
import DeleteDialog from "@/components/admin/delete-dialog";
import Loading from "@/components/admin/loading-overlay";
import { useSponsors } from "@/hooks/useSponsors";
import { SponsorCategoryDisplayName } from "@/models/sponsor";
import { DollarSign, HandCoins, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

type TableRowType = {
  levelName: string;
  level: string;
  name: string;
  url: string;
  id: string;
};

export default function Sponsors() {
  const router = useRouter();
  const { sponsors, loading, removeSponsor } = useSponsors();

  const [sponsor, setSponsor] = useState<TableRowType | null>();
  const [dialogDeleteOpen, setDialogDeleteOpen] = useState(false);

  const tableRows: TableRowType[] = sponsors.flatMap((group) =>
    group.items.map(
      (item) =>
        ({
          level: item.level,
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
    removeSponsor(sponsor.id);
    setSponsor(null);
    setDialogDeleteOpen(false);
  };

  const getLevelColor = (levelName: string) => {
    return (
      {
        superior: "border-1 border-devBlue-dark text-white",
        diamond: "border-1 border-blue-300 text-white",
        gold: "border-1 border-yellow-500 text-white",
        silver: "border-1 border-gray-300 text-white",
        bronze: "border-1 border-orange-400 text-white",
        iron: "border-1 border-gray-500 text-white",
        ruby: "border-1 border-red-500 text-white",
        support: "border-1 border-teal-500 text-white",
      }[levelName] || "border-1 border-devGreen-light text-white"
    );
  };

  const getSponsorLevel = (levelName: string) => {
    return Object.entries(SponsorCategoryDisplayName).find(
      ([key]) => key === levelName,
    )?.[1];
  };

  return (
    <>
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
            href="/admin/sponsors/add-sponsor"
            className="text-white bg-devBlue-dark border-1 border-devBlue-dark hover:border-1 hover:border-white/60 size-12 flex items-center justify-center rounded-full"
          >
            <HandCoins />
          </Link>
        </div>

        <div className="mt-12 overflow-x-auto rounded-xl">
          <Table className="rounded-xl overflow-hidden border-collapse">
            <TableCaption />
            <TableHeader className="bg-devGray-dark text-white">
              <TableRow>
                <TableHead className="p-3 text-white w-24 text-center">
                  Level
                </TableHead>
                <TableHead className="p-3 text-white ">Nome</TableHead>
                <TableHead className="p-3 text-white text-center w-14"></TableHead>
                <TableHead className="p-3 text-white text-center w-14"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableRows.map((sponsor) => (
                <TableRow key={sponsor.id}>
                  <TableCell className="p-3 text-white/80 font-medium text-center">
                    <span
                      className={`py-1 px-2 text-xs rounded-2xl ${getLevelColor(sponsor.level)}`}
                    >
                      {getSponsorLevel(sponsor.level)}
                    </span>
                  </TableCell>
                  <TableCell className="p-3 text-white/80 font-bold">
                    {sponsor.name}
                  </TableCell>
                  <TableCell className="px-3 text-white/80 text-right">
                    <Button
                      disabled={loading}
                      variant="secondary"
                      size="icon"
                      className="size-8 text-devGreen-dark hover:text-devGreen bg-transparent p-0"
                      onClick={() =>
                        router.push(
                          `/admin/sponsors/edit/${sponsor.levelName}?id=${sponsor.id}`,
                        )
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
    </>
  );
}
