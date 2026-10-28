"use client";

import * as React from "react";
import { Controller, FormProvider, useFormContext, type ControllerProps, type FieldPath, type FieldValues } from "react-hook-form";

const Form = FormProvider;
const FormFieldContext = React.createContext<{ name: string }>({ name: "" });

function FormField<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>(props: ControllerProps<TFieldValues, TName>) {
  return <FormFieldContext.Provider value={{ name: props.name }}><Controller {...props} /></FormFieldContext.Provider>;
}

function FormItem({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`space-y-1 ${className}`} {...props} />;
}

function FormLabel({ className = "", ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={className} {...props} />;
}

function FormControl({ children, ...props }: { children: React.ReactElement; className?: string }) {
  return React.cloneElement(children, props);
}

function FormMessage({ className = "" }: { className?: string }) {
  const { name } = React.useContext(FormFieldContext);
  const { formState } = useFormContext();
  const message = formState.errors[name]?.message;
  return message ? <p className={`text-xs text-red-500 ${className}`}>{String(message)}</p> : null;
}

export { Form, FormControl, FormField, FormItem, FormLabel, FormMessage };
