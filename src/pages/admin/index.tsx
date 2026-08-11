import { useSpeakers } from "@/hooks/useSpeakers";
import { IconLoader2 } from "@tabler/icons-react";
import { useSponsors } from "@/hooks/useSponsors";
import DroidShirt from "@/assets/images/droid-shirt.png";
import Image from "next/image";

function AdminIndex() {
  const { speakers, loading: loadingSpeakers } = useSpeakers();
  const { sponsors, sponsorship, loading: loadingSponsors } = useSponsors();

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
              <div className="text-md ">
                {speakers.length > 1 ? "palestrantes" : "palestrante"}
              </div>
            </>
          )}
        </div>

        <div className="bg-muted/50 aspect-video rounded-xl flex items-center justify-center flex-col border-1 border-white/10">
          {loadingSponsors ? (
            <>
              <IconLoader2 className="size-14 animate-spin text-devBlue-dark" />
            </>
          ) : (
            <>
              <div className="text-7xl font-bold">{sponsors.length}</div>
              <div className="text-md ">
                {sponsors.length > 1 ? "patrocinadores" : "patrocinador"}
              </div>
            </>
          )}
        </div>
        <div className="bg-muted/50 aspect-video rounded-xl flex items-center justify-center flex-col border-1 border-white/10">
          {loadingSponsors ? (
            <>
              <IconLoader2 className="size-14 animate-spin text-devBlue-dark" />
            </>
          ) : (
            <>
              <div className="font-bold text-7xl">{sponsorship}k</div>
              <div className="text-md ">R$ em patrocínio</div>
            </>
          )}
        </div>
      </div>
      <div className="bg-muted/50 aspect-video min-h-[100vh] flex-1 rounded-xl md:min-h-min">
        {loadingSponsors || loadingSpeakers ? (
          <div className="w-full justify-center relative flex h-full items-center">
            <IconLoader2 className="size-14 animate-spin text-devBlue-dark" />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <Image
              alt="Imagem do DevFest triângulo de 2024"
              src={DroidShirt}
              priority
              style={{
                objectFit: "contain",
                maxWidth: "300px",
                height: "auto",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminIndex;
