import { Button } from "@/assets/components/ui/button";
import { AdminQrCodeCard } from "@/components/admin/admin-qr-code-card";
import { AdminVisibilityControl } from "@/components/admin/admin-visibility-control";
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
import { Tag, TagInput, tagInputSchema } from "@/contracts/tag";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";

export function TagForm({
  tag,
  loading,
  onSubmit,
}: {
  tag?: Tag;
  loading?: boolean;
  onSubmit: (value: TagInput) => unknown;
}) {
  const { uploadImage, loadingImage } = useImageUpload();
  const form = useForm<TagInput>({
    resolver: zodResolver(tagInputSchema),
    defaultValues: tag
      ? {
          id: tag.id,
          qrId: tag.qrId,
          name: tag.name,
          description: tag.description,
          imageUrl: tag.imageUrl,
          active: tag.active,
          order: tag.order,
          xpAwarded: tag.xpAwarded,
        }
      : {
          id: uuidv4(),
          qrId: uuidv4(),
          name: "",
          description: "",
          imageUrl: "",
          active: true,
          order: 0,
          xpAwarded: null,
        },
  });
  useUnsavedChanges(form.formState.isDirty && !form.formState.isSubmitting);
  const upload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file)
      form.setValue("imageUrl", await uploadImage(file, "tags"), {
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
          <h2 className="font-semibold text-slate-900">Informações da tag</h2>
          <p className="mt-1 text-sm text-slate-500">
            O QR é gerado automaticamente e consumido pela Pokedex.
          </p>
        </div>
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem className="md:col-span-8">
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="order"
          control={form.control}
          render={({ field }) => (
            <FormItem className="md:col-span-1">
              <FormLabel>Ordem</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  {...field}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
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
              <FormLabel>XP</FormLabel>
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
                <Textarea rows={4} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="imageUrl"
          control={form.control}
          render={({ field }) => (
            <FormItem className="md:col-span-5">
              <FormLabel>Imagem</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => void upload(e)}
                />
              </FormControl>
              {field.value && (
                <Image
                  src={field.value}
                  alt="Prévia"
                  width={72}
                  height={72}
                  className="mt-3 size-18 rounded-lg object-contain"
                />
              )}
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="md:col-span-8">
          <AdminQrCodeCard
            value={form.watch("qrId")}
            downloadName={`tag-${form.watch("id")}`}
            entityLabel="esta tag"
          />
        </div>
        <FormField
          name="active"
          control={form.control}
          render={({ field }) => (
            <FormItem className="md:col-span-8">
              <FormControl>
                <AdminVisibilityControl
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  label="Disponibilidade da tag"
                  description="Tags ativas podem ser lidas e exibidas para os participantes."
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="sticky bottom-3 z-10 flex gap-3 p-3 md:col-span-8 md:justify-end">
          <Button
            type="button"
            variant="outline"
            className="!border-slate-300 !bg-white !text-slate-700 hover:!bg-slate-50 hover:!text-slate-900"
            onClick={() => history.back()}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={loading || loadingImage || form.formState.isSubmitting}
            className="admin-primary-action !bg-blue-600"
          >
            {tag ? "Salvar alterações" : "Cadastrar tag"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
