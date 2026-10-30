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
    const originalPush = router.push.bind(router);
    const originalReplace = router.replace.bind(router);
    const guardedPush: typeof router.push = (...args) =>
      window.confirm(MESSAGE) ? originalPush(...args) : Promise.resolve(false);
    const guardedReplace: typeof router.replace = (...args) =>
      window.confirm(MESSAGE)
        ? originalReplace(...args)
        : Promise.resolve(false);

    router.push = guardedPush;
    router.replace = guardedReplace;
    router.beforePopState(() => window.confirm(MESSAGE));

    window.addEventListener("beforeunload", beforeUnload);
    return () => {
      window.removeEventListener("beforeunload", beforeUnload);
      if (router.push === guardedPush) router.push = originalPush;
      if (router.replace === guardedReplace) router.replace = originalReplace;
      router.beforePopState(() => true);
    };
  }, [enabled, router]);
}
