"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check, Loader2, Sparkles } from "lucide-react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { pushDataLayer } from "@/lib/analytics";
import {
  EMPTY_ENQUIRY,
  MAX_DETAILS,
  MIN_DETAILS,
  SERVICE_OPTIONS,
  STEPS,
  TIMELINES,
  buildMessage,
  createRequestId,
  enquirySchema,
  isStepValid,
  saveEnquiry,
  submitEnquiry,
} from "@/lib/contact";

const FORM_ID = "brxel_enquiry";

/** A row of pill-shaped radio buttons; real radios, so arrow keys and Tab work natively. */
function ChoiceGroup({ name, options, value, onChange, columns = "", size = "md", legend, ...rest }) {
  return (
    <div role="radiogroup" aria-label={legend} className={cn("grid gap-2", columns)} {...rest}>
      {options.map((option) => {
        const checked = value === option;
        return (
          <label
            key={option}
            className={cn(
              "relative flex cursor-pointer items-center gap-3 rounded-xl border px-4 text-base font-medium transition duration-200 motion-reduce:transition-none",
              "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand-bright",
              size === "sm" ? "min-h-12 py-2 text-sm" : "min-h-14 py-3",
              checked
                ? "border-brand bg-brand/10 text-ice"
                : "border-hairline bg-field text-ice-muted hover:border-hairline-strong hover:text-ice"
            )}
          >
            <input
              type="radio"
              name={name}
              value={option}
              checked={checked}
              onChange={() => onChange(option)}
              className="peer sr-only"
            />
            <span
              className={cn(
                "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition motion-reduce:transition-none",
                checked ? "border-brand bg-brand text-[#150C09]" : "border-hairline-strong"
              )}
              aria-hidden="true"
            >
              {checked ? <Check className="h-3 w-3" strokeWidth={3} /> : null}
            </span>
            <span className="leading-6">{option}</span>
          </label>
        );
      })}
    </div>
  );
}

/** Step indicator: numbered dots joined by a bar that fills as the visitor moves on. */
function Progress({ step }) {
  const percent = Math.round(((step + 1) / STEPS.length) * 100);

  return (
    <div>
      <div className="flex items-center justify-between text-sm font-semibold">
        <span className="text-brand-bright">
          الخطوة <span className="latin">{step + 1}</span> من <span className="latin">{STEPS.length}</span>
        </span>
        <span className="latin text-ice-faint">{percent}%</span>
      </div>
      <div
        className="mt-3 h-1.5 overflow-hidden rounded-full bg-hairline"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={STEPS.length}
        aria-valuenow={step + 1}
        aria-label="تقدّم تعبئة النموذج"
      >
        <div
          className="h-full rounded-full bg-brand transition-[width] duration-500 ease-out motion-reduce:transition-none"
          style={{ width: `${percent}%` }}
        />
      </div>
      <ol className="mt-4 grid grid-cols-3 gap-2">
        {STEPS.map((item, index) => {
          const done = index < step;
          const current = index === step;
          return (
            <li
              key={item.id}
              aria-current={current ? "step" : undefined}
              className={cn(
                "flex items-center gap-2 text-sm font-semibold",
                current ? "text-ice" : done ? "text-ice-muted" : "text-ice-faint"
              )}
            >
              <span
                className={cn(
                  "latin flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs",
                  done
                    ? "border-brand bg-brand text-[#150C09]"
                    : current
                      ? "border-brand text-brand-bright"
                      : "border-hairline-strong"
                )}
                aria-hidden="true"
              >
                {done ? <Check className="h-3 w-3" strokeWidth={3} /> : index + 1}
              </span>
              {item.label}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/**
 * The enquiry form: three short steps (service → project → contact), validated
 * as the visitor types with React Hook Form + Zod. "Next" and "submit" stay
 * disabled until their step is valid. On success the visitor lands on
 * /thank-you/ with the request id; every stage is pushed to the data layer.
 */
export default function EnquiryForm({ location = "page" }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const headingRef = useRef(null);
  const started = useRef(false);
  const movedStep = useRef(false);

  const form = useForm({
    resolver: zodResolver(enquirySchema),
    defaultValues: EMPTY_ENQUIRY,
    mode: "onChange",
  });

  const values = useWatch({ control: form.control });
  const current = STEPS[step];
  const stepValid = isStepValid(step, { ...EMPTY_ENQUIRY, ...values });
  const isLast = step === STEPS.length - 1;
  const { isSubmitting } = form.formState;
  const detailsLength = (values.details || "").trim().length;

  // Move focus to the new step's question so keyboard and screen-reader users follow along.
  useEffect(() => {
    if (movedStep.current) headingRef.current?.focus();
  }, [step]);

  const markStarted = () => {
    if (started.current) return;
    started.current = true;
    pushDataLayer("form_start", { form_id: FORM_ID, form_location: location });
  };

  const goNext = async () => {
    const ok = await form.trigger(current.fields);
    if (!ok) return;
    pushDataLayer("form_step_complete", {
      form_id: FORM_ID,
      form_location: location,
      step_number: step + 1,
      step_name: current.id,
    });
    movedStep.current = true;
    setStep((value) => Math.min(value + 1, STEPS.length - 1));
  };

  const goBack = () => {
    movedStep.current = true;
    setStep((value) => Math.max(value - 1, 0));
  };

  const onSubmit = async (data) => {
    const requestId = createRequestId();
    const message = buildMessage(data, requestId);
    const analytics = {
      form_id: FORM_ID,
      form_location: location,
      request_id: requestId,
      service: data.service,
      timeline: data.timeline || "unspecified",
    };

    pushDataLayer("form_submit", analytics);

    try {
      const delivered = await submitEnquiry(data, requestId);
      saveEnquiry(requestId, { message, service: data.service, name: data.name.trim(), delivered });
      pushDataLayer("form_submit_success", { ...analytics, delivery: delivered ? "endpoint" : "handoff" });

      toast.success(delivered ? "تم استلام طلبك بنجاح" : "طلبك جاهز", {
        description: `رقم طلبك ${requestId}`,
      });
      router.push(`/thank-you/?id=${encodeURIComponent(requestId)}`);
    } catch {
      pushDataLayer("form_submit_error", analytics);
      toast.error("تعذّر إرسال الطلب", {
        description: "تحقق من اتصالك وحاول مرة أخرى، أو راسلنا على واتساب مباشرة.",
      });
    }
  };

  const onInvalid = () => {
    toast.warning("بقيت تفاصيل بسيطة", { description: "راجع الحقول المظلّلة ثم أكمل." });
  };

  // Enter inside a single-line field moves forward instead of submitting early.
  const onKeyDown = (event) => {
    if (event.key !== "Enter" || event.target.tagName === "TEXTAREA" || isLast) return;
    event.preventDefault();
    if (stepValid) goNext();
  };

  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(onSubmit, onInvalid)}
        onFocusCapture={markStarted}
        onKeyDown={onKeyDown}
        aria-labelledby={`${FORM_ID}-title`}
        className="rounded-3xl border border-hairline bg-navy-raised p-5 shadow-card sm:p-8"
      >
        <Progress step={step} />

        <div className="mt-8 border-t border-hairline pt-7">
          <h3
            id={`${FORM_ID}-title`}
            ref={headingRef}
            tabIndex={-1}
            className="text-xl font-bold text-ice outline-none sm:text-2xl"
          >
            {current.title}
          </h3>

          {/* Step 1: the easy, one-click questions. */}
          {step === 0 ? (
            <div className="mt-6 grid gap-7">
              <FormField
                control={form.control}
                name="service"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الخدمة المطلوبة</FormLabel>
                    <FormControl>
                      <ChoiceGroup
                        name={field.name}
                        legend="الخدمة المطلوبة"
                        options={SERVICE_OPTIONS}
                        value={field.value}
                        onChange={field.onChange}
                        columns="grid-cols-2"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="timeline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel optional>متى تريد البدء؟</FormLabel>
                    <FormControl>
                      <ChoiceGroup
                        name={field.name}
                        legend="متى تريد البدء؟"
                        options={TIMELINES}
                        value={field.value}
                        onChange={field.onChange}
                        columns="grid-cols-2"
                        size="sm"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          ) : null}

          {/* Step 2: one open question. */}
          {step === 1 ? (
            <div className="mt-6">
              <FormField
                control={form.control}
                name="details"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>فكرة المشروع</FormLabel>
                    <FormControl>
                      <textarea
                        {...field}
                        rows={6}
                        maxLength={MAX_DETAILS}
                        placeholder="مثال: نطلق متجرًا للقهوة المختصة ونحتاج شعارًا وهوية وقوالب للسوشيال ميديا."
                        className="field min-h-40 resize-y leading-7"
                      />
                    </FormControl>
                    <div className="flex items-start justify-between gap-4">
                      <FormMessage />
                      <FormDescription className={cn("ms-auto shrink-0", detailsLength >= MIN_DETAILS && "text-success")}>
                        <span className="latin">
                          {detailsLength}/{MIN_DETAILS}
                        </span>
                        {detailsLength >= MIN_DETAILS ? " ✓" : ""}
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          ) : null}

          {/* Step 3: contact details, asked last. */}
          {step === 2 ? (
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>الاسم</FormLabel>
                    <FormControl>
                      <input {...field} type="text" autoComplete="name" placeholder="اسمك الكريم" className="field" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>البريد الإلكتروني</FormLabel>
                    <FormControl>
                      <input
                        {...field}
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        dir="ltr"
                        placeholder="name@example.com"
                        className="field text-left"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel optional>رقم الجوال / واتساب</FormLabel>
                    <FormControl>
                      <input
                        {...field}
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        dir="ltr"
                        placeholder="+963 9xx xxx xxx"
                        className="field text-left"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <p className="text-sm text-ice-faint sm:col-span-2">
                نستخدم بياناتك للرد على طلبك فقط، وفق{" "}
                <Link href="/privacy/" className="font-semibold text-ice-muted underline underline-offset-4 hover:text-brand-bright">
                  سياسة الخصوصية
                </Link>
                .
              </p>
            </div>
          ) : null}
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-hairline pt-6 sm:flex-row sm:items-center sm:justify-between">
          {step > 0 ? (
            <button
              type="button"
              onClick={goBack}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-4 text-base font-semibold text-ice-muted transition hover:bg-surface hover:text-ice motion-reduce:transition-none"
            >
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
              رجوع
            </button>
          ) : (
            <p className="text-sm text-ice-muted">أقل من دقيقة · بدون أي التزام</p>
          )}

          {isLast ? (
            <button
              type="submit"
              disabled={!form.formState.isValid || isSubmitting}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand px-6 text-base font-bold text-[#150C09] transition hover:bg-brand-bright disabled:cursor-not-allowed disabled:opacity-40 motion-reduce:transition-none"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  جارٍ الإرسال…
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                  احصل على عرضك الآن
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={goNext}
              disabled={!stepValid}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand px-6 text-base font-bold text-[#150C09] transition hover:bg-brand-bright disabled:cursor-not-allowed disabled:opacity-40 motion-reduce:transition-none"
            >
              {step === 0 ? "لنبدأ" : "خطوة أخيرة"}
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </form>
    </Form>
  );
}
