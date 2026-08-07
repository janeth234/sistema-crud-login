
import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede superar los 100 caracteres"),

  email: z
    .string()
    .trim()
    .email("El correo electrónico no es válido")
    .max(150, "El correo no puede superar los 150 caracteres")
    .transform((email) => email.toLowerCase()),

  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(72, "La contraseña no puede superar los 72 caracteres")
    .regex(/[A-Z]/, "La contraseña debe incluir una mayúscula")
    .regex(/[a-z]/, "La contraseña debe incluir una minúscula")
    .regex(/[0-9]/, "La contraseña debe incluir un número"),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("El correo electrónico no es válido")
    .transform((email) => email.toLowerCase()),

  password: z
    .string()
    .min(1, "La contraseña es obligatoria"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;