import { CheckCircle2, X, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

export const ADMIN_FEEDBACK_EVENT = "admin-feedback";

export function notifyAdminFeedback(detail: {
  type: "success" | "error";
  message: string;
}) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(ADMIN_FEEDBACK_EVENT, { detail }));
  }
}

export function AdminFeedback() {
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    const listener = (event: Event) => {
      const customEvent = event as CustomEvent<NonNullable<typeof feedback>>;
      setFeedback(customEvent.detail);
    };
    window.addEventListener(ADMIN_FEEDBACK_EVENT, listener);
    return () => window.removeEventListener(ADMIN_FEEDBACK_EVENT, listener);
  }, []);

  useEffect(() => {
    if (!feedback) return;
    const timeout = window.setTimeout(() => setFeedback(null), 4_000);
    return () => window.clearTimeout(timeout);
  }, [feedback]);

  if (!feedback) return null;
  const Icon = feedback.type === "success" ? CheckCircle2 : XCircle;

  return (
    <div
      role={feedback.type === "error" ? "alert" : "status"}
      className="fixed right-4 top-20 z-50 flex max-w-sm items-start gap-3 rounded-xl border border-white/15 bg-devGray-dark p-4 text-white shadow-2xl"
    >
      <Icon
        className={
          feedback.type === "success" ? "text-emerald-300" : "text-red-300"
        }
      />
      <p className="flex-1 text-sm">{feedback.message}</p>
      <button aria-label="Fechar mensagem" onClick={() => setFeedback(null)}>
        <X className="size-4 text-white/60" />
      </button>
    </div>
  );
}
