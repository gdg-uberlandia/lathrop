import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

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

const allowedFolders = new Set(["missions", "speakers", "sponsors"]);
const allowedMimeTypes = new Set([
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

function resolveBucketName() {
  const configuredBucket = process.env.NEXT_PUBLIC_FB_BUCKET?.trim();

  if (!configuredBucket) {
    throw new Error("Firebase Storage bucket não configurado");
  }

  return configuredBucket.includes(".")
    ? configuredBucket
    : `${configuredBucket}.firebasestorage.app`;
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
    const folderValue = Array.isArray(fields.folder)
      ? fields.folder[0]
      : fields.folder;

    if (!file) {
      return res.status(400).json({ error: "Arquivo não enviado" });
    }

    if (!folderValue || !allowedFolders.has(folderValue)) {
      return res.status(400).json({ error: "Pasta de upload inválida" });
    }

    if (!file.mimetype || !allowedMimeTypes.has(file.mimetype)) {
      return res.status(400).json({ error: "Formato de imagem inválido" });
    }

    const extension = path.extname(file.originalFilename ?? "").toLowerCase();
    const objectName = `${folderValue}/${randomUUID()}${extension}`;
    const bucket = getStorage(admin.app()).bucket(resolveBucketName());
    const upload = bucket.file(objectName);

    await upload.save(await fs.readFile(file.filepath), {
      metadata: { contentType: file.mimetype },
      resumable: false,
    });

    const [url] = await upload.getSignedUrl({
      action: "read",
      expires: "03-01-2030",
    });

    return res.status(200).json({ url });
  } catch (error) {
    console.error("[upload-photo] Erro ao enviar para o bucket:", error);
    return res.status(500).json({ error: "Erro ao enviar para o bucket" });
  }
}
