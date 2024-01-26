"use server";

import { formSchema } from "@/lib";
import { db } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import { z } from "zod";

export default async function login(values: z.infer<typeof formSchema>) {
  const validatedValues = formSchema.safeParse(values);

  if (!validatedValues.success) {
    return {
      error: "Invalid form data",
    };
  }

  const { username, email } = validatedValues.data;

  await db.user.create({
    data: {
      name: username,
      email,
    },
  });

  const verificationToken = await generateVerificationToken(email);

  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return { success: "Verification Sent!" };
}
