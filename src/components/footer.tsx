import Link from "next/link";
import { Clock, Mail, Phone } from "lucide-react";
import { getCategoriesWithCounts } from "@/lib/queries";
import { STORE } from "@/lib/utils";
import { NewsletterForm } from "./client/forms";
import { Logo } from "./ui";

function FooterColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold tracking-normal text-white">{title}</h3>
      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href} className="text-sm text-white/60 transition-colors hover:text-white">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

const PAYMENT_BADGES = ["Visa", "Mastercard", "Cash on delivery", "Bank transfer"];

export async function Footer() {
  const categories = await getCategoriesWithCounts();

  return (
    <footer className="mt-20 bg-primary text-white">
      <div className="container-page">
        <div className="flex flex-col gap-6 border-b border-white/10 py-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-md">
            <p className="eyebrow text-white/60">Newsletter</p>
            <h2 className="mt-3 text-2xl font-bold text-white">Be first to know about new arrivals</h2>
            <p className="mt-2 text-sm leading-relaxed text-white/60">
              Member-only offers, restocks and curated picks. No spam — unsubscribe anytime.
            </p>
          </div>
          <div className="w-full lg:max-w-md">
            <NewsletterForm />
          </div>
        </div>

        <div className="grid gap-10 py-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo variant="light" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/60">
              Carefully selected electronics, fashion, home and lifestyle essentials — with honest prices, genuine
              products and service you can count on.
            </p>
            <ul className="mt-6 space-y-2.5 text-sm text-white/75">
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-accent" aria-hidden />
                <a href={`mailto:${STORE.supportEmail}`} className="hover:text-white">
                  {STORE.supportEmail}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-accent" aria-hidden />
                {STORE.supportPhone}
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 text-accent" aria-hidden />
                {STORE.supportHours}
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-8 lg:pl-8">
            <FooterColumn
              title="Shop"
              links={[
                { href: "/shop", label: "All products" },
                ...categories.slice(0, 6).map((c) => ({ href: `/shop?category=${c.slug}`, label: c.name })),
                { href: "/shop?sale=1", label: "Deals" },
              ]}
            />
            <FooterColumn
              title="Customer care"
              links={[
                { href: "/help", label: "Help center" },
                { href: "/help#shipping", label: "Shipping & delivery" },
                { href: "/help#returns", label: "Returns & refunds" },
                { href: "/help#payment", label: "Payment options" },
                { href: "/help#contact", label: "Contact us" },
              ]}
            />
            <FooterColumn
              title="Your account"
              links={[
                { href: "/account", label: "My account" },
                { href: "/account#orders", label: "Order history" },
                { href: "/wishlist", label: "Wishlist" },
                { href: "/cart", label: "Shopping cart" },
                { href: "/register", label: "Create account" },
              ]}
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 py-6 text-xs text-white/50 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} RAFIK STOORE. All rights reserved.</p>
          <ul className="flex flex-wrap items-center gap-2" aria-label="Accepted payment methods">
            {PAYMENT_BADGES.map((badge) => (
              <li key={badge} className="rounded-md border border-white/15 px-2.5 py-1 font-medium text-white/75">
                {badge}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
