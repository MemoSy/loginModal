"use server";

import { signIn } from "@/auth";
import { getTwoFactorConfirmation } from "@/data/two-factor-confirmation";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { getUserByEmail } from "@/data/user";
import { formSchema } from "@/lib";
import { db } from "@/lib/db";
import { sendTwoFactorEmail, sendVerificationEmail } from "@/lib/mail";
import {
  generateTwoFactorToken,
  generateVerificationToken,
} from "@/lib/tokens";
import { AuthError } from "next-auth";
import * as z from "zod";

export default async function register(values: z.infer<typeof formSchema>) {
  const validatedValues = formSchema.safeParse(values);

  if (!validatedValues.success) {
    return {
      error: "بيانات النموذج غير صالحة",
    };
  }

  const { username, email, code } = validatedValues.data;

  const user = await getUserByEmail(email);

  if (!user || !user.email) {
    return { error: "معلومات غير صالحة" };
  }

  if (!user.emailVerified) {
    const verificationToken = await generateVerificationToken(user.email);

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );
    return { success: "تم إرسال التحقق!" };
  }

  if (user.isTwoFactorEnabled && user.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(user.email);

      if (!twoFactorToken) {
        return { error: "الرمز غير صحيح!" };
      }

      if (twoFactorToken.token !== code) {
        return { error: "رمز خاطئ!" };
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date();

      if (hasExpired) {
        return { error: "انتهت صلاحية الرمز!" };
      }

      await db.twoFactorToken.delete({
        where: { id: twoFactorToken.id },
      });

      const existingConfirmation = await getTwoFactorConfirmation(user.id);

      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: { id: existingConfirmation.id },
        });
      }

      await db.twoFactorConfirmation.create({
        data: {
          userId: user.id,
        },
      });
    } else {
      const twoFactorToken = await generateTwoFactorToken(user.email);

      await sendTwoFactorEmail(twoFactorToken.email, twoFactorToken.token);

      return { twoFactor: true };
    }
  }

  try {
    await signIn("credentials", {
      username,
      email,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.message) {
        case "CredentialsSignin":
          return {
            error: "بيانات الاعتماد غير صالحة",
          };
        default:
          return {
            error: "حدث خطأ",
          };
      }
    }

    throw error;
  }
}
