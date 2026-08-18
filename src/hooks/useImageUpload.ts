import { useState } from "react";
import { adminApiRequest } from "@/lib/admin-api/client";
import { AdminApiError, getAdminApiErrorMessage } from "@/lib/admin-api/errors";
import { isTransientHttpStatus } from "@/lib/admin-api/response";
import { ImageUploadFolder, ImageUploadTarget } from "@/contracts/image-upload";

const UPLOAD_RETRY_DELAY_MS = 1_500;

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

      const send = async () => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", target.folder);
        formData.append("entityId", target.entityId);
        formData.append("variant", target.variant);

        return adminApiRequest<{ url: string }>("/api/v1/upload-photo/", {
          method: "POST",
          body: formData,
        });
      };

      let data: { url: string } | undefined;
      for (let attempt = 0; attempt < 2; attempt += 1) {
        try {
          data = await send();
          break;
        } catch (attemptError) {
          const canRetry =
            attempt === 0 &&
            window.navigator.onLine &&
            (!(attemptError instanceof AdminApiError) ||
              attemptError.status === 0 ||
              isTransientHttpStatus(attemptError.status));
          if (!canRetry) throw attemptError;

          await new Promise((resolve) =>
            window.setTimeout(resolve, UPLOAD_RETRY_DELAY_MS),
          );
        }
      }

      if (!data) {
        throw new AdminApiError(0, "Não foi possível concluir o upload.");
      }

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
