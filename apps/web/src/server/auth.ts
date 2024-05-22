import type { DefaultSession } from "next-auth";
import type { z } from "zod";
import { env } from "@/env";
import authConfig from "@/server/auth.config";
import { users } from "@/server/db/schema";
import { createSelectSchema } from "drizzle-zod";
import NextAuth from "next-auth";

const user = createSelectSchema(users);
type UserData = Omit<z.infer<typeof user>, "password">;

declare module "next-auth" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface User extends UserData {}
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session extends DefaultSession {
    user: User;
  }
}

export const {
  handlers: { GET, POST },
  signIn: signInServer,
  signOut: signOutServer,
  auth,
} = NextAuth({
  ...authConfig,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt({ token, user }) {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (user) token.user = user;
      return token;
    },
    session({ session, token }) {
      //@ts-expect-error - next-auth type is pain in the ass
      session.user = token.user;
      return session;
    },
  },
  debug: env.NODE_ENV === "development",
});
