"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { buttonClass } from "@/components/admin/ui";

function Confirm({ label, variant }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={buttonClass(variant)}>
      {pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
      {label}
    </button>
  );
}

/**
 * A button that asks before running a Server Action (delete, reset password…).
 * `fields` become hidden inputs; the action's result is shown as a toast, and
 * `onDone` receives it (to show a generated password, for example).
 */
export default function ConfirmAction({
  action,
  fields = {},
  label,
  title,
  message,
  confirmLabel = "تأكيد",
  variant = "danger",
  triggerVariant = variant,
  icon: Icon,
  onDone,
}) {
  const dialogRef = useRef(null);
  const [state, formAction] = useActionState(action, null);
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  });

  useEffect(() => {
    if (!state) return;
    dialogRef.current?.close();
    if (state.ok) {
      if (state.message) toast.success(state.message);
      onDoneRef.current?.(state);
    } else if (state.error) toast.error(state.error);
  }, [state]);

  return (
    <>
      <button type="button" onClick={() => dialogRef.current?.showModal()} className={buttonClass(triggerVariant)}>
        {Icon ? <Icon className="h-4 w-4" aria-hidden="true" /> : null}
        {label}
      </button>
      <dialog
        ref={dialogRef}
        dir="rtl"
        className="m-auto w-[min(28rem,calc(100vw-2rem))] rounded-2xl border border-hairline-strong bg-navy p-6 text-ice backdrop:bg-black/70"
        aria-labelledby="confirm-title"
      >
        <form action={formAction}>
          {Object.entries(fields).map(([key, value]) => (
            <input key={key} type="hidden" name={key} value={value} />
          ))}
          <p id="confirm-title" className="text-lg font-bold">
            {title}
          </p>
          {message ? <p className="mt-2 text-sm leading-7 text-ice-muted">{message}</p> : null}
          <div className="mt-6 flex justify-end gap-2">
            <button type="button" onClick={() => dialogRef.current?.close()} className={buttonClass("ghost")}>
              إلغاء
            </button>
            <Confirm label={confirmLabel} variant={variant} />
          </div>
        </form>
      </dialog>
    </>
  );
}
