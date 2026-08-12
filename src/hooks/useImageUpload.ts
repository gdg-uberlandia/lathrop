import { useState } from "react";
import { adminApiRequest } from "@/lib/admin-api/client";
import { getAdminApiErrorMessage } from "@/lib/admin-api/errors";
import { ImageUploadFolder, ImageUploadTarget } from "@/contracts/image-upload";

export function useImageUpload() {
  const [loadingImage, setLoadingImage] = useState(false);
  const [error, setError] = useState("");

  const uploadImage = async <TFolder extends ImageUploadFolder>(
    file: File,
    target: ImageUploadTarget<TFolder>,
  ) => {
    try {
      setLoadingImage(true);
      setError("");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", target.folder);
      formData.append("entityId", target.entityId);
      formData.append("variant", target.variant);

      const data = await adminApiRequest<{ url: string }>(
        "/api/v1/upload-photo",
        {
          method: "POST",
          body: formData,
          retryOnNetworkError: true,
        },
      );

      return data.url;
    } catch (uploadError) {
      console.error("Erro ao enviar imagem:", uploadError);
      setError(
        getAdminApiErrorMessage(
          uploadError,
          "Não foi possível enviar a imagem.",
        ),
      );
      throw uploadError;
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
