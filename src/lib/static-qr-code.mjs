const prefixes = { company: "c", mission: "m", tag: "t" };

/** @param {"company" | "mission" | "tag"} type @param {string} qrId */
export function buildStaticQrPath(type, qrId) {
  if (
    !prefixes[type] ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      qrId,
    )
  ) {
    throw new Error("Invalid static QR target");
  }
  const bytes = qrId
    .replaceAll("-", "")
    .match(/.{2}/g)
    .map((byte) => String.fromCharCode(parseInt(byte, 16)))
    .join("");
  return `/q/${prefixes[type]}${btoa(bytes).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "")}`;
}
