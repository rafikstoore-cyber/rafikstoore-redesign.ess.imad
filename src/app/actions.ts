"use server";

import { randomInt } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { and, eq, gte, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  cartItems,
  newsletterSubscribers,
  orderItems,
  orders,
  products,
  users,
  wishlistItems,
} from "@/db/schema";
import {
  createSession,
  destroySession,
  getCurrentUser,
  getOrCreateOwnerKey,
  getOwnerKey,
  hashPassword,
  mergeGuestIntoUser,
  verifyPassword,
} from "@/lib/auth";
import { ensureDb } from "@/lib/ensure-db";
import { getCartLines } from "@/lib/queries";
import {
  PAYMENT_OPTIONS,
  safeRedirectPath,
  shippingCostCents,
  type DeliveryMethod,
} from "@/lib/utils";

export type ActionResult = { ok: boolean; message: string };
export type WishlistResult = ActionResult & { active: boolean };
export type FormState = {
  error?: string;
  success?: string;
  fieldErrors?: Record<string, string>;
  values?: Record<string, string>;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function refreshStore() {
  revalidatePath("/", "layout");
}

function field(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

/* ------------------------------------------------------------------ */
/* Cart                                                                */
/* ------------------------------------------------------------------ */

export async function addToCartAction(productId: number, quantity = 1): Promise<ActionResult> {
  await ensureDb();
  const qty = Math.max(1, Math.min(99, Math.floor(Number(quantity) || 1)));
  const [product] = await db
    .select({ id: products.id, name: products.name, stock: products.stock })
    .from(products)
    .where(eq(products.id, productId))
    .limit(1);
  if (!product) return { ok: false, message: "This product is no longer available." };
  if (product.stock <= 0) return { ok: false, message: `${product.name} is currently out of stock.` };

  const ownerKey = await getOrCreateOwnerKey();
  await db
    .insert(cartItems)
    .values({ ownerKey, productId, quantity: Math.min(qty, product.stock) })
    .onConflictDoUpdate({
      target: [cartItems.ownerKey, cartItems.productId],
      set: { quantity: sql`least(${cartItems.quantity} + excluded.quantity, ${product.stock}::int, 99)` },
    });
  refreshStore();
  return { ok: true, message: `${product.name} was added to your cart.` };
}

export async function updateCartQuantityAction(productId: number, quantity: number): Promise<ActionResult> {
  await ensureDb();
  const ownerKey = await getOwnerKey();
  if (!ownerKey) return { ok: false, message: "Your cart is empty." };
  const where = and(eq(cartItems.ownerKey, ownerKey), eq(cartItems.productId, productId));
  const requested = Math.floor(Number(quantity));

  if (!Number.isFinite(requested) || requested <= 0) {
    await db.delete(cartItems).where(where);
    refreshStore();
    return { ok: true, message: "Item removed from your cart." };
  }

  const [product] = await db
    .select({ stock: products.stock })
    .from(products)
    .where(eq(products.id, productId))
    .limit(1);
  if (!product) return { ok: false, message: "This product is no longer available." };

  const allowed = Math.max(1, Math.min(requested, product.stock, 99));
  await db.update(cartItems).set({ quantity: allowed }).where(where);
  refreshStore();
  if (allowed < requested) return { ok: false, message: `Only ${product.stock} available right now.` };
  return { ok: true, message: "Cart updated." };
}

export async function removeFromCartAction(productId: number): Promise<ActionResult> {
  return updateCartQuantityAction(productId, 0);
}

/* ------------------------------------------------------------------ */
/* Wishlist                                                            */
/* ------------------------------------------------------------------ */

export async function toggleWishlistAction(productId: number): Promise<WishlistResult> {
  await ensureDb();
  const ownerKey = await getOrCreateOwnerKey();
  const removed = await db
    .delete(wishlistItems)
    .where(and(eq(wishlistItems.ownerKey, ownerKey), eq(wishlistItems.productId, productId)))
    .returning({ id: wishlistItems.id });
  if (removed.length) {
    refreshStore();
    return { ok: true, active: false, message: "Removed from your wishlist." };
  }

  const [product] = await db
    .select({ name: products.name })
    .from(products)
    .where(eq(products.id, productId))
    .limit(1);
  if (!product) return { ok: false, active: false, message: "This product is no longer available." };

  await db.insert(wishlistItems).values({ ownerKey, productId }).onConflictDoNothing();
  refreshStore();
  return { ok: true, active: true, message: `${product.name} was saved to your wishlist.` };
}

export async function moveToCartAction(productId: number): Promise<ActionResult> {
  const result = await addToCartAction(productId, 1);
  if (!result.ok) return result;
  const ownerKey = await getOwnerKey();
  if (ownerKey) {
    await db
      .delete(wishlistItems)
      .where(and(eq(wishlistItems.ownerKey, ownerKey), eq(wishlistItems.productId, productId)));
  }
  refreshStore();
  return { ok: true, message: "Moved to your cart." };
}

/* ------------------------------------------------------------------ */
/* Authentication                                                      */
/* ------------------------------------------------------------------ */

export async function loginAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = field(formData, "email").toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = safeRedirectPath(formData.get("next"));
  const values = { email };

  const fieldErrors: Record<string, string> = {};
  if (!EMAIL_RE.test(email)) fieldErrors.email = "Enter a valid email address.";
  if (!password) fieldErrors.password = "Enter your password.";
  if (Object.keys(fieldErrors).length) return { fieldErrors, values };

  await ensureDb();
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return { error: "The email or password you entered is incorrect.", values };
  }

  await createSession(user.id);
  await mergeGuestIntoUser(user.id);
  refreshStore();
  redirect(next);
}

export async function registerAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const name = field(formData, "name");
  const email = field(formData, "email").toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = safeRedirectPath(formData.get("next"));
  const values = { name, email };

  const fieldErrors: Record<string, string> = {};
  if (name.length < 2) fieldErrors.name = "Enter your full name.";
  if (!EMAIL_RE.test(email)) fieldErrors.email = "Enter a valid email address.";
  if (password.length < 8) fieldErrors.password = "Use at least 8 characters.";
  if (Object.keys(fieldErrors).length) return { fieldErrors, values };

  await ensureDb();
  const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
  if (existing) {
    return { fieldErrors: { email: "An account with this email already exists." }, values };
  }

  let userId: number;
  try {
    const [created] = await db
      .insert(users)
      .values({ name, email, passwordHash: await hashPassword(password) })
      .returning({ id: users.id });
    userId = created.id;
  } catch (error) {
    if ((error as { code?: string }).code === "23505") {
      return { fieldErrors: { email: "An account with this email already exists." }, values };
    }
    throw error;
  }

  await createSession(userId);
  await mergeGuestIntoUser(userId);
  refreshStore();
  redirect(next);
}

export async function logoutAction() {
  await destroySession();
  refreshStore();
  redirect("/");
}

/* ------------------------------------------------------------------ */
/* Checkout                                                            */
/* ------------------------------------------------------------------ */

class StockError extends Error {
  constructor(public productName: string) {
    super(`Insufficient stock for ${productName}`);
  }
}

export async function placeOrderAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/checkout");

  const values = {
    fullName: field(formData, "fullName"),
    email: field(formData, "email").toLowerCase(),
    phone: field(formData, "phone"),
    address: field(formData, "address"),
    city: field(formData, "city"),
    postalCode: field(formData, "postalCode"),
    country: field(formData, "country"),
    delivery: field(formData, "delivery"),
    payment: field(formData, "payment"),
    notes: field(formData, "notes").slice(0, 500),
  };

  const fieldErrors: Record<string, string> = {};
  if (values.fullName.length < 2) fieldErrors.fullName = "Enter the recipient's full name.";
  if (!EMAIL_RE.test(values.email)) fieldErrors.email = "Enter a valid email address.";
  if (values.phone.replace(/\D/g, "").length < 7) fieldErrors.phone = "Enter a valid phone number.";
  if (values.address.length < 5) fieldErrors.address = "Enter your street address.";
  if (values.city.length < 2) fieldErrors.city = "Enter your city.";
  if (values.postalCode.length < 3) fieldErrors.postalCode = "Enter your postal code.";
  if (!values.country) fieldErrors.country = "Select your country.";
  const payment = PAYMENT_OPTIONS.find((o) => o.id === values.payment)?.id;
  if (!payment) fieldErrors.payment = "Choose a payment method.";
  if (Object.keys(fieldErrors).length) {
    return { error: "Please review the highlighted fields.", fieldErrors, values };
  }

  const delivery: DeliveryMethod = values.delivery === "express" ? "express" : "standard";
  const ownerKey = `user:${user.id}`;
  const lines = await getCartLines(ownerKey);
  if (!lines.length) return { error: "Your cart is empty.", values };

  const shortages = lines.filter((line) => line.stock < line.quantity);
  if (shortages.length) {
    return {
      error: `Not enough stock for: ${shortages.map((l) => l.name).join(", ")}. Please update your cart.`,
      values,
    };
  }

  const subtotalCents = lines.reduce((sum, l) => sum + l.priceCents * l.quantity, 0);
  const shipping = shippingCostCents(subtotalCents, delivery);
  const orderNumber = `RS-${Date.now().toString(36).toUpperCase()}${randomInt(10, 99)}`;

  let orderId: number;
  try {
    orderId = await db.transaction(async (tx) => {
      for (const line of lines) {
        const updated = await tx
          .update(products)
          .set({ stock: sql`${products.stock} - ${line.quantity}::int` })
          .where(and(eq(products.id, line.productId), gte(products.stock, line.quantity)))
          .returning({ id: products.id });
        if (!updated.length) throw new StockError(line.name);
      }

      const [order] = await tx
        .insert(orders)
        .values({
          orderNumber,
          userId: user.id,
          status: "processing",
          subtotalCents,
          shippingCents: shipping,
          totalCents: subtotalCents + shipping,
          deliveryMethod: delivery,
          paymentMethod: payment!,
          fullName: values.fullName,
          email: values.email,
          phone: values.phone,
          address: values.address,
          city: values.city,
          postalCode: values.postalCode,
          country: values.country,
          notes: values.notes,
        })
        .returning({ id: orders.id });

      await tx.insert(orderItems).values(
        lines.map((line) => ({
          orderId: order.id,
          productId: line.productId,
          productName: line.name,
          productSlug: line.slug,
          image: line.image ?? "",
          unitPriceCents: line.priceCents,
          quantity: line.quantity,
        })),
      );

      await tx.delete(cartItems).where(eq(cartItems.ownerKey, ownerKey));
      return order.id;
    });
  } catch (error) {
    if (error instanceof StockError) {
      return { error: `${error.productName} just sold out. Please update your cart and try again.`, values };
    }
    console.error("placeOrderAction failed", error);
    return { error: "We couldn't place your order. Please try again in a moment.", values };
  }

  refreshStore();
  redirect(`/account/orders/${orderId}?placed=1`);
}

/* ------------------------------------------------------------------ */
/* Newsletter                                                          */
/* ------------------------------------------------------------------ */

export async function subscribeNewsletterAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = field(formData, "email").toLowerCase();
  if (!EMAIL_RE.test(email)) return { error: "Please enter a valid email address.", values: { email } };
  await ensureDb();
  await db.insert(newsletterSubscribers).values({ email }).onConflictDoNothing();
  return { success: "You're on the list. Look out for new arrivals and member-only offers." };
}ش
