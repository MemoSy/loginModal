"use server"

import { getUserById } from "@/data/user";
import { SettingsSchema } from "@/lib";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
  const user = await currentUser();

  if (!user) {
    return {
      error: "يجب عليك تسجيل الدخول لتحديث إعداداتك.",
    };
  }

  //@ts-ignore
  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    return {
      error: "يجب عليك تسجيل الدخول لتحديث إعداداتك.",
    };
  }

  await db.user.update({
    where: {
      id: dbUser.id,
    },
    data: {
      ...values,
    },
  });

  return {
    success: "تم تحديث البيانات",
  };
};



export const removeImage = async () => {
  const user = await currentUser();

  if (!user) {
    return {
      error: "يجب عليك تسجيل الدخول لتحديث إعداداتك.",
    };
  }

  //@ts-ignore
  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    return {
      error: "يجب عليك تسجيل الدخول لتحديث إعداداتك.",
    };
  }

  await db.user.update({
    where: {
      id: dbUser.id,
    },
    data: {
      image: "",
    },
  });

  return {
    success: "تم تحديث البيانات",
  };
};
