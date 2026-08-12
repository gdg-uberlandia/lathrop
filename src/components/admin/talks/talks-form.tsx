import { Button } from "@/assets/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/assets/components/ui/form";
import { Input } from "@/assets/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/assets/components/ui/select";
import { Textarea } from "@/assets/components/ui/textarea";
import { Checkbox } from "@/assets/components/ui/checkbox";
import { AdminVisibilityControl } from "@/components/admin/admin-visibility-control";
import { Speaker } from "@/contracts/speaker";
import { Talk, TalkInput } from "@/contracts/talk";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import { v4 as uuidv4 } from "uuid";
import { TalkFormType, talkFormSchema } from "./talks-schema";
import { Search, UserRound } from "lucide-react";

interface TalksFormProps {
  speakers: Speaker[];
  talk?: Talk;
  loading?: boolean;
  onSubmit: (data: TalkInput) => void | Promise<unknown>;
}
const defaults = (): TalkFormType => ({
  id: uuidv4(),
  title: "",
  description: "",
  category: null,
  format: "talk",
  speakerIds: [],
  evaluationStatus: "locked",
  isActive: true,
});

export function TalksForm({
  speakers,
  talk,
  loading,
  onSubmit,
}: TalksFormProps) {
  const [validationError, setValidationError] = useState("");
  const [speakerSearch, setSpeakerSearch] = useState("");
  const form = useForm<TalkFormType>({
    resolver: zodResolver(talkFormSchema),
    defaultValues: defaults(),
  });
  useUnsavedChanges(form.formState.isDirty && !form.formState.isSubmitting);
  useEffect(() => {
    if (talk)
      form.reset({
        id: talk.id,
        title: talk.title,
        description: talk.description,
        category: talk.category,
        format: talk.format,
        speakerIds: talk.speakerIds,
        evaluationStatus: talk.evaluationStatus,
        isActive: talk.isActive,
      });
  }, [form, talk]);

  const submitHandler = async (data: TalkFormType) => {
    setValidationError("");
    await onSubmit(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submitHandler, () => {
          setValidationError(
            "Revise os campos destacados antes de salvar a palestra.",
          );
        })}
        className="grid grid-cols-1 gap-6 rounded-2xl border border-white/10 bg-devGray-dark/20 p-4 md:grid-cols-8 md:p-6"
      >
        <div className="md:col-span-8">
          <h2 className="font-semibold text-slate-900">
            Conteúdo e responsáveis
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Informações exibidas na programação pública.
          </p>
        </div>
        <FormField
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <FormItem className="md:col-span-4">
              <FormLabel>Título da palestra</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              {fieldState.error && <span>{fieldState.error.message}</span>}
            </FormItem>
          )}
        />
        <FormField
          name="format"
          control={form.control}
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Formato</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="talk">Palestra</SelectItem>
                  <SelectItem value="panel">Painel</SelectItem>
                  <SelectItem value="keynote">Keynote</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          name="category"
          control={form.control}
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Categoria</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value ?? ""}
                  onChange={(event) =>
                    field.onChange(event.target.value || null)
                  }
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="grid gap-6 md:col-span-8 md:grid-cols-[minmax(0,3fr)_minmax(20rem,2fr)]">
          <FormField
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Textarea {...field} className="h-80 resize-none" />
                </FormControl>
                <p className="text-right text-xs text-slate-400">
                  {field.value.length}/3000
                </p>
                {fieldState.error && <span>{fieldState.error.message}</span>}
              </FormItem>
            )}
          />
          <FormField
            name="speakerIds"
            control={form.control}
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Palestrante(s)</FormLabel>
                <div className="flex h-80 flex-col overflow-hidden rounded-xl border !border-slate-200 bg-white">
                  <div className="relative border-b !border-slate-200 p-3">
                    <Search className="absolute left-6 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      type="search"
                      value={speakerSearch}
                      onChange={(event) => setSpeakerSearch(event.target.value)}
                      placeholder="Buscar por nome ou empresa"
                      className="pl-9"
                    />
                  </div>
                  <FormControl>
                    <div className="min-h-0 flex-1 space-y-1 overflow-y-auto p-2">
                      {speakers
                        .filter((speaker) =>
                          `${speaker.name} ${speaker.company ?? ""}`
                            .toLocaleLowerCase("pt-BR")
                            .includes(
                              speakerSearch.toLocaleLowerCase("pt-BR").trim(),
                            ),
                        )
                        .map((speaker) => {
                          const selected = field.value.includes(speaker.id);
                          return (
                            <label
                              key={speaker.id}
                              className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${selected ? "!border-blue-200 bg-blue-50" : "!border-transparent hover:bg-slate-50"}`}
                            >
                              <Checkbox
                                checked={selected}
                                onCheckedChange={(checked) =>
                                  field.onChange(
                                    checked
                                      ? [...field.value, speaker.id]
                                      : field.value.filter(
                                          (id) => id !== speaker.id,
                                        ),
                                  )
                                }
                              />
                              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                                <UserRound className="size-4" />
                              </span>
                              <span className="min-w-0">
                                <span className="block truncate text-sm font-medium text-slate-800">
                                  {speaker.name}
                                </span>
                                {speaker.company && (
                                  <span className="block truncate text-xs text-slate-500">
                                    {speaker.company}
                                  </span>
                                )}
                              </span>
                            </label>
                          );
                        })}
                    </div>
                  </FormControl>
                  <div className="border-t !border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600">
                    {field.value.length}{" "}
                    {field.value.length === 1
                      ? "palestrante selecionado"
                      : "palestrantes selecionados"}
                  </div>
                </div>
                {fieldState.error && <span>{fieldState.error.message}</span>}
              </FormItem>
            )}
          />
        </div>
        <div className="border-t !border-slate-200 pt-5 md:col-span-8">
          <h2 className="font-semibold text-slate-900">
            Publicação e avaliação
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Controle quando a palestra fica disponível e pode ser avaliada.
          </p>
        </div>
        <FormField
          name="evaluationStatus"
          control={form.control}
          render={({ field }) => (
            <FormItem className="md:col-span-4">
              <FormLabel>Avaliação</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="locked">Bloqueada</SelectItem>
                  <SelectItem value="open">Aberta</SelectItem>
                  <SelectItem value="closed">Encerrada</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          name="isActive"
          control={form.control}
          render={({ field }) => (
            <FormItem className="md:col-span-4">
              <FormControl>
                <AdminVisibilityControl
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  label="Disponibilidade da palestra"
                  description="Palestras ativas podem ser exibidas e associadas à programação."
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="sticky bottom-3 z-10 p-3 md:col-span-8">
          {validationError && (
            <p role="alert" className="mb-3 text-devRed">
              {validationError}
            </p>
          )}
          {form.formState.errors.id && (
            <p role="alert" className="mb-3 text-devRed">
              {form.formState.errors.id.message}
            </p>
          )}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className="h-11 !border-slate-300 !bg-white !text-slate-700 hover:!bg-slate-50 hover:!text-slate-900"
              onClick={() => window.history.back()}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={
                loading || form.formState.isSubmitting || speakers.length === 0
              }
              className="admin-primary-action h-11 !bg-blue-600 sm:min-w-48"
            >
              {talk ? "Salvar alterações" : "Cadastrar palestra"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
