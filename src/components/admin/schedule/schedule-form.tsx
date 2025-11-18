import { Button } from "@/assets/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/assets/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/assets/components/ui/form";
import { useSpeakers } from "@/hooks/useSpeakers";
import { useEffect } from "react";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

import { Schedule, ScheduleFormProps } from "./schedule-types";
import { scheduleSchema, ScheduleFormValues } from "./schedule-schema";
import SortableSpeech from "./sortable-speech";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

export function ScheduleForm({
  onSubmit,
  loading,
  schedule,
  editing = false,
}: ScheduleFormProps) {
  const { speakers } = useSpeakers();
  const form = useForm<z.infer<typeof scheduleSchema>>({
    resolver: zodResolver(scheduleSchema) as any,
    defaultValues: schedule
      ? { ...schedule }
      : {
          start: "08:00",
          end: "08:00",
          speeches: [{ id: uuidv4(), topic: "registration", order: 0 }],
        },
  });
  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "speeches",
  });

  // dnd-kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  // Atualiza ordem dos speeches após reordenação
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = fields.findIndex((item) => item.id === active.id);
      const newIndex = fields.findIndex((item) => item.id === over.id);
      move(oldIndex, newIndex);
      // Atualiza o campo order
      const updated = form
        .getValues("speeches")
        .map((speech: any, idx: number) => ({ ...speech, order: idx }));
      form.setValue("speeches", updated);
    }
  };
  useEffect(() => {
    if (schedule) {
      form.reset(schedule);
    }
  }, [schedule, form]);

  const handleAddSpeech = () => {
    if (fields.length < 5) {
      append({ id: uuidv4(), topic: "registration", order: fields.length });
    }
  };

  const handleRemoveSpeech = (idx: number) => {
    if (fields.length > 1) remove(idx);
  };

  const handleFormSubmit = async (data: z.infer<typeof scheduleSchema>) => {
    console.log("handleFormSubmit");
    const scheduleId = editing && data.id ? data.id : uuidv4();
    const newSchedule: Schedule = {
      id: scheduleId,
      start: data.start,
      end: data.end,
      speeches: data.speeches.map((speech, idx) => {
        if (speech.topic === "panel") {
          const validSlugs = Array.isArray(speech.speakerSlugs)
            ? speech.speakerSlugs.filter((s) => !!s)
            : [];
          return {
            ...speech,
            id: speech.id || uuidv4(),
            speakerSlugs: validSlugs,
            order: typeof speech.order === "number" ? speech.order : idx,
          };
        }
        return {
          ...speech,
          id: speech.id || uuidv4(),
          order: typeof speech.order === "number" ? speech.order : idx,
        };
      }),
    };
    await onSubmit(newSchedule);
    if (!editing) form.reset();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="grid grid-cols-12 gap-6 p-4"
      >
        {/* Horário inicial */}
        <FormField
          control={form.control}
          name="start"
          render={({ field }) => (
            <FormItem className="col-span-6">
              <FormLabel>Início</FormLabel>
              <FormControl>
                <div className="flex gap-2">
                  <Select
                    value={field.value.split(":")[0]}
                    onValueChange={(h) =>
                      field.onChange(`${h}:${field.value.split(":")[1]}`)
                    }
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Hora" />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(12)].map((_, i) => {
                        const hour = (8 + i).toString().padStart(2, "0");
                        return (
                          <SelectItem value={hour} key={hour}>
                            {hour}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <span className="self-center">:</span>
                  <Select
                    value={field.value.split(":")[1]}
                    onValueChange={(m) =>
                      field.onChange(`${field.value.split(":")[0]}:${m}`)
                    }
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Minuto" />
                    </SelectTrigger>
                    <SelectContent>
                      {[0, 10, 20, 30, 40, 50].map((m) => {
                        const min = m.toString().padStart(2, "0");
                        return (
                          <SelectItem value={min} key={min}>
                            {min}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Horário final */}
        <FormField
          control={form.control}
          name="end"
          render={({ field }) => (
            <FormItem className="col-span-6">
              <FormLabel>Fim</FormLabel>
              <FormControl>
                <div className="flex gap-2">
                  <Select
                    value={field.value.split(":")[0]}
                    onValueChange={(h) =>
                      field.onChange(`${h}:${field.value.split(":")[1]}`)
                    }
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Hora" />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(12)].map((_, i) => {
                        const hour = (8 + i).toString().padStart(2, "0");
                        return (
                          <SelectItem value={hour} key={hour}>
                            {hour}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <span className="self-center">:</span>
                  <Select
                    value={field.value.split(":")[1]}
                    onValueChange={(m) =>
                      field.onChange(`${field.value.split(":")[0]}:${m}`)
                    }
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Minuto" />
                    </SelectTrigger>
                    <SelectContent>
                      {[0, 10, 20, 30, 40, 50].map((m) => {
                        const min = m.toString().padStart(2, "0");
                        return (
                          <SelectItem value={min} key={min}>
                            {min}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Lista de Speechs dinâmicos */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={fields.map((f) => f.id)}
            strategy={verticalListSortingStrategy}
          >
            {fields.map((speech, idx) => (
              <SortableSpeech
                key={speech.id}
                id={speech.id}
                idx={idx}
                handleRemoveSpeech={handleRemoveSpeech}
                fieldsLength={fields.length}
                form={form}
                speakers={speakers}
                className="col-span-6"
              />
            ))}
          </SortableContext>
        </DndContext>

        <div className="col-span-12 flex justify-end mb-4">
          {fields.length < 5 && (
            <Button
              type="button"
              variant="outline"
              onClick={handleAddSpeech}
              className=" border-1 rounded-xl border-white hover:border-white h-11"
            >
              Adicionar item
            </Button>
          )}
        </div>

        <div className="col-span-12 flex gap-4 mt-4 justify-center">
          {!editing && (
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              className="w-full border-1 rounded-xl border-white hover:border-white h-11"
              onClick={() => form.reset()}
            >
              Limpar
            </Button>
          )}
          <Button
            type="submit"
            disabled={loading}
            className="w-full text-white !bg-devBlue-dark rounded-xl border-1 border-devBlue-dark hover:border-white h-11"
          >
            {loading ? "Salvando..." : editing ? "Atualizar" : "Cadastrar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
