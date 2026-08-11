import axios from "axios";
import { useState } from "react";
import { auth } from "@/utils/firebaseClient";

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

      const token = await auth.currentUser?.getIdToken();
      if (!token) throw new Error("Sessão não encontrada");

      const response = await axios.post("/api/v1/upload-photo/", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status < 200 || response.status >= 300) {
        throw new Error("Falha ao enviar foto");
      }

      const data = response.data;

      return data.url as string;
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
