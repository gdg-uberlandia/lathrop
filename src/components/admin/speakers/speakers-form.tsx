import { Button } from "@/assets/components/ui/button";
import { Checkbox } from "@/assets/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/assets/components/ui/form";
import { Input } from "@/assets/components/ui/input";
import { Textarea } from "@/assets/components/ui/textarea";
import Loading from "@/components/admin/loading-overlay";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import { Speaker, SpeakerInput } from "@/contracts/speaker";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { SpeakerFormType, speakerFormSchema } from "./speakers-schema";

interface SpeakerFormProps {
  editing?: boolean;
  loading?: boolean;
  onSubmit: (data: SpeakerInput) => void | Promise<unknown>;
  speaker?: Speaker;
}

const emptyValues = (): SpeakerFormType => ({
  id: uuidv4(),
  name: "",
  company: "",
  title: "",
  miniBio: "",
  photoUrl: "",
  socialMedia: { instagram: "", linkedIn: "" },
  isVisible: true,
});

export function SpeakersForm({
  editing = false,
  loading = false,
  onSubmit,
  speaker,
}: SpeakerFormProps) {
  const { uploadImage, loadingImage, error: uploadError } = useImageUpload();
  const [validationError, setValidationError] = useState("");
  const form = useForm<SpeakerFormType>({
    resolver: zodResolver(speakerFormSchema),
    defaultValues: emptyValues(),
  });
  useUnsavedChanges(form.formState.isDirty && !form.formState.isSubmitting);

  useEffect(() => {
    if (!speaker) return;
    form.reset({
      id: speaker.id,
      name: speaker.name,
      company: speaker.company ?? "",
      title: speaker.title ?? "",
      miniBio: speaker.miniBio ?? "",
      photoUrl: speaker.photoUrl ?? "",
      socialMedia: {
        instagram: speaker.socialMedia.instagram ?? "",
        linkedIn: speaker.socialMedia.linkedIn ?? "",
      },
      isVisible: speaker.isVisible,
    });
  }, [form, speaker]);

  const submitHandler = async (data: SpeakerFormType) => {
    setValidationError("");
    await onSubmit({
      ...data,
      company: data.company || null,
      title: data.title || null,
      miniBio: data.miniBio || null,
      photoUrl: data.photoUrl || null,
      socialMedia: {
        instagram: data.socialMedia.instagram || null,
        linkedIn: data.socialMedia.linkedIn || null,
      },
    });
    if (!editing) form.reset(emptyValues());
  };

  const uploadPhoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const url = await uploadImage(file, "speakers");
        form.setValue("photoUrl", url, {
          shouldValidate: true,
          shouldDirty: true,
        });
      } catch {
        // O hook expõe a mensagem de erro junto ao campo.
      }
    }
  };

  if (loadingImage) return <Loading />;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submitHandler, () => {
          setValidationError(
            "Revise os campos destacados antes de salvar o palestrante.",
          );
        })}
        className="grid grid-cols-1 gap-6 rounded-2xl border border-white/10 bg-devGray-dark/20 p-4 md:grid-cols-8 md:p-6"
      >
        <div className="md:col-span-8">
          <h2 className="font-semibold text-slate-900">
            Informações principais
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Identificação e apresentação pública do palestrante.
          </p>
        </div>
        <FormField
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <FormItem className="md:col-span-4">
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              {fieldState.error && <span>{fieldState.error.message}</span>}
            </FormItem>
          )}
        />
        <FormField
          name="photoUrl"
          control={form.control}
          render={({ field, fieldState }) => (
            <FormItem className="md:col-span-4">
              <FormLabel>Foto</FormLabel>
              <FormControl>
                <div className="flex items-center gap-2">
                  <Input type="file" accept="image/*" onChange={uploadPhoto} />
                  {field.value && (
                    <Image
                      src={field.value}
                      alt="Preview"
                      width={40}
                      height={40}
                      className="size-10 rounded-full object-cover"
                    />
                  )}
                  <input type="hidden" {...field} />
                </div>
              </FormControl>
              {fieldState.error && <span>{fieldState.error.message}</span>}
              {uploadError && <span>{uploadError}</span>}
            </FormItem>
          )}
        />
        <FormField
          name="company"
          control={form.control}
          render={({ field }) => (
            <FormItem className="md:col-span-4">
              <FormLabel>Empresa</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="title"
          control={form.control}
          render={({ field }) => (
            <FormItem className="md:col-span-4">
              <FormLabel>Cargo</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="miniBio"
          control={form.control}
          render={({ field, fieldState }) => (
            <FormItem className="md:col-span-8">
              <FormLabel>Mini bio</FormLabel>
              <FormControl>
                <Textarea {...field} rows={5} />
              </FormControl>
              <p className="text-right text-xs text-slate-400">
                {field.value.length}/3000
              </p>
              {fieldState.error && <span>{fieldState.error.message}</span>}
            </FormItem>
          )}
        />
        <div className="border-t !border-slate-200 pt-5 md:col-span-8">
          <h2 className="font-semibold text-slate-900">Contato e publicação</h2>
          <p className="mt-1 text-sm text-slate-500">
            Redes sociais e visibilidade no site.
          </p>
        </div>
        <FormField
          name="socialMedia.instagram"
          control={form.control}
          render={({ field, fieldState }) => (
            <FormItem className="md:col-span-4">
              <FormLabel>Instagram (URL)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              {fieldState.error && <span>{fieldState.error.message}</span>}
            </FormItem>
          )}
        />
        <FormField
          name="socialMedia.linkedIn"
          control={form.control}
          render={({ field, fieldState }) => (
            <FormItem className="md:col-span-4">
              <FormLabel>LinkedIn (URL)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              {fieldState.error && <span>{fieldState.error.message}</span>}
            </FormItem>
          )}
        />
        <FormField
          name="isVisible"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex items-center gap-2 md:col-span-8">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(value) => field.onChange(value === true)}
                />
              </FormControl>
              <FormLabel>Exibir palestrante no site</FormLabel>
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
              className="h-11 !border-slate-300 !bg-white !text-slate-700 hover:!bg-slate-50 hover:!text-slate-900 sm:w-auto"
              onClick={() => window.history.back()}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || form.formState.isSubmitting}
              className="admin-primary-action h-11 rounded-lg !bg-blue-600 sm:min-w-48"
            >
              {editing ? "Salvar alterações" : "Cadastrar palestrante"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
