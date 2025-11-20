import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/assets/components/ui/button";
import { Input } from "@/assets/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/assets/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/assets/components/ui/select";
import { GripVertical, X } from "lucide-react";

const SortableSpeech = function (props: any) {
  const { id, idx, handleRemoveSpeech, fieldsLength, form, speakers } = props;
  const sortable = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(sortable.transform),
    transition: sortable.transition,
    zIndex: sortable.isDragging ? 10 : 1,
    opacity: sortable.isDragging ? 0.7 : 1,
  };
  return (
    <div
      ref={sortable.setNodeRef}
      style={style}
      className="col-span-12 py-4 border-1 border-devGray bg-devGray-dark/60 rounded-xl grid grid-cols-12"
    >
      <div className="h-10 flex items-center justify-center">
        <GripVertical
          {...sortable.listeners}
          {...sortable.attributes}
          className="cursor-grab size-5 bg-transparent text-devGray-light"
        />
      </div>
      <div className="col-span-10 flex flex-col gap-4 ">
        <FormField
          control={form.control}
          name={`speeches.${idx}.topic`}
          render={({ field }) => (
            <FormItem className="grow">
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="registration">Credenciamento</SelectItem>
                    <SelectItem value="start">Abertura</SelectItem>
                    <SelectItem value="keynote_start">
                      Keynote Abertura
                    </SelectItem>
                    <SelectItem value="interval">Intervalo</SelectItem>
                    <SelectItem value="coffeeBreak">Coffee Break</SelectItem>
                    <SelectItem value="speech">Palestra</SelectItem>
                    <SelectItem value="panel">Painel</SelectItem>
                    <SelectItem value="keynote_end">
                      Keynote Encerramento
                    </SelectItem>
                    <SelectItem value="finish">Encerramento</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {(() => {
          const topic = form.watch(`speeches.${idx}.topic`);
          if (["keynote_start", "keynote_end"].includes(topic)) {
            return (
              <FormField
                control={form.control}
                name={`speeches.${idx}.speakerSlugs`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Palestrante</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value?.[0] || ""}
                        onValueChange={(val) => field.onChange([val])}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {speakers?.map((speaker: any) => (
                            <SelectItem value={speaker.id} key={speaker.id}>
                              {speaker.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            );
          }
          if (topic === "panel") {
            return (
              <>
                <FormField
                  control={form.control}
                  name={`speeches.${idx}.path`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trilha (opcional)</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value || ""}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MINAS">MINAS</SelectItem>
                            <SelectItem value="CANASTRA">CANASTRA</SelectItem>
                            <SelectItem value="CURADO">CURADO</SelectItem>
                            <SelectItem value="TRANCA">TRANÇA</SelectItem>
                            <SelectItem value="COMMUNITY">
                              ARENA COMUNIDADE
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`speeches.${idx}.title`}
                  render={({ field, fieldState }) => (
                    <FormItem className="col-span-4">
                      <FormLabel>Título</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      {fieldState.error && (
                        <span>{fieldState.error.message}</span>
                      )}
                    </FormItem>
                  )}
                />
                <FormItem>
                  <FormLabel>Palestrantes (até 3)</FormLabel>
                  <div className="grid grid-cols-1 gap-3">
                    {[0, 1, 2].map((panelIdx) => (
                      <FormField
                        key={panelIdx}
                        control={form.control as any}
                        name={`speeches.${idx}.speakerSlugs.${panelIdx}`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Select
                                value={field.value || ""}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue
                                    placeholder={`Palestrante ${panelIdx + 1}`}
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  {/* Show selected speaker even if not in filtered list */}
                                  {field.value &&
                                    !speakers?.some(
                                      (s: any) => s.id === field.value,
                                    ) && (
                                      <SelectItem
                                        value={field.value}
                                        key={field.value}
                                      >
                                        {field.value}
                                      </SelectItem>
                                    )}
                                  {speakers
                                    ?.filter(
                                      (speaker: any) =>
                                        !form
                                          .watch(`speeches.${idx}.speakerSlugs`)
                                          ?.includes(speaker.id) ||
                                        speaker.id === field.value,
                                    )
                                    .map((speaker: any) => (
                                      <SelectItem
                                        value={speaker.id}
                                        key={speaker.id}
                                      >
                                        {speaker.name}
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <FormField
                    control={form.control as any}
                    name={`speeches.${idx}.speakerSlugs`}
                    render={() => <FormMessage />}
                  />
                </FormItem>
              </>
            );
          }
          if (topic === "speech") {
            return (
              <>
                <FormField
                  control={form.control}
                  name={`speeches.${idx}.path`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trilha (opcional)</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value || ""}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MINAS">MINAS</SelectItem>
                            <SelectItem value="CANASTRA">CANASTRA</SelectItem>
                            <SelectItem value="CURADO">CURADO</SelectItem>
                            <SelectItem value="TRANCA">TRANÇA</SelectItem>
                            <SelectItem value="COMMUNITY">
                              ARENA COMUNIDADE
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`speeches.${idx}.speakerSlugs`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Palestrante</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value?.[0] || ""}
                          onValueChange={(val) => field.onChange([val])}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            {speakers?.map((speaker: any) => (
                              <SelectItem value={speaker.id} key={speaker.id}>
                                {speaker.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            );
          }
          return null;
        })()}
      </div>
      <div className="h-10 flex items-center justify-center">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => handleRemoveSpeech(idx)}
          disabled={fieldsLength <= 1}
          className="border-1 hover:bg-devRed-dark rounded-xl size-10"
        >
          <X />
        </Button>
      </div>
    </div>
  );
};

export default SortableSpeech;
