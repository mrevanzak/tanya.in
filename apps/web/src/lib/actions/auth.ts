"use server";

import { signIn as attempt } from "@/server/auth";
import { AuthError } from "next-auth";

export async function signIn(email: string, password: string) {
  try {
    await attempt("credentials", {
      email: email,
      password: password,
      redirectTo: "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        error: error.cause?.err?.message ?? "Oops! Something went wrong!",
      };
    }
    throw error;
  }
}
