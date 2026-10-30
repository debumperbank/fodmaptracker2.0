export function safeNextPath(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return "/dashboard";
  if (value.includes("://") || value.includes("\\")) return "/dashboard";
  return value;
}
