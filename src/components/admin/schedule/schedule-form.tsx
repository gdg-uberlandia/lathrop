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
  scheduleInputSchema,
} from "@/contracts/schedule";
import { useTalks } from "@/hooks/useTalks";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import { zodResolver } from "@hookform/resolvers/zod";
import { Resolver, useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";

const localDateTime = (value: Date) => {
  const offset = value.getTimezoneOffset() * 60_000;
  return new Date(value.getTime() - offset).toISOString().slice(0, 16);
};
export function ScheduleForm({
  schedule,
  loading,
  onSubmit,
}: {
  schedule?: ScheduleEntry;
  loading?: boolean;
  onSubmit: (value: ScheduleInput) => unknown;
}) {
  const { talks } = useTalks();
  const initial = schedule?.startAt ?? new Date();
  const form = useForm<ScheduleInput>({
    resolver: zodResolver(scheduleInputSchema) as Resolver<ScheduleInput>,
    defaultValues: schedule
      ? {
          id: schedule.id,
          date: schedule.date,
          startAt: schedule.startAt,
          endAt: schedule.endAt,
          room: schedule.room,
          activity: schedule.activity,
          active: schedule.active,
          order: schedule.order,
        }
      : {
          id: uuidv4(),
          date: localDateTime(initial).slice(0, 10),
          startAt: initial,
          endAt: new Date(initial.getTime() + 60 * 60_000),
          room: null,
          activity: { type: "opening", title: "Abertura" },
          active: true,
          order: 0,
        },
  });
  useUnsavedChanges(form.formState.isDirty && !form.formState.isSubmitting);
  const type = form.watch("activity.type");
  const changeType = (value: "talk" | "opening" | "break" | "closing") =>
    form.setValue(
      "activity",
      value === "talk"
        ? { type: "talk", talkId: talks[0]?.id ?? "" }
        : {
            type: value,
            title:
              value === "opening"
                ? "Abertura"
                : value === "break"
                  ? "Intervalo"
                  : "Encerramento",
          },
      { shouldDirty: true, shouldValidate: true },
    );
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-6 rounded-2xl border border-white/10 bg-devGray-dark/20 p-4 md:grid-cols-8 md:p-6"
      >
        <div className="md:col-span-8">
          <h2 className="font-semibold text-slate-900">Item da programação</h2>
          <p className="mt-1 text-sm text-slate-500">
            Cada registro representa uma atividade em uma sala e intervalo
            definidos.
          </p>
        </div>
        <FormItem className="md:col-span-3">
          <FormLabel>Tipo</FormLabel>
          <Select value={type} onValueChange={changeType}>
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
        {type === "talk" ? (
          <FormField
            name="activity.talkId"
            control={form.control}
            render={({ field }) => (
              <FormItem className="md:col-span-5">
                <FormLabel>Palestra</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {talks.map((talk) => (
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
        <FormField
          name="date"
          control={form.control}
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Data</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {(["startAt", "endAt"] as const).map((name) => (
          <FormField
            key={name}
            name={name}
            control={form.control}
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>
                  {name === "startAt" ? "Início" : "Término"}
                </FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    value={localDateTime(field.value)}
                    onChange={(e) => field.onChange(new Date(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <FormField
          name="room"
          control={form.control}
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Sala</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value || null)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="order"
          control={form.control}
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Ordem</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  {...field}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
