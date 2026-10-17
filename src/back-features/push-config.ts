export function isPushEnabled() {
  return process.env.PUSH_ENABLED?.trim().toLowerCase() === "true";
}
