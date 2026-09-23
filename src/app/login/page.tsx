import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth-shell";
import { LoginForm } from "@/components/client/forms";
import { getCurrentUser } from "@/lib/auth";
import { safeRedirectPath } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Sign in" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function LoginPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const rawNext = Array.isArray(sp.next) ? sp.next[0] : sp.next;
  const next = safeRedirectPath(rawNext, "/account");

  if (await getCurrentUser()) redirect(next);

  return (
    <AuthShell
      title="Welcome back"
      subtitle={
        next === "/checkout"
          ? "Sign in to complete your order. Your cart is saved."
          : "Sign in to your RAFIK STOORE account to manage orders and your wishlist."
      }
      footer={
        <>
          New to RAFIK STOORE?{" "}
          <Link href={`/register?next=${encodeURIComponent(next)}`} className="link">
            Create an account
          </Link>
        </>
      }
    >
      <LoginForm next={next} />
    </AuthShell>
  );
}
