import axios from "axios";
import { useState } from "react";

export function useImageUpload() {
  const [loadingImage, setLoadingImage] = useState(false);
  const [error, setError] = useState("");

  const uploadImage = async (file: File) => {
    try {
      setLoadingImage(true);

      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post("/api/v1/upload-photo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status < 200 || response.status >= 300) {
        throw new Error("Falha ao enviar foto");
      }

      const data = response.data;

      return data.url as string;
    } catch (error) {
      console.error("Erro ao enviar foto:", error);
      setError("Erro ao enviar foto");
      return "";
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
