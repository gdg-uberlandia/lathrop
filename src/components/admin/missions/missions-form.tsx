import { Button } from "@/assets/components/ui/button";
import { AdminQrCodeCard } from "@/components/admin/admin-qr-code-card";
import { AdminVisibilityControl } from "@/components/admin/admin-visibility-control";
import { AdminImageUpload } from "@/components/admin/admin-image-upload";
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
import { useImageUpload } from "@/hooks/useImageUpload";
import { useMissions } from "@/hooks/useMissions";
import { useCompanies } from "@/hooks/useCompanies";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import { Mission, MissionInput } from "@/models/mission";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
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
    id: mission?.id ?? uuidv4(),
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
  const { uploadImage, loadingImage, error: uploadError } = useImageUpload();
  const { missions } = useMissions();
  const { companies } = useCompanies();
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
  const currentId = form.watch("id");

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

  const handleImageFileChange = async (file: File) => {
    try {
      const url = await uploadImage(file, {
        folder: "missions",
        entityId: form.getValues("id"),
        variant: "image",
      });
      form.setValue("imageUrl", url, {
        shouldDirty: true,
        shouldValidate: true,
      });
    } catch {
      // A mensagem do hook é exibida no componente.
    }
  };

  return (
    <>
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
                  <div className="mt-4">
                    <AdminQrCodeCard
                      value={field.value}
                      downloadName={`missao-${currentId || "qr"}`}
                      entityLabel="esta missão"
                    />
                  </div>
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
                          Empresas visitadas
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
                    Missões ou empresas que precisam ser concluídas antes.
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
                          <SelectItem value="company">Empresa</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <FormField
                    name={`prerequisites.${index}.activityId`}
                    control={form.control}
                    render={({ field }) =>
                      form.watch(`prerequisites.${index}.type`) ===
                      "mission" ? (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma missão" />
                          </SelectTrigger>
                          <SelectContent>
                            {missions
                              .filter((option) => option.id !== currentId)
                              .map((option) => (
                                <SelectItem key={option.id} value={option.id}>
                                  {option.title}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma empresa" />
                          </SelectTrigger>
                          <SelectContent>
                            {companies
                              .filter((company) => company.active)
                              .map((company) => (
                                <SelectItem key={company.id} value={company.id}>
                                  {company.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      )
                    }
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
                <AdminImageUpload
                  value={field.value}
                  label="Imagem da missão"
                  loading={loadingImage}
                  error={uploadError}
                  previewFit="cover"
                  onFileSelect={handleImageFileChange}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="active"
            control={form.control}
            render={({ field }) => (
              <FormItem className="md:col-span-8">
                <FormControl>
                  <AdminVisibilityControl
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    label="Disponibilidade da missão"
                    description="Missões ativas aparecem para os participantes e podem receber progresso."
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="sticky bottom-3 z-10 mt-4 flex justify-center p-3 md:col-span-8">
            <div className="flex w-full flex-col-reverse gap-3 sm:flex-row sm:justify-end">
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
