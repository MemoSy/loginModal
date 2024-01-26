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
      error: "You must be logged in to update your settings.",
    };
  }

  //@ts-ignore
  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    return {
      error: "You must be logged in to update your settings.",
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
    success: "Settings updated.",
  };
};
