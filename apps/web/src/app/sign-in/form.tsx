"use client";

import * as React from "react";
import Link from "next/link";
import { signIn } from "@/lib/actions/auth";
import { authSchema } from "@/server/api/routers/auth/auth.input";
import { useQueryClient } from "@tanstack/react-query";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { Button } from "@tanya.in/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@tanya.in/ui/card";
import { Form, FormInput, useForm } from "@tanya.in/ui/form";
import { toast } from "@tanya.in/ui/toast";

export function SignInForm() {
  const queryClient = useQueryClient();

  const [isVisible, setIsVisible] = React.useState(false);
  const [isPending, setIsPending] = React.useState(false);

  const methods = useForm({
    schema: authSchema,
    mode: "onTouched",
  });
  const { handleSubmit, control } = methods;

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...methods}>
          <form
            className="space-y-4"
            onSubmit={handleSubmit(async (data) => {
              await queryClient.invalidateQueries();
              setIsPending(true);
              const res = await signIn(data.email, data.password);
              if (res?.error) toast.error(res.error);
              setIsPending(false);
            })}
          >
            <FormInput name="email" type="email" control={control} />
            <FormInput
              name="password"
              control={control}
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={() => setIsVisible(!isVisible)}
                >
                  {isVisible ? (
                    <FaEyeSlash className="pointer-events-none text-2xl text-default-400" />
                  ) : (
                    <FaEye className="pointer-events-none text-2xl text-default-400" />
                  )}
                </button>
              }
              type={isVisible ? "text" : "password"}
            />

            <Button
              color="primary"
              type="submit"
              className="w-full"
              isLoading={isPending}
            >
              Login
            </Button>
            <Button variant="shadow" color="warning" className="w-full">
              Login with MyITS
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="#" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
