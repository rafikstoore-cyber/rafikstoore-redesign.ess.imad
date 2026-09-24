import { createHash, randomBytes, randomUUID, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { cookies, headers } from "next/headers";
import { cache } from "react";
import { and, eq, gt, sql } from "drizzle-orm";
import { db } from "@/db";
import { cartItems, sessions, users, wishlistItems } from "@/db/schema";
import { ensureDb } from "./ensure-db";

const SESSION_COOKIE = "rs_session";
const GUEST_COOKIE = "rs_guest";
const SESSION_DAYS = 30;
const GUEST_DAYS = 60;

export type SessionUser = { id: number; name: string; email: string; createdAt: Date };

function scrypt(password: string, salt: Buffer, keyLength: number): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scryptCallback(password, salt, keyLength, (error, key) => (error ? reject(error) : resolve(key)));
  });
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const key = await scrypt(password, salt, 64);
  return `${salt.toString("hex")}:${key.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string) {
  const [saltHex, keyHex] = stored.split(":");
  if (!saltHex || !keyHex) return false;
  const expected = Buffer.from(keyHex, "hex");
  const actual = await scrypt(password, Buffer.from(saltHex, "hex"), expected.length);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

async function cookieOptions(maxAgeSeconds: number) {
  const forwardedProto = (await headers()).get("x-forwarded-proto") ?? "";
  const secure = forwardedProto.split(",")[0]?.trim() === "https";
  return { httpOnly: true, sameSite: "lax" as const, path: "/", maxAge: maxAgeSeconds, secure };
}

export async function createSession(userId: number) {
  await ensureDb();
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 86_400_000);
  await db.insert(sessions).values({ id: hashToken(token), userId, expiresAt });
  const store = await cookies();
  store.set(SESSION_COOKIE, token, await cookieOptions(SESSION_DAYS * 86_400));
}

export async function destroySession() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) {
    await ensureDb();
    await db.delete(sessions).where(eq(sessions.id, hashToken(token)));
  }
  store.delete(SESSION_COOKIE);
}

export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  await ensureDb();
  const [row] = await db
    .select({ id: users.id, name: users.name, email: users.email, createdAt: users.createdAt })
    .from(sessions)
    .innerJoin(users, eq(users.id, sessions.userId))
    .where(and(eq(sessions.id, hashToken(token)), gt(sessions.expiresAt, new Date())))
    .limit(1);
  return row ?? null;
});

/** Identifies whose cart/wishlist to use: the signed-in user or the guest browser. */
export async function getOwnerKey(): Promise<string | null> {
  const user = await getCurrentUser();
  if (user) return `user:${user.id}`;
  const guest = (await cookies()).get(GUEST_COOKIE)?.value;
  return guest ? `guest:${guest}` : null;
}

/** Same as getOwnerKey but creates a guest identity when needed (server actions only). */
export async function getOrCreateOwnerKey(): Promise<string> {
  const existing = await getOwnerKey();
  if (existing) return existing;
  const token = randomUUID();
  const store = await cookies();
  store.set(GUEST_COOKIE, token, await cookieOptions(GUEST_DAYS * 86_400));
  return `guest:${token}`;
}

/** Moves a guest's cart and wishlist into the signed-in account. */
export async function mergeGuestIntoUser(userId: number) {
  const store = await cookies();
  const guest = store.get(GUEST_COOKIE)?.value;
  if (!guest) return;
  const guestKey = `guest:${guest}`;
  const userKey = `user:${userId}`;

  await db.execute(sql`
    insert into cart_items (owner_key, product_id, quantity)
    select ${userKey}, product_id, quantity from cart_items where owner_key = ${guestKey}
    on conflict (owner_key, product_id)
    do update set quantity = least(cart_items.quantity + excluded.quantity, 99)
  `);
  await db.delete(cartItems).where(eq(cartItems.ownerKey, guestKey));

  await db.execute(sql`
    insert into wishlist_items (owner_key, product_id)
    select ${userKey}, product_id from wishlist_items where owner_key = ${guestKey}
    on conflict (owner_key, product_id) do nothing
  `);
  await db.delete(wishlistItems).where(eq(wishlistItems.ownerKey, guestKey));

  store.delete(GUEST_COOKIE);
}
