import { Button } from "@/assets/components/ui/button";
import { AdminVisibilityControl } from "@/components/admin/admin-visibility-control";
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
import { ScheduleTimeSelect } from "./schedule-time-select";

const timeValue = (value: Date) =>
  new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "America/Sao_Paulo",
  }).format(value);
type ScheduleActivityType =
  | "talk"
  | "opening"
  | "opening_keynote"
  | "break"
  | "closing"
  | "closing_keynote";
type LinkedActivityType = "talk" | "opening_keynote" | "closing_keynote";
const isLinkedActivity = (
  value: ScheduleActivityType,
): value is LinkedActivityType =>
  value === "talk" ||
  value === "opening_keynote" ||
  value === "closing_keynote";
export function ScheduleForm({
  schedule,
  initialValues,
  loading,
  onSubmit,
}: {
  schedule?: ScheduleEntry;
  initialValues?: Partial<
    Pick<ScheduleInput, "startTime" | "endTime" | "track">
  > & { type?: ScheduleActivityType };
  loading?: boolean;
  onSubmit: (value: ScheduleInput) => unknown;
}) {
  const { talks } = useTalks();
  const currentTalkId =
    schedule?.activity && "talkId" in schedule.activity
      ? schedule.activity.talkId
      : null;
  const [selectedType, setSelectedType] = useState<ScheduleActivityType>(
    schedule?.activity.type ?? initialValues?.type ?? "opening",
  );
  const availableTalks = useMemo(
    () =>
      talks.filter((talk) => {
        if (!talk.isActive && talk.id !== currentTalkId) return false;
        if (
          selectedType === "opening_keynote" ||
          selectedType === "closing_keynote"
        )
          return talk.format === "keynote";
        return isLinkedActivity(selectedType);
      }),
    [currentTalkId, selectedType, talks],
  );
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
          activity: ["opening", "break", "closing"].includes(
            initialValues?.type ?? "opening",
          )
            ? {
                type: (initialValues?.type ?? "opening") as
                  | "opening"
                  | "break"
                  | "closing",
                title:
                  initialValues?.type === "break"
                    ? "Coffee-break"
                    : initialValues?.type === "closing"
                      ? "Encerramento"
                      : "Abertura",
              }
            : {
                type: initialValues?.type as
                  | "talk"
                  | "opening_keynote"
                  | "closing_keynote",
                talkId: availableTalks[0]?.id ?? "",
              },
          active: true,
        },
  });
  useUnsavedChanges(form.formState.isDirty && !form.formState.isSubmitting);
  const talkForType = (value: LinkedActivityType) =>
    talks.find((talk) => {
      if (!talk.isActive && talk.id !== currentTalkId) return false;
      if (value === "opening_keynote" || value === "closing_keynote")
        return talk.format === "keynote";
      return true;
    })?.id ?? "";
  const changeType = (value: ScheduleActivityType) =>
    form.setValue(
      "activity",
      !isLinkedActivity(value)
        ? {
            type: value as "opening" | "break" | "closing",
            title:
              value === "break"
                ? "Coffee-break"
                : value === "closing"
                  ? "Encerramento"
                  : "Abertura",
          }
        : { type: value, talkId: talkForType(value) },
      { shouldDirty: true, shouldValidate: true },
    );
  const handleTypeChange = (value: ScheduleActivityType) => {
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
            Palestras pertencem a uma trilha. Aberturas, intervalos,
            encerramentos e keynotes não possuem trilha.
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
              <SelectItem value="opening_keynote">
                Keynote de abertura
              </SelectItem>
              <SelectItem value="break">Intervalo</SelectItem>
              <SelectItem value="closing">Encerramento</SelectItem>
              <SelectItem value="closing_keynote">
                Keynote de encerramento
              </SelectItem>
            </SelectContent>
          </Select>
        </FormItem>
        {isLinkedActivity(selectedType) ? (
          <FormField
            name="activity.talkId"
            control={form.control}
            render={({ field }) => (
              <FormItem className="md:col-span-5">
                <FormLabel>
                  {selectedType === "talk"
                    ? "Palestra"
                    : selectedType === "opening_keynote"
                      ? "Keynote de abertura"
                      : "Keynote de encerramento"}
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
                <FormLabel>
                  {selectedType === "opening"
                    ? "Nome da abertura"
                    : selectedType === "closing"
                      ? "Nome do encerramento"
                      : "Nome do intervalo"}
                </FormLabel>
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
                  <ScheduleTimeSelect
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
            <FormItem className="md:col-span-8">
              <FormControl>
                <AdminVisibilityControl
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  label="Visibilidade da atividade"
                  description="Atividades visíveis aparecem na programação pública do evento."
                  activeLabel="Visível"
                  inactiveLabel="Oculta"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="sticky bottom-3 z-10 flex gap-3 p-3 md:col-span-8 md:justify-end">
          <Button
            type="button"
            variant="outline"
            className="!border-slate-300 !bg-white !text-slate-700 hover:!bg-slate-50 hover:!text-slate-900"
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
