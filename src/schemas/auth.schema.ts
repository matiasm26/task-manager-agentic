import { z } from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "El nombre debe tener al menos 2 caracteres.")
      .max(80, "El nombre no puede superar los 80 caracteres."),
    email: z
      .string()
      .trim()
      .email("Ingresa un email válido.")
      .max(254, "El email no puede superar los 254 caracteres.")
      .transform((email) => email.toLowerCase()),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres.")
      .max(128, "La contraseña no puede superar los 128 caracteres."),
    passwordConfirmation: z.string().min(1, "Confirma la contraseña."),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Las contraseñas no coinciden.",
    path: ["passwordConfirmation"],
  });


export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Ingresa un email válido.")
    .max(254, "El email no puede superar los 254 caracteres.")
    .transform((email) => email.toLowerCase()),
  password: z.string().min(1, "Ingresa tu contraseña."),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
