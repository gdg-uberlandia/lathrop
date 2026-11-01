import type { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { adminPathWithReturnTo } from "@/lib/admin-return-path";
export function ParticipantAnalyticsLink({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  const router = useRouter();
  return (
    <Link
      href={adminPathWithReturnTo(
        `/admin/pokedex/participants/${encodeURIComponent(id)}`,
        router.asPath,
      )}
      className="text-blue-700 hover:underline"
    >
      {children}
    </Link>
  );
}
