import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronDown, Clock, CreditCard, FileText, HelpCircle, Mail, Phone, RotateCcw, Truck } from "lucide-react";
import { PageHeader } from "@/components/ui";
import { PAYMENT_OPTIONS, STORE, formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Help center",
  description: "Shipping, returns, payment options and answers to common questions about shopping at RAFIK STOORE.",
};

const SECTIONS = [
  { id: "shipping", label: "Shipping & delivery", icon: Truck },
  { id: "returns", label: "Returns & refunds", icon: RotateCcw },
  { id: "payment", label: "Payment options", icon: CreditCard },
  { id: "faq", label: "FAQ", icon: HelpCircle },
  { id: "contact", label: "Contact us", icon: Mail },
  { id: "terms", label: "Terms & privacy", icon: FileText },
];

const FAQ = [
  {
    q: "How do I track my order?",
    a: "Sign in and open My account → Order history. Each order shows its current status, from processing to delivered.",
  },
  {
    q: "Can I change or cancel my order?",
    a: "Orders can be changed or cancelled while they are still processing. Contact our support team as soon as possible and we'll help.",
  },
  {
    q: "Do I need an account to shop?",
    a: "You can browse, save items and fill your cart as a guest. An account is required at checkout so you can track your orders.",
  },
  {
    q: "Are your products genuine?",
    a: "Yes. We only work with verified brands and authorized suppliers, and every item is quality-checked before it ships.",
  },
  {
    q: "Which countries do you deliver to?",
    a: "We currently deliver across North America, Europe, North Africa and the Gulf region. Available countries are listed at checkout.",
  },
];

function Section({ id, title, icon, children }: { id: string; title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <section id={id} className="card scroll-mt-28 p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary-soft text-primary">{icon}</span>
        <h2 className="text-xl font-bold text-ink">{title}</h2>
      </div>
      <div className="mt-5 space-y-3 text-[15px] leading-relaxed text-muted">{children}</div>
    </section>
  );
}

export default function HelpPage() {
  return (
    <>
      <PageHeader
        title="How can we help?"
        description="Everything you need to know about delivery, returns and payments — and how to reach a real person when you need one."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Help center" }]}
      />

      <div className="container-page grid items-start gap-8 py-8 lg:grid-cols-12 lg:py-10">
        <nav aria-label="Help topics" className="lg:sticky lg:top-24 lg:col-span-3">
          <ul className="card grid grid-cols-2 gap-1 p-2 sm:grid-cols-3 lg:grid-cols-1">
            {SECTIONS.map(({ id, label, icon: Icon }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-canvas hover:text-primary"
                >
                  <Icon className="h-4 w-4 text-muted" />
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-6 lg:col-span-9">
          <Section id="shipping" title="Shipping & delivery" icon={<Truck className="h-5 w-5" />}>
            <p>Every order is packed with care and leaves our warehouse within 24 hours on business days.</p>
            <div className="grid gap-3 pt-2 sm:grid-cols-2">
              <div className="rounded-lg border border-line bg-canvas p-4">
                <p className="text-sm font-semibold text-ink">Standard delivery</p>
                <p className="mt-1 text-sm">
                  3–5 business days · Free over {formatPrice(STORE.freeShippingThresholdCents)}, otherwise{" "}
                  {formatPrice(STORE.standardShippingCents)}
                </p>
              </div>
              <div className="rounded-lg border border-line bg-canvas p-4">
                <p className="text-sm font-semibold text-ink">Express delivery</p>
                <p className="mt-1 text-sm">1–2 business days · {formatPrice(STORE.expressShippingCents)}</p>
              </div>
            </div>
          </Section>

          <Section id="returns" title="Returns & refunds" icon={<RotateCcw className="h-5 w-5" />}>
            <p>
              Not quite right? Return unused items in their original packaging within {STORE.returnDays} days of
              delivery for a full refund — return shipping is on us.
            </p>
            <ol className="list-decimal space-y-1.5 pl-5">
              <li>Contact our support team with your order number.</li>
              <li>We&apos;ll email you a prepaid return label within one business day.</li>
              <li>Once we receive your item, your refund is issued within 5 business days.</li>
            </ol>
          </Section>

          <Section id="payment" title="Payment options" icon={<CreditCard className="h-5 w-5" />}>
            <p>Choose the payment method that suits you best at checkout. We never ask for card details online.</p>
            <ul className="grid gap-3 pt-2 sm:grid-cols-3">
              {PAYMENT_OPTIONS.map((option) => (
                <li key={option.id} className="rounded-lg border border-line bg-canvas p-4">
                  <p className="text-sm font-semibold text-ink">{option.label}</p>
                  <p className="mt-1 text-sm">{option.description}</p>
                </li>
              ))}
            </ul>
          </Section>

          <Section id="faq" title="Frequently asked questions" icon={<HelpCircle className="h-5 w-5" />}>
            <div className="divide-y divide-line rounded-lg border border-line">
              {FAQ.map((item) => (
                <details key={item.q} className="group px-4">
                  <summary className="flex cursor-pointer items-center justify-between gap-4 py-4 text-[15px] font-semibold text-ink hover:text-primary">
                    {item.q}
                    <ChevronDown className="h-4 w-4 shrink-0 text-muted transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="pb-4 text-sm">{item.a}</p>
                </details>
              ))}
            </div>
          </Section>

          <Section id="contact" title="Contact us" icon={<Mail className="h-5 w-5" />}>
            <p>Our support team answers every message personally — usually within a few hours.</p>
            <ul className="grid gap-3 pt-2 sm:grid-cols-3">
              <li className="rounded-lg border border-line bg-canvas p-4">
                <Mail className="h-5 w-5 text-primary" />
                <p className="mt-3 text-sm font-semibold text-ink">Email</p>
                <a href={`mailto:${STORE.supportEmail}`} className="mt-0.5 block break-all text-sm text-primary hover:underline">
                  {STORE.supportEmail}
                </a>
              </li>
              <li className="rounded-lg border border-line bg-canvas p-4">
                <Phone className="h-5 w-5 text-primary" />
                <p className="mt-3 text-sm font-semibold text-ink">Phone</p>
                <p className="mt-0.5 text-sm">{STORE.supportPhone}</p>
              </li>
              <li className="rounded-lg border border-line bg-canvas p-4">
                <Clock className="h-5 w-5 text-primary" />
                <p className="mt-3 text-sm font-semibold text-ink">Hours</p>
                <p className="mt-0.5 text-sm">{STORE.supportHours}</p>
              </li>
            </ul>
          </Section>

          <Section id="terms" title="Terms & privacy" icon={<FileText className="h-5 w-5" />}>
            <p id="privacy" className="scroll-mt-28">
              We only collect the information needed to process and deliver your orders. Your data is never sold, and
              passwords are stored using strong one-way hashing.
            </p>
            <p>
              By placing an order you agree to our standard terms of sale, including the delivery and returns conditions
              described on this page. Questions?{" "}
              <Link href="#contact" className="link">
                Get in touch
              </Link>
              .
            </p>
          </Section>
        </div>
      </div>
    </>
  );
}
