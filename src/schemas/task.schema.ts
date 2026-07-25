import { TaskPriority, TaskStatus } from "@prisma/client";
import { z } from "zod";

const taskPriorityValues = [TaskPriority.LOW, TaskPriority.MEDIUM, TaskPriority.HIGH] as const;
const taskStatusValues = [TaskStatus.PENDING, TaskStatus.IN_PROGRESS, TaskStatus.COMPLETED] as const;

const emptyStringToUndefined = (value: unknown) => {
  if (typeof value !== "string") {
    return value;
  }

  const trimmedValue = value.trim();

  return trimmedValue === "" ? undefined : trimmedValue;
};

const dueDateSchema = z.preprocess(
  emptyStringToUndefined,
  z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "La fecha límite no es válida.")
    .refine((value) => !Number.isNaN(new Date(`${value}T00:00:00.000`).getTime()), "La fecha límite no es válida.")
    .transform((value) => new Date(`${value}T00:00:00.000`))
    .optional(),
);

const descriptionSchema = z.preprocess(
  emptyStringToUndefined,
  z.string().trim().max(1000, "La descripción no puede superar los 1000 caracteres.").optional(),
);

const titleSchema = z
  .string()
  .trim()
  .min(1, "El título es obligatorio.")
  .max(120, "El título no puede superar los 120 caracteres.");

export const taskIdSchema = z.coerce.number().int().positive();

export const createTaskSchema = z.object({
  title: titleSchema,
  description: descriptionSchema,
  dueDate: dueDateSchema,
});

export const updateTaskSchema = z.object({
  title: titleSchema,
  description: descriptionSchema,
  dueDate: dueDateSchema,
  status: z.enum(taskStatusValues, {
    message: "El estado seleccionado no es válido.",
  }),
  priority: z.enum(taskPriorityValues, {
    message: "La prioridad seleccionada no es válida.",
  }),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
