import { buildStaticQrPath } from "./static-qr-code.mjs";

export function buildStaticQrUrl(
  type: "company" | "tag" | "mission",
  qrId: string,
) {
  const origin = process.env.NEXT_PUBLIC_APP_URL;
  if (!origin)
    throw new Error("Configure NEXT_PUBLIC_APP_URL com a origem da Pokédex");
  const appUrl = new URL(origin);
  if (
    !["http:", "https:"].includes(appUrl.protocol) ||
    appUrl.username ||
    appUrl.password ||
    appUrl.search ||
    appUrl.hash
  ) {
    throw new Error(
      "NEXT_PUBLIC_APP_URL deve ser uma URL HTTP ou HTTPS sem credenciais, parâmetros ou fragmento",
    );
  }
  return new URL(buildStaticQrPath(type, qrId), appUrl).toString();
}
