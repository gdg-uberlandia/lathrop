import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidv4 } from "uuid";
import { sponsorFormSchema, SponsorFormType } from "./sponsors-schema";
import { Input } from "@/assets/components/ui/input";
import { Button } from "@/assets/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/assets/components/ui/select";
import { useImageUpload } from "@/hooks/useImageUpload";
import { Sponsor, SponsorCategoryDisplayName } from "@/models/sponsor";
import Loading from "@/components/admin/loading-overlay";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/assets/components/ui/form";
import Image from "next/image";

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
  const { uploadImage, loadingImage } = useImageUpload();
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

  const handlePhotoFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadImage(file, "sponsors");
      form.setValue("logo", url, { shouldValidate: true });
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
    <>
      {loadingImage ? (
        <Loading />
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onFormSubmit)}
            className="grid grid-cols-1 md:grid-cols-8 gap-6 p-4"
          >
            <FormField
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <FormItem className="col-span-4">
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
                <FormItem className="col-span-4">
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
                <FormItem className="col-span-4">
                  <FormLabel>Foto</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Input
                        id="picture"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoFileChange}
                      />

                      {field.value && (
                        <Image
                          src={field.value}
                          alt="Preview"
                          width={32}
                          height={32}
                          style={{
                            maxWidth: 32,
                            maxHeight: 32,
                            objectFit: "cover",
                          }}
                          className="rounded-full"
                        />
                      )}
                      {/* Hidden input to keep photo URL in form state */}
                      <input type="hidden" {...field} />
                    </div>
                  </FormControl>
                  {fieldState.error && <span>{fieldState.error.message}</span>}
                </FormItem>
              )}
            />

            <FormField
              name="category"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-4">
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

            <div className="col-span-8 md:col-span-8 flex gap-4 mt-4 justify-center">
              <Button
                type="submit"
                disabled={loading}
                className="w-full text-white !bg-devBlue-dark rounded-xl border-1 border-devBlue-dark hover:border-white h-11"
              >
                {editing ? "Salvar alterações" : "Cadastrar"}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </>
  );
}
