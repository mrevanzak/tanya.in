import type { NextAuthConfig } from "next-auth";
import { authSchema } from "@/server/api/routers/auth/auth.input";
import { db } from "@/server/db";
import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";

export default {
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
        const { email, password } = await authSchema.parseAsync(credentials);
        const user = await db.query.users.findFirst({
          where: (user, { eq }) => eq(user.email, email),
        });

        if (!user) throw new Error("User not found! Please sign up");

        if (!(await bcrypt.compare(password, user.password))) {
          throw new Error("Invalid credentials");
        }

        return {
          ...user,
          password: undefined,
        };
      },
    }),
  ],
} satisfies NextAuthConfig;
