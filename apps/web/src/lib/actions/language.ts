"use server";

import { cookies } from "next/headers";

// eslint-disable-next-line @typescript-eslint/require-await
export async function changeLanguage(value: string) {
  cookies().set("NEXT_LOCALE", value);

  // It does not matter what we return here
  return {
    status: "success",
  };
}
