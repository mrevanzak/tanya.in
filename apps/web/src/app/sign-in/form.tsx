"use client";

import * as React from "react";
import Link from "next/link";
import { signIn } from "@/lib/actions/auth";
import { authSchema } from "@/server/api/routers/auth/auth.input";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { z } from "zod";
import { makeZodI18nMap } from "zod-i18n-map";

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

  const t = useTranslations("Signin");
  const zodi18n = useTranslations("Zod");
  // @ts-expect-error - lib doesn't support next-intl types
  z.setErrorMap(makeZodI18nMap({ t: zodi18n }));

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
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
              {t("title")}
            </Button>
            <Button variant="shadow" color="warning" className="w-full">
              {t("cta")}
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm">
          {t("noAccount")}{" "}
          <Link href="#" className="underline">
            {t("signUp")}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
