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
import { Checkbox } from "@/assets/components/ui/checkbox";
import Loading from "@/components/admin/loading-overlay";
import { useImageUpload } from "@/hooks/useImageUpload";
import { Mission } from "@/models/mission";
import { Profile } from "@/models/profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { MissionFormType, missionSchema } from "./missions-schema";

export interface MissionFormProps {
  editing?: boolean;
  loading?: boolean;
  onSubmit: (data: Mission) => void;
  mission?: Mission;
}

export function MissionsForm({
  editing = false,
  loading = false,
  onSubmit,
  mission,
}: MissionFormProps) {
  const { uploadImage, loadingImage } = useImageUpload();
  const [reviewerDropdownOpen, setReviewerDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Profile[]>([]);
  const [searching, setSearching] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  const form = useForm<MissionFormType>({
    resolver: zodResolver(missionSchema),
    defaultValues: {
      id: editing && mission?.id ? mission.id : uuidv4(),
      name: mission?.name ?? "",
      description: mission?.description ?? "",
      details: mission?.details ?? "",
      qrMission: mission?.qrMission ?? false,
      reviewer: mission?.reviewer ?? [],
      image: mission?.image ?? "",
    },
  });

  useEffect(() => {
    if (editing && mission) {
      Object.entries(mission).forEach(([key, value]) => {
        if (key !== "id") form.setValue(key as keyof MissionFormType, value);
      });
    } else {
      form.reset({
        id: uuidv4(),
        name: "",
        description: "",
        details: "",
        qrMission: false,
        reviewer: [],
        image: "",
      });
    }
  }, [editing, mission, form]);

  // Cleanup do timer quando o componente for desmontado
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  const submitHandler = (data: MissionFormType) => {
    onSubmit(data as Mission);
    if (!editing) {
      form.reset({
        id: uuidv4(),
        name: "",
        description: "",
        details: "",
        qrMission: false,
        reviewer: [],
        image: "",
      });
    }
  };

  const handleImageFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadImage(file, "missions");
      form.setValue("image", url, { shouldValidate: true });
    } catch (err) {
      console.error("Erro ao enviar imagem", err);
    }
  };

  const handleSearchProfiles = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const token = await (await import("firebase/auth"))
        .getAuth()
        .currentUser?.getIdToken();

      const response = await fetch(
        `/api/v1/profiles?search=${encodeURIComponent(query)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await response.json();

      // Garantir que data é um array
      if (Array.isArray(data)) {
        setSearchResults(data);
      } else {
        console.error("Resposta da API não é um array:", data);
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Erro ao buscar profiles:", error);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleSearchWithDebounce = (query: string) => {
    // Limpar timer anterior
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Se query for muito curta, limpar resultados imediatamente
    if (query.length < 2) {
      setSearchResults([]);
      setReviewerDropdownOpen(false);
      return;
    }

    // Criar novo timer de 350ms
    const timer = setTimeout(() => {
      handleSearchProfiles(query);
    }, 350);

    setDebounceTimer(timer);
  };

  return (
    <>
      {loadingImage && <Loading />}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submitHandler)}
          className="grid grid-cols-1 md:grid-cols-8 gap-6 p-4"
        >
          <FormField
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <FormItem className="col-span-8">
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                {fieldState.error && <span>{fieldState.error.message}</span>}
              </FormItem>
            )}
          />

          <FormField
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <FormItem className="col-span-8">
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Textarea {...field} rows={3} />
                </FormControl>
                {fieldState.error && <span>{fieldState.error.message}</span>}
              </FormItem>
            )}
          />

          <FormField
            name="details"
            control={form.control}
            render={({ field, fieldState }) => (
              <FormItem className="col-span-8">
                <FormLabel>Detalhes</FormLabel>
                <FormControl>
                  <Textarea {...field} rows={4} />
                </FormControl>
                {fieldState.error && <span>{fieldState.error.message}</span>}
              </FormItem>
            )}
          />

          <FormField
            name="image"
            control={form.control}
            render={({ field, fieldState }) => (
              <FormItem className="col-span-8">
                <FormLabel>Imagem da Missão</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-2">
                    <Input
                      id="mission-image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
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
                          borderRadius: "4px",
                        }}
                      />
                    )}
                  </div>
                </FormControl>
                {fieldState.error && <span>{fieldState.error.message}</span>}
              </FormItem>
            )}
          />

          <FormField
            name="reviewer"
            control={form.control}
            render={({ field }) => (
              <FormItem className="col-span-8">
                <FormLabel>Revisores (Emails)</FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Digite para buscar por email ou nome..."
                        value={searchQuery}
                        onChange={(e) => {
                          const value = e.target.value;
                          setSearchQuery(value);
                          handleSearchWithDebounce(value);
                          if (value.length >= 2) {
                            setReviewerDropdownOpen(true);
                          }
                        }}
                        onFocus={() => {
                          if (searchQuery.length >= 2) {
                            setReviewerDropdownOpen(true);
                          }
                        }}
                        className="w-full"
                      />
                      {reviewerDropdownOpen && searchQuery.length >= 2 && (
                        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover p-2 shadow-md max-h-60 overflow-y-auto">
                          {searching ? (
                            <div className="p-2 text-sm text-muted-foreground">
                              Buscando...
                            </div>
                          ) : searchResults.length === 0 ? (
                            <div className="p-2 text-sm text-muted-foreground">
                              Nenhum perfil encontrado
                            </div>
                          ) : (
                            searchResults.map((profile) => (
                              <div
                                key={profile.id}
                                className="flex items-center space-x-2 p-2 hover:bg-accent rounded-sm cursor-pointer"
                                onClick={() => {
                                  const currentValue = field.value || [];
                                  if (!currentValue.includes(profile.email)) {
                                    field.onChange([
                                      ...currentValue,
                                      profile.email,
                                    ]);
                                    setSearchQuery("");
                                    setSearchResults([]);
                                    setReviewerDropdownOpen(false);
                                  }
                                }}
                              >
                                <Checkbox
                                  checked={
                                    field.value?.includes(profile.email) ||
                                    false
                                  }
                                  onCheckedChange={() => {}}
                                />
                                <span className="text-sm">
                                  {profile.email}
                                  {profile.name && ` (${profile.name})`}
                                </span>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                    {field.value.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {field.value.map((email) => (
                          <div
                            key={email}
                            className="flex items-center gap-1 bg-devBlue-dark/20 text-white px-2 py-1 rounded-md text-sm"
                          >
                            <span>{email}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const newValue = field.value.filter(
                                  (e) => e !== email,
                                );
                                field.onChange(newValue);
                              }}
                              className="hover:text-devRed-dark"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            name="qrMission"
            control={form.control}
            render={({ field, fieldState }) => (
              <FormItem className="col-span-8 flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Missão QR Code</FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Marque se esta missão requer leitura de QR Code
                  </p>
                </div>
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
    </>
  );
}
