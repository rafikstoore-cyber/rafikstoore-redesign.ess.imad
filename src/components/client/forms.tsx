"use client";

import { useActionState, useState, type InputHTMLAttributes, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2, Lock, ShieldCheck } from "lucide-react";
import {
  loginAction,
  placeOrderAction,
  registerAction,
  subscribeNewsletterAction,
  type FormState,
} from "@/app/actions";
import {
  COUNTRIES,
  DELIVERY_OPTIONS,
  PAYMENT_OPTIONS,
  STORE,
  cn,
  formatPrice,
  shippingCostCents,
  type DeliveryMethod,
} from "@/lib/utils";
import { SafeImage } from "./safe-image";

const initialState: FormState = {};

function SubmitButton({
  children,
  pendingLabel,
  variant = "primary",
  className,
}: {
  children: ReactNode;
  pendingLabel?: string;
  variant?: "primary" | "accent";
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn("btn", variant === "primary" ? "btn-primary" : "btn-accent", className)}
    >
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      {pending && pendingLabel ? pendingLabel : children}
    </button>
  );
}

function FormAlert({ tone, children }: { tone: "error" | "success"; children: ReactNode }) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-2.5 rounded-lg border px-4 py-3 text-sm",
        tone === "error" ? "border-error/20 bg-error-soft text-error" : "border-success/20 bg-success-soft text-success",
      )}
    >
      {tone === "error" ? <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> : <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />}
      <span>{children}</span>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  error,
  hint,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="label">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} className="field-error">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-muted">{hint}</p>
      ) : null}
    </div>
  );
}

function PasswordInput({
  id,
  autoComplete,
  invalid,
  placeholder,
}: {
  id: string;
  autoComplete: string;
  invalid: boolean;
  placeholder?: string;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <input
        id={id}
        name="password"
        type={visible ? "text" : "password"}
        autoComplete={autoComplete}
        aria-invalid={invalid}
        aria-describedby={invalid ? `${id}-error` : undefined}
        placeholder={placeholder}
        className="input pr-11"
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute inset-y-0 right-0 grid w-11 place-items-center text-muted hover:text-ink"
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

export function LoginForm({ next }: { next: string }) {
  const [state, formAction] = useActionState(loginAction, initialState);
  const errors = state.fieldErrors ?? {};
  return (
    <form action={formAction} noValidate className="space-y-5">
      <input type="hidden" name="next" value={next} />
      {state.error && <FormAlert tone="error">{state.error}</FormAlert>}
      <Field label="Email address" htmlFor="email" error={errors.email}>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          defaultValue={state.values?.email}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
          className="input"
        />
      </Field>
      <Field label="Password" htmlFor="password" error={errors.password}>
        <PasswordInput id="password" autoComplete="current-password" invalid={Boolean(errors.password)} placeholder="Your password" />
      </Field>
      <SubmitButton className="btn-lg w-full" pendingLabel="Signing in…">
        Sign in
      </SubmitButton>
    </form>
  );
}

export function RegisterForm({ next }: { next: string }) {
  const [state, formAction] = useActionState(registerAction, initialState);
  const errors = state.fieldErrors ?? {};
  return (
    <form action={formAction} noValidate className="space-y-5">
      <input type="hidden" name="next" value={next} />
      {state.error && <FormAlert tone="error">{state.error}</FormAlert>}
      <Field label="Full name" htmlFor="name" error={errors.name}>
        <input
          id="name"
          name="name"
          autoComplete="name"
          placeholder="Your full name"
          defaultValue={state.values?.name}
          aria-invalid={Boolean(errors.name)}
          className="input"
        />
      </Field>
      <Field label="Email address" htmlFor="email" error={errors.email}>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          defaultValue={state.values?.email}
          aria-invalid={Boolean(errors.email)}
          className="input"
        />
      </Field>
      <Field label="Password" htmlFor="password" error={errors.password} hint="Use at least 8 characters.">
        <PasswordInput id="password" autoComplete="new-password" invalid={Boolean(errors.password)} placeholder="Create a password" />
      </Field>
      <SubmitButton className="btn-lg w-full" pendingLabel="Creating account…">
        Create account
      </SubmitButton>
    </form>
  );
}

export function NewsletterForm() {
  const [state, formAction] = useActionState(subscribeNewsletterAction, initialState);
  if (state.success) {
    return (
      <p className="flex items-center gap-2.5 rounded-lg border border-white/15 px-4 py-3 text-sm text-white">
        <CheckCircle2 className="h-5 w-5 shrink-0 text-accent" />
        {state.success}
      </p>
    );
  }
  return (
    <div className="w-full">
      <form action={formAction} noValidate className="flex w-full flex-col gap-2.5 sm:flex-row">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="Enter your email address"
          defaultValue={state.values?.email}
          className="input h-12 flex-1 border-white/15 bg-white/[0.06] text-white placeholder:text-white/45 hover:border-white/30 focus:border-accent focus:ring-accent/20"
        />
        <SubmitButton variant="accent" className="btn-lg" pendingLabel="Subscribing…">
          Subscribe
        </SubmitButton>
      </form>
      {state.error && <p className="mt-2 text-xs font-medium text-red-300">{state.error}</p>}
    </div>
  );
}

export type CheckoutLine = {
  productId: number;
  name: string;
  image: string | null;
  priceCents: number;
  quantity: number;
};

function CheckoutSection({
  step,
  title,
  description,
  children,
}: {
  step?: number;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="card p-5 sm:p-6">
      <div className="flex items-start gap-3">
        {step !== undefined && (
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-white">
            {step}
          </span>
        )}
        <div>
          <h2 className="text-base font-bold text-ink">{title}</h2>
          {description && <p className="mt-0.5 text-sm text-muted">{description}</p>}
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function CheckoutForm({
  lines,
  defaults,
}: {
  lines: CheckoutLine[];
  defaults: { fullName: string; email: string };
}) {
  const [state, formAction] = useActionState(placeOrderAction, initialState);
  const [delivery, setDelivery] = useState<DeliveryMethod>("standard");
  const [payment, setPayment] = useState<string>(PAYMENT_OPTIONS[0].id);

  const errors = state.fieldErrors ?? {};
  const value = (key: string, fallback = "") => state.values?.[key] ?? fallback;

  const subtotal = lines.reduce((sum, line) => sum + line.priceCents * line.quantity, 0);
  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);
  const shipping = shippingCostCents(subtotal, delivery);
  const total = subtotal + shipping;

  const input = (name: string, props: InputHTMLAttributes<HTMLInputElement> = {}) => (
    <input
      id={name}
      name={name}
      aria-invalid={Boolean(errors[name])}
      aria-describedby={errors[name] ? `${name}-error` : undefined}
      className="input"
      {...props}
    />
  );

  return (
    <form action={formAction} noValidate className="grid items-start gap-8 lg:grid-cols-12">
      <div className="space-y-5 lg:col-span-7">
        {state.error && <FormAlert tone="error">{state.error}</FormAlert>}

        <CheckoutSection step={1} title="Contact information" description="We'll send your order confirmation and updates here.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Email address" htmlFor="email" error={errors.email}>
              {input("email", { type: "email", autoComplete: "email", defaultValue: value("email", defaults.email) })}
            </Field>
            <Field label="Phone number" htmlFor="phone" error={errors.phone}>
              {input("phone", { type: "tel", autoComplete: "tel", placeholder: "+1 555 000 0000", defaultValue: value("phone") })}
            </Field>
          </div>
        </CheckoutSection>

        <CheckoutSection step={2} title="Shipping address">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name" htmlFor="fullName" error={errors.fullName} className="sm:col-span-2">
              {input("fullName", { autoComplete: "name", defaultValue: value("fullName", defaults.fullName) })}
            </Field>
            <Field label="Street address" htmlFor="address" error={errors.address} className="sm:col-span-2">
              {input("address", { autoComplete: "street-address", placeholder: "Street, building, apartment", defaultValue: value("address") })}
            </Field>
            <Field label="City" htmlFor="city" error={errors.city}>
              {input("city", { autoComplete: "address-level2", defaultValue: value("city") })}
            </Field>
            <Field label="Postal code" htmlFor="postalCode" error={errors.postalCode}>
              {input("postalCode", { autoComplete: "postal-code", defaultValue: value("postalCode") })}
            </Field>
            <Field label="Country" htmlFor="country" error={errors.country} className="sm:col-span-2">
              <select
                id="country"
                name="country"
                autoComplete="country-name"
                defaultValue={value("country", COUNTRIES[0])}
                aria-invalid={Boolean(errors.country)}
                className="input"
              >
                {COUNTRIES.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </CheckoutSection>

        <CheckoutSection step={3} title="Delivery method">
          <div className="grid gap-3 sm:grid-cols-2">
            {DELIVERY_OPTIONS.map((option) => {
              const checked = delivery === option.id;
              const cost = shippingCostCents(subtotal, option.id);
              return (
                <label
                  key={option.id}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors",
                    checked ? "border-primary bg-primary-soft/60 ring-1 ring-primary" : "border-line hover:border-slate-300",
                  )}
                >
                  <input
                    type="radio"
                    name="delivery"
                    value={option.id}
                    checked={checked}
                    onChange={() => setDelivery(option.id)}
                    className="mt-0.5 h-4 w-4 accent-primary"
                  />
                  <span className="flex-1">
                    <span className="block text-sm font-semibold text-ink">{option.label}</span>
                    <span className="mt-0.5 block text-xs text-muted">{option.eta}</span>
                  </span>
                  <span className={cn("text-sm font-semibold", cost === 0 ? "text-success" : "text-ink")}>
                    {cost === 0 ? "Free" : formatPrice(cost)}
                  </span>
                </label>
              );
            })}
          </div>
        </CheckoutSection>

        <CheckoutSection step={4} title="Payment method" description="No card details are collected online.">
          <div className="space-y-3">
            {PAYMENT_OPTIONS.map((option) => {
              const checked = payment === option.id;
              return (
                <label
                  key={option.id}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors",
                    checked ? "border-primary bg-primary-soft/60 ring-1 ring-primary" : "border-line hover:border-slate-300",
                  )}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={option.id}
                    checked={checked}
                    onChange={() => setPayment(option.id)}
                    className="mt-0.5 h-4 w-4 accent-primary"
                  />
                  <span>
                    <span className="block text-sm font-semibold text-ink">{option.label}</span>
                    <span className="mt-0.5 block text-xs text-muted">{option.description}</span>
                  </span>
                </label>
              );
            })}
            {errors.payment && <p className="field-error">{errors.payment}</p>}
          </div>
        </CheckoutSection>

        <CheckoutSection title="Order notes" description="Optional — delivery instructions or a gift message.">
          <label htmlFor="notes" className="sr-only">
            Order notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            maxLength={500}
            defaultValue={value("notes")}
            placeholder="e.g. Leave the parcel with the building concierge"
            className="input resize-none"
          />
        </CheckoutSection>
      </div>

      <aside className="lg:sticky lg:top-24 lg:col-span-5">
        <div className="card p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-ink">Order summary</h2>
            <span className="text-sm text-muted">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </span>
          </div>
          <ul className="mt-5 max-h-80 space-y-4 overflow-y-auto pr-1">
            {lines.map((line) => (
              <li key={line.productId} className="flex items-center gap-3">
                <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-line bg-canvas">
                  <SafeImage src={line.image} alt={line.name} fill sizes="56px" className="object-cover" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="line-clamp-1 text-sm font-medium text-ink">{line.name}</span>
                  <span className="text-xs text-muted">Qty {line.quantity}</span>
                </span>
                <span className="text-sm font-semibold text-ink">{formatPrice(line.priceCents * line.quantity)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-5 space-y-2.5 border-t border-line pt-5 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd className="font-medium text-ink">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Shipping</dt>
              <dd className={cn("font-medium", shipping === 0 ? "text-success" : "text-ink")}>
                {shipping === 0 ? "Free" : formatPrice(shipping)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Taxes</dt>
              <dd className="font-medium text-ink">Included</dd>
            </div>
            <div className="flex items-baseline justify-between border-t border-line pt-4">
              <dt className="text-base font-semibold text-ink">Total</dt>
              <dd className="font-display text-2xl font-bold text-ink">{formatPrice(total)}</dd>
            </div>
          </dl>
          <SubmitButton className="btn-lg mt-6 w-full" pendingLabel="Placing your order…">
            <Lock className="h-4 w-4" />
            Place order · {formatPrice(total)}
          </SubmitButton>
          <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-muted">
            <ShieldCheck className="h-4 w-4 shrink-0 text-success" />
            Your information is protected. Free returns within {STORE.returnDays} days of delivery.
          </p>
        </div>
      </aside>
    </form>
  );
}
