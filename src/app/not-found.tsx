import Link from "next/link";
import { ArrowRight, Building2, House, SearchX } from "lucide-react";

const NotFound = () => {
  return (
    <main className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_64%)] px-4 py-10 text-[#0f2c4f] sm:py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[55%] bg-[radial-gradient(circle_at_1px_1px,rgba(16,65,112,0.1)_1px,transparent_0)] [background-size:20px_20px]"
      />
      <div aria-hidden="true" className="pointer-events-none absolute -left-28 top-[12%] size-80 rounded-full bg-[#dcecf9]/80 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 bottom-[8%] size-72 rounded-full bg-[#d1e4f6]/70 blur-3xl" />

      <section className="relative z-10 w-full max-w-2xl rounded-3xl border border-[#dbe7f4] bg-white/95 p-6 text-center shadow-[0_22px_60px_rgba(16,65,112,0.12)] backdrop-blur sm:p-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#edf7ff] px-3 py-1.5 text-xs font-bold text-[#104170]">
          <Building2 size={15} aria-hidden="true" /> FORECLOSURE GOLD
        </div>

        <div className="relative mx-auto mt-6 grid size-24 place-items-center rounded-full bg-[#e8f3ff] text-[#087ce7] ring-8 ring-[#f5faff]">
          <SearchX size={43} strokeWidth={1.8} aria-hidden="true" />
        </div>
        <p className="mt-5 text-7xl font-extrabold leading-none tracking-[-0.07em] text-[#104170] sm:text-8xl">
          404
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-[#0f2c4f] sm:text-[42px]">
          The page you are looking for doesn&apos;t exist
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-[#4c6175] sm:text-base">
          Try to use a correct url or go back to homepage to start again
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-[9px] bg-[#104170] px-6 text-sm font-bold text-white transition hover:bg-[#0b3b65] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104170] focus-visible:ring-offset-2"
          >
            <House size={18} aria-hidden="true" /> Back to Home
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-[9px] border border-[#b9ccdd] bg-white px-6 text-sm font-bold text-[#104170] transition hover:bg-[#f4f8ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104170] focus-visible:ring-offset-2"
          >
            Go to Dashboard <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
};

export default NotFound;
