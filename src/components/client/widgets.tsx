"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronRight, Heart, LifeBuoy, Menu, Package, ShoppingBag, Tag, User, X } from "lucide-react";
import { SORT_OPTIONS, cn } from "@/lib/utils";
import { SafeImage } from "./safe-image";

export function MobileMenu({
  categories,
  userName,
}: {
  categories: { slug: string; name: string }[];
  userName: string | null;
}) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const linkClass = "flex items-center justify-between py-3 text-[15px] font-medium text-ink hover:text-primary";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        className="-ml-2 grid h-10 w-10 place-items-center rounded-lg text-ink transition-colors hover:bg-primary-soft lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Main menu">
          <div className="absolute inset-0 animate-fade-in bg-primary/40" onClick={close} aria-hidden />
          <div className="absolute inset-y-0 left-0 flex w-[88%] max-w-sm animate-drawer-in flex-col bg-white">
            <div className="flex h-16 items-center justify-between border-b border-line px-5">
              <span className="font-display text-base font-bold text-primary">Menu</span>
              <button
                type="button"
                onClick={close}
                aria-label="Close menu"
                className="-mr-2 grid h-10 w-10 place-items-center rounded-lg text-ink hover:bg-primary-soft"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 pb-8 pt-5">
              <div className="rounded-xl bg-primary-soft p-4">
                {userName ? (
                  <Link href="/account" onClick={close} className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-primary text-sm font-bold text-white">
                      {userName.charAt(0).toUpperCase()}
                    </span>
                    <span>
                      <span className="block text-xs text-muted">Signed in as</span>
                      <span className="block text-sm font-semibold text-ink">{userName}</span>
                    </span>
                    <ChevronRight className="ml-auto h-4 w-4 text-muted" />
                  </Link>
                ) : (
                  <>
                    <p className="text-sm font-semibold text-ink">Welcome to RAFIK STOORE</p>
                    <p className="mt-0.5 text-xs text-muted">Sign in to track orders and save favorites.</p>
                    <div className="mt-3 flex gap-2">
                      <Link href="/login" onClick={close} className="btn btn-primary btn-sm flex-1">
                        Sign in
                      </Link>
                      <Link href="/register" onClick={close} className="btn btn-secondary btn-sm flex-1">
                        Register
                      </Link>
                    </div>
                  </>
                )}
              </div>

              <p className="mt-7 text-xs font-semibold tracking-[0.14em] text-muted uppercase">Shop</p>
              <ul className="mt-1 divide-y divide-line">
                <li>
                  <Link href="/shop" onClick={close} className={linkClass}>
                    All products
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </Link>
                </li>
                {categories.map((category) => (
                  <li key={category.slug}>
                    <Link href={`/shop?category=${category.slug}`} onClick={close} className={linkClass}>
                      {category.name}
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/shop?sale=1" onClick={close} className={cn(linkClass, "text-primary")}>
                    <span className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-accent" />
                      Deals
                    </span>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </Link>
                </li>
              </ul>

              <p className="mt-7 text-xs font-semibold tracking-[0.14em] text-muted uppercase">Your account</p>
              <ul className="mt-1 divide-y divide-line">
                {[
                  { href: userName ? "/account" : "/login", label: "My account", icon: User },
                  { href: "/account#orders", label: "Orders", icon: Package },
                  { href: "/wishlist", label: "Wishlist", icon: Heart },
                  { href: "/cart", label: "Cart", icon: ShoppingBag },
                  { href: "/help", label: "Help center", icon: LifeBuoy },
                ].map(({ href, label, icon: Icon }) => (
                  <li key={label}>
                    <Link href={href} onClick={close} className={linkClass}>
                      <span className="flex items-center gap-3">
                        <Icon className="h-4 w-4 text-muted" />
                        {label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function SortSelect({ value, params }: { value: string; params: Record<string, string> }) {
  const router = useRouter();
  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="hidden whitespace-nowrap text-muted sm:inline">Sort by</span>
      <select
        value={value}
        aria-label="Sort products"
        onChange={(event) => {
          const search = new URLSearchParams(params);
          search.delete("page");
          if (event.target.value === "featured") search.delete("sort");
          else search.set("sort", event.target.value);
          const query = search.toString();
          router.push(query ? `/shop?${query}` : "/shop");
        }}
        className="input h-10 w-auto min-w-[176px] cursor-pointer font-medium"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0] ?? null;

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-line bg-white">
        <SafeImage
          src={current}
          alt={name}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-3">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Show image ${index + 1} of ${images.length}`}
              aria-current={index === active}
              className={cn(
                "relative aspect-square overflow-hidden rounded-lg border bg-white transition",
                index === active ? "border-primary ring-1 ring-primary" : "border-line hover:border-slate-300",
              )}
            >
              <SafeImage src={image} alt="" fill sizes="120px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
