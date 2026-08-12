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
import { Speaker } from "@/contracts/speaker";
import { Talk, TalkInput } from "@/contracts/talk";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import { v4 as uuidv4 } from "uuid";
import { TalkFormType, talkFormSchema } from "./talks-schema";

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
            <FormItem className="md:col-span-6">
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
                  <SelectItem value="talk">Talk</SelectItem>
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
            <FormItem className="md:col-span-4">
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
        <FormField
          name="speakerIds"
          control={form.control}
          render={({ field, fieldState }) => (
            <FormItem className="md:col-span-4">
              <FormLabel>Palestrante(s)</FormLabel>
              <Input
                type="search"
                value={speakerSearch}
                onChange={(event) => setSpeakerSearch(event.target.value)}
                placeholder="Buscar palestrante..."
                className="mb-2"
              />
              <FormControl>
                <select
                  multiple
                  value={field.value}
                  onChange={(event) =>
                    field.onChange(
                      Array.from(
                        event.target.selectedOptions,
                        (option) => option.value,
                      ),
                    )
                  }
                  className="min-h-28 w-full rounded-md border bg-transparent p-2"
                >
                  {speakers
                    .filter((speaker) =>
                      `${speaker.name} ${speaker.company ?? ""}`
                        .toLocaleLowerCase("pt-BR")
                        .includes(
                          speakerSearch.toLocaleLowerCase("pt-BR").trim(),
                        ),
                    )
                    .map((speaker) => (
                      <option
                        key={speaker.id}
                        value={speaker.id}
                        className="text-black"
                      >
                        {speaker.name}
                      </option>
                    ))}
                </select>
              </FormControl>
              <small>
                Use Ctrl/Cmd para selecionar mais de um palestrante em painéis.
              </small>
              {fieldState.error && <span>{fieldState.error.message}</span>}
            </FormItem>
          )}
        />
        <FormField
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <FormItem className="md:col-span-8">
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea {...field} rows={7} />
              </FormControl>
              <p className="text-right text-xs text-slate-400">
                {field.value.length}/3000
              </p>
              {fieldState.error && <span>{fieldState.error.message}</span>}
            </FormItem>
          )}
        />
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
              <FormLabel>Status</FormLabel>
              <Select
                value={String(field.value)}
                onValueChange={(value) => field.onChange(value === "true")}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="true">Ativa</SelectItem>
                  <SelectItem value="false">Inativa</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <div className="sticky bottom-3 z-10 rounded-xl border border-white/10 bg-background/95 p-3 shadow-xl backdrop-blur md:col-span-8">
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
              className="h-11 !border-slate-300"
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
