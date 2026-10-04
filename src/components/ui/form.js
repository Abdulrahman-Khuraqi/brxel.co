"use client";

import { createContext, useContext, useId } from "react";
import { Slot } from "@radix-ui/react-slot";
import { Controller, FormProvider, useFormContext, useFormState } from "react-hook-form";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

/**
 * shadcn/ui Form primitives (React Hook Form bindings), styled with the site
 * tokens. Every field gets matching ids, aria-invalid and aria-describedby for
 * free, so errors are announced and tied to the right input.
 */
const Form = FormProvider;

const FormFieldContext = createContext({});

function FormField(props) {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
}

const FormItemContext = createContext({});

function useFormField() {
  const fieldContext = useContext(FormFieldContext);
  const itemContext = useContext(FormItemContext);
  const { getFieldState } = useFormContext();
  const formState = useFormState({ name: fieldContext.name });
  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
}

function FormItem({ className, ...props }) {
  const id = useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div data-slot="form-item" className={cn("grid gap-2", className)} {...props} />
    </FormItemContext.Provider>
  );
}

function FormLabel({ className, optional = false, children, ...props }) {
  const { error, formItemId } = useFormField();

  return (
    <Label
      data-slot="form-label"
      data-error={!!error}
      className={cn("data-[error=true]:text-error", className)}
      htmlFor={formItemId}
      {...props}
    >
      {children}
      {optional ? <span className="text-xs font-normal text-ice-faint">(اختياري)</span> : null}
    </Label>
  );
}

function FormControl(props) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

  return (
    <Slot
      data-slot="form-control"
      id={formItemId}
      aria-describedby={!error ? formDescriptionId : `${formDescriptionId} ${formMessageId}`}
      aria-invalid={!!error}
      {...props}
    />
  );
}

function FormDescription({ className, ...props }) {
  const { formDescriptionId } = useFormField();

  return (
    <p
      data-slot="form-description"
      id={formDescriptionId}
      className={cn("text-xs text-ice-faint", className)}
      {...props}
    />
  );
}

function FormMessage({ className, children, ...props }) {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message ?? "") : children;

  if (!body) return null;

  return (
    <p
      data-slot="form-message"
      id={formMessageId}
      role={error ? "alert" : undefined}
      className={cn("flex items-center gap-1.5 text-sm font-medium leading-6 text-error", className)}
      {...props}
    >
      {error ? <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> : null}
      {body}
    </p>
  );
}

export { useFormField, Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage, FormField };
