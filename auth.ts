import Credentials from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import { formSchema } from "./lib";
import { getUserById } from "./data/user";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./lib/db";

import authConfig from "./auth.config";
import { getTwoFactorConfirmation } from "./data/two-factor-confirmation";
import { getAccountByUserId } from "./data/account";

declare module "next-auth" {
  interface User {
    /** The user's postal address. */
    role: "ADMIN" | "USER";
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(db),
  pages: {
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") {
        return true;
      }
      // @ts-ignore
      const existingUser = await getUserById(user.id);

      if (!existingUser?.emailVerified) {
        return false;
      }

      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmation(existingUser.id);
        if (!twoFactorConfirmation) {
          return false;
        }

        await db.twoFactorConfirmation.delete({
          where: {
            id: twoFactorConfirmation.id,
          },
        });
      }

      return true;
    },
    // @ts-ignore
    async session({ token, session }) {
      console.log(token);
      if (session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role;
      }

      if (session.user) {
        // @ts-ignore
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      }

      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email;
        // @ts-ignore
        session.user.isOAuth = token.isOAuth as boolean;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const user = await getUserById(token.sub);
      if (!user) return token;

      const account = await getAccountByUserId(user.id);

      token.isOAuth = !!account;
      token.name = user.name;
      token.email = user.email;
      token.role = user.role;
      token.isTwoFactorEnabled = user.isTwoFactorEnabled;

      return token;
    },
  },
  session: { strategy: "jwt" },
  ...authConfig,
}); 
