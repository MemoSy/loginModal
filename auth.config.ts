import Credentials from "next-auth/providers/credentials";
import NextAuth, { NextAuthConfig } from "next-auth";
import { formSchema } from "./lib";
import { getUserByEmail } from "./data/user";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Credentials({
      // @ts-ignore
      async authorize(credentials) {
        const validatedFields = formSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email } = validatedFields.data;

          const user = await getUserByEmail(email);

          if (user) {
            return user;
          }
        }
        
        return null;
      }
    }),
  ],
} satisfies NextAuthConfig;
