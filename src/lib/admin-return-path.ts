export function adminDestinationWithReturnTo(
  pathname: string,
  returnTo: string,
) {
  return { pathname, query: { returnTo } };
}

export function adminPathWithReturnTo(pathname: string, returnTo: string) {
  return `${pathname}?returnTo=${encodeURIComponent(returnTo)}`;
}

export function resolveAdminReturnTo(
  value: string | string[] | undefined,
  fallback: string,
) {
  const candidate = Array.isArray(value) ? value[0] : value;
  if (
    !candidate ||
    !candidate.startsWith("/admin/") ||
    candidate.startsWith("//")
  )
    return fallback;
  return candidate;
}
