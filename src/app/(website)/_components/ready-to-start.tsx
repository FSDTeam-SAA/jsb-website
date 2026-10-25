import Image from "next/image";
import Link from "next/link";

const ReadyToStart = () => {
  return (
    <section aria-labelledby="ready-to-start-heading" className="bg-white py-0 lg:py-[60px]">
      <div className="container mx-auto px-0">
        <div className="relative isolate flex h-[260px] items-center justify-center overflow-hidden px-4 py-8 text-center lg:h-[320px] lg:rounded-xl">
          <Image
            src="/images/ready_to_start.png"
            alt="Aerial view of a neighbourhood"
            fill
            sizes="(max-width: 1023px) 100vw, 1312px"
            className="-z-20 object-cover"
          />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[#073d6e]/80" />

          <div className="flex max-w-2xl flex-col items-center">
            <h2
              id="ready-to-start-heading"
              className="text-balance text-2xl font-bold leading-[1.1] tracking-[-0.03em] text-white lg:text-[40px]"
            >
              <span className="block">Ready To Start</span>
              <span className="block">Finding Quality Leads?</span>
            </h2>
            <p className="mt-6 text-lg leading-[1.2] text-white">
              Create your free account and explore available lead opportunities.
            </p>
            <Link
              href="#create-your-book"
              className="mt-6 inline-flex h-12 items-center justify-center rounded-lg bg-[linear-gradient(270deg,#05976a_0%,#0eb57e_100%)] px-3 text-base font-bold text-white shadow-sm transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a477b]"
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
