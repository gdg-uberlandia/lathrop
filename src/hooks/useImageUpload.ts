import { useState } from "react";
import { adminApiRequest } from "@/lib/admin-api/client";

export function useImageUpload() {
  const [loadingImage, setLoadingImage] = useState(false);
  const [error, setError] = useState("");

  const uploadImage = async (file: File, folder: string) => {
    try {
      setLoadingImage(true);
      setError("");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder); // Adiciona o folder

      const data = await adminApiRequest<{ url: string }>(
        "/api/v1/upload-photo",
        {
          method: "POST",
          body: formData,
        },
      );

      return data.url;
    } catch (error) {
      console.error("Erro ao enviar foto:", error);
      setError("Erro ao enviar foto");
      throw error;
    } finally {
      setLoadingImage(false);
    }
  };
  return {
    uploadImage,
    loadingImage,
    error,
  };
}
