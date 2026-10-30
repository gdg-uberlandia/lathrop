const TRUSTED_SVG_HOSTS = new Set(["api.dicebear.com"]);
const DIRECT_IMAGE_HOSTS = new Set([
  "firebasestorage.googleapis.com",
  "storage.googleapis.com",
]);

export function shouldBypassImageOptimization(source?: string | null) {
  if (!source) return false;

  try {
    const url = new URL(source);
    const isSvgPath =
      url.pathname.endsWith(".svg") || url.pathname.endsWith("/svg");
    return (
      DIRECT_IMAGE_HOSTS.has(url.hostname) ||
      (TRUSTED_SVG_HOSTS.has(url.hostname) && isSvgPath)
    );
  } catch {
    return false;
  }
}
