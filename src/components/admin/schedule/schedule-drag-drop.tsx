import { useDraggable, useDroppable } from "@dnd-kit/core";
import { GripVertical } from "lucide-react";
import { CSSProperties, ReactNode, useId } from "react";
import { cn } from "@/assets/lib/utils";
import { ScheduleEntry } from "@/contracts/schedule";

export function ScheduleDraggable({
  item,
  title,
  disabled,
  children,
}: {
  item: ScheduleEntry;
  title: string;
  disabled: boolean;
  children: ReactNode;
}) {
  const dragId = useId();
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: dragId,
    data: { item },
    disabled,
  });
  return (
    <div
      ref={setNodeRef}
      className={cn("relative h-full min-w-0", isDragging && "opacity-40")}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        disabled={disabled}
        aria-label={`Mover ${title}`}
        title="Arraste para mover ou trocar de horário"
        className="mb-1 flex touch-none items-center gap-1 rounded p-1 text-xs text-slate-500 hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50"
      >
        <GripVertical className="size-4 shrink-0" /> Mover
      </button>
      {children}
    </div>
  );
}

export type ScheduleDropTarget = {
  startTime: string;
  endTime: string;
  track: ScheduleEntry["track"];
  item?: ScheduleEntry;
};
export function ScheduleDroppable({
  id,
  target,
  disabled,
  className,
  style,
  children,
}: {
  id: string;
  target: ScheduleDropTarget;
  disabled: boolean;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: { target },
    disabled,
  });
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        className,
        "min-w-0",
        isOver && "bg-blue-50 ring-2 ring-inset ring-blue-400",
      )}
    >
      {children}
    </div>
  );
}
