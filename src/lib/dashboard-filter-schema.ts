import { z } from "zod";
const date = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine(
    (v) =>
      !Number.isNaN(Date.parse(`${v}T00:00:00Z`)) &&
      new Date(`${v}T00:00:00Z`).toISOString().slice(0, 10) === v,
  );
export const dashboardFilterFields = {
  from: date.optional(),
  to: date.optional(),
  role: z
    .enum([
      "all",
      "participant",
      "staff",
      "reviewer",
      "sponsor",
      "editor",
      "admin",
    ])
    .default("all"),
};
export const validDashboardPeriod = (v: { from?: string; to?: string }) =>
  !v.from || !v.to || v.from <= v.to;
export const dashboardFiltersSchema = z
  .object(dashboardFilterFields)
  .refine(validDashboardPeriod, "Período inválido");
