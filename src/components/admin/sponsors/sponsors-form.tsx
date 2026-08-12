import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidv4 } from "uuid";
import { sponsorFormSchema, SponsorFormType } from "./sponsors-schema";
import { Input } from "@/assets/components/ui/input";
import { Button } from "@/assets/components/ui/button";
import { AdminImageUpload } from "@/components/admin/admin-image-upload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/assets/components/ui/select";
import { useImageUpload } from "@/hooks/useImageUpload";
import { Sponsor, SponsorCategoryDisplayName } from "@/models/sponsor";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/assets/components/ui/form";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";

export interface SponsorFormProps {
  editing?: boolean;
  loading?: boolean;
  onSubmit: (sponsor: Sponsor) => void;
  sponsor?: Sponsor;
}

export function SponsorsForm({
  editing = false,
  loading,
  onSubmit,
  sponsor,
}: SponsorFormProps) {
  const { uploadImage, loadingImage, error: uploadError } = useImageUpload();
  const form = useForm<SponsorFormType>({
    resolver: zodResolver(sponsorFormSchema),
    defaultValues: {
      id: editing && sponsor?.id ? sponsor.id : uuidv4(),
      name: sponsor?.name ?? "",
      url: sponsor?.url ?? "",
      logo: sponsor?.logo ?? "",
      category: sponsor?.level ?? "",
      level: sponsor?.level ?? "",
    },
  });
  useUnsavedChanges(form.formState.isDirty && !form.formState.isSubmitting);

  const handlePhotoFileChange = async (file: File) => {
    try {
      const url = await uploadImage(file, {
        folder: "sponsors",
        entityId: form.getValues("id"),
        variant: "logo",
      });
      form.setValue("logo", url, { shouldDirty: true, shouldValidate: true });
    } catch (err) {
      console.error("Erro ao enviar foto", err);
    }
  };

  const onFormSubmit = (data: SponsorFormType) => {
    const id = editing && sponsor?.id ? sponsor.id : uuidv4();
    const sponsorData: Sponsor = {
      id,
      name: data.name,
      url: data.url,
      logo: data.logo ?? "",
      level: data.category,
      format: "horizontal",
    };
    onSubmit(sponsorData);
    if (!editing) {
      form.reset({
        id: uuidv4(),
        name: "",
        url: "",
        logo: "",
        category: "",
        level: "",
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onFormSubmit)}
        className="grid grid-cols-1 gap-6 rounded-2xl border border-white/10 bg-devGray-dark/20 p-4 md:grid-cols-8 md:p-6"
      >
        <div className="md:col-span-8">
          <h2 className="font-semibold text-slate-900">Marca e participação</h2>
          <p className="mt-1 text-sm text-slate-500">
            Identidade visual, endereço e nível do patrocinador.
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
          name="url"
          control={form.control}
          render={({ field, fieldState }) => (
            <FormItem className="md:col-span-4">
              <FormLabel>URL</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              {fieldState.error && <span>{fieldState.error.message}</span>}
            </FormItem>
          )}
        />

        <FormField
          name="logo"
          control={form.control}
          render={({ field, fieldState }) => (
            <FormItem className="md:col-span-4">
              <FormLabel>Foto</FormLabel>
              <AdminImageUpload
                value={field.value}
                label="Logo do patrocinador"
                loading={loadingImage}
                error={uploadError}
                onFileSelect={handlePhotoFileChange}
              />
              <input type="hidden" {...field} />
              {fieldState.error && <span>{fieldState.error.message}</span>}
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
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(SponsorCategoryDisplayName).map(
                      ([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
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
              disabled={loading || form.formState.isSubmitting}
              className="admin-primary-action h-11 rounded-lg !bg-blue-600 sm:min-w-48"
            >
              {editing ? "Salvar alterações" : "Cadastrar"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
