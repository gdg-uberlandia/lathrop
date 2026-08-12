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
import { Textarea } from "@/assets/components/ui/textarea";
import { Company, CompanyInput, companyInputSchema } from "@/contracts/company";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";

export function CompanyForm({
  company,
  loading,
  onSubmit,
}: {
  company?: Company;
  loading?: boolean;
  onSubmit: (value: CompanyInput) => Promise<unknown> | unknown;
}) {
  const { uploadImage, loadingImage } = useImageUpload();
  const form = useForm<CompanyInput>({
    resolver: zodResolver(companyInputSchema),
    defaultValues: company
      ? {
          id: company.id,
          qrId: company.qrId,
          name: company.name,
          description: company.description,
          logoUrl: company.logoUrl,
          stampImageUrl: company.stampImageUrl,
          active: company.active,
          xpAwarded: company.xpAwarded,
        }
      : {
          id: uuidv4(),
          qrId: uuidv4(),
          name: "",
          description: null,
          logoUrl: "",
          stampImageUrl: null,
          active: true,
          xpAwarded: null,
        },
  });
  useUnsavedChanges(form.formState.isDirty && !form.formState.isSubmitting);
  const upload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    field: "logoUrl" | "stampImageUrl",
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    form.setValue(field, await uploadImage(file, "companies"), {
      shouldDirty: true,
      shouldValidate: true,
    });
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-6 rounded-2xl border border-white/10 bg-devGray-dark/20 p-4 md:grid-cols-8 md:p-6"
      >
        <div className="md:col-span-8">
          <h2 className="font-semibold text-slate-900">
            Informações da company
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Dados consumidos pelas missões e pela Pokedex.
          </p>
        </div>
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem className="md:col-span-5">
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="xpAwarded"
          control={form.control}
          render={({ field }) => (
            <FormItem className="md:col-span-3">
              <FormLabel>XP concedido</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value ? e.target.valueAsNumber : null,
                    )
                  }
                />
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
                <Textarea
                  rows={4}
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value || null)}
                />
              </FormControl>
              <p className="text-right text-xs text-slate-400">
                {field.value?.length ?? 0}/1000
              </p>
              <FormMessage />
            </FormItem>
          )}
        />
        {(["logoUrl", "stampImageUrl"] as const).map((name) => (
          <FormField
            key={name}
            name={name}
            control={form.control}
            render={({ field }) => (
              <FormItem className="md:col-span-4">
                <FormLabel>
                  {name === "logoUrl" ? "Logo" : "Imagem do selo"}
                </FormLabel>
                <div className="flex items-center gap-3">
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(event) => void upload(event, name)}
                    />
                  </FormControl>
                  {field.value && (
                    <Image
                      src={field.value}
                      alt="Prévia"
                      width={48}
                      height={48}
                      className="size-12 rounded-lg object-contain"
                    />
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <FormField
          name="active"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex items-center gap-3 md:col-span-8">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(value) => field.onChange(value === true)}
                />
              </FormControl>
              <FormLabel>Company ativa</FormLabel>
            </FormItem>
          )}
        />
        <div className="sticky bottom-3 z-10 flex flex-col-reverse gap-3 rounded-xl border bg-white/95 p-3 shadow-xl backdrop-blur sm:flex-row sm:justify-end md:col-span-8">
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
            disabled={loading || loadingImage || form.formState.isSubmitting}
            className="admin-primary-action h-11 !bg-blue-600 sm:min-w-48"
          >
            {company ? "Salvar alterações" : "Cadastrar company"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
