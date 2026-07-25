import { z } from "zod";

const emptyStringToUndefined = (value: unknown) => {
  if (typeof value !== "string") {
    return value;
  }

  const trimmedValue = value.trim();

  return trimmedValue === "" ? undefined : trimmedValue;
};

export const createTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "El título es obligatorio.")
    .max(120, "El título no puede superar los 120 caracteres."),
  description: z.preprocess(
    emptyStringToUndefined,
    z.string().trim().max(1000, "La descripción no puede superar los 1000 caracteres.").optional(),
  ),
  dueDate: z.preprocess(
    emptyStringToUndefined,
    z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "La fecha límite no es válida.")
      .transform((value) => new Date(`${value}T00:00:00.000`))
      .optional(),
  ),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
