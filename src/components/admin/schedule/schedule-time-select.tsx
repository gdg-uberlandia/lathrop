import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/assets/components/ui/select";
const START_MINUTES = 8 * 60;
const END_MINUTES = 21 * 60;
const TIME_OPTIONS = Array.from(
  { length: (END_MINUTES - START_MINUTES) / 10 + 1 },
  (_, index) => {
    const totalMinutes = START_MINUTES + index * 10;
    const hour = Math.floor(totalMinutes / 60);
    const minute = totalMinutes % 60;
    return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
  },
);

export function ScheduleTimeSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="bg-white">
        <SelectValue placeholder="Selecione o horário" />
      </SelectTrigger>
      <SelectContent className="max-h-72">
        {TIME_OPTIONS.map((time) => (
          <SelectItem key={time} value={time}>
            {time}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
