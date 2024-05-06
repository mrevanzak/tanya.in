import type { SignInFormValues } from "@/lib/validation/sign-in";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";

import { toast } from "@tanya.in/ui/toast";

export default function useSignIn() {
  const searchParams = useSearchParams();
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ email, password }: SignInFormValues) => {
      await Promise.resolve(
        signIn("credentials", {
          email,
          password,
          redirect: false,
        }).then((res) => {
          if (!res?.ok) {
            throw new Error(res?.error ?? "Something went wrong!");
          }
          return res;
        }),
      );
    },
    onSuccess: () => {
      toast.success("Login success!");
      router.push(searchParams.get("callbackUrl") ?? "/");
    },
  });
}
