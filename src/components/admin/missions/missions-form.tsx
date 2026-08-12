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
import { Textarea } from "@/assets/components/ui/textarea";
import Loading from "@/components/admin/loading-overlay";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import { Mission, MissionInput } from "@/models/mission";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";
import { Resolver, useFieldArray, useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";

import { MissionFormType, missionSchema } from "./missions-schema";

interface MissionFormProps {
  editing?: boolean;
  loading?: boolean;
  onSubmit: (data: MissionInput) => Promise<Mission | null> | Mission | null;
  mission?: Mission;
}

function defaults(mission?: Mission): MissionFormType {
  return {
    id: mission?.id ?? "",
    title: mission?.title ?? "",
    description: mission?.description ?? "",
    imageUrl: mission?.imageUrl ?? null,
    validationType: mission?.validationType ?? "reviewer",
    qrId: mission?.qrId ?? null,
    progressRequirement: mission?.progressRequirement ?? null,
    prerequisites: mission?.prerequisites ?? [],
    active: mission?.active ?? true,
    order: mission?.order ?? 0,
    xpAwarded: mission?.xpAwarded ?? null,
  };
}

export function MissionsForm({
  editing = false,
  loading = false,
  onSubmit,
  mission,
}: MissionFormProps) {
  const { uploadImage, loadingImage } = useImageUpload();
  const form = useForm<MissionFormType>({
    resolver: zodResolver(missionSchema) as Resolver<MissionFormType>,
    defaultValues: defaults(mission),
  });
  useUnsavedChanges(form.formState.isDirty && !form.formState.isSubmitting);
  const prerequisites = useFieldArray({
    control: form.control,
    name: "prerequisites",
  });
  const validationType = form.watch("validationType");
  const progressType = form.watch("progressRequirement.type");

  useEffect(() => {
    form.reset(defaults(mission));
  }, [form, mission]);

  useEffect(() => {
    if (validationType === "qr") {
      if (!form.getValues("qrId")) form.setValue("qrId", uuidv4());
      form.setValue("progressRequirement", null);
      return;
    }

    form.setValue("qrId", null);
    if (validationType === "automatic") {
      form.setValue("prerequisites", []);
      if (!form.getValues("progressRequirement")) {
        form.setValue("progressRequirement", {
          type: "connections",
          target: 1,
        });
      }
      return;
    }

    form.setValue("progressRequirement", null);
  }, [form, validationType]);

  const submitHandler = async (data: MissionFormType) => {
    const result = await onSubmit(data);
    if (!editing && result) form.reset(defaults());
  };

  const handleImageFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = await uploadImage(file, "missions");
    form.setValue("imageUrl", url, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <>
      {loadingImage && <Loading />}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submitHandler)}
          className="grid grid-cols-1 gap-6 rounded-2xl border border-white/10 bg-devGray-dark/20 p-4 md:grid-cols-8 md:p-6"
        >
          <div className="md:col-span-8">
            <h2 className="font-semibold text-slate-900">
              Informações principais
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Identificação e conteúdo apresentado ao participante.
            </p>
          </div>
          <FormField
            name="id"
            control={form.control}
            render={({ field }) => (
              <FormItem className="md:col-span-4">
                <FormLabel>Identificador</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={editing}
                    placeholder="ex.: encontre-o-qr-secreto"
                  />
                </FormControl>
                <p className="text-xs text-muted-foreground">
                  Use um identificador estável, sem espaços.
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="title"
            control={form.control}
            render={({ field }) => (
              <FormItem className="md:col-span-4">
                <FormLabel>Título</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="description"
            control={form.control}
            render={({ field }) => (
              <FormItem className="md:col-span-8">
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Textarea {...field} rows={4} />
                </FormControl>
                <p className="text-right text-xs text-slate-400">
                  {field.value.length}/1000
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="border-t !border-slate-200 pt-5 md:col-span-8">
            <h2 className="font-semibold text-slate-900">
              Validação e recompensa
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Regras necessárias para concluir a missão.
            </p>
          </div>
          <FormField
            name="validationType"
            control={form.control}
            render={({ field }) => (
              <FormItem className="md:col-span-4">
                <FormLabel>Tipo de validação</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="reviewer">
                      Aprovação por revisor
                    </SelectItem>
                    <SelectItem value="qr">Leitura de QR Code</SelectItem>
                    <SelectItem value="automatic">
                      Progresso automático
                    </SelectItem>
                  </SelectContent>
                </Select>
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
                    onChange={(event) =>
                      field.onChange(event.target.valueAsNumber)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="xpAwarded"
            control={form.control}
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>XP concedido</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    value={field.value ?? ""}
                    onChange={(event) =>
                      field.onChange(
                        event.target.value === ""
                          ? null
                          : event.target.valueAsNumber,
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {validationType === "qr" && (
            <FormField
              name="qrId"
              control={form.control}
              render={({ field }) => (
                <FormItem className="md:col-span-8">
                  <FormLabel>Identificador público do QR Code</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} readOnly />
                    </FormControl>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => field.onChange(uuidv4())}
                    >
                      Gerar outro
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {validationType === "automatic" && (
            <div className="grid grid-cols-1 gap-4 rounded-xl border p-4 md:col-span-8 md:grid-cols-2">
              <FormField
                name="progressRequirement.type"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Progresso acompanhado</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(value: "connections" | "companies") => {
                        field.onChange(value);
                        form.setValue("progressRequirement.target", 1);
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="connections">Conexões</SelectItem>
                        <SelectItem value="companies">
                          Companies visitadas
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="progressRequirement.target"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        value={field.value ?? ""}
                        placeholder={
                          progressType === "companies"
                            ? "Número ou all"
                            : "Quantidade"
                        }
                        onChange={(event) => {
                          const value = event.target.value.trim();
                          field.onChange(
                            value === "all" ? "all" : Number(value),
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {validationType !== "automatic" && (
            <div className="space-y-3 rounded-xl border p-4 md:col-span-8">
              <div className="flex items-center justify-between">
                <div>
                  <FormLabel>Pré-requisitos</FormLabel>
                  <p className="text-xs text-muted-foreground">
                    Missões ou companies que precisam ser concluídas antes.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    prerequisites.append({ type: "mission", activityId: "" })
                  }
                >
                  <Plus className="mr-2 size-4" />
                  Adicionar
                </Button>
              </div>
              {prerequisites.fields.map((item, index) => (
                <div
                  key={item.id}
                  className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_2fr_auto]"
                >
                  <FormField
                    name={`prerequisites.${index}.type`}
                    control={form.control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mission">Missão</SelectItem>
                          <SelectItem value="company">Company</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <FormField
                    name={`prerequisites.${index}.activityId`}
                    control={form.control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Identificador da atividade"
                      />
                    )}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    aria-label="Remover pré-requisito"
                    onClick={() => prerequisites.remove(index)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
              <FormMessage>
                {form.formState.errors.prerequisites?.message}
              </FormMessage>
            </div>
          )}

          <div className="border-t !border-slate-200 pt-5 md:col-span-8">
            <h2 className="font-semibold text-slate-900">
              Apresentação e publicação
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Imagem e disponibilidade para participantes.
            </p>
          </div>
          <FormField
            name="imageUrl"
            control={form.control}
            render={({ field }) => (
              <FormItem className="md:col-span-8">
                <FormLabel>Imagem da missão</FormLabel>
                <div className="flex items-center gap-3">
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                    />
                  </FormControl>
                  {field.value && (
                    <Image
                      src={field.value}
                      alt="Prévia da missão"
                      width={48}
                      height={48}
                      className="size-12 rounded object-cover"
                    />
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="active"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex items-center gap-3 space-y-0 rounded-xl border p-4 md:col-span-8">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div>
                  <FormLabel>Missão ativa</FormLabel>
                  <p className="text-xs text-muted-foreground">
                    Somente missões ativas aparecem para participantes.
                  </p>
                </div>
              </FormItem>
            )}
          />

          <div className="sticky bottom-3 z-10 mt-4 flex justify-center rounded-xl border border-white/10 bg-background/95 p-3 shadow-xl backdrop-blur md:col-span-8">
            <div className="flex w-full flex-col-reverse gap-3 sm:flex-row sm:justify-end">
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
                  loading || loadingImage || form.formState.isSubmitting
                }
                className="admin-primary-action h-11 rounded-lg !bg-blue-600 sm:min-w-48"
              >
                {editing ? "Salvar alterações" : "Cadastrar"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
}
