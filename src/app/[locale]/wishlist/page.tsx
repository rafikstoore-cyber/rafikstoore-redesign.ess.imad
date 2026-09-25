import type { Metadata } from "next";
import Link from "next/link";
import { Heart, Info } from "lucide-react";
import { MoveToCartButton } from "@/components/client/store-actions";
import { ProductCard } from "@/components/product-card";
import { EmptyState, PageHeader } from "@/components/ui";
import { getCurrentUser, getOwnerKey } from "@/lib/auth";
import { getWishlistProducts } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Wishlist" };

export default async function WishlistPage() {
  const [ownerKey, user] = await Promise.all([getOwnerKey(), getCurrentUser()]);
  const items = ownerKey ? await getWishlistProducts(ownerKey) : [];

  return (
    <>
      <PageHeader
        title="Your wishlist"
        description={
          items.length
            ? `${items.length} saved ${items.length === 1 ? "item" : "items"} — move them to your cart whenever you're ready.`
            : "Save the things you love and come back to them anytime."
        }
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Wishlist" }]}
      />

      <div className="container-page py-8 lg:py-10">
        {!user && items.length > 0 && (
          <div className="mb-6 flex flex-col gap-3 rounded-xl border border-line bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-2.5 text-sm text-ink">
              <Info className="h-4 w-4 shrink-0 text-primary" />
              Sign in to keep your wishlist safe and synced across devices.
            </p>
            <Link href="/login?next=/wishlist" className="btn btn-secondary btn-sm">
              Sign in
            </Link>
          </div>
        )}

        {items.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {items.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                wishlisted
                footer={
                  <MoveToCartButton productId={product.id} productName={product.name} disabled={product.stock <= 0} />
                }
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Heart className="h-7 w-7" />}
            title="Your wishlist is empty"
            description="Tap the heart on any product to save it here for later."
            action={
              <Link href="/shop" className="btn btn-primary">
                Discover products
              </Link>
            }
          />
        )}
      </div>
    </>
  );
}
