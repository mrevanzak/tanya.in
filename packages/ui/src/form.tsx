"use client";

import type { InputProps } from "@nextui-org/input";
import type {
  FieldPath,
  FieldValues,
  UseControllerProps,
  UseFormProps,
} from "react-hook-form";
import type { ZodType, ZodTypeDef } from "zod";
import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@nextui-org/input";
import {
  useForm as __useForm,
  FormProvider,
  useController,
} from "react-hook-form";

const useForm = <TOut, TDef extends ZodTypeDef, TIn extends FieldValues>(
  props: Omit<UseFormProps<TIn>, "resolver"> & {
    schema: ZodType<TOut, TDef, TIn>;
  },
) => {
  const form = __useForm<TIn>({
    ...props,
    resolver: zodResolver(props.schema, undefined),
  });

  return form;
};

const Form = FormProvider;

const FormInput = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: UseControllerProps<TFieldValues, TName> & InputProps) => {
  const { field, fieldState } = useController({
    name: props.name,
    control: props.control,
  });

  return (
    <Input
      {...field}
      //automatically capitalize the first letter of the label and replace camel case with normal case
      label={props.name
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase())}
      isInvalid={fieldState.invalid}
      errorMessage={fieldState.error?.message}
      isClearable
      {...props}
    />
  );
};

export { useForm, Form, FormInput };

export { useFieldArray } from "react-hook-form";
