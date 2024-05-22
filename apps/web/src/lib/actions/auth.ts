"use server";

import { signInServer, signOutServer } from "@/server/auth";
import { AuthError } from "next-auth";

export async function signIn(email: string, password: string) {
  try {
    await signInServer("credentials", {
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

export async function signOut() {
  await signOutServer();
}
