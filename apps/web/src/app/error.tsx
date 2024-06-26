"use client";

// Error components must be Client Components
import * as React from "react";
import { signOut } from "@/lib/actions/auth";
import { useTranslations } from "next-intl";
import { RiAlarmWarningFill } from "react-icons/ri";

import { Button } from "@tanya.in/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: (Error & { digest?: string }) | { message: string };
  reset?: () => void;
}) {
  const t = useTranslations("Error");
  const isUnauthorized = error.message.includes("Unauthorized");
  const isMaintenance = error.message.includes("maintenance");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center space-y-4 text-center ">
      <RiAlarmWarningFill
        size={60}
        className="drop-shadow-glow animate-flicker text-danger"
      />
      <h1 className="max-w-prose text-balance">{error.message}</h1>
      <Button
        className="!mt-12"
        onClick={async () => {
          if (isUnauthorized) return await signOut();
          reset?.();
        }}
      >
        {isUnauthorized ? t("goToSignIn") : t("tryAgain")}
      </Button>
      {isMaintenance && (
        <Button
          onClick={async () => {
            await signOut();
          }}
        >
          {t("signInAsAdmin")}
        </Button>
      )}
    </div>
  );
}
