import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight, Star } from "lucide-react";
import { cn, formatPrice, type StatusTone } from "@/lib/utils";

export function Logo({ variant = "dark", className }: { variant?: "dark" | "light"; className?: string }) {
  const light = variant === "light";
  return (
    <Link href="/" aria-label="RAFIK STOORE — home" className={cn("group flex shrink-0 items-center gap-2.5", className)}>
      <span
        className={cn(
          "relative grid h-9 w-9 place-items-center rounded-lg font-display text-[17px] font-extrabold",
          light ? "bg-white text-primary" : "bg-primary text-white",
        )}
      >
        R
        <span
          className={cn(
            "absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 bg-accent",
            light ? "border-primary" : "border-white",
          )}
        />
      </span>
      <span className="flex flex-col leading-none">
        <span className={cn("font-display text-[17px] font-extrabold tracking-[0.14em]", light ? "text-white" : "text-primary")}>
          RAFIK
        </span>
        <span className={cn("mt-1 text-[9.5px] font-semibold tracking-[0.5em]", light ? "text-accent" : "text-accent-ink")}>
          STOORE
        </span>
      </span>
    </Link>
  );
}

export function Stars({ value, size = "sm" }: { value: number; size?: "sm" | "md" }) {
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));
  const iconClass = cn("shrink-0 fill-current", size === "sm" ? "h-3.5 w-3.5" : "h-[18px] w-[18px]");
  const row = [0, 1, 2, 3, 4].map((i) => <Star key={i} className={iconClass} strokeWidth={0} aria-hidden />);
  return (
    <span className="relative inline-flex" role="img" aria-label={`Rated ${value.toFixed(1)} out of 5`}>
      <span className="flex gap-0.5 text-slate-200">{row}</span>
      <span className="absolute inset-y-0 left-0 flex gap-0.5 overflow-hidden text-accent" style={{ width: `${pct}%` }}>
        {row}
      </span>
    </span>
  );
}

export function Rating({ value, count, size = "sm" }: { value: number; count?: number; size?: "sm" | "md" }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <Stars value={value} size={size} />
      <span className={cn("text-muted", size === "sm" ? "text-xs" : "text-sm")}>
        <span className="font-semibold text-ink">{value.toFixed(1)}</span>
        {count !== undefined && <> ({count.toLocaleString("en-US")})</>}
      </span>
    </span>
  );
}

export function Price({
  cents,
  compareAt,
  size = "md",
}: {
  cents: number;
  compareAt?: number | null;
  size?: "sm" | "md" | "lg";
}) {
  const onSale = Boolean(compareAt && compareAt > cents);
  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
      <span
        className={cn(
          "font-semibold tracking-tight text-ink",
          size === "sm" && "text-sm",
          size === "md" && "text-base",
          size === "lg" && "font-display text-3xl font-bold",
        )}
      >
        {formatPrice(cents)}
      </span>
      {onSale && compareAt && (
        <span className={cn("text-muted line-through", size === "lg" ? "text-lg" : "text-xs")}>
          {formatPrice(compareAt)}
        </span>
      )}
    </span>
  );
}

const badgeTones = {
  primary: "bg-primary text-white",
  sale: "bg-white text-error ring-1 ring-error/15",
  neutral: "bg-white text-ink ring-1 ring-line",
  gold: "bg-accent-soft text-accent-ink",
} as const;

export function Badge({ tone = "neutral", children }: { tone?: keyof typeof badgeTones; children: ReactNode }) {
  return (
    <span className={cn("inline-flex items-center rounded-md px-2 py-1 text-[11px] font-semibold leading-none", badgeTones[tone])}>
      {children}
    </span>
  );
}

const statusTones: Record<StatusTone, string> = {
  warning: "bg-warning-soft text-warning ring-warning/20",
  info: "bg-primary-soft text-primary ring-primary/15",
  success: "bg-success-soft text-success ring-success/20",
  error: "bg-error-soft text-error ring-error/20",
  neutral: "bg-slate-100 text-muted ring-line",
};

export function StatusBadge({ tone, children }: { tone: StatusTone; children: ReactNode }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset", statusTones[tone])}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 className="mt-3 text-2xl font-bold text-ink sm:text-[28px] sm:leading-tight">{title}</h2>
        {description && <p className="mt-2 text-[15px] leading-relaxed text-muted">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function ViewAllLink({ href, children = "View all" }: { href: string; children?: ReactNode }) {
  return (
    <Link href={href} className="group inline-flex items-center gap-1 text-sm font-semibold text-primary">
      {children}
      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-muted">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
            {index > 0 && <ChevronRight className="h-3.5 w-3.5 text-slate-400" aria-hidden />}
            {item.href ? (
              <Link href={item.href} className="transition-colors hover:text-primary">
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-ink" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="card flex flex-col items-center px-6 py-16 text-center">
      <span className="grid h-16 w-16 place-items-center rounded-full bg-primary-soft text-primary">{icon}</span>
      <h2 className="mt-5 text-xl font-bold text-ink">{title}</h2>
      <p className="mt-2 max-w-md text-[15px] leading-relaxed text-muted">{description}</p>
      {action && <div className="mt-7 flex flex-wrap justify-center gap-3">{action}</div>}
    </div>
  );
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  children,
}: {
  title: string;
  description?: string;
  breadcrumbs?: { label: string; href?: string }[];
  children?: ReactNode;
}) {
  return (
    <div className="border-b border-line bg-white">
      <div className="container-page py-8 sm:py-10">
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-ink sm:text-[34px] sm:leading-tight">{title}</h1>
            {description && <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted">{description}</p>}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
