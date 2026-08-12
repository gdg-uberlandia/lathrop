import { Button } from "@/assets/components/ui/button";
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
import { Textarea } from "@/assets/components/ui/textarea";
import { Raffle, RaffleInput, raffleInputSchema } from "@/contracts/raffle";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";

export function RaffleForm({
  raffle,
  loading,
  onSubmit,
}: {
  raffle?: Raffle;
  loading?: boolean;
  onSubmit: (value: RaffleInput) => unknown;
}) {
  const { uploadImage, loadingImage, error: uploadError } = useImageUpload();
  const form = useForm<RaffleInput>({
    resolver: zodResolver(raffleInputSchema),
    defaultValues: raffle
      ? {
          id: raffle.id,
          prizeName: raffle.prizeName,
          description: raffle.description,
          imageUrl: raffle.imageUrl,
          order: raffle.order,
          active: raffle.active,
        }
      : {
          id: uuidv4(),
          prizeName: "",
          description: null,
          imageUrl: null,
          order: 0,
          active: true,
        },
  });
  useUnsavedChanges(form.formState.isDirty && !form.formState.isSubmitting);
  const upload = async (file: File) => {
    try {
      form.setValue(
        "imageUrl",
        await uploadImage(file, {
          folder: "raffles",
          entityId: form.getValues("id"),
          variant: "image",
        }),
        {
          shouldDirty: true,
          shouldValidate: true,
        },
      );
    } catch {
      // A mensagem do hook é exibida no componente.
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-6 rounded-2xl border border-white/10 bg-devGray-dark/20 p-4 md:grid-cols-8 md:p-6"
      >
        <div className="md:col-span-8">
          <h2 className="font-semibold text-slate-900">Dados do prêmio</h2>
          <p className="mt-1 text-sm text-slate-500">
            Resultado, candidato e vencedor são controlados exclusivamente pela
            Pokedex.
          </p>
        </div>
        <FormField
          name="prizeName"
          control={form.control}
          render={({ field }) => (
            <FormItem className="md:col-span-6">
              <FormLabel>Nome do prêmio</FormLabel>
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
            <FormItem className="md:col-span-2">
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
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="imageUrl"
          control={form.control}
          render={({ field }) => (
            <FormItem className="md:col-span-8">
              <FormLabel>Imagem</FormLabel>
              <AdminImageUpload
                value={field.value}
                label="Imagem do prêmio"
                loading={loadingImage}
                error={uploadError}
                onFileSelect={upload}
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
                  label="Disponibilidade do prêmio"
                  description="Prêmios ativos ficam disponíveis para uso nos sorteios."
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
            {raffle ? "Salvar alterações" : "Cadastrar prêmio"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
