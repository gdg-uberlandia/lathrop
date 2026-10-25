import { Button } from "@/assets/components/ui/button";
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
import { AdminImageUpload } from "@/components/admin/admin-image-upload";
import { AdminVisibilityControl } from "@/components/admin/admin-visibility-control";
import { Reward, RewardInput, rewardInputSchema } from "@/contracts/reward";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { Loader2 } from "lucide-react";

export function RewardForm({
  reward,
  loading,
  onSubmit,
}: {
  reward?: Reward;
  loading?: boolean;
  onSubmit: (value: RewardInput) => Promise<unknown>;
}) {
  const { uploadImage, loadingImage, error: uploadError } = useImageUpload();
  const form = useForm<RewardInput>({
    resolver: zodResolver(rewardInputSchema),
    defaultValues: reward
      ? rewardInputSchema.parse({
          id: reward.id,
          name: reward.name,
          description: reward.description,
          imageUrl: reward.imageUrl,
          ticketCost: reward.ticketCost,
          stock: reward.stock,
          redemptionLimit: reward.redemptionLimit,
          active: reward.active,
          order: reward.order,
        })
      : {
          id: uuidv4(),
          name: "",
          description: "",
          imageUrl: "",
          ticketCost: 1,
          stock: 0,
          redemptionLimit: null,
          active: true,
          order: 0,
        },
  });
  useUnsavedChanges(form.formState.isDirty && !form.formState.isSubmitting);
  const saving = loading || form.formState.isSubmitting;
  async function upload(file: File) {
    try {
      const url = await uploadImage(file, {
        folder: "rewards",
        entityId: form.getValues("id"),
        variant: "image",
      });
      form.setValue("imageUrl", url, {
        shouldDirty: true,
        shouldValidate: true,
      });
    } catch {
      // The upload component displays the hook's error.
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 rounded-2xl border border-slate-200 bg-white p-4 md:p-6"
      >
        <fieldset
          disabled={saving}
          className="grid min-w-0 grid-cols-1 gap-5 md:grid-cols-2"
        >
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Nome do brinde</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    maxLength={100}
                    placeholder="Ex.: Camiseta"
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
              <FormItem className="md:col-span-2">
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Textarea {...field} maxLength={240} rows={3} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {(
            [
              ["ticketCost", "Preço em tickets", 1, 1000],
              ["stock", "Estoque disponível", 0, undefined],
              ["order", "Ordem de exibição", 0, undefined],
            ] as const
          ).map(([name, label, min, max]) => (
            <FormField
              key={name}
              name={name}
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{label}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min={min}
                      max={max}
                      step={1}
                      onChange={(event) =>
                        field.onChange(event.target.valueAsNumber)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                  {name === "stock" && (
                    <p className="text-xs text-slate-500">
                      Quantidade restante para resgate. Cada troca diminui este
                      saldo.
                    </p>
                  )}
                </FormItem>
              )}
            />
          ))}
          <FormField
            name="redemptionLimit"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Limite por participante</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min={1}
                    max={100}
                    step={1}
                    value={field.value ?? ""}
                    placeholder="Sem limite"
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
                <p className="text-xs text-slate-500">
                  Deixe em branco para permitir resgates sem limite individual.
                </p>
              </FormItem>
            )}
          />
          <FormField
            name="imageUrl"
            control={form.control}
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Imagem do brinde</FormLabel>
                <AdminImageUpload
                  value={field.value}
                  label="Imagem do brinde"
                  loading={loadingImage}
                  error={uploadError}
                  disabled={saving}
                  onFileSelect={upload}
                />
                <FormControl>
                  <Input
                    {...field}
                    type="url"
                    placeholder="Ou informe a URL da imagem"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="active"
            control={form.control}
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormControl>
                  <AdminVisibilityControl
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    label="Disponibilidade do brinde"
                    description="Brindes ativos aparecem na lojinha da Pokédex. Desative para interromper novos resgates."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </fieldset>
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={saving || loadingImage}
            onClick={() => history.back()}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={saving || loadingImage}
            className="admin-primary-action !bg-blue-600"
          >
            {saving && (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            )}
            {reward ? "Salvar alterações" : "Cadastrar brinde"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
