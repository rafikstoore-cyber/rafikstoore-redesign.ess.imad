import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, ArrowRight, CheckCircle2, RotateCcw, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import { SafeImage } from "@/components/client/safe-image";
import { CartLineControls } from "@/components/client/store-actions";
import { EmptyState, PageHeader } from "@/components/ui";
import { getCurrentUser, getOwnerKey } from "@/lib/auth";
import { getCartLines } from "@/lib/queries";
import { STORE, cn, formatPrice, shippingCostCents } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Shopping cart" };

export default async function CartPage() {
  const [ownerKey, user] = await Promise.all([getOwnerKey(), getCurrentUser()]);
  const lines = ownerKey ? await getCartLines(ownerKey) : [];
  const breadcrumbs = [{ label: "Home", href: "/" }, { label: "Cart" }];

  if (!lines.length) {
    return (
      <>
        <PageHeader title="Shopping cart" breadcrumbs={breadcrumbs} />
        <div className="container-page py-10">
          <EmptyState
            icon={<ShoppingBag className="h-7 w-7" />}
            title="Your cart is empty"
            description="Looks like you haven't added anything yet. Explore our collections and find something you'll love."
            action={
              <>
                <Link href="/shop" className="btn btn-primary">
                  Start shopping
                </Link>
                <Link href="/wishlist" className="btn btn-secondary">
                  View wishlist
                </Link>
              </>
            }
          />
        </div>
      </>
    );
  }

  const itemCount = lines.reduce((sum, l) => sum + l.quantity, 0);
  const subtotal = lines.reduce((sum, l) => sum + l.priceCents * l.quantity, 0);
  const savings = lines.reduce(
    (sum, l) => sum + (l.compareAtCents && l.compareAtCents > l.priceCents ? (l.compareAtCents - l.priceCents) * l.quantity : 0),
    0,
  );
  const shipping = shippingCostCents(subtotal, "standard");
  const threshold = STORE.freeShippingThresholdCents;
  const remaining = Math.max(0, threshold - subtotal);
  const progress = Math.min(100, Math.round((subtotal / threshold) * 100));
  const hasStockIssue = lines.some((l) => l.stock < l.quantity);

  return (
    <>
      <PageHeader
        title="Shopping cart"
        description={`${itemCount} ${itemCount === 1 ? "item" : "items"} ready for checkout`}
        breadcrumbs={breadcrumbs}
      />

      <div className="container-page grid items-start gap-8 py-8 lg:grid-cols-12 lg:py-10">
        <div className="space-y-4 lg:col-span-8">
          <div className="card p-5">
            {remaining > 0 ? (
              <p className="flex items-center gap-2.5 text-sm text-ink">
                <Truck className="h-4 w-4 shrink-0 text-primary" />
                <span>
                  Add <span className="font-semibold">{formatPrice(remaining)}</span> more to unlock{" "}
                  <span className="font-semibold text-primary">free standard shipping</span>.
                </span>
              </p>
            ) : (
              <p className="flex items-center gap-2.5 text-sm font-medium text-success">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                You&apos;ve unlocked free standard shipping.
              </p>
            )}
            <div
              className="mt-3 h-2 overflow-hidden rounded-full bg-primary-soft"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
              aria-label="Progress towards free shipping"
            >
              <div
                className={cn("h-full rounded-full transition-all duration-500", remaining > 0 ? "bg-accent" : "bg-success")}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <ul className="card divide-y divide-line">
            {lines.map((line) => (
              <li key={line.productId} className="flex gap-4 p-4 sm:gap-5 sm:p-5">
                <Link
                  href={`/product/${line.slug}`}
                  className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-line bg-canvas sm:h-28 sm:w-28"
                >
                  <SafeImage src={line.image} alt={line.name} fill sizes="112px" className="object-cover" />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold tracking-[0.08em] text-muted uppercase">
                        {line.brand} · {line.categoryName}
                      </p>
                      <Link
                        href={`/product/${line.slug}`}
                        className="mt-0.5 line-clamp-2 text-sm font-semibold text-ink transition-colors hover:text-primary sm:text-[15px]"
                      >
                        {line.name}
                      </Link>
                      <p className="mt-1 text-xs text-muted">
                        {formatPrice(line.priceCents)} each
                        {line.compareAtCents && line.compareAtCents > line.priceCents && (
                          <span className="ml-1.5 line-through">{formatPrice(line.compareAtCents)}</span>
                        )}
                      </p>
                    </div>
                    <p className="shrink-0 text-right text-sm font-semibold text-ink sm:text-base">
                      {formatPrice(line.priceCents * line.quantity)}
                    </p>
                  </div>
                  {line.stock < line.quantity && (
                    <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-warning">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      {line.stock === 0
                        ? "This item is now sold out. Please remove it to continue."
                        : `Only ${line.stock} available — please reduce the quantity.`}
                    </p>
                  )}
                  <div className="mt-auto pt-3">
                    <CartLineControls
                      productId={line.productId}
                      productName={line.name}
                      quantity={line.quantity}
                      stock={line.stock}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <Link href="/shop" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" />
            Continue shopping
          </Link>
        </div>

        <aside className="lg:sticky lg:top-24 lg:col-span-4">
          <div className="card p-6">
            <h2 className="text-base font-bold text-ink">Order summary</h2>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">
                  Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
                </dt>
                <dd className="font-medium text-ink">{formatPrice(subtotal)}</dd>
              </div>
              {savings > 0 && (
                <div className="flex justify-between">
                  <dt className="text-muted">You save</dt>
                  <dd className="font-medium text-success">−{formatPrice(savings)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-muted">Standard shipping</dt>
                <dd className={cn("font-medium", shipping === 0 ? "text-success" : "text-ink")}>
                  {shipping === 0 ? "Free" : formatPrice(shipping)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Taxes</dt>
                <dd className="font-medium text-ink">Included</dd>
              </div>
              <div className="flex items-baseline justify-between border-t border-line pt-4">
                <dt className="text-base font-semibold text-ink">Estimated total</dt>
                <dd className="font-display text-2xl font-bold text-ink">{formatPrice(subtotal + shipping)}</dd>
              </div>
            </dl>

            {hasStockIssue ? (
              <p className="mt-6 rounded-lg border border-warning/25 bg-warning-soft px-4 py-3 text-xs font-medium text-warning">
                Please update the highlighted items before checking out.
              </p>
            ) : (
              <Link href="/checkout" className="btn btn-primary btn-lg mt-6 w-full">
                {user ? "Proceed to checkout" : "Sign in & checkout"}
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
            {!user && !hasStockIssue && (
              <p className="mt-3 text-center text-xs leading-relaxed text-muted">
                Your cart is saved and will be waiting after you sign in.
              </p>
            )}

            <ul className="mt-6 space-y-3 border-t border-line pt-5 text-xs text-muted">
              <li className="flex items-center gap-2.5">
                <ShieldCheck className="h-4 w-4 text-success" />
                Secure, encrypted checkout
              </li>
              <li className="flex items-center gap-2.5">
                <RotateCcw className="h-4 w-4 text-primary" />
                Free returns within {STORE.returnDays} days
              </li>
              <li className="flex items-center gap-2.5">
                <Truck className="h-4 w-4 text-primary" />
                Ships within 24 hours
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </>
  );
}
