import { cache } from "react";
import { and, asc, desc, eq, gt, gte, ilike, inArray, lte, ne, or, sql, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { cartItems, categories, orderItems, orders, products, wishlistItems } from "@/db/schema";
import { ensureDb } from "./ensure-db";
import type { SortKey } from "./utils";

export type ProductCardData = {
  id: number;
  slug: string;
  name: string;
  brand: string;
  image: string | null;
  priceCents: number;
  compareAtCents: number | null;
  rating: number;
  reviewCount: number;
  stock: number;
  isNew: boolean;
  categoryName: string;
  categorySlug: string;
};

export type CategoryWithCount = {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  productCount: number;
};

export type CartLine = {
  productId: number;
  slug: string;
  name: string;
  brand: string;
  image: string | null;
  priceCents: number;
  compareAtCents: number | null;
  stock: number;
  quantity: number;
  categoryName: string;
};

const cardColumns = {
  id: products.id,
  slug: products.slug,
  name: products.name,
  brand: products.brand,
  images: products.images,
  priceCents: products.priceCents,
  compareAtCents: products.compareAtCents,
  rating: products.rating,
  reviewCount: products.reviewCount,
  stock: products.stock,
  isNew: products.isNew,
  categoryName: categories.name,
  categorySlug: categories.slug,
};

type CardRow = Omit<ProductCardData, "image"> & { images: string[] };

function toCard({ images, ...row }: CardRow): ProductCardData {
  return { ...row, image: images[0] ?? null };
}

function cardQuery() {
  return db
    .select(cardColumns)
    .from(products)
    .innerJoin(categories, eq(categories.id, products.categoryId));
}

export const getCategoriesWithCounts = cache(async (): Promise<CategoryWithCount[]> => {
  await ensureDb();
  return db
    .select({
      id: categories.id,
      slug: categories.slug,
      name: categories.name,
      tagline: categories.tagline,
      description: categories.description,
      image: categories.image,
      productCount: sql<number>`cast(count(${products.id}) as int)`,
    })
    .from(categories)
    .leftJoin(products, eq(products.categoryId, categories.id))
    .groupBy(categories.id)
    .orderBy(asc(categories.sortOrder), asc(categories.name));
});

export type ProductFilters = {
  category?: string;
  q?: string;
  min?: number;
  max?: number;
  inStock?: boolean;
  sale?: boolean;
  sort?: SortKey;
  page?: number;
  pageSize?: number;
};

export async function getProducts(filters: ProductFilters) {
  await ensureDb();
  const conditions: SQL[] = [];
  if (filters.category) conditions.push(eq(categories.slug, filters.category));
  if (filters.q) {
    const term = `%${filters.q.replace(/[\\%_]/g, (m) => `\\${m}`)}%`;
    const match = or(
      ilike(products.name, term),
      ilike(products.brand, term),
      ilike(products.shortDescription, term),
      ilike(categories.name, term),
    );
    if (match) conditions.push(match);
  }
  if (filters.min !== undefined) conditions.push(gte(products.priceCents, Math.round(filters.min * 100)));
  if (filters.max !== undefined) conditions.push(lte(products.priceCents, Math.round(filters.max * 100)));
  if (filters.inStock) conditions.push(gt(products.stock, 0));
  if (filters.sale) conditions.push(sql`${products.compareAtCents} > ${products.priceCents}`);
  const where = conditions.length ? and(...conditions) : undefined;

  const sort = filters.sort ?? "featured";
  const orderBy: SQL[] = {
    featured: [desc(products.isFeatured), desc(products.rating), asc(products.id)],
    newest: [desc(products.createdAt), asc(products.id)],
    "price-asc": [asc(products.priceCents), asc(products.id)],
    "price-desc": [desc(products.priceCents), asc(products.id)],
    rating: [desc(products.rating), desc(products.reviewCount), asc(products.id)],
  }[sort];

  const pageSize = filters.pageSize ?? 12;
  const page = Math.max(1, filters.page ?? 1);

  const [rows, totals] = await Promise.all([
    cardQuery()
      .where(where)
      .orderBy(...orderBy)
      .limit(pageSize)
      .offset((page - 1) * pageSize),
    db
      .select({ total: sql<number>`cast(count(*) as int)` })
      .from(products)
      .innerJoin(categories, eq(categories.id, products.categoryId))
      .where(where),
  ]);

  const total = totals[0]?.total ?? 0;
  return {
    items: rows.map(toCard),
    total,
    page,
    pageSize,
    pageCount: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export async function getFeaturedProducts(limit = 8) {
  await ensureDb();
  const rows = await cardQuery()
    .where(eq(products.isFeatured, true))
    .orderBy(desc(products.rating), desc(products.reviewCount))
    .limit(limit);
  return rows.map(toCard);
}

export async function getNewArrivals(limit = 8) {
  await ensureDb();
  const rows = await cardQuery().orderBy(desc(products.createdAt), asc(products.id)).limit(limit);
  return rows.map(toCard);
}

export async function getStoreStats() {
  await ensureDb();
  const [row] = await db
    .select({
      productCount: sql<number>`cast(count(*) as int)`,
      avgRating: sql<number>`coalesce(round(avg(${products.rating})::numeric, 1), 0)::float`,
    })
    .from(products);
  return row ?? { productCount: 0, avgRating: 0 };
}

export const getProductBySlug = cache(async (slug: string) => {
  await ensureDb();
  const [row] = await db
    .select({
      product: products,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(products)
    .innerJoin(categories, eq(categories.id, products.categoryId))
    .where(eq(products.slug, slug))
    .limit(1);
  return row ?? null;
});

export async function getRelatedProducts(categoryId: number, excludeId: number, limit = 4) {
  await ensureDb();
  const rows = await cardQuery()
    .where(and(eq(products.categoryId, categoryId), ne(products.id, excludeId)))
    .orderBy(desc(products.rating))
    .limit(limit);
  return rows.map(toCard);
}

export async function getCartLines(ownerKey: string): Promise<CartLine[]> {
  await ensureDb();
  const rows = await db
    .select({
      productId: products.id,
      slug: products.slug,
      name: products.name,
      brand: products.brand,
      images: products.images,
      priceCents: products.priceCents,
      compareAtCents: products.compareAtCents,
      stock: products.stock,
      quantity: cartItems.quantity,
      categoryName: categories.name,
    })
    .from(cartItems)
    .innerJoin(products, eq(products.id, cartItems.productId))
    .innerJoin(categories, eq(categories.id, products.categoryId))
    .where(eq(cartItems.ownerKey, ownerKey))
    .orderBy(asc(cartItems.createdAt), asc(cartItems.id));
  return rows.map(({ images, ...row }) => ({ ...row, image: images[0] ?? null }));
}

export async function getCartCount(ownerKey: string) {
  await ensureDb();
  const [row] = await db
    .select({ count: sql<number>`cast(coalesce(sum(${cartItems.quantity}), 0) as int)` })
    .from(cartItems)
    .where(eq(cartItems.ownerKey, ownerKey));
  return row?.count ?? 0;
}

export async function getWishlistIds(ownerKey: string | null): Promise<number[]> {
  if (!ownerKey) return [];
  await ensureDb();
  const rows = await db
    .select({ productId: wishlistItems.productId })
    .from(wishlistItems)
    .where(eq(wishlistItems.ownerKey, ownerKey));
  return rows.map((r) => r.productId);
}

export async function getWishlistProducts(ownerKey: string) {
  await ensureDb();
  const rows = await db
    .select(cardColumns)
    .from(wishlistItems)
    .innerJoin(products, eq(products.id, wishlistItems.productId))
    .innerJoin(categories, eq(categories.id, products.categoryId))
    .where(eq(wishlistItems.ownerKey, ownerKey))
    .orderBy(desc(wishlistItems.createdAt));
  return rows.map(toCard);
}

export async function getUserOrders(userId: number) {
  await ensureDb();
  const list = await db
    .select()
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt));
  if (!list.length) return [];
  const items = await db
    .select({
      orderId: orderItems.orderId,
      image: orderItems.image,
      productName: orderItems.productName,
      quantity: orderItems.quantity,
    })
    .from(orderItems)
    .where(inArray(orderItems.orderId, list.map((o) => o.id)));
  return list.map((order) => {
    const own = items.filter((i) => i.orderId === order.id);
    return {
      ...order,
      itemCount: own.reduce((sum, i) => sum + i.quantity, 0),
      previews: own.slice(0, 4).map((i) => ({ image: i.image, name: i.productName })),
    };
  });
}

export async function getUserOrder(userId: number, orderId: number) {
  await ensureDb();
  const [order] = await db
    .select()
    .from(orders)
    .where(and(eq(orders.id, orderId), eq(orders.userId, userId)))
    .limit(1);
  if (!order) return null;
  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, order.id))
    .orderBy(asc(orderItems.id));
  return { order, items };
}
