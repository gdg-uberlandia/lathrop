import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { speakerSchema, SpeakerFormValues } from "./add-speaker-form-schema";
import { Button } from "@/assets/components/ui/button";
import { Input } from "@/assets/components/ui/input";
import { Textarea } from "@/assets/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/assets/components/ui/select";
import {
  IconBrandLinkedin,
  IconBrandInstagram,
  IconBrandX,
  IconBrandGithub,
} from "@tabler/icons-react";
import { useEffect } from "react";

interface SpeakerFormProps {
  onSubmit: (data: SpeakerFormValues) => void;
  loading?: boolean;
  error?: string | null;
  speaker?: SpeakerFormValues;
}

export function SpeakerForm({
  onSubmit,
  loading,
  error,
  speaker,
}: SpeakerFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<SpeakerFormValues>({
    resolver: zodResolver(speakerSchema),
    defaultValues: speaker || {},
  });

  useEffect(() => {
    if (speaker) {
      reset(speaker);
    }
  }, [speaker, reset]);

  const handleFormSubmit = async (data: SpeakerFormValues) => {
    const res = await onSubmit(data);
    if (!speaker) {
      reset();
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="grid grid-cols-1 md:grid-cols-8 gap-6 p-4"
      >
        <div className="col-span-4">
          <label className="block text-sm font-medium text-white mb-1">
            Nome *
          </label>
          <Input {...register("name")} />
          {errors.name && (
            <span className="text-red-500 text-xs">{errors.name.message}</span>
          )}
        </div>

        <div className="col-span-4">
          <label className="block text-sm font-medium text-white mb-1">
            Foto (URL)
          </label>
          <Input {...register("photo")} />
        </div>

        <div className="col-span-8">
          <label className="block text-sm font-medium text-white mb-1">
            Mini Bio
          </label>
          <Textarea {...register("miniBio")} rows={5} />
        </div>

        <div className="col-span-1 md:col-span-8 grid grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <IconBrandLinkedin />
            <Input {...register("socialMedia.linkedIn")} />
          </div>
          <div className="flex items-center gap-2">
            <IconBrandInstagram />
            <Input {...register("socialMedia.instagram")} />
          </div>
          <div className="flex items-center gap-2">
            <IconBrandX />
            <Input {...register("socialMedia.twitter")} />
          </div>
          <div className="flex items-center gap-2">
            <IconBrandGithub />
            <Input {...register("socialMedia.github")} />
          </div>
        </div>

        <div className="col-span-3">
          <label className="block text-sm font-medium text-white mb-1">
            Empresa
          </label>
          <Input {...register("company")} />
        </div>

        <div className="col-span-3">
          <label className="block text-sm font-medium text-white mb-1">
            Título
          </label>
          <Input {...register("title")} />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-white mb-1">
            Tech
          </label>
          <Select
            value={watch("tech") || ""}
            onValueChange={(value) => setValue("tech", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Career">Carreira</SelectItem>
              <SelectItem value="MachineLearning">Machine Learning</SelectItem>
              <SelectItem value="Web">Web</SelectItem>
              <SelectItem value="UI_UX">UI/UX</SelectItem>
              <SelectItem value="Infra_Devops">Infra/Devops</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="col-span-8">
          <label className="block text-sm font-medium text-white mb-1">
            Tópico *
          </label>
          <Input {...register("topic")} />
          {errors.topic && (
            <span className="text-red-500 text-xs">{errors.topic.message}</span>
          )}
        </div>

        <div className="col-span-1 md:col-span-8">
          <label className="block text-sm font-medium text-white mb-1">
            Conteúdo *
          </label>
          <Textarea {...register("content")} rows={8} />
          {errors.content && (
            <span className="text-red-500 text-xs">
              {errors.content.message}
            </span>
          )}
        </div>

        {error && (
          <div className="col-span-1 md:col-span-2 text-red-500 text-sm">
            {error}
          </div>
        )}

        <div className="col-span-8 md:col-span-8 flex gap-4 mt-4 justify-center">
          {!speaker && (
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              className="w-full border-1 rounded-xl border-white  hover:border-white h-11"
              onClick={() => reset()}
            >
              Limpar
            </Button>
          )}
          <Button
            type="submit"
            disabled={loading}
            className="w-full text-white !bg-devBlue-dark rounded-xl border-1 border-devBlue-dark hover:border-white h-11"
          >
            {loading
              ? "Salvando..."
              : speaker
                ? "Salvar alterações"
                : "Cadastrar"}
          </Button>
        </div>
      </form>
    </>
  );
}
