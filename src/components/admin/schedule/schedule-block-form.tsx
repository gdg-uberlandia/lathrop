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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/assets/components/ui/select";
import {
  ScheduleBlockInput,
  SCHEDULE_TRACKS,
  scheduleBlockInputSchema,
} from "@/contracts/schedule";
import { useTalks } from "@/hooks/useTalks";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import { zodResolver } from "@hookform/resolvers/zod";
import { Resolver, useForm, useWatch } from "react-hook-form";
import { ScheduleTimeSelect } from "./schedule-time-select";

export function ScheduleBlockForm({
  loading,
  onSubmit,
}: {
  loading?: boolean;
  onSubmit: (value: ScheduleBlockInput) => unknown;
}) {
  const { talks } = useTalks();
  const availableTalks = talks.filter((talk) => talk.isActive);
  const form = useForm<ScheduleBlockInput>({
    resolver: zodResolver(
      scheduleBlockInputSchema,
    ) as Resolver<ScheduleBlockInput>,
    defaultValues: {
      startTime: "09:00",
      endTime: "10:00",
      talks: {
        MINAS: "",
        CURADO: "",
        CANASTRA: "",
        TRANCA: "",
        COMUNIDADE: "",
      },
      active: true,
    },
  });
  const selectedTalks = useWatch({ control: form.control, name: "talks" });
  useUnsavedChanges(form.formState.isDirty && !form.formState.isSubmitting);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-6 rounded-2xl border !border-slate-200 bg-white p-4 shadow-sm md:grid-cols-2 md:p-6"
      >
        <div className="md:col-span-2">
          <h2 className="font-semibold text-slate-900">Bloco de palestras</h2>
          <p className="mt-1 text-sm text-slate-500">
            Cadastre o mesmo intervalo nas cinco trilhas em uma única ação.
          </p>
        </div>

        {(["startTime", "endTime"] as const).map((name) => (
          <FormField
            key={name}
            name={name}
            control={form.control}
            render={({ field }) => (
              <FormItem>
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

        <div className="grid gap-4 rounded-xl bg-slate-50 p-4 md:col-span-2 md:grid-cols-2">
          {SCHEDULE_TRACKS.map((track) => (
            <FormField
              key={track.value}
              name={`talks.${track.value}`}
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trilha {track.label}</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Selecione uma palestra" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableTalks.map((talk) => {
                        const selectedElsewhere = Object.entries(
                          selectedTalks ?? {},
                        ).some(
                          ([selectedTrack, talkId]) =>
                            selectedTrack !== track.value && talkId === talk.id,
                        );
                        return (
                          <SelectItem
                            key={talk.id}
                            value={talk.id}
                            disabled={selectedElsewhere}
                          >
                            {talk.title}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          {availableTalks.length < SCHEDULE_TRACKS.length && (
            <p className="text-sm text-amber-700 md:col-span-2">
              São necessárias pelo menos cinco palestras ativas para preencher
              um bloco completo.
            </p>
          )}
          <FormMessage>
            {form.formState.errors.talks?.root?.message}
          </FormMessage>
        </div>

        <FormField
          name="active"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex items-center gap-3 md:col-span-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(value) => field.onChange(value === true)}
                />
              </FormControl>
              <FormLabel>Exibir todas as palestras na programação</FormLabel>
            </FormItem>
          )}
        />

        <div className="sticky bottom-3 z-10 flex gap-3 rounded-xl border !border-slate-200 bg-white/95 p-3 shadow-xl md:col-span-2 md:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => history.back()}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={
              loading ||
              form.formState.isSubmitting ||
              availableTalks.length < SCHEDULE_TRACKS.length
            }
            className="admin-primary-action !bg-blue-600"
          >
            Cadastrar bloco completo
          </Button>
        </div>
      </form>
    </Form>
  );
}
