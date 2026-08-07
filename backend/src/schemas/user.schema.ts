import { z } from "zod";

export const updateUserSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "El nombre debe tener al menos 2 caracteres")
      .max(100, "El nombre no puede superar los 100 caracteres")
      .optional(),

    email: z
      .string()
      .trim()
      .email("El correo electrónico no es válido")
      .max(150, "El correo no puede superar los 150 caracteres")
      .transform((email) => email.toLowerCase())
      .optional(),

    role: z
      .enum(["USER", "ADMIN"], {
        message: "El rol debe ser USER o ADMIN",
      })
      .optional(),
  })
  .refine(
    (data) =>
      data.name !== undefined ||
      data.email !== undefined ||
      data.role !== undefined,
    {
      message: "Debes enviar al menos un campo para actualizar",
    },
  );

export type UpdateUserInput = z.infer<typeof updateUserSchema>;