import { useSpeakers } from "@/hooks/useSpeakers";
import AdminLayout from "layouts/admin-layout";
import { IconLoader2 } from "@tabler/icons-react";

function AdminIndex() {
  const { speakers, loading: loadingSpeakers } = useSpeakers();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="bg-muted/50 aspect-video rounded-xl flex items-center justify-center flex-col border-1 border-white/10">
          {loadingSpeakers ? (
            <>
              <IconLoader2 className="size-14 animate-spin text-devBlue-dark" />
            </>
          ) : (
            <>
              <div className="text-7xl font-bold">{speakers.length}</div>
              <div className="text-md ">palestrantes</div>
            </>
          )}
        </div>

        <div className="bg-muted/50 aspect-video rounded-xl flex items-center justify-center flex-col border-1 border-white/10">
          <div className="text-7xl font-bold">4</div>
          <div className="text-md ">patrocinadores</div>
        </div>
        <div className="bg-muted/50 aspect-video rounded-xl flex items-center justify-center flex-col border-1 border-white/10">
          <div className="text-7xl font-bold">1200</div>
          <div className="text-md ">participantes</div>
        </div>
      </div>
      <div className="bg-muted/50 aspect-video min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
    </div>
  );
}

AdminIndex.layout = AdminLayout;

export default AdminIndex;
