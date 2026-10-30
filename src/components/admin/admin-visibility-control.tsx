import { Switch } from "@/assets/components/ui/switch";
import { cn } from "@/assets/lib/utils";
import { Eye, EyeOff } from "lucide-react";

type AdminVisibilityControlProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
  description: string;
  activeLabel?: string;
  inactiveLabel?: string;
  disabled?: boolean;
  className?: string;
};

export function AdminVisibilityControl({
  checked,
  onCheckedChange,
  label,
  description,
  activeLabel = "Ativa",
  inactiveLabel = "Inativa",
  disabled,
  className,
}: AdminVisibilityControlProps) {
  const Icon = checked ? Eye : EyeOff;

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 rounded-xl border p-4 transition-colors",
        checked
          ? "!border-emerald-200 bg-emerald-50/60"
          : "!border-slate-200 bg-slate-50",
        className,
      )}
    >
      <div className="flex min-w-0 items-start gap-3">
        <span
          className={cn(
            "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg",
            checked
              ? "bg-emerald-100 text-emerald-700"
              : "bg-slate-200 text-slate-500",
          )}
        >
          <Icon className="size-4" />
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-800">{label}</p>
          <p className="mt-0.5 text-xs leading-5 text-slate-500">
            {description}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <span
          className={cn(
            "text-xs font-semibold",
            checked ? "text-emerald-700" : "text-slate-500",
          )}
        >
          {checked ? activeLabel : inactiveLabel}
        </span>
        <Switch
          checked={checked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
          aria-label={`${label}: ${checked ? activeLabel : inactiveLabel}`}
          className="data-[state=checked]:!bg-emerald-600 data-[state=unchecked]:!bg-slate-300"
        />
      </div>
    </div>
  );
}
