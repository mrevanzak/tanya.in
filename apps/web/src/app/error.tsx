"use client";

// Error components must be Client Components
import * as React from "react";
import { signOut } from "next-auth/react";
import { RiAlarmWarningFill } from "react-icons/ri";

import { Button } from "@tanya.in/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const isUnauthorized = error.message?.includes("Unauthorized");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center space-y-4 text-center ">
      <RiAlarmWarningFill
        size={60}
        className="drop-shadow-glow animate-flicker text-danger"
      />
      <h1>{error.message ?? "Oops, something went wrong!"}</h1>
      <Button
        onClick={async () => {
          if (isUnauthorized) return await signOut();
          reset();
        }}
      >
        {isUnauthorized ? "Go to sign in page" : "Try again"}
      </Button>
    </div>
  );
}
