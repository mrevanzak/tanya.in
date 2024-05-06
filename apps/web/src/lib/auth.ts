import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { signInFormSchema } from "./validation/sign-in";

export const {
  handlers: { GET, POST },
  signIn,
  signOut,
  auth,
} = NextAuth({
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

        return { id: "1", name: "John Doe", email };
      },
    }),
  ],
});
