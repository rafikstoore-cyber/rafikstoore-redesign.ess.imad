import type { ReactNode } from "react";
import { Heart, Package, Tag, Zap } from "lucide-react";
import { Stars } from "./ui";

const BENEFITS = [
  { icon: Package, title: "Track every order", text: "Clear updates from checkout to your door." },
  { icon: Heart, title: "Save your favorites", text: "Your wishlist, kept safe across devices." },
  { icon: Zap, title: "Faster checkout", text: "Your details ready whenever you are." },
  { icon: Tag, title: "Member-only offers", text: "Early access to deals and new arrivals." },
];

export function AuthShell({
  title,
  subtitle,
  footer,
  children,
}: {
  title: string;
  subtitle: string;
  footer: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="container-page py-10 lg:py-16">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-2xl border border-line bg-white lg:grid-cols-2">
        <div className="hidden flex-col justify-between bg-primary p-10 text-white lg:flex">
          <div>
            <p className="eyebrow text-white/60">Member benefits</p>
            <h2 className="mt-4 text-3xl font-bold leading-tight text-white">One account for everything you love.</h2>
            <ul className="mt-9 space-y-6">
              {BENEFITS.map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex gap-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white/10 text-accent">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-white">{title}</span>
                    <span className="block text-sm text-white/60">{text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <figure className="mt-12 rounded-xl border border-white/10 p-5">
            <Stars value={5} />
            <blockquote className="mt-3 text-sm leading-relaxed text-white/80">
              "Fast delivery, genuine products and support that actually helps. RAFIK STOORE is where I shop for
              everything now."
            </blockquote>
            <figcaption className="mt-3 text-xs text-white/50">Nadia K. · Verified buyer</figcaption>
          </figure>
        </div>

        <div className="p-6 sm:p-10 lg:p-12">
          <h1 className="text-2xl font-bold text-ink sm:text-3xl">{title}</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <p className="mt-8 border-t border-line pt-6 text-center text-sm text-muted">{footer}</p>
        </div>
      </div>
    </div>
  );
}
