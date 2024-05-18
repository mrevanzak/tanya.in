import type { DefaultSession } from "next-auth";
import { signInFormSchema } from "@/lib/validation/sign-in";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import "next-auth/jwt";

type Role = "admin" | "user";

declare module "next-auth" {
  interface User {
    role: Role;
  }
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      role: Role;
      /**
       * By default, TypeScript merges new interface properties and overwrites existing ones.
       * In this case, the default session user properties will be overwritten,
       * with the new ones defined above. To keep the default session user properties,
       * you need to add them back into the newly declared interface.
       */
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: Role;
  }
}

export const {
  handlers: { GET, POST },
  signIn,
  signOut,
  auth,
} = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        const { email } = await signInFormSchema.parseAsync(credentials);

        return { name: "John Doe", email, role: "user" };
      },
    }),
  ],
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
});
