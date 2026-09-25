import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Check, CheckCircle2, CreditCard, MapPin, StickyNote, Truck } from "lucide-react";
import { SafeImage } from "@/components/client/safe-image";
import { Breadcrumbs, StatusBadge } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth";
import { getUserOrder } from "@/lib/queries";
import { ORDER_STATUS, cn, deliveryLabel, formatDate, formatPrice, paymentLabel } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Order details" };

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const STEPS = ["Order placed", "Processing", "Shipped", "Delivered"];

export default async function OrderPage({ params, searchParams }: Props) {
  const [{ id }, sp, user] = await Promise.all([params, searchParams, getCurrentUser()]);
  if (!user) redirect(`/login?next=/account/orders/${encodeURIComponent(id)}`);

  const orderId = Number(id);
  if (!Number.isInteger(orderId) || orderId <= 0) notFound();
  const data = await getUserOrder(user.id, orderId);
  if (!data) notFound();

  const { order, items } = data;
  const placed = (Array.isArray(sp.placed) ? sp.placed[0] : sp.placed) === "1";
  const status = ORDER_STATUS[order.status] ?? { label: order.status, tone: "neutral" as const, step: 1 };
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="container-page py-8 lg:py-10">
      {placed && (
        <div className="mb-8 rounded-2xl border border-success/20 bg-white">
          <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:p-8">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-success-soft text-success">
              <CheckCircle2 className="h-7 w-7" />
            </span>
            <div className="flex-1">
              <p className="font-display text-xl font-bold text-ink sm:text-2xl">
                Thank you, {user.name.split(" ")[0]}! Your order is confirmed.
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                A confirmation has been sent to <span className="font-medium text-ink">{order.email}</span>. We&apos;ll
                let you know as soon as it ships.
              </p>
            </div>
            <Link href="/shop" className="btn btn-secondary">
              Continue shopping
            </Link>
          </div>
        </div>
      )}

      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "My account", href: "/account" },
          { label: order.orderNumber },
        ]}
      />
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink sm:text-3xl">Order {order.orderNumber}</h1>
          <p className="mt-1 text-sm text-muted">
            Placed on {formatDate(order.createdAt)} · {itemCount} {itemCount === 1 ? "item" : "items"}
          </p>
        </div>
        <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
      </div>

      {order.status !== "cancelled" && (
        <div className="card mt-6 px-4 py-6 sm:px-8">
          <ol className="flex items-start" aria-label="Order progress">
            {STEPS.map((label, index) => {
              const done = status.step >= index;
              return (
                <li key={label} className="relative flex flex-1 flex-col items-center text-center">
                  {index > 0 && (
                    <span
                      className={cn("absolute right-1/2 top-4 h-0.5 w-full -translate-y-1/2", done ? "bg-primary" : "bg-line")}
                      aria-hidden
                    />
                  )}
                  <span
                    className={cn(
                      "relative z-10 grid h-8 w-8 place-items-center rounded-full text-xs font-bold",
                      done ? "bg-primary text-white" : "bg-white text-muted ring-1 ring-line",
                      status.step === index && "ring-4 ring-primary-soft",
                    )}
                  >
                    {done ? <Check className="h-4 w-4" /> : index + 1}
                  </span>
                  <span className={cn("mt-2 text-xs font-medium sm:text-sm", done ? "text-ink" : "text-muted")}>{label}</span>
                </li>
              );
            })}
          </ol>
        </div>
      )}

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-12">
        <section className="card overflow-hidden lg:col-span-8" aria-labelledby="items-heading">
          <h2 id="items-heading" className="border-b border-line px-5 py-4 text-base font-bold text-ink sm:px-6">
            Items in this order
          </h2>
          <ul className="divide-y divide-line">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-4 px-5 py-4 sm:px-6">
                <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-line bg-canvas">
                  <SafeImage src={item.image} alt={item.productName} fill sizes="64px" className="object-cover" />
                </span>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/product/${item.productSlug}`}
                    className="line-clamp-2 text-sm font-semibold text-ink transition-colors hover:text-primary"
                  >
                    {item.productName}
                  </Link>
                  <p className="mt-0.5 text-xs text-muted">
                    Qty {item.quantity} × {formatPrice(item.unitPriceCents)}
                  </p>
                </div>
                <p className="text-sm font-semibold text-ink">{formatPrice(item.unitPriceCents * item.quantity)}</p>
              </li>
            ))}
          </ul>
          <dl className="space-y-2.5 border-t border-line bg-canvas px-5 py-5 text-sm sm:px-6">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd className="font-medium text-ink">{formatPrice(order.subtotalCents)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Shipping</dt>
              <dd className={cn("font-medium", order.shippingCents === 0 ? "text-success" : "text-ink")}>
                {order.shippingCents === 0 ? "Free" : formatPrice(order.shippingCents)}
              </dd>
            </div>
            <div className="flex items-baseline justify-between border-t border-line pt-3">
              <dt className="font-semibold text-ink">Total</dt>
              <dd className="font-display text-xl font-bold text-ink">{formatPrice(order.totalCents)}</dd>
            </div>
          </dl>
        </section>

        <aside className="space-y-5 lg:col-span-4">
          <div className="card p-6">
            <h2 className="flex items-center gap-2 text-sm font-bold text-ink">
              <MapPin className="h-4 w-4 text-primary" />
              Shipping address
            </h2>
            <address className="mt-3 text-sm not-italic leading-relaxed text-muted">
              <span className="font-medium text-ink">{order.fullName}</span>
              <br />
              {order.address}
              <br />
              {order.city}, {order.postalCode}
              <br />
              {order.country}
              <br />
              {order.phone}
            </address>
          </div>

          <div className="card p-6">
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="flex items-center gap-2 font-bold text-ink">
                  <Truck className="h-4 w-4 text-primary" />
                  Delivery
                </dt>
                <dd className="mt-1.5 text-muted">{deliveryLabel(order.deliveryMethod)}</dd>
              </div>
              <div className="border-t border-line pt-4">
                <dt className="flex items-center gap-2 font-bold text-ink">
                  <CreditCard className="h-4 w-4 text-primary" />
                  Payment
                </dt>
                <dd className="mt-1.5 text-muted">{paymentLabel(order.paymentMethod)}</dd>
              </div>
            </dl>
          </div>

          {order.notes && (
            <div className="card p-6">
              <h2 className="flex items-center gap-2 text-sm font-bold text-ink">
                <StickyNote className="h-4 w-4 text-primary" />
                Order notes
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">{order.notes}</p>
            </div>
          )}

          <Link href="/account#orders" className="btn btn-secondary w-full">
            Back to all orders
          </Link>
        </aside>
      </div>
    </div>
  );
}
