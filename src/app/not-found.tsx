import Link from "next/link";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container-page py-20">
      <div className="mx-auto flex max-w-lg flex-col items-center text-center">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-primary-soft text-primary">
          <Compass className="h-7 w-7" />
        </span>
        <p className="mt-6 text-sm font-semibold tracking-[0.16em] text-accent-ink uppercase">Error 404</p>
        <h1 className="mt-2 text-3xl font-bold text-ink sm:text-4xl">We couldn&apos;t find that page</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-muted">
          The page may have moved or the product is no longer available. Let&apos;s get you back on track.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/shop" className="btn btn-primary">
            Browse products
          </Link>
          <Link href="/" className="btn btn-secondary">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
