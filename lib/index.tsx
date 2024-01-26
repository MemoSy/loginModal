import * as z from "zod";

export const formSchema = z.object({
  username: z.string().min(2).max(50),
  email: z.string().email(),
  code: z.optional(z.string()),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "البريد الالكتروني مطلوب",
  }),
});

export const NewPasswordSchema = z.object({
  username: z.string().min(6, {
    message: "الحد الأدنى من 6 أحرف مطلوبة",
  }),
});

export const SettingsSchema = z.object({
  name: z.optional(z.string()),
  isTwoFactorEnabled: z.optional(z.boolean()),
  role: z.enum(["ADMIN", "USER", "SUPERVISOR"]),
  email: z.optional(z.string().email()),
});
