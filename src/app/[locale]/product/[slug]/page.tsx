import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { BadgeCheck, Check, ChevronDown, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { PurchasePanel } from "@/components/client/store-actions";
import { ProductGallery } from "@/components/client/widgets";
import { ProductGrid } from "@/components/product-card";
import { Badge, Breadcrumbs, Price, Rating, SectionHeader, ViewAllLink } from "@/components/ui";
import { getOwnerKey } from "@/lib/auth";
import { getProductBySlug, getRelatedProducts, getWishlistIds } from "@/lib/queries";
import { STORE, discountPercent, formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const data = await getProductBySlug(slug);
  if (!data) return { title: "Product not found" };
  return {
    title: data.product.name,
    description: data.product.shortDescription,
    openGraph: { images: data.product.images.slice(0, 1) },
  };
}

function Accordion({ title, defaultOpen, children }: { title: string; defaultOpen?: boolean; children: ReactNode }) {
  return (
    <details className="group" open={defaultOpen}>
      <summary className="flex cursor-pointer items-center justify-between py-4 text-[15px] font-semibold text-ink transition-colors hover:text-primary">
        {title}
        <ChevronDown className="h-4 w-4 text-muted transition-transform duration-200 group-open:rotate-180" />
      </summary>
      <div className="pb-6 text-sm leading-relaxed text-muted">{children}</div>
    </details>
  );
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const data = await getProductBySlug(slug);
  if (!data) notFound();

  const { product, categoryName, categorySlug } = data;
  const [related, ownerKey] = await Promise.all([
    getRelatedProducts(product.categoryId, product.id, 4),
    getOwnerKey(),
  ]);
  const wishlistIds = await getWishlistIds(ownerKey);

  const off = discountPercent(product.priceCents, product.compareAtCents);
  const savings = product.compareAtCents ? product.compareAtCents - product.priceCents : 0;
  const soldOut = product.stock <= 0;
  const lowStock = !soldOut && product.stock <= 5;

  const guarantees = [
    { icon: Truck, title: "Free delivery", text: `On orders over ${formatPrice(STORE.freeShippingThresholdCents)}` },
    { icon: RotateCcw, title: `${STORE.returnDays}-day returns`, text: "Free and easy refunds" },
    { icon: ShieldCheck, title: "Secure checkout", text: "Protected payments" },
    { icon: BadgeCheck, title: "Genuine product", text: "From verified brands" },
  ];

  return (
    <>
      <div className="container-page py-6 sm:py-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Shop", href: "/shop" },
            { label: categoryName, href: `/shop?category=${categorySlug}` },
            { label: product.name },
          ]}
        />

        <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-14">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ProductGallery images={product.images} name={product.name} />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold tracking-[0.12em] uppercase">
              <Link href={`/shop?category=${categorySlug}`} className="text-muted transition-colors hover:text-primary">
                {categoryName}
              </Link>
              <span className="text-slate-300" aria-hidden>
                ·
              </span>
              <span className="text-accent-ink">{product.brand}</span>
              {product.isNew && (
                <span className="ml-1 normal-case tracking-normal">
                  <Badge tone="primary">New</Badge>
                </span>
              )}
            </div>

            <h1 className="mt-3 text-3xl font-bold leading-tight text-ink sm:text-[34px]">{product.name}</h1>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Rating value={product.rating} count={product.reviewCount} size="md" />
              <span className="text-sm text-muted">verified reviews</span>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Price cents={product.priceCents} compareAt={product.compareAtCents} size="lg" />
              {off > 0 && (
                <span className="rounded-md bg-error-soft px-2 py-1 text-xs font-semibold text-error">
                  Save {formatPrice(savings)} ({off}%)
                </span>
              )}
            </div>
            <p className="mt-1.5 text-xs text-muted">Taxes included. Shipping calculated at checkout.</p>

            <p className="mt-6 text-[15px] leading-relaxed text-muted">{product.shortDescription}</p>

            <div className="mt-6 flex items-center gap-2 text-sm">
              {soldOut ? (
                <>
                  <span className="h-2 w-2 rounded-full bg-error" />
                  <span className="font-semibold text-error">Out of stock</span>
                  <span className="text-muted">— back soon</span>
                </>
              ) : lowStock ? (
                <>
                  <span className="h-2 w-2 rounded-full bg-warning" />
                  <span className="font-semibold text-warning">Only {product.stock} left</span>
                  <span className="text-muted">— order soon</span>
                </>
              ) : (
                <>
                  <span className="h-2 w-2 rounded-full bg-success" />
                  <span className="font-semibold text-success">In stock</span>
                  <span className="text-muted">— ships within 24 hours</span>
                </>
              )}
            </div>

            <div className="mt-5">
              <PurchasePanel
                productId={product.id}
                productName={product.name}
                stock={product.stock}
                wishlisted={wishlistIds.includes(product.id)}
              />
            </div>

            <ul className="mt-6 grid gap-4 rounded-xl border border-line bg-white p-5 sm:grid-cols-2">
              {guarantees.map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex items-start gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary">
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-ink">{title}</span>
                    <span className="block text-xs text-muted">{text}</span>
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-8 divide-y divide-line border-y border-line">
              <Accordion title="Description" defaultOpen>
                <p>{product.description}</p>
              </Accordion>
              {product.features.length > 0 && (
                <Accordion title="Key features" defaultOpen>
                  <ul className="space-y-2.5">
                    {product.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-ink">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </Accordion>
              )}
              {product.specs.length > 0 && (
                <Accordion title="Specifications">
                  <dl className="divide-y divide-line overflow-hidden rounded-lg border border-line bg-white">
                    {product.specs.map((spec) => (
                      <div key={spec.label} className="grid grid-cols-2 gap-4 px-4 py-3">
                        <dt className="text-muted">{spec.label}</dt>
                        <dd className="font-medium text-ink">{spec.value}</dd>
                      </div>
                    ))}
                  </dl>
                </Accordion>
              )}
              <Accordion title="Shipping & returns">
                <p>
                  Standard delivery takes 3–5 business days and is free on orders over{" "}
                  {formatPrice(STORE.freeShippingThresholdCents)} ({formatPrice(STORE.standardShippingCents)} otherwise).
                  Express delivery arrives in 1–2 business days for {formatPrice(STORE.expressShippingCents)}.
                </p>
                <p className="mt-3">
                  Changed your mind? Return unused items in their original packaging within {STORE.returnDays} days of
                  delivery for a full refund.{" "}
                  <Link href="/help#returns" className="link">
                    Read our returns policy
                  </Link>
                  .
                </p>
              </Accordion>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-10 border-t border-line bg-white py-16">
          <div className="container-page">
            <SectionHeader
              eyebrow="You may also like"
              title={`More from ${categoryName}`}
              action={<ViewAllLink href={`/shop?category=${categorySlug}`}>View all</ViewAllLink>}
            />
            <div className="mt-8">
              <ProductGrid products={related} wishlistIds={wishlistIds} />
            </div>
          </div>
        </section>
      )}
    </>
  );
}
