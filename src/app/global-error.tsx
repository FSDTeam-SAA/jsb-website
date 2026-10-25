"use client";

import { useEffect } from "react";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("Global application error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#003be2] font-sans text-white">
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:60px_60px]"
          />
          <section className="relative z-10 w-full max-w-lg rounded-3xl border border-white/20 bg-white/10 p-7 text-center shadow-2xl backdrop-blur-md sm:p-10">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary text-2xl font-bold text-black">
              !
            </div>
            <h1 className="mt-5 text-2xl font-bold sm:text-3xl">
              Something went wrong
            </h1>
            <p className="mt-3 break-words text-sm leading-6 text-white/80">
              {error.message || "An unexpected application error occurred."}
            </p>
            {error.digest && (
              <p className="mt-4 text-xs text-white/70">
                Error reference: <code className="select-all">{error.digest}</code>
              </p>
            )}
            <button
              type="button"
              onClick={() => reset()}
              className="mt-7 inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-6 font-medium text-black transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#003be2]"
            >
              Try again
            </button>
          </section>
        </main>
      </body>
    </html>
  );
}
