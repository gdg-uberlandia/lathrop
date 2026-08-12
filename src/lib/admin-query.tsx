import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

import { AdminApiError } from "@/lib/admin-api/errors";
import {
  AdminFeedback,
  notifyAdminFeedback,
} from "@/components/admin/admin-feedback";

function shouldRetry(failureCount: number, error: unknown) {
  if (
    error instanceof AdminApiError &&
    (error.isUnauthorized || error.isForbidden || error.isValidationError)
  ) {
    return false;
  }

  return failureCount < 1;
}

export function AdminQueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        mutationCache: new MutationCache({
          onError: (error) =>
            notifyAdminFeedback({
              type: "error",
              message:
                error instanceof Error
                  ? error.message
                  : "Não foi possível concluir a operação",
            }),
          onSuccess: () =>
            notifyAdminFeedback({
              type: "success",
              message: "Alterações salvas com sucesso",
            }),
        }),
        defaultOptions: {
          queries: {
            gcTime: 10 * 60 * 1_000,
            refetchOnWindowFocus: false,
            retry: shouldRetry,
            staleTime: 60 * 1_000,
          },
          mutations: {
            retry: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <AdminFeedback />
    </QueryClientProvider>
  );
}

export const adminQueryKeys = {
  dashboard: ["admin", "dashboard"] as const,
  companies: ["admin", "companies"] as const,
  missions: ["admin", "missions"] as const,
  raffles: ["admin", "raffles"] as const,
  profiles: ["admin", "profiles"] as const,
  schedule: ["admin", "schedule"] as const,
  scheduleWorkspace: ["admin", "schedule", "workspace"] as const,
  schedulePublication: ["admin", "schedule", "publication"] as const,
  speakers: ["admin", "speakers"] as const,
  sponsors: ["admin", "sponsors"] as const,
  talks: ["admin", "talks"] as const,
  tags: ["admin", "tags"] as const,
};

export async function resolveAdminAction<T>(action: () => Promise<T>) {
  try {
    return await action();
  } catch {
    return null;
  }
}
