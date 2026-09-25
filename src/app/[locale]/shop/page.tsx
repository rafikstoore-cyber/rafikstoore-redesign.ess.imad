import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ChevronRight, SearchX, SlidersHorizontal, X } from "lucide-react";
import { SortSelect } from "@/components/client/widgets";
import { ProductGrid } from "@/components/product-card";
import { EmptyState, PageHeader } from "@/components/ui";
import { getOwnerKey } from "@/lib/auth";
import { getCategoriesWithCounts, getProducts, getWishlistIds, type CategoryWithCount } from "@/lib/queries";
import { cn, isSortKey, type SortKey } from "@/lib/utils";

export const dynamic = "force-dynamic";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

type ShopParams = {
  category?: string;
  q?: string;
  min?: number;
  max?: number;
  inStock: boolean;
  sale: boolean;
  sort: SortKey;
  page: number;
};

type HrefBuilder = (overrides: Record<string, string | undefined>) => string;

const PAGE_SIZE = 12;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parsePrice(value: string | undefined) {
  if (!value) return undefined;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
}

function parseParams(sp: Awaited<SearchParams>): ShopParams {
  const sort = first(sp.sort);
  return {
    category: first(sp.category)?.trim() || undefined,
    q: first(sp.q)?.trim().slice(0, 80) || undefined,
    min: parsePrice(first(sp.min)),
    max: parsePrice(first(sp.max)),
    inStock: first(sp.stock) === "1",
    sale: first(sp.sale) === "1",
    sort: isSortKey(sort) ? sort : "featured",
    page: Math.max(1, Number.parseInt(first(sp.page) ?? "1", 10) || 1),
  };
}

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const params = parseParams(await searchParams);
  if (params.q) return { title: `Search: ${params.q}` };
  if (params.category) {
    const category = (await getCategoriesWithCounts()).find((c) => c.slug === params.category);
    if (category) return { title: category.name, description: category.description };
  }
  if (params.sale) return { title: "Deals" };
  return { title: "Shop all products" };
}

function CategoryLink({ href, active, label, count }: { href: string; active: boolean; label: string; count: number }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
        active ? "bg-primary-soft font-semibold text-primary" : "text-ink hover:bg-white hover:text-primary",
      )}
    >
      <span className="flex items-center gap-2">
        {active && <span className="h-4 w-0.5 rounded-full bg-accent" aria-hidden />}
        {label}
      </span>
      <span className={cn("text-xs tabular-nums", active ? "text-primary/70" : "text-muted")}>{count}</span>
    </Link>
  );
}

function FiltersPanel({
  idPrefix,
  categories,
  params,
  href,
  hasFilters,
}: {
  idPrefix: string;
  categories: CategoryWithCount[];
  params: ShopParams;
  href: HrefBuilder;
  hasFilters: boolean;
}) {
  const total = categories.reduce((sum, c) => sum + c.productCount, 0);
  const headingClass = "text-xs font-semibold tracking-[0.14em] text-muted uppercase";
  return (
    <div className="space-y-7">
      <div>
        <h2 className={headingClass}>Categories</h2>
        <ul className="-mx-3 mt-3 space-y-0.5">
          <li>
            <CategoryLink href={href({ category: undefined, page: undefined })} active={!params.category} label="All products" count={total} />
          </li>
          {categories.map((category) => (
            <li key={category.slug}>
              <CategoryLink
                href={href({ category: category.slug, page: undefined })}
                active={params.category === category.slug}
                label={category.name}
                count={category.productCount}
              />
            </li>
          ))}
        </ul>
      </div>

      <form action="/shop" className="space-y-7 border-t border-line pt-7">
        {params.category && <input type="hidden" name="category" value={params.category} />}
        {params.q && <input type="hidden" name="q" value={params.q} />}
        {params.sort !== "featured" && <input type="hidden" name="sort" value={params.sort} />}

        <fieldset>
          <legend className={headingClass}>Price range</legend>
          <div className="mt-3 flex items-center gap-2">
            {(["min", "max"] as const).map((key, index) => (
              <div key={key} className="contents">
                {index === 1 && <span className="text-muted">–</span>}
                <div className="relative flex-1">
                  <label htmlFor={`${idPrefix}-${key}`} className="sr-only">
                    {key === "min" ? "Minimum price" : "Maximum price"}
                  </label>
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted">$</span>
                  <input
                    id={`${idPrefix}-${key}`}
                    name={key}
                    type="number"
                    min={0}
                    inputMode="numeric"
                    placeholder={key === "min" ? "Min" : "Max"}
                    defaultValue={params[key]}
                    className="input h-10 pl-7"
                  />
                </div>
              </div>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className={headingClass}>Availability</legend>
          <div className="mt-3 space-y-3">
            <label className="flex cursor-pointer items-center gap-3 text-sm text-ink">
              <input type="checkbox" name="stock" value="1" defaultChecked={params.inStock} className="checkbox" />
              In stock only
            </label>
            <label className="flex cursor-pointer items-center gap-3 text-sm text-ink">
              <input type="checkbox" name="sale" value="1" defaultChecked={params.sale} className="checkbox" />
              On sale
            </label>
          </div>
        </fieldset>

        <div className="flex gap-2">
          <button type="submit" className="btn btn-primary flex-1">
            Apply filters
          </button>
          {hasFilters && (
            <Link href="/shop" className="btn btn-secondary">
              Reset
            </Link>
          )}
        </div>
      </form>
    </div>
  );
}

function pageWindow(page: number, pageCount: number): (number | "gap")[] {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, i) => i + 1);
  const pages = new Set([1, pageCount, page - 1, page, page + 1].filter((p) => p >= 1 && p <= pageCount));
  const sorted = [...pages].sort((a, b) => a - b);
  const result: (number | "gap")[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) result.push("gap");
    result.push(p);
  });
  return result;
}

function Pagination({ page, pageCount, href }: { page: number; pageCount: number; href: HrefBuilder }) {
  if (pageCount <= 1) return null;
  const pageHref = (p: number) => href({ page: p > 1 ? String(p) : undefined });
  const edgeClass = "btn btn-secondary btn-sm h-10";
  return (
    <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-1.5">
      {page > 1 ? (
        <Link href={pageHref(page - 1)} className={edgeClass} aria-label="Previous page">
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Previous</span>
        </Link>
      ) : (
        <span className={cn(edgeClass, "pointer-events-none opacity-50")} aria-hidden>
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Previous</span>
        </span>
      )}
      {pageWindow(page, pageCount).map((p, i) =>
        p === "gap" ? (
          <span key={`gap-${i}`} className="px-1 text-muted">
            …
          </span>
        ) : (
          <Link
            key={p}
            href={pageHref(p)}
            aria-current={p === page ? "page" : undefined}
            className={cn(
              "grid h-10 min-w-10 place-items-center rounded-lg px-3 text-sm font-semibold transition-colors",
              p === page ? "bg-primary text-white" : "text-ink hover:bg-white hover:ring-1 hover:ring-line",
            )}
          >
            {p}
          </Link>
        ),
      )}
      {page < pageCount ? (
        <Link href={pageHref(page + 1)} className={edgeClass} aria-label="Next page">
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span className={cn(edgeClass, "pointer-events-none opacity-50")} aria-hidden>
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" />
        </span>
      )}
    </nav>
  );
}

export default async function ShopPage({ searchParams }: { searchParams: SearchParams }) {
  const params = parseParams(await searchParams);
  const [categories, result, ownerKey] = await Promise.all([
    getCategoriesWithCounts(),
    getProducts({ ...params, pageSize: PAGE_SIZE }),
    getOwnerKey(),
  ]);
  const wishlistIds = await getWishlistIds(ownerKey);
  const activeCategory = categories.find((c) => c.slug === params.category);
  const totalProducts = categories.reduce((sum, c) => sum + c.productCount, 0);

  const current: Record<string, string> = {};
  if (params.category) current.category = params.category;
  if (params.q) current.q = params.q;
  if (params.min !== undefined) current.min = String(params.min);
  if (params.max !== undefined) current.max = String(params.max);
  if (params.inStock) current.stock = "1";
  if (params.sale) current.sale = "1";
  if (params.sort !== "featured") current.sort = params.sort;
  if (params.page > 1) current.page = String(params.page);

  const href: HrefBuilder = (overrides) => {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries({ ...current, ...overrides })) {
      if (value) search.set(key, value);
    }
    const query = search.toString();
    return query ? `/shop?${query}` : "/shop";
  };

  const chips: { label: string; href: string }[] = [];
  if (params.q) chips.push({ label: `"${params.q}"`, href: href({ q: undefined, page: undefined }) });
  if (activeCategory) chips.push({ label: activeCategory.name, href: href({ category: undefined, page: undefined }) });
  if (params.min !== undefined || params.max !== undefined) {
    const label =
      params.min !== undefined && params.max !== undefined
        ? `$${params.min} – $${params.max}`
        : params.min !== undefined
          ? `From $${params.min}`
          : `Up to $${params.max}`;
    chips.push({ label, href: href({ min: undefined, max: undefined, page: undefined }) });
  }
  if (params.inStock) chips.push({ label: "In stock", href: href({ stock: undefined, page: undefined }) });
  if (params.sale) chips.push({ label: "On sale", href: href({ sale: undefined, page: undefined }) });
  const hasFilters = chips.length > 0;

  const title = params.q
    ? `Results for "${params.q}"`
    : activeCategory?.name ?? (params.sale ? "Deals" : "All products");
  const description = params.q
    ? `${result.total} ${result.total === 1 ? "product matches" : "products match"} your search.`
    : activeCategory?.description ??
      (params.sale
        ? "Limited-time savings on customer favorites across every category."
        : `Browse our full collection of ${totalProducts} products across ${categories.length} categories.`);

  const breadcrumbs: { label: string; href?: string }[] = [{ label: "Home", href: "/" }];
  if (activeCategory || params.q || params.sale) {
    breadcrumbs.push({ label: "Shop", href: "/shop" });
    breadcrumbs.push({ label: activeCategory?.name ?? (params.q ? "Search" : "Deals") });
  } else {
    breadcrumbs.push({ label: "Shop" });
  }

  const from = result.total === 0 ? 0 : (result.page - 1) * result.pageSize + 1;
  const to = Math.min(result.page * result.pageSize, result.total);

  return (
    <>
      <PageHeader title={title} description={description} breadcrumbs={breadcrumbs} />

      <div className="container-page py-8 lg:py-10">
        <div className="flex gap-10">
          <aside className="hidden w-60 shrink-0 lg:block" aria-label="Filters">
            <div className="sticky top-24">
              <FiltersPanel idPrefix="desktop" categories={categories} params={params} href={href} hasFilters={hasFilters} />
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            <details className="mb-4 lg:hidden">
              <summary className="btn btn-secondary btn-sm w-full sm:w-auto">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {hasFilters && (
                  <span className="grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
                    {chips.length}
                  </span>
                )}
              </summary>
              <div className="card mt-3 p-5">
                <FiltersPanel idPrefix="mobile" categories={categories} params={params} href={href} hasFilters={hasFilters} />
              </div>
            </details>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted">
                {result.total > 0 ? (
                  <>
                    Showing <span className="font-semibold text-ink">{from}–{to}</span> of{" "}
                    <span className="font-semibold text-ink">{result.total}</span> products
                  </>
                ) : (
                  "No products to show"
                )}
              </p>
              <SortSelect value={params.sort} params={current} />
            </div>

            {hasFilters && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {chips.map((chip) => (
                  <Link
                    key={chip.label}
                    href={chip.href}
                    className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white py-1.5 pl-3 pr-2 text-xs font-medium text-ink transition-colors hover:border-primary/30 hover:text-primary"
                  >
                    {chip.label}
                    <X className="h-3.5 w-3.5 text-muted" aria-label="Remove filter" />
                  </Link>
                ))}
                <Link href="/shop" className="ml-1 text-xs font-semibold text-primary hover:underline">
                  Clear all
                </Link>
              </div>
            )}

            <div className="mt-6">
              {result.items.length > 0 ? (
                <ProductGrid products={result.items} wishlistIds={wishlistIds} columns={3} priorityCount={3} />
              ) : (
                <EmptyState
                  icon={<SearchX className="h-7 w-7" />}
                  title="No products found"
                  description="We couldn't find anything matching these filters. Try removing a filter or searching for something else."
                  action={
                    <>
                      <Link href="/shop" className="btn btn-primary">
                        Reset all filters
                      </Link>
                      <Link href="/" className="btn btn-secondary">
                        Back to home
                      </Link>
                    </>
                  }
                />
              )}
            </div>

            <Pagination page={result.page} pageCount={result.pageCount} href={href} />
          </div>
        </div>
      </div>
    </>
  );
}
