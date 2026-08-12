import { useRouter } from "next/router";
import { useEffect } from "react";

const MESSAGE = "Você possui alterações não salvas. Deseja sair mesmo assim?";

export function useUnsavedChanges(enabled: boolean) {
  const router = useRouter();

  useEffect(() => {
    if (!enabled) return;

    const beforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = MESSAGE;
    };
    const beforeRouteChange = () => {
      if (window.confirm(MESSAGE)) return;
      router.events.emit("routeChangeError");
      throw new Error("Route change aborted: unsaved form");
    };

    window.addEventListener("beforeunload", beforeUnload);
    router.events.on("routeChangeStart", beforeRouteChange);
    return () => {
      window.removeEventListener("beforeunload", beforeUnload);
      router.events.off("routeChangeStart", beforeRouteChange);
    };
  }, [enabled, router.events]);
}
