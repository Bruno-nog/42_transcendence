import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, "O usuário deve conter no mínimo 3 caracteres"),

  email: z.email("E-mail inválido"),

  password: z
    .string()
    .min(6, "A senha deve conter no mínimo 6 caracteres"),
});

export type RegisterFormData = z.infer<typeof registerSchema>;