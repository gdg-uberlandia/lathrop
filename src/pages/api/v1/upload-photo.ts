import type { NextApiRequest, NextApiResponse } from "next";
import { getStorage } from "firebase-admin/storage";
import { admin } from "@/utils/db";

export const config = {
  api: {
    bodyParser: false,
  },
};

import fs from "fs";
import formidable from "formidable";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const form = formidable();
    const [fields, files] = await form.parse(req);

    const fileArray = files.file as
      | formidable.File[]
      | formidable.File
      | undefined;
    const file = Array.isArray(fileArray) ? fileArray[0] : fileArray;
    if (!file) {
      return res.status(400).json({ error: "Arquivo não enviado" });
    }

    const folder = Array.isArray(fields.folder)
      ? fields.folder[0]
      : fields.folder || "";

    const bucket = getStorage(admin.app()).bucket(
      process.env.NEXT_PUBLIC_FIREBASE_BUCKET,
    );

    const fileName = `${folder}/speaker-${file.originalFilename}`;
    const upload = bucket.file(fileName);

    await upload.save(fs.readFileSync(file.filepath), {
      metadata: {
        contentType: file.mimetype ?? "application/octet-stream",
      },
      public: true,
      validation: false,
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
