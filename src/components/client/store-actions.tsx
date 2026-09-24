"use client";

import { useOptimistic, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Heart, Loader2, Minus, Plus, ShoppingBag, Trash2, Zap } from "lucide-react";
import {
  addToCartAction,
  moveToCartAction,
  toggleWishlistAction,
  updateCartQuantityAction,
} from "@/app/actions";
import { cn } from "@/lib/utils";
import { useToast } from "./toast";

/* Compact icon button used on product cards. */
export function AddToCartButton({
  productId,
  productName,
  disabled = false,
}: {
  productId: number;
  productName: string;
  disabled?: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [added, setAdded] = useState(false);
  const toast = useToast();

  function handleClick() {
    startTransition(async () => {
      const result = await addToCartAction(productId, 1);
      if (result.ok) {
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1600);
        toast.show({ title: "Added to cart", description: productName, action: { href: "/cart", label: "View cart" } });
      } else {
        toast.show({ tone: "error", title: "Couldn't add to cart", description: result.message });
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || pending}
      aria-label={disabled ? `${productName} is sold out` : `Add ${productName} to cart`}
      title={disabled ? "Sold out" : "Add to cart"}
      className={cn(
        "grid h-10 w-10 shrink-0 place-items-center rounded-lg border transition-colors disabled:cursor-not-allowed",
        disabled
          ? "border-line bg-canvas text-slate-300"
          : "border-primary/10 bg-primary-soft text-primary hover:border-primary hover:bg-primary hover:text-white",
      )}
    >
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : added ? (
        <Check className="h-4 w-4" />
      ) : (
        <ShoppingBag className="h-[18px] w-[18px]" />
      )}
    </button>
  );
}

export function WishlistButton({
  productId,
  productName,
  active,
  variant = "floating",
}: {
  productId: number;
  productName: string;
  active: boolean;
  variant?: "floating" | "outline";
}) {
  const [optimisticActive, setOptimisticActive] = useOptimistic(active);
  const [pending, startTransition] = useTransition();
  const toast = useToast();

  function toggle() {
    startTransition(async () => {
      setOptimisticActive(!optimisticActive);
      const result = await toggleWishlistAction(productId);
      if (!result.ok) {
        toast.show({ tone: "error", title: "Something went wrong", description: result.message });
      } else if (result.active) {
        toast.show({ title: "Saved to wishlist", description: productName, action: { href: "/wishlist", label: "View wishlist" } });
      }
    });
  }

  const label = optimisticActive ? `Remove ${productName} from wishlist` : `Save ${productName} to wishlist`;

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      aria-pressed={optimisticActive}
      aria-label={label}
      title={optimisticActive ? "Saved" : "Save to wishlist"}
      className={cn(
        "grid place-items-center transition-colors",
        variant === "floating" &&
          "h-9 w-9 rounded-full bg-white text-ink shadow-soft ring-1 ring-line hover:text-primary hover:ring-primary/30",
        variant === "outline" &&
          "h-12 w-12 shrink-0 rounded-lg border border-line bg-white text-ink hover:border-primary/30 hover:bg-primary-soft",
      )}
    >
      <Heart
        className={cn(
          variant === "floating" ? "h-4 w-4" : "h-5 w-5",
          optimisticActive && "fill-primary text-primary",
        )}
      />
    </button>
  );
}

function Stepper({
  value,
  onChange,
  min = 1,
  max,
  disabled,
  size = "md",
}: {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max: number;
  disabled?: boolean;
  size?: "sm" | "md";
}) {
  const buttonClass = cn(
    "grid place-items-center text-ink transition-colors hover:bg-primary-soft disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent",
    size === "sm" ? "h-9 w-9" : "h-12 w-11",
  );
  return (
    <div className={cn("inline-flex shrink-0 items-center overflow-hidden rounded-lg border border-line bg-white", disabled && "opacity-60")}>
      <button
        type="button"
        className={buttonClass}
        onClick={() => onChange(value - 1)}
        disabled={disabled || value <= min}
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span
        className={cn("text-center font-semibold tabular-nums text-ink", size === "sm" ? "w-8 text-sm" : "w-10")}
        aria-live="polite"
      >
        {value}
      </span>
      <button
        type="button"
        className={buttonClass}
        onClick={() => onChange(value + 1)}
        disabled={disabled || value >= max}
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

/* Product detail page: quantity, add to cart, buy now, wishlist. */
export function PurchasePanel({
  productId,
  productName,
  stock,
  wishlisted,
}: {
  productId: number;
  productName: string;
  stock: number;
  wishlisted: boolean;
}) {
  const [quantity, setQuantity] = useState(1);
  const [adding, startAdding] = useTransition();
  const [buying, startBuying] = useTransition();
  const router = useRouter();
  const toast = useToast();
  const soldOut = stock <= 0;
  const max = Math.max(1, Math.min(stock, 10));

  function addToCart() {
    startAdding(async () => {
      const result = await addToCartAction(productId, quantity);
      if (result.ok) {
        toast.show({
          title: "Added to cart",
          description: `${quantity} × ${productName}`,
          action: { href: "/cart", label: "View cart" },
        });
      } else {
        toast.show({ tone: "error", title: "Couldn't add to cart", description: result.message });
      }
    });
  }

  function buyNow() {
    startBuying(async () => {
      const result = await addToCartAction(productId, quantity);
      if (result.ok) router.push("/checkout");
      else toast.show({ tone: "error", title: "Couldn't start checkout", description: result.message });
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <Stepper value={quantity} onChange={setQuantity} max={max} disabled={soldOut} />
        <button
          type="button"
          onClick={addToCart}
          disabled={soldOut || adding || buying}
          className="btn btn-primary btn-lg min-w-0 flex-1"
        >
          {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShoppingBag className="h-[18px] w-[18px]" />}
          {soldOut ? "Sold out" : "Add to cart"}
        </button>
        <WishlistButton productId={productId} productName={productName} active={wishlisted} variant="outline" />
      </div>
      {!soldOut && (
        <button
          type="button"
          onClick={buyNow}
          disabled={adding || buying}
          className="btn btn-secondary btn-lg w-full"
        >
          {buying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4 text-accent" />}
          Buy it now
        </button>
      )}
    </div>
  );
}

/* Cart page: quantity stepper and remove. */
export function CartLineControls({
  productId,
  productName,
  quantity,
  stock,
}: {
  productId: number;
  productName: string;
  quantity: number;
  stock: number;
}) {
  const [optimisticQuantity, setOptimisticQuantity] = useOptimistic(quantity);
  const [pending, startTransition] = useTransition();
  const toast = useToast();

  function update(next: number) {
    startTransition(async () => {
      setOptimisticQuantity(next);
      const result = await updateCartQuantityAction(productId, next);
      if (!result.ok) toast.show({ tone: "error", title: "Quantity adjusted", description: result.message });
    });
  }

  function remove() {
    startTransition(async () => {
      const result = await updateCartQuantityAction(productId, 0);
      if (result.ok) toast.show({ title: "Removed from cart", description: productName });
    });
  }

  return (
    <div className={cn("flex items-center gap-2 transition-opacity", pending && "opacity-70")}>
      <Stepper
        value={optimisticQuantity}
        onChange={update}
        max={Math.max(1, Math.min(stock, 99))}
        disabled={pending}
        size="sm"
      />
      <button
        type="button"
        onClick={remove}
        disabled={pending}
        className="btn btn-sm btn-danger-ghost px-2.5"
        aria-label={`Remove ${productName} from cart`}
      >
        <Trash2 className="h-4 w-4" />
        <span className="hidden sm:inline">Remove</span>
      </button>
    </div>
  );
}

export function MoveToCartButton({
  productId,
  productName,
  disabled,
}: {
  productId: number;
  productName: string;
  disabled?: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const toast = useToast();

  function handleClick() {
    startTransition(async () => {
      const result = await moveToCartAction(productId);
      if (result.ok) {
        toast.show({ title: "Moved to cart", description: productName, action: { href: "/cart", label: "View cart" } });
      } else {
        toast.show({ tone: "error", title: "Couldn't move item", description: result.message });
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || pending}
      className="btn btn-sm btn-secondary w-full"
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShoppingBag className="h-4 w-4" />}
      {disabled ? "Sold out" : "Move to cart"}
    </button>
  );
}
