import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Check } from "lucide-react";
import { CheckoutForm } from "@/components/client/forms";
import { Breadcrumbs } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth";
import { getCartLines } from "@/lib/queries";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Checkout" };

const STEPS = ["Cart", "Details", "Confirmation"];

export default async function CheckoutPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/checkout");

  const lines = await getCartLines(`user:${user.id}`);
  if (!lines.length) redirect("/cart");

  return (
    <>
      <div className="border-b border-line bg-white">
        <div className="container-page flex flex-col gap-6 py-8 md:flex-row md:items-end md:justify-between">
          <div>
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Cart", href: "/cart" },
                { label: "Checkout" },
              ]}
            />
            <h1 className="mt-4 text-3xl font-bold text-ink sm:text-[34px]">Checkout</h1>
          </div>
          <ol className="flex items-center gap-2 text-sm" aria-label="Checkout progress">
            {STEPS.map((step, index) => {
              const done = index === 0;
              const current = index === 1;
              return (
                <li key={step} className="flex items-center gap-2">
                  {index > 0 && <span className={cn("h-px w-6 sm:w-10", done || current ? "bg-primary" : "bg-line")} />}
                  <span
                    className={cn(
                      "grid h-7 w-7 place-items-center rounded-full text-xs font-bold",
                      done && "bg-primary text-white",
                      current && "bg-primary text-white ring-4 ring-primary-soft",
                      !done && !current && "bg-white text-muted ring-1 ring-line",
                    )}
                  >
                    {done ? <Check className="h-3.5 w-3.5" /> : index + 1}
                  </span>
                  <span className={cn("font-medium", current ? "text-ink" : "text-muted")} aria-current={current ? "step" : undefined}>
                    {step}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      <div className="container-page py-8 lg:py-10">
        <CheckoutForm
          lines={lines.map((line) => ({
            productId: line.productId,
            name: line.name,
            image: line.image,
            priceCents: line.priceCents,
            quantity: line.quantity,
          }))}
          defaults={{ fullName: user.name, email: user.email }}
        />
      </div>
    </>
  );
}
