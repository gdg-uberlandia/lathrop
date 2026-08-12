import { Button } from "@/assets/components/ui/button";
import { Checkbox } from "@/assets/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/assets/components/ui/form";
import { Input } from "@/assets/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/assets/components/ui/select";
import {
  ScheduleEntry,
  ScheduleInput,
  SCHEDULE_TRACKS,
  scheduleInputSchema,
} from "@/contracts/schedule";
import { useTalks } from "@/hooks/useTalks";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import { zodResolver } from "@hookform/resolvers/zod";
import { Resolver, useForm } from "react-hook-form";
import { useState } from "react";
import { useMemo } from "react";
import { v4 as uuidv4 } from "uuid";

const timeValue = (value: Date) =>
  new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "America/Sao_Paulo",
  }).format(value);
export function ScheduleForm({
  schedule,
  initialValues,
  loading,
  onSubmit,
}: {
  schedule?: ScheduleEntry;
  initialValues?: Partial<
    Pick<ScheduleInput, "startTime" | "endTime" | "track">
  > & { type?: "talk" | "opening" | "break" | "closing" };
  loading?: boolean;
  onSubmit: (value: ScheduleInput) => unknown;
}) {
  const { talks } = useTalks();
  const currentTalkId =
    schedule?.activity.type === "break" ? null : schedule?.activity.talkId;
  const availableTalks = useMemo(
    () => talks.filter((talk) => talk.isActive || talk.id === currentTalkId),
    [currentTalkId, talks],
  );
  const [selectedType, setSelectedType] = useState<
    "talk" | "opening" | "break" | "closing"
  >(schedule?.activity.type ?? initialValues?.type ?? "opening");
  const form = useForm<ScheduleInput>({
    resolver: zodResolver(scheduleInputSchema) as Resolver<ScheduleInput>,
    defaultValues: schedule
      ? {
          id: schedule.id,
          startTime: timeValue(schedule.startAt),
          endTime: timeValue(schedule.endAt),
          track: schedule.track,
          activity: schedule.activity,
          active: schedule.active,
        }
      : {
          id: uuidv4(),
          startTime: initialValues?.startTime ?? "08:00",
          endTime: initialValues?.endTime ?? "09:00",
          track:
            initialValues?.type === "talk"
              ? (initialValues.track ?? "MINAS")
              : null,
          activity:
            initialValues?.type === "break"
              ? { type: "break", title: "Coffee-break" }
              : {
                  type: initialValues?.type ?? "opening",
                  talkId: availableTalks[0]?.id ?? "",
                },
          active: true,
        },
  });
  useUnsavedChanges(form.formState.isDirty && !form.formState.isSubmitting);
  const changeType = (value: "talk" | "opening" | "break" | "closing") =>
    form.setValue(
      "activity",
      value === "break"
        ? { type: "break", title: "Coffee-break" }
        : { type: value, talkId: availableTalks[0]?.id ?? "" },
      { shouldDirty: true, shouldValidate: true },
    );
  const handleTypeChange = (
    value: "talk" | "opening" | "break" | "closing",
  ) => {
    setSelectedType(value);
    changeType(value);
    form.setValue("track", value === "talk" ? "MINAS" : null, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-6 rounded-2xl border border-white/10 bg-devGray-dark/20 p-4 md:grid-cols-8 md:p-6"
      >
        <div className="md:col-span-8">
          <h2 className="font-semibold text-slate-900">Item da programação</h2>
          <p className="mt-1 text-sm text-slate-500">
            Palestras pertencem a uma trilha. Abertura, intervalo e encerramento
            são atividades gerais, sem trilha.
          </p>
        </div>
        <FormItem className="md:col-span-3">
          <FormLabel>Tipo</FormLabel>
          <Select value={selectedType} onValueChange={handleTypeChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="talk">Palestra</SelectItem>
              <SelectItem value="opening">Abertura</SelectItem>
              <SelectItem value="break">Intervalo</SelectItem>
              <SelectItem value="closing">Encerramento</SelectItem>
            </SelectContent>
          </Select>
        </FormItem>
        {selectedType !== "break" ? (
          <FormField
            name="activity.talkId"
            control={form.control}
            render={({ field }) => (
              <FormItem className="md:col-span-5">
                <FormLabel>
                  {selectedType === "talk"
                    ? "Palestra"
                    : selectedType === "opening"
                      ? "Palestra de abertura"
                      : "Palestra de encerramento"}
                </FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTalks.map((talk) => (
                      <SelectItem key={talk.id} value={talk.id}>
                        {talk.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <FormField
            name="activity.title"
            control={form.control}
            render={({ field }) => (
              <FormItem className="md:col-span-5">
                <FormLabel>Título</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {(["startTime", "endTime"] as const).map((name) => (
          <FormField
            key={name}
            name={name}
            control={form.control}
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>
                  {name === "startTime" ? "Início" : "Término"}
                </FormLabel>
                <FormControl>
                  <Input
                    type="time"
                    step={900}
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        {selectedType === "talk" && (
          <FormField
            name="track"
            control={form.control}
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Trilha</FormLabel>
                <Select
                  value={field.value ?? undefined}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {SCHEDULE_TRACKS.map((track) => (
                      <SelectItem key={track.value} value={track.value}>
                        {track.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          name="active"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex items-center gap-3 md:col-span-8">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(value) => field.onChange(value === true)}
                />
              </FormControl>
              <FormLabel>Exibir na programação</FormLabel>
            </FormItem>
          )}
        />
        <div className="sticky bottom-3 z-10 flex gap-3 rounded-xl border bg-white/95 p-3 shadow-xl md:col-span-8 md:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => history.back()}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={loading || form.formState.isSubmitting}
            className="admin-primary-action !bg-blue-600"
          >
            {schedule ? "Salvar alterações" : "Adicionar à programação"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
