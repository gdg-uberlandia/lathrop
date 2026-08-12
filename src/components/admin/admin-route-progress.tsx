import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export function AdminRouteProgress() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const start = (url: string) => {
      if (url !== router.asPath) setLoading(true);
    };
    const finish = () => setLoading(false);
    router.events.on("routeChangeStart", start);
    router.events.on("routeChangeComplete", finish);
    router.events.on("routeChangeError", finish);
    return () => {
      router.events.off("routeChangeStart", start);
      router.events.off("routeChangeComplete", finish);
      router.events.off("routeChangeError", finish);
    };
  }, [router.asPath, router.events]);

  return (
    <div
      aria-hidden={!loading}
      className={`pointer-events-none fixed inset-x-0 top-0 z-[100] h-0.5 overflow-hidden transition-opacity ${loading ? "opacity-100" : "opacity-0"}`}
    >
      <div className="h-full w-1/3 animate-[admin-route-progress_1s_ease-in-out_infinite] bg-blue-600" />
    </div>
  );
}
