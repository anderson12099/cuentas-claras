import { z } from "zod";
import { validationMessages } from "@/config/messages";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, validationMessages.email.required)
    .email(validationMessages.email.invalid),
  password: z
    .string()
    .min(1, validationMessages.password.required)
    .min(6, validationMessages.password.min),
});

export const registerSchema = z.object({
  nombre: z
    .string()
    .min(1, validationMessages.nombre.required)
    .min(2, validationMessages.nombre.min),
  email: z
    .string()
    .min(1, validationMessages.email.required)
    .email(validationMessages.email.invalid),
  password: z
    .string()
    .min(1, validationMessages.password.required)
    .min(6, validationMessages.password.min),
});

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
