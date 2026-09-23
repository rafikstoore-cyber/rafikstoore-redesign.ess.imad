import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Headphones,
  RotateCcw,
  ShieldCheck,
  Truck,
  Wallet,
} from "lucide-react";
import { SafeImage } from "@/components/client/safe-image";
import { ProductGrid } from "@/components/product-card";
import { SectionHeader, Stars, ViewAllLink } from "@/components/ui";
import { getOwnerKey } from "@/lib/auth";
import {
  getCategoriesWithCounts,
  getFeaturedProducts,
  getNewArrivals,
  getStoreStats,
  getWishlistIds,
} from "@/lib/queries";
import { STORE, formatPrice, pexels } from "@/lib/utils";

export const dynamic = "force-dynamic";

const HERO_TILES = [
  { label: "Electronics", href: "/shop?category=electronics", image: pexels(3394650, 700) },
  { label: "Fashion", href: "/shop?category=fashion", image: pexels(16428734, 700) },
  { label: "Home & Living", href: "/shop?category=home-living", image: pexels(38986380, 700) },
  { label: "Beauty & Care", href: "/shop?category=beauty", image: pexels(20382236, 700) },
];

const TRUST_ITEMS = [
  { icon: Truck, title: "Free shipping", text: `On orders over ${formatPrice(STORE.freeShippingThresholdCents)}` },
  { icon: RotateCcw, title: `${STORE.returnDays}-day returns`, text: "Simple, no-hassle refunds" },
  { icon: ShieldCheck, title: "Secure checkout", text: "Your data stays protected" },
  { icon: Headphones, title: "Real support", text: "Friendly help, 6 days a week" },
];

const VALUES = [
  { icon: BadgeCheck, title: "Genuine products", text: "Every item comes from verified brands and is quality-checked before it ships." },
  { icon: Truck, title: "Fast, tracked delivery", text: "Orders leave our warehouse within 24 hours, with tracking from door to door." },
  { icon: Wallet, title: "Flexible payment", text: "Pay cash or card on delivery, or by bank transfer — whatever suits you best." },
  { icon: Headphones, title: "People who care", text: "Our support team answers real questions from real people, quickly and kindly." },
];

const REVIEWS = [
  { name: "Sarah M.", location: "Chicago, IL", rating: 5, text: "Ordered headphones and a lamp in the same basket — both arrived in two days, beautifully packed. Checkout was effortless." },
  { name: "Youssef A.", location: "Montréal, QC", rating: 5, text: "Finally a store that carries quality across categories. The product descriptions are honest and the prices are fair." },
  { name: "Emma L.", location: "London, UK", rating: 4.5, text: "I needed to exchange a jacket size and support sorted it the same day. That's exactly the kind of service I come back for." },
];

export default async function HomePage() {
  const [categories, featured, newArrivals, stats, ownerKey] = await Promise.all([
    getCategoriesWithCounts(),
    getFeaturedProducts(8),
    getNewArrivals(4),
    getStoreStats(),
    getOwnerKey(),
  ]);
  const wishlistIds = await getWishlistIds(ownerKey);

  return (
    <>
      {/* Hero */}
      <section className="bg-primary text-white">
        <div className="container-page grid items-center gap-12 py-14 lg:grid-cols-12 lg:gap-10 lg:py-20">
          <div className="lg:col-span-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 text-xs font-medium text-white/80">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              New season essentials are here
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-[1.08] text-white sm:text-5xl lg:text-[3.5rem]">
              Everything you love,
              <br className="hidden sm:block" /> in one{" "}
              <span className="relative inline-block">
                trusted
                <span className="absolute inset-x-0 -bottom-1.5 h-[3px] rounded-full bg-accent" aria-hidden />
              </span>{" "}
              place.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-white/70 sm:text-lg">
              Quality electronics, fashion, home, beauty and lifestyle essentials — carefully selected, fairly priced and
              delivered with care.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/shop" className="btn btn-light btn-lg">
                Shop all products
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/shop?sale=1" className="btn btn-outline-light btn-lg">
                Explore today&apos;s deals
              </Link>
            </div>
            <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-white/10 pt-6">
              <div>
                <dt className="text-xs text-white/55">Happy customers</dt>
                <dd className="mt-1 font-display text-2xl font-bold text-white">120k+</dd>
              </div>
              <div>
                <dt className="text-xs text-white/55">Average rating</dt>
                <dd className="mt-1 font-display text-2xl font-bold text-white">
                  {stats.avgRating.toFixed(1)}
                  <span className="text-base font-semibold text-white/50">/5</span>
                </dd>
              </div>
              <div>
                <dt className="text-xs text-white/55">Categories</dt>
                <dd className="mt-1 font-display text-2xl font-bold text-white">{categories.length}</dd>
              </div>
            </dl>
          </div>

          <div className="lg:col-span-6">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {HERO_TILES.map((tile, index) => (
                <Link
                  key={tile.label}
                  href={tile.href}
                  className="group relative aspect-square overflow-hidden rounded-2xl bg-white/5"
                >
                  <SafeImage
                    src={tile.image}
                    alt={tile.label}
                    fill
                    priority={index < 2}
                    sizes="(min-width: 1024px) 300px, 45vw"
                    className="object-cover transition duration-700 ease-out group-hover:scale-105"
                  />
                  <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-primary shadow-soft sm:bottom-4 sm:left-4">
                    {tile.label}
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section aria-label="Why shop with us" className="border-b border-line bg-white">
        <div className="container-page grid grid-cols-2 gap-y-6 py-6 lg:grid-cols-4 lg:py-7">
          {TRUST_ITEMS.map(({ icon: Icon, title, text }, index) => (
            <div
              key={title}
              className={`flex items-center gap-3 pr-2 lg:px-6 ${index > 0 ? "lg:border-l lg:border-line" : "lg:pl-0"}`}
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary-soft text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink">{title}</p>
                <p className="text-xs text-muted">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="container-page py-16 lg:py-20">
        <SectionHeader
          eyebrow="Shop by category"
          title="Find what you need, faster"
          description="From everyday tech to home comforts — explore curated collections across every part of your life."
          action={<ViewAllLink href="/shop">Browse all products</ViewAllLink>}
        />
        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/shop?category=${category.slug}`}
              className="group overflow-hidden rounded-xl border border-line bg-white transition duration-200 hover:border-slate-300 hover:shadow-lift"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-canvas">
                <SafeImage
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(min-width: 1024px) 300px, (min-width: 768px) 33vw, 50vw"
                  className="object-cover transition duration-700 ease-out group-hover:scale-105"
                />
              </div>
              <div className="flex items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold text-ink sm:text-base">{category.name}</h3>
                  <p className="mt-0.5 truncate text-xs text-muted">
                    {category.productCount} products · {category.tagline}
                  </p>
                </div>
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line text-ink transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-white">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Bestsellers */}
      <section className="border-y border-line bg-white py-16 lg:py-20">
        <div className="container-page">
          <SectionHeader
            eyebrow="Bestsellers"
            title="Most-loved by our customers"
            description="Top-rated picks across every category, chosen by thousands of verified reviews."
            action={<ViewAllLink href="/shop">View all</ViewAllLink>}
          />
          <div className="mt-10">
            <ProductGrid products={featured} wishlistIds={wishlistIds} />
          </div>
        </div>
      </section>

      {/* Promotions */}
      <section className="container-page grid gap-4 py-16 sm:gap-5 lg:grid-cols-2 lg:py-20">
        <div className="relative flex min-h-[300px] overflow-hidden rounded-2xl bg-primary text-white">
          <div className="relative z-10 flex w-full flex-col justify-center p-8 sm:w-3/5 sm:p-10">
            <p className="eyebrow text-white/60">Tech week</p>
            <h3 className="mt-3 text-2xl font-bold leading-tight text-white sm:text-[28px]">
              Save up to 25% on audio &amp; wearables
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-white/65">
              Noise-cancelling headphones, smartwatches and earbuds from brands you trust.
            </p>
            <div className="mt-7">
              <Link href="/shop?category=electronics&sale=1" className="btn btn-accent">
                Shop electronics
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 hidden w-2/5 sm:block">
            <SafeImage src={pexels(15840650, 700)} alt="Wireless headphones" fill sizes="280px" className="object-cover" />
          </div>
        </div>

        <div className="relative flex min-h-[300px] overflow-hidden rounded-2xl border border-line bg-accent-soft">
          <div className="relative z-10 flex w-full flex-col justify-center p-8 sm:w-3/5 sm:p-10">
            <p className="eyebrow">Home refresh</p>
            <h3 className="mt-3 text-2xl font-bold leading-tight text-ink sm:text-[28px]">
              Calm, considered pieces for every room
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Handmade ceramics, warm lighting and natural textures — new this season.
            </p>
            <div className="mt-7">
              <Link href="/shop?category=home-living" className="btn btn-primary">
                Discover home
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 hidden w-2/5 sm:block">
            <SafeImage src={pexels(29904622, 700)} alt="Ceramic vase" fill sizes="280px" className="object-cover" />
          </div>
        </div>
      </section>

      {/* New arrivals */}
      <section className="container-page pb-16 lg:pb-20">
        <SectionHeader
          eyebrow="Just landed"
          title="New arrivals"
          description="Fresh additions to the store this week."
          action={<ViewAllLink href="/shop?sort=newest">Shop new arrivals</ViewAllLink>}
        />
        <div className="mt-10">
          <ProductGrid products={newArrivals} wishlistIds={wishlistIds} />
        </div>
      </section>

      {/* Values */}
      <section className="border-y border-line bg-white py-16 lg:py-20">
        <div className="container-page grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow">Why RAFIK STOORE</p>
            <h2 className="mt-3 text-2xl font-bold text-ink sm:text-[28px] sm:leading-tight">
              Shopping that&apos;s simple, safe and reliable
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">
              We built RAFIK STOORE around one idea: you should be able to buy anything you need from a store you can
              genuinely trust.
            </p>
            <Link href="/help" className="btn btn-secondary mt-7">
              How we work
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
            {VALUES.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-xl border border-line bg-canvas p-6">
                <span className="grid h-11 w-11 place-items-center rounded-lg bg-primary text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-base font-semibold text-ink">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="container-page py-16 lg:py-20">
        <SectionHeader
          eyebrow="Customer reviews"
          title="Trusted by shoppers everywhere"
          description={`Rated ${stats.avgRating.toFixed(1)} out of 5 on average across ${stats.productCount} products.`}
        />
        <div className="mt-10 grid gap-4 sm:gap-5 md:grid-cols-3">
          {REVIEWS.map((review) => (
            <figure key={review.name} className="card flex flex-col p-6">
              <Stars value={review.rating} size="md" />
              <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-ink">"{review.text}"</blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-soft text-sm font-bold text-primary">
                  {review.name.charAt(0)}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-ink">{review.name}</span>
                  <span className="flex items-center gap-1 text-xs text-muted">
                    <BadgeCheck className="h-3.5 w-3.5 text-success" />
                    Verified buyer · {review.location}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </>
  );
}
