"use server";

import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verficiation-token";

export default async function newVerification(token: string) {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return { error: "الرمز غير موجود!" };
  }

  // @ts-ignore
  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "انتهت صلاحية الرمز المميز!" };
  }

  // @ts-ignore
  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: "البريد الإلكتروني غير موجود!" };
  }

  await db.user.update({
    where: { id: existingUser.id },
    data: { 
      emailVerified: new Date(),
      // @ts-ignore
      email: existingToken.email,
    }
  });

  await db.verificationToken.delete({
    // @ts-ignore
    where: { id: existingToken.id }
  });

  return { success: "تم التحقق من البريد الإلكتروني!" };
};