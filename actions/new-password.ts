"use server";

import * as z from "zod";

import { getPasswordResetTokenByToken } from "@/data/password-reset-token";
import { getUserByEmail } from "@/data/user";
import { db } from "@/lib/db";
import { NewPasswordSchema } from "@/lib";

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema> ,
  token?: string | null,
) => {
  if (!token) {
    return { error: "رمز مفقود!" };
  }

  const validatedFields = NewPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "الحقول غير صالحة!" };
  }

  const { username } = validatedFields.data;

  const existingToken = await getPasswordResetTokenByToken(token);

  if (!existingToken) {
    return { error: "رمز غير صالح!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "انتهت صلاحية الرمز المميز!" };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: "البريد الإلكتروني غير موجود!" }
  }



  await db.user.update({
    where: { id: existingUser.id },
    data: { name: username },
  });

  await db.passwordResetToken.delete({
    where: { id: existingToken.id }
  });

  return { success: "تم تحديث كلمة السر!" };
};