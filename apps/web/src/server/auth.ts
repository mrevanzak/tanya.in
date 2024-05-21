import type { DefaultSession } from "next-auth";
import authConfig from "@/server/auth.config";
import NextAuth from "next-auth";

import "next-auth/jwt";

import type { z } from "zod";
import { env } from "@/env";
import { users } from "@/server/db/schema";
import { createSelectSchema } from "drizzle-zod";

const user = createSelectSchema(users);
type UserData = Omit<z.infer<typeof user>, "password">;

declare module "next-auth" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface User extends UserData {}
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: UserData &
      /**
       * By default, TypeScript merges new interface properties and overwrites existing ones.
       * In this case, the default session user properties will be overwritten,
       * with the new ones defined above. To keep the default session user properties,
       * you need to add them back into the newly declared interface.
       */
      DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: UserData["role"];
  }
}

export const {
  handlers: { GET, POST },
  signIn,
  signOut,
  auth,
} = NextAuth({
  ...authConfig,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt({ token, user }) {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (user) token.role = user.role;
      return token;
    },
    session({ session, token }) {
      session.user.role = token.role;
      return session;
    },
  },
  debug: env.NODE_ENV === "development",
});
