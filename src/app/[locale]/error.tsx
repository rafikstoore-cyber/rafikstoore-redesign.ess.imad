"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AlertTriangle, RotateCw } from "lucide-react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-page py-20">
      <div className="mx-auto flex max-w-lg flex-col items-center text-center">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-error-soft text-error">
          <AlertTriangle className="h-7 w-7" />
        </span>
        <h1 className="mt-6 text-3xl font-bold text-ink">Something went wrong</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-muted">
          We hit an unexpected problem loading this page. Please try again — if it keeps happening, our support team is
          happy to help.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={reset} className="btn btn-primary">
            <RotateCw className="h-4 w-4" />
            Try again
          </button>
          <Link href="/" className="btn btn-secondary">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
