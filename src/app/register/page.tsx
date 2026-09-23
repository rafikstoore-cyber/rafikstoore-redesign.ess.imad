import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth-shell";
import { RegisterForm } from "@/components/client/forms";
import { getCurrentUser } from "@/lib/auth";
import { safeRedirectPath } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Create account" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function RegisterPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const rawNext = Array.isArray(sp.next) ? sp.next[0] : sp.next;
  const next = safeRedirectPath(rawNext, "/account");

  if (await getCurrentUser()) redirect(next);

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join RAFIK STOORE for faster checkout, order tracking and member-only offers."
      footer={
        <>
          Already have an account?{" "}
          <Link href={`/login?next=${encodeURIComponent(next)}`} className="link">
            Sign in
          </Link>
        </>
      }
    >
      <RegisterForm next={next} />
      <p className="mt-5 text-center text-xs leading-relaxed text-muted">
        By creating an account you agree to our{" "}
        <Link href="/help#terms" className="underline underline-offset-2 hover:text-primary">
          terms of service
        </Link>{" "}
        and{" "}
        <Link href="/help#privacy" className="underline underline-offset-2 hover:text-primary">
          privacy policy
        </Link>
        .
      </p>
    </AuthShell>
  );
}
