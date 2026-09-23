import Link from "next/link";
import type { ReactNode } from "react";
import { Heart, Search, ShoppingBag, Tag, Truck, User } from "lucide-react";
import { getCurrentUser, getOwnerKey } from "@/lib/auth";
import { getCartCount, getCategoriesWithCounts, getWishlistIds } from "@/lib/queries";
import { STORE, formatPrice } from "@/lib/utils";
import { MobileMenu } from "./client/widgets";
import { Logo } from "./ui";

function CountIcon({ href, label, count, children }: { href: string; label: string; count: number; children: ReactNode }) {
  return (
    <Link
      href={href}
      aria-label={`${label}${count ? ` (${count})` : ""}`}
      className="relative grid h-10 w-10 place-items-center rounded-lg text-ink transition-colors hover:bg-primary-soft hover:text-primary"
    >
      {children}
      {count > 0 && (
        <span className="absolute right-0.5 top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-primary px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}

function SearchForm({ id, className }: { id: string; className?: string }) {
  return (
    <form action="/shop" role="search" className={className}>
      <label htmlFor={id} className="sr-only">
        Search products
      </label>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
        <input
          id={id}
          type="search"
          name="q"
          placeholder="Search products, brands and categories"
          className="input h-11 rounded-full bg-canvas pl-10 pr-[92px] hover:bg-white focus:bg-white"
        />
        <button type="submit" className="btn btn-primary btn-sm absolute right-1 top-1 h-9 rounded-full px-4">
          Search
        </button>
      </div>
    </form>
  );
}

export async function Header() {
  const [user, ownerKey, categories] = await Promise.all([getCurrentUser(), getOwnerKey(), getCategoriesWithCounts()]);
  const [cartCount, wishlistIds] = ownerKey
    ? await Promise.all([getCartCount(ownerKey), getWishlistIds(ownerKey)])
    : [0, [] as number[]];
  const firstName = user?.name.split(" ")[0] ?? null;

  return (
    <>
      <div className="bg-primary text-white">
        <div className="container-page flex h-9 items-center justify-center text-xs sm:justify-between">
          <p className="flex items-center gap-2 text-white/85">
            <Truck className="h-3.5 w-3.5 text-accent" aria-hidden />
            Free shipping over {formatPrice(STORE.freeShippingThresholdCents)}
            <span className="hidden text-white/30 sm:inline">·</span>
            <span className="hidden sm:inline">{STORE.returnDays}-day free returns</span>
          </p>
          <nav aria-label="Support" className="hidden items-center gap-5 text-white/70 sm:flex">
            <Link href="/help#shipping" className="transition-colors hover:text-white">
              Shipping
            </Link>
            <Link href="/help#returns" className="transition-colors hover:text-white">
              Returns
            </Link>
            <Link href="/account#orders" className="transition-colors hover:text-white">
              Track order
            </Link>
            <Link href="/help" className="transition-colors hover:text-white">
              Help center
            </Link>
          </nav>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-line bg-white">
        <div className="container-page flex h-16 items-center gap-3 lg:h-[72px] lg:gap-10">
          <MobileMenu categories={categories.map(({ slug, name }) => ({ slug, name }))} userName={user?.name ?? null} />
          <Logo />
          <SearchForm id="search-desktop" className="hidden max-w-xl flex-1 md:block" />
          <nav aria-label="Account" className="ml-auto flex items-center gap-0.5 sm:gap-1">
            <Link
              href={user ? "/account" : "/login"}
              className="flex h-10 items-center gap-2.5 rounded-lg px-2 text-ink transition-colors hover:bg-primary-soft hover:text-primary sm:px-2.5"
              aria-label={user ? "My account" : "Sign in"}
            >
              <User className="h-5 w-5" />
              <span className="hidden text-left leading-tight lg:block">
                <span className="block text-[11px] text-muted">{user ? "Hello," : "Welcome"}</span>
                <span className="block max-w-[110px] truncate text-sm font-semibold">{firstName ?? "Sign in"}</span>
              </span>
            </Link>
            <CountIcon href="/wishlist" label="Wishlist" count={wishlistIds.length}>
              <Heart className="h-5 w-5" />
            </CountIcon>
            <CountIcon href="/cart" label="Cart" count={cartCount}>
              <ShoppingBag className="h-5 w-5" />
            </CountIcon>
          </nav>
        </div>
        <div className="container-page pb-3 md:hidden">
          <SearchForm id="search-mobile" />
        </div>
      </header>

      <nav aria-label="Categories" className="hidden border-b border-line bg-white lg:block">
        <div className="container-page flex h-12 items-center gap-7 text-sm">
          <Link href="/shop" className="font-semibold text-primary">
            All products
          </Link>
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/shop?category=${category.slug}`}
              className="font-medium whitespace-nowrap text-muted transition-colors hover:text-primary"
            >
              {category.name}
            </Link>
          ))}
          <Link href="/shop?sale=1" className="ml-auto flex items-center gap-1.5 font-semibold text-primary">
            <Tag className="h-4 w-4 text-accent" aria-hidden />
            Deals
          </Link>
        </div>
      </nav>
    </>
  );
}
