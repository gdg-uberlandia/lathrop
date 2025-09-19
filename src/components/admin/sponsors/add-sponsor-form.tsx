import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sponsorsSchema, SponsorsrFormValues } from "./add-sponsor-form-schema";
import { Button } from "@/assets/components/ui/button";
import { Input } from "@/assets/components/ui/input";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/assets/components/ui/select";

import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/assets/components/ui/form";

interface SpeakerFormProps {
  onSubmitForm: (data: SponsorsrFormValues) => void;
  loading?: boolean;
  sponsor?: SponsorsrFormValues;
}

export function SponsorForm({
  onSubmitForm,
  loading,
  sponsor,
}: SpeakerFormProps) {
  const form = useForm<z.infer<typeof sponsorsSchema>>({
    resolver: zodResolver(sponsorsSchema),
    defaultValues: sponsor || {},
  });

  async function handleFormSubmit(values: z.infer<typeof sponsorsSchema>) {
    await onSubmitForm(values);
    if (!sponsor) {
      form.reset();
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="grid grid-cols-1 md:grid-cols-8 gap-6 p-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="col-span-4">
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem className="col-span-4">
              <FormLabel>Website</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="logo"
          render={({ field }) => (
            <FormItem className="col-span-4">
              <FormLabel>Logo (url)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="levelName"
          render={({ field }) => (
            <FormItem className="col-span-4">
              <FormLabel>Cota</FormLabel>
              <Select
                value={form.watch("levelName")}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="superior">Organização</SelectItem>
                  <SelectItem value="diamond">Diamante</SelectItem>
                  <SelectItem value="gold">Ouro</SelectItem>
                  <SelectItem value="silver">Prata</SelectItem>
                  <SelectItem value="bronze">Bronze</SelectItem>
                  <SelectItem value="iron">Ferro</SelectItem>
                  <SelectItem value="ruby">Apoiador</SelectItem>
                  <SelectItem value="support">Parceiros</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="col-span-8 md:col-span-8 flex gap-4 mt-4 justify-center">
          {!sponsor && (
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              className="w-1/2 border-1 rounded-xl border-white  hover:border-white h-11"
              onClick={() => {
                form.reset();
              }}
            >
              Limpar
            </Button>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-1/2 text-white !bg-devBlue-dark rounded-xl border-1 border-devBlue-dark hover:border-white h-11"
          >
            {loading
              ? "Salvando..."
              : sponsor
                ? "Salvar alterações"
                : "Cadastrar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
