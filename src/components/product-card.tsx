import Link from "next/link";
import type { ReactNode } from "react";
import type { ProductCardData } from "@/lib/queries";
import { cn, discountPercent } from "@/lib/utils";
import { SafeImage } from "./client/safe-image";
import { AddToCartButton, WishlistButton } from "./client/store-actions";
import { Badge, Price, Rating } from "./ui";

export function ProductCard({
  product,
  wishlisted,
  footer,
  priority = false,
}: {
  product: ProductCardData;
  wishlisted: boolean;
  footer?: ReactNode;
  priority?: boolean;
}) {
  const off = discountPercent(product.priceCents, product.compareAtCents);
  const soldOut = product.stock <= 0;
  const lowStock = !soldOut && product.stock <= 5;
  const href = `/product/${product.slug}`;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-line bg-white transition duration-200 hover:border-slate-300 hover:shadow-lift">
      <div className="relative aspect-square overflow-hidden bg-canvas">
        <Link href={href} className="absolute inset-0" tabIndex={-1} aria-hidden>
          <SafeImage
            src={product.image}
            alt={product.name}
            fill
            priority={priority}
            sizes="(min-width: 1280px) 300px, (min-width: 768px) 33vw, 50vw"
            className={cn("object-cover transition duration-500 ease-out group-hover:scale-[1.03]", soldOut && "opacity-60 grayscale-[30%]")}
          />
        </Link>
        <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {soldOut ? (
            <Badge tone="neutral">Sold out</Badge>
          ) : (
            <>
              {product.isNew && <Badge tone="primary">New</Badge>}
              {off > 0 && <Badge tone="sale">−{off}%</Badge>}
            </>
          )}
        </div>
        <div className="absolute right-3 top-3">
          <WishlistButton productId={product.id} productName={product.name} active={wishlisted} />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        <p className="truncate text-[11px] font-semibold tracking-[0.08em] text-muted uppercase">{product.brand}</p>
        <h3 className="mt-1 line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-5 text-ink">
          <Link href={href} className="transition-colors hover:text-primary">
            {product.name}
          </Link>
        </h3>
        <div className="mt-2">
          <Rating value={product.rating} count={product.reviewCount} />
        </div>
        <div className="mt-auto flex items-end justify-between gap-2 pt-4">
          <div className="min-w-0">
            <Price cents={product.priceCents} compareAt={product.compareAtCents} />
            {lowStock && <p className="mt-0.5 text-[11px] font-semibold text-warning">Only {product.stock} left</p>}
          </div>
          <AddToCartButton productId={product.id} productName={product.name} disabled={soldOut} />
        </div>
        {footer && <div className="mt-3">{footer}</div>}
      </div>
    </article>
  );
}

export function ProductGrid({
  products,
  wishlistIds,
  columns = 4,
  priorityCount = 0,
}: {
  products: ProductCardData[];
  wishlistIds: number[];
  columns?: 3 | 4;
  priorityCount?: number;
}) {
  const saved = new Set(wishlistIds);
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-3 sm:gap-5",
        columns === 4 ? "md:grid-cols-3 lg:grid-cols-4" : "md:grid-cols-3",
      )}
    >
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          wishlisted={saved.has(product.id)}
          priority={index < priorityCount}
        />
      ))}
    </div>
  );
}
