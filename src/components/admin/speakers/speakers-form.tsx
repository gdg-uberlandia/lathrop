import { Button } from "@/assets/components/ui/button";
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
import { Speaker } from "@/models/speaker";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import router from "next/router";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { SpeakerFormType, speakerSchema } from "./speakers-schema";

export interface SpeakerFormProps {
  editing?: boolean;
  loading?: boolean;
  onSubmit: (data: Speaker) => void;
  speaker?: Speaker;
}

export function SpeakersForm({
  editing = false,
  loading = false,
  onSubmit,
  speaker,
}: SpeakerFormProps) {
  const { uploadImage, loadingImage } = useImageUpload();

  const form = useForm<SpeakerFormType>({
    resolver: zodResolver(speakerSchema),
    defaultValues: {
      id: editing && speaker?.id ? speaker.id : uuidv4(),
      name: speaker?.name ?? "",
      content: speaker?.content ?? "",
      topic: speaker?.topic ?? "",
    },
  });

  useEffect(() => {
    if (editing && speaker) {
      Object.entries(speaker).forEach(([key, value]) => {
        if (key !== "id") form.setValue(key as keyof SpeakerFormType, value);
      });
    } else {
      form.reset({ id: uuidv4() });
    }
  }, [editing, speaker, form]);

  const submitHandler = (data: SpeakerFormType) => {
    onSubmit(data);
    if (!editing) {
      form.reset({
        id: uuidv4(),
        name: "",
        photo: "",
        miniBio: "",
        socialMedia: {
          github: "",
          instagram: "",
          linkedIn: "",
          twitter: "",
          website: "",
        },
        company: "",
        title: "",
        tech: "",
        topic: "",
        content: "",
      });
    }
  };

  const handlePhotoFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadImage(file, "speakers");
      form.setValue("photo", url, { shouldValidate: true });
    } catch (err) {
      console.error("Erro ao enviar foto", err);
    }
  };

  return (
    <>
      {loadingImage ? (
        <Loading />
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(submitHandler)}
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
              name="photo"
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
              name="miniBio"
              control={form.control}
              render={({ field, fieldState }) => (
                <FormItem className="col-span-8">
                  <FormLabel>Mini Bio</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={4} />
                  </FormControl>
                  {fieldState.error && <span>{fieldState.error.message}</span>}
                </FormItem>
              )}
            />

            <div className="col-span-1 md:col-span-8 grid grid-cols-5 gap-4">
              <FormField
                name="socialMedia.github"
                control={form.control}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>GitHub</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    {fieldState.error && (
                      <span>{fieldState.error.message}</span>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                name="socialMedia.instagram"
                control={form.control}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Instagram</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    {fieldState.error && (
                      <span>{fieldState.error.message}</span>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                name="socialMedia.linkedIn"
                control={form.control}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>LinkedIn</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    {fieldState.error && (
                      <span>{fieldState.error.message}</span>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                name="socialMedia.twitter"
                control={form.control}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Twitter</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    {fieldState.error && (
                      <span>{fieldState.error.message}</span>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                name="socialMedia.website"
                control={form.control}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    {fieldState.error && (
                      <span>{fieldState.error.message}</span>
                    )}
                  </FormItem>
                )}
              />
            </div>

            <FormField
              name="company"
              control={form.control}
              render={({ field, fieldState }) => (
                <FormItem className="col-span-3">
                  <FormLabel>Empresa</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  {fieldState.error && <span>{fieldState.error.message}</span>}
                </FormItem>
              )}
            />

            <FormField
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <FormItem className="col-span-3">
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  {fieldState.error && <span>{fieldState.error.message}</span>}
                </FormItem>
              )}
            />

            <FormField
              name="tech"
              control={form.control}
              render={({ field, fieldState }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Tech</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  {fieldState.error && <span>{fieldState.error.message}</span>}
                </FormItem>
              )}
            />

            <FormField
              name="topic"
              control={form.control}
              render={({ field, fieldState }) => (
                <FormItem className="col-span-8">
                  <FormLabel>Tópico</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  {fieldState.error && <span>{fieldState.error.message}</span>}
                </FormItem>
              )}
            />

            <FormField
              name="content"
              control={form.control}
              render={({ field, fieldState }) => (
                <FormItem className="col-span-1 md:col-span-8">
                  <FormLabel>Conteúdo</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={5} />
                  </FormControl>
                  {fieldState.error && <span>{fieldState.error.message}</span>}
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
