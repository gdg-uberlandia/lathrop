import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";

import {
  IMAGE_UPLOAD_TARGETS,
  ImageUploadFolder,
} from "@/contracts/image-upload";
import {
  createFirebaseDownloadUrl,
  resolveBucketName,
} from "@/lib/firebase-storage";
import { admin } from "@/utils/db";
import { getStorage } from "firebase-admin/storage";
import formidable from "formidable";
import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "@/utils/api/require-admin";

export const config = {
  api: {
    bodyParser: false,
  },
};

const extensionsByMimeType = new Map([
  ["image/gif", ".gif"],
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
]);
const validEntityId = /^[A-Za-z0-9_-]{1,128}$/;

const fieldValue = (value: string[] | string | undefined) =>
  Array.isArray(value) ? value[0] : value;

function isUploadFolder(value: string): value is ImageUploadFolder {
  return value in IMAGE_UPLOAD_TARGETS;
}

function isStoragePermissionError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 403
  );
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  if (!(await requireAdmin(req, res))) return;

  try {
    const form = formidable({ maxFileSize: 5 * 1024 * 1024 });
    const [fields, files] = await form.parse(req);
    const fileValue = files.file as
      | formidable.File[]
      | formidable.File
      | undefined;
    const file = Array.isArray(fileValue) ? fileValue[0] : fileValue;
    const folder = fieldValue(fields.folder);
    const entityId = fieldValue(fields.entityId);
    const variant = fieldValue(fields.variant);

    if (!file) {
      return res.status(400).json({ error: "Arquivo não enviado" });
    }

    if (!folder || !isUploadFolder(folder)) {
      return res.status(400).json({ error: "Pasta de upload inválida" });
    }

    if (!entityId || !validEntityId.test(entityId)) {
      return res
        .status(400)
        .json({ error: "Identificador da entidade inválido" });
    }

    if (!variant || !IMAGE_UPLOAD_TARGETS[folder].includes(variant as never)) {
      return res.status(400).json({ error: "Tipo de imagem inválido" });
    }

    const extension = file.mimetype
      ? extensionsByMimeType.get(file.mimetype)
      : undefined;
    if (!file.mimetype || !extension) {
      return res.status(400).json({ error: "Formato de imagem inválido" });
    }

    const objectPrefix = `${folder}/${entityId}/${variant}`;
    const objectName = `${objectPrefix}${extension}`;
    const firebaseApp = admin.app();
    const bucket = getStorage(firebaseApp).bucket(
      resolveBucketName(firebaseApp.options.storageBucket),
    );
    const upload = bucket.file(objectName);
    const downloadToken = randomUUID();

    await upload.save(await fs.readFile(file.filepath), {
      metadata: {
        contentType: file.mimetype,
        cacheControl: "public, max-age=3600",
        metadata: {
          firebaseStorageDownloadTokens: downloadToken,
        },
      },
      resumable: false,
    });

    await Promise.all(
      [...extensionsByMimeType.values()]
        .filter((storedExtension) => storedExtension !== extension)
        .map((storedExtension) =>
          bucket
            .file(`${objectPrefix}${storedExtension}`)
            .delete({ ignoreNotFound: true }),
        ),
    );

    const url = createFirebaseDownloadUrl(
      bucket.name,
      objectName,
      downloadToken,
    );

    return res.status(200).json({ url });
  } catch (error) {
    console.error("[upload-photo] Erro ao enviar para o bucket:", error);
    if (isStoragePermissionError(error)) {
      return res.status(503).json({
        error:
          "O servidor não possui permissão para gravar no Firebase Storage configurado.",
      });
    }
    return res.status(500).json({ error: "Erro ao enviar para o bucket" });
  }
}
