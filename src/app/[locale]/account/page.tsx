import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronRight, CreditCard, Heart, LifeBuoy, LogOut, Package, RotateCcw, ShoppingBag } from "lucide-react";
import { logoutAction } from "@/app/actions";
import { SafeImage } from "@/components/client/safe-image";
import { Breadcrumbs, StatusBadge } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth";
import { getCartCount, getUserOrders, getWishlistIds } from "@/lib/queries";
import { ORDER_STATUS, STORE, formatDate, formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "My account" };

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/account");

  const ownerKey = `user:${user.id}`;
  const [orders, wishlistIds, cartCount] = await Promise.all([
    getUserOrders(user.id),
    getWishlistIds(ownerKey),
    getCartCount(ownerKey),
  ]);
  const totalSpent = orders.filter((o) => o.status !== "cancelled").reduce((sum, o) => sum + o.totalCents, 0);
  const firstName = user.name.split(" ")[0];

  const stats = [
    { label: "Orders placed", value: String(orders.length), icon: Package, href: "#orders" },
    { label: "Total spent", value: formatPrice(totalSpent), icon: CreditCard, href: "#orders" },
    { label: "Wishlist items", value: String(wishlistIds.length), icon: Heart, href: "/wishlist" },
    { label: "Items in cart", value: String(cartCount), icon: ShoppingBag, href: "/cart" },
  ];

  return (
    <>
      <div className="border-b border-line bg-white">
        <div className="container-page flex flex-col gap-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:py-10">
          <div>
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "My account" }]} />
            <div className="mt-5 flex items-center gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-primary font-display text-xl font-bold text-white ring-4 ring-primary-soft">
                {user.name.charAt(0).toUpperCase()}
              </span>
              <div>
                <h1 className="text-2xl font-bold text-ink sm:text-3xl">Hello, {firstName}</h1>
                <p className="mt-0.5 text-sm text-muted">Member since {formatDate(user.createdAt)}</p>
              </div>
            </div>
          </div>
          <form action={logoutAction}>
            <button type="submit" className="btn btn-secondary">
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </form>
        </div>
      </div>

      <div className="container-page space-y-8 py-8 lg:py-10">
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {stats.map(({ label, value, icon: Icon, href }) => (
            <Link key={label} href={href} className="card group flex items-center gap-4 p-5 transition-colors hover:border-slate-300">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block truncate font-display text-xl font-bold text-ink">{value}</span>
                <span className="block text-xs text-muted">{label}</span>
              </span>
            </Link>
          ))}
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-12">
          <section id="orders" className="scroll-mt-28 lg:col-span-8" aria-labelledby="orders-heading">
            <div className="card overflow-hidden">
              <div className="flex items-center justify-between border-b border-line px-5 py-4 sm:px-6">
                <h2 id="orders-heading" className="text-base font-bold text-ink">
                  Order history
                </h2>
                <span className="text-sm text-muted">
                  {orders.length} {orders.length === 1 ? "order" : "orders"}
                </span>
              </div>

              {orders.length > 0 ? (
                <ul className="divide-y divide-line">
                  {orders.map((order) => {
                    const status = ORDER_STATUS[order.status] ?? { label: order.status, tone: "neutral" as const };
                    return (
                      <li key={order.id}>
                        <Link
                          href={`/account/orders/${order.id}`}
                          className="flex flex-col gap-4 px-5 py-5 transition-colors hover:bg-canvas sm:flex-row sm:items-center sm:px-6"
                        >
                          <div className="flex -space-x-3">
                            {order.previews.map((preview, index) => (
                              <span
                                key={`${order.id}-${index}`}
                                className="relative h-12 w-12 overflow-hidden rounded-lg border-2 border-white bg-canvas ring-1 ring-line"
                              >
                                <SafeImage src={preview.image} alt={preview.name} fill sizes="48px" className="object-cover" />
                              </span>
                            ))}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-ink">{order.orderNumber}</p>
                            <p className="mt-0.5 text-xs text-muted">
                              {formatDate(order.createdAt)} · {order.itemCount} {order.itemCount === 1 ? "item" : "items"}
                            </p>
                          </div>
                          <div className="flex items-center justify-between gap-4 sm:justify-end">
                            <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
                            <span className="w-24 text-right text-sm font-semibold text-ink">{formatPrice(order.totalCents)}</span>
                            <ChevronRight className="hidden h-4 w-4 text-muted sm:block" />
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="flex flex-col items-center px-6 py-14 text-center">
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-primary-soft text-primary">
                    <Package className="h-6 w-6" />
                  </span>
                  <p className="mt-4 text-base font-semibold text-ink">No orders yet</p>
                  <p className="mt-1 max-w-sm text-sm text-muted">
                    When you place an order, you&apos;ll be able to track it here.
                  </p>
                  <Link href="/shop" className="btn btn-primary mt-6">
                    Start shopping
                  </Link>
                </div>
              )}
            </div>
          </section>

          <aside className="space-y-5 lg:col-span-4">
            <div className="card p-6">
              <h2 className="text-base font-bold text-ink">Profile</h2>
              <dl className="mt-4 space-y-4 text-sm">
                <div>
                  <dt className="text-xs text-muted">Full name</dt>
                  <dd className="mt-0.5 font-medium text-ink">{user.name}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">Email address</dt>
                  <dd className="mt-0.5 break-all font-medium text-ink">{user.email}</dd>
                </div>
              </dl>
            </div>

            <div className="card p-2">
              {[
                { href: "/wishlist", label: "My wishlist", icon: Heart },
                { href: "/cart", label: "Shopping cart", icon: ShoppingBag },
                { href: "/help#returns", label: "Returns & refunds", icon: RotateCcw },
                { href: "/help", label: "Help center", icon: LifeBuoy },
              ].map(({ href, label, icon: Icon }) => (
                <Link
                  key={label}
                  href={href}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-ink transition-colors hover:bg-canvas hover:text-primary"
                >
                  <Icon className="h-4 w-4 text-muted" />
                  {label}
                  <ChevronRight className="ml-auto h-4 w-4 text-slate-400" />
                </Link>
              ))}
            </div>

            <div className="rounded-xl bg-primary p-6 text-white">
              <p className="font-display text-base font-bold">Need help with an order?</p>
              <p className="mt-1.5 text-sm leading-relaxed text-white/65">
                Our support team is available {STORE.supportHours}.
              </p>
              <Link href="/help#contact" className="btn btn-accent btn-sm mt-5">
                Contact support
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
