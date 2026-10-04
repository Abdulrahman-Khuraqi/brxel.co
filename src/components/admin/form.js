"use client";

import { createContext, startTransition, useActionState, useContext, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { buttonClass } from "@/components/admin/ui";

const FormContext = createContext({ fieldErrors: {}, pending: false });

/**
 * A form bound to a Server Action. The action returns `{ ok, message, error,
 * fieldErrors }`; field errors appear under their inputs and the rest as a
 * toast. `onSuccess` runs in the browser after a successful submit.
 *
 * Submitting through onSubmit (not the `action` prop) keeps what was typed when
 * the server rejects it: React resets uncontrolled forms after an `action`.
 */
export function ActionForm({ action, children, className = "", onSuccess, resetOnSuccess = false, ...rest }) {
  const [state, formAction, pending] = useActionState(action, null);
  const formRef = useRef(null);
  const onSuccessRef = useRef(onSuccess);

  useEffect(() => {
    onSuccessRef.current = onSuccess;
  });

  useEffect(() => {
    if (!state) return;
    if (state.ok) {
      if (state.message) toast.success(state.message);
      if (resetOnSuccess) formRef.current?.reset();
      onSuccessRef.current?.(state);
    } else if (state.error) {
      toast.error(state.error);
      const firstInvalid = Object.keys(state.fieldErrors || {})[0];
      if (firstInvalid) formRef.current?.querySelector(`[name="${CSS.escape(firstInvalid)}"]`)?.focus();
    }
  }, [state, resetOnSuccess]);

  return (
    <FormContext.Provider value={{ fieldErrors: state?.ok === false ? state.fieldErrors || {} : {}, pending }}>
      <form
        ref={formRef}
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget, event.nativeEvent.submitter);
          startTransition(() => formAction(data));
        }}
        className={className}
        noValidate
        {...rest}
      >
        {children}
      </form>
    </FormContext.Provider>
  );
}

export const useFieldError = (name) => useContext(FormContext).fieldErrors?.[name];

export function Field({ name, label, hint, children, className = "", optional = false }) {
  const error = useFieldError(name);
  return (
    <div className={cn("grid content-start gap-1.5", className)}>
      {label ? (
        <label htmlFor={`f-${name}`} className="text-sm font-semibold text-ice">
          {label}
          {optional ? <span className="ms-1.5 text-xs font-normal text-ice-faint">(اختياري)</span> : null}
        </label>
      ) : null}
      {children}
      {error ? (
        <p id={`f-${name}-error`} className="text-xs font-medium text-error">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs leading-5 text-ice-faint">{hint}</p>
      ) : null}
    </div>
  );
}

const control =
  "w-full rounded-xl border bg-field px-3.5 text-sm text-ice placeholder:text-ice-faint transition focus:border-brand focus:bg-field-focus focus:outline-none disabled:opacity-60";

function useControlProps(name, invalidClass = "border-error/60") {
  const error = useFieldError(name);
  return {
    id: `f-${name}`,
    name,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `f-${name}-error` : undefined,
    className: cn(control, error ? invalidClass : "border-hairline-strong"),
  };
}

export function Input({ name, className = "", dir, ...rest }) {
  const props = useControlProps(name);
  return <input {...props} dir={dir} className={cn(props.className, "min-h-11", className)} {...rest} />;
}

export function Textarea({ name, className = "", rows = 4, ...rest }) {
  const props = useControlProps(name);
  return <textarea {...props} rows={rows} className={cn(props.className, "py-3 leading-7", className)} {...rest} />;
}

export function Select({ name, options, className = "", ...rest }) {
  const props = useControlProps(name);
  return (
    <select {...props} className={cn(props.className, "min-h-11", className)} {...rest}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export function Checkbox({ name, label, description, defaultChecked, value, disabled }) {
  return (
    <label className={cn("flex cursor-pointer items-start gap-3 rounded-xl border border-hairline p-3", disabled && "cursor-not-allowed opacity-60")}>
      <input
        type="checkbox"
        name={name}
        value={value}
        defaultChecked={defaultChecked}
        disabled={disabled}
        className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-brand)]"
      />
      <span>
        <span className="block text-sm font-semibold text-ice">{label}</span>
        {description ? <span className="mt-0.5 block text-xs leading-5 text-ice-faint">{description}</span> : null}
      </span>
    </label>
  );
}

export function SubmitButton({ children, variant = "primary", className = "", pendingLabel = "جارٍ الحفظ…", ...rest }) {
  const { pending: actionPending } = useFormStatus();
  const pending = useContext(FormContext).pending || actionPending;
  return (
    <button type="submit" disabled={pending} className={buttonClass(variant, className)} {...rest}>
      {pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
      {pending ? pendingLabel : children}
    </button>
  );
}
