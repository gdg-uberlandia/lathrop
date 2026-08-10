import { useId, useState } from "react";
import clsx from "clsx";
import { Minus, Plus } from "lucide-react";

interface FaqItemProps {
  title: string;
  content: React.ReactNode;
}

export const FaqItem = ({ title, content }: FaqItemProps) => {
  const [expanded, setExpanded] = useState(false);
  const contentId = useId();

  return (
    <article
      className={clsx(
        "rounded-2xl border p-6 transition-colors duration-200 sm:px-16 motion-reduce:transition-none",
        expanded ? "border-devBlue-dark" : "border-devGray",
      )}
    >
      <div className="flex items-center justify-between gap-4 text-devWhite-ice">
        <p className="mb-0 text-left font-medium">{title}</p>

        <button
          type="button"
          className="inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-1 text-devWhite-ice transition-colors duration-200 hover:bg-devBlue-dark/10 hover:text-devBlue-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-devBlue-dark motion-reduce:transition-none"
          aria-label={expanded ? "Recolher resposta" : "Expandir resposta"}
          aria-expanded={expanded}
          aria-controls={contentId}
          onClick={() => {
            setExpanded((prev) => !prev);
          }}
        >
          {expanded ? (
            <Minus className="size-6" />
          ) : (
            <Plus className="size-6" />
          )}
        </button>
      </div>
      <div
        id={contentId}
        className={clsx(
          "grid transition-[grid-template-rows] duration-200 ease-in-out motion-reduce:transition-none",
          expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden text-left text-white/60 [&_a]:text-devBlue-dark [&_a]:underline [&_li]:ml-5 [&_li]:list-disc [&_p]:mb-0 [&_p]:mt-6">
          {typeof content === "string" ? <p>{content}</p> : content}
        </div>
      </div>
    </article>
  );
};
