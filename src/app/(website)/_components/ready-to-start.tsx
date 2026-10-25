import Image from "next/image";
import Link from "next/link";

const ReadyToStart = () => {
  return (
    <section aria-labelledby="ready-to-start-heading" className="py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-5 sm:px-8 lg:px-0">
        <div className="relative isolate flex min-h-[300px] items-center justify-center overflow-hidden rounded-2xl px-5 py-10 text-center sm:min-h-[309px] sm:px-8">
          <Image
            src="/images/ready_to_start.png"
            alt="Aerial view of a neighbourhood"
            fill
            sizes="(max-width: 1279px) calc(100vw - 40px), 1280px"
            className="-z-20 object-cover"
          />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[#073d6e]/80" />

          <div className="flex max-w-2xl flex-col items-center">
            <h2
              id="ready-to-start-heading"
              className="text-balance text-[clamp(2rem,3vw,2.25rem)] font-bold leading-[1.18] tracking-[-0.03em] text-white"
            >
              <span className="block">Ready To Start</span>
              <span className="block">Finding Quality Leads?</span>
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-white sm:text-base">
              Create your free account and explore available lead opportunities.
            </p>
            <Link
              href="#create-your-book"
              className="mt-4 inline-flex min-h-9 items-center justify-center rounded-md bg-[#06bd8c] px-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#05aa7e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a477b]"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReadyToStart;
