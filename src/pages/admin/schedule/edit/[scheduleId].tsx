import Loading from "@/components/admin/loading-overlay";
import { ScheduleForm } from "@/components/admin/schedule/schedule-form";
import { ScheduleFormValues } from "@/components/admin/schedule/schedule-schema";
import { useSchedule } from "@/hooks/useSchedule";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EditSchedulePage() {
  const router = useRouter();
  const { loading, readSchedule, updateSchedule } = useSchedule();
  const { scheduleId } = router.query;
  const [schedule, setSchedule] = useState<ScheduleFormValues | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (scheduleId) {
        const data = await readSchedule(String(scheduleId));
        if (data) {
          setSchedule(data);
        } else setSchedule(null);
      }
    };
    fetchData();
  }, [scheduleId, readSchedule]);

  return (
    <>
      {loading && <Loading />}
      <div className="p-4">
        <div className="flex w-full items-center gap-2 justify-between">
          <Link
            href="/admin/schedule"
            className="text-white size-12 bg-devGray-light/40 flex items-center justify-center bg-devBlue-dark border-1 border-white/5 hover:border-1 hover:border-devBlue-dark hover:!text-devBlue-dark rounded-full"
          >
            <ChevronLeft />
          </Link>
          <div className="grow">
            <h1 className="text-xl text-white/80">Edição de Cronograma</h1>
          </div>
        </div>

        <div className="mt-12 flex flex-col lg:flex-row lg:justify-center lg:items-start gap-8">
          <div className="w-full max-w-[900px] mx-auto">
            {!schedule && !loading ? (
              <h2>Cronograma não encontrado</h2>
            ) : (
              schedule && (
                <div>
                  <ScheduleForm
                    onSubmit={updateSchedule}
                    loading={loading}
                    schedule={schedule}
                    editing
                  />
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
}
