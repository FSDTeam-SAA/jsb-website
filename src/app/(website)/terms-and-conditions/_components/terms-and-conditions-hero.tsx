import Link from "next/link";

const TermsAndConditionsHero = () => (
  <section className="relative isolate flex min-h-[430px] items-center justify-center overflow-hidden bg-[linear-gradient(180deg,#fff_0%,#eff8ff_57%,#fff_100%)] px-4 pb-12 pt-24 text-center sm:min-h-[460px] sm:px-6 sm:pt-28 lg:h-[650px] lg:min-h-0 lg:pb-0 lg:pt-[90px]">
    <div
      aria-hidden="true"
      className="absolute inset-0 -z-10 opacity-60 [background-image:linear-gradient(90deg,rgba(255,255,255,.9),transparent_22%,transparent_78%,rgba(255,255,255,.9)),repeating-linear-gradient(90deg,rgba(188,216,242,.42)_0,rgba(188,216,242,.42)_80px,transparent_80px,transparent_160px)]"
    />
    <div
      aria-hidden="true"
      className="absolute -left-36 top-1/2 size-[250px] -translate-y-1/2 rounded-full border-[32px] border-[#d7edff]/70 sm:-left-28 sm:size-[300px] sm:border-[40px] lg:-left-20 lg:size-[360px] lg:border-[50px]"
    />
    <div
      aria-hidden="true"
      className="absolute -right-36 top-1/2 size-[250px] -translate-y-1/2 rounded-full border-[32px] border-[#d7edff]/70 sm:-right-28 sm:size-[300px] sm:border-[40px] lg:-right-20 lg:size-[360px] lg:border-[50px]"
    />
    <div className="relative flex max-w-[620px] flex-col items-center gap-4 sm:gap-5 lg:gap-6">
      <p className="inline-flex h-[32px] items-center rounded-lg bg-[#D1E4F6] px-3 text-xs font-semibold text-primary sm:text-sm lg:h-[30px] lg:font-medium">
        Terms &amp; Conditions
      </p>
      <h1 className="max-w-[560px] text-[clamp(2rem,8vw,3rem)] font-bold leading-[1.08] tracking-[-.04em] text-[#104170] lg:text-[56px]">
        Clear Terms for Using
        <br className="hidden lg:block" /> Foreclosure Gold
      </h1>
      <p className="max-w-[510px] text-sm font-medium leading-6 text-[#263442] lg:text-sm lg:leading-[1.25]">
        Understand the rules, responsibilities, memberships, and lead-purchase
        terms that apply when using our platform.
      </p>
      <Link
        href="/sign-up"
        className="inline-flex h-11 items-center justify-center rounded-lg bg-[#104170] px-5 text-sm font-bold text-white shadow-[0_8px_18px_rgba(16,65,112,0.2)] transition hover:-translate-y-0.5 hover:bg-[#0b3b65] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104170] focus-visible:ring-offset-2 lg:h-[38px] lg:px-3 lg:text-base"
      >
        Create free account
      </Link>
    </div>
  </section>
);

export default TermsAndConditionsHero;
