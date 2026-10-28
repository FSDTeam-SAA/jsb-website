import Link from "next/link";

const PrivacyPolicyHero = () => (
  <section className="relative isolate flex h-[390px] items-center justify-center overflow-hidden bg-[linear-gradient(180deg,#fff_0%,#eaf5ff_58%,#fff_100%)] px-4 pt-[58px] text-center lg:h-[650px] lg:pt-[90px]">
    <div
      aria-hidden="true"
      className="absolute inset-0 -z-10 opacity-60 [background-image:repeating-linear-gradient(90deg,rgba(188,216,242,.42)_0,rgba(188,216,242,.42)_80px,transparent_80px,transparent_160px)]"
    />
    <div
      aria-hidden="true"
      className="absolute -left-28 top-1/2 size-[280px] -translate-y-1/2 rounded-full border-[40px] border-[#d7edff]/70 lg:-left-20 lg:size-[360px] lg:border-[50px]"
    />
    <div
      aria-hidden="true"
      className="absolute -right-28 top-1/2 size-[280px] -translate-y-1/2 rounded-full border-[40px] border-[#d7edff]/70 lg:-right-20 lg:size-[360px] lg:border-[50px]"
    />
    <div className="relative flex max-w-[580px] flex-col items-center gap-4 lg:gap-6">
      <p className="inline-flex h-[30px] items-center rounded-[8px] bg-[#104170] px-3 text-xs font-medium text-white lg:text-sm">
        Privacy Policy
      </p>
      <h1 className="text-3xl font-bold leading-[1.08] tracking-[-.04em] text-[#104170] lg:text-[56px]">
        Your Privacy, Our Priority
      </h1>
      <p className="max-w-[500px] text-xs font-medium leading-[1.25] text-black lg:text-sm">
        Learn how Foreclosure Gold collects, uses, and protects your information
        while you use our platform.
      </p>
      <Link
        href="/sign-up"
        className="inline-flex h-[38px] items-center justify-center rounded-[8px] bg-[#104170] px-3 text-sm font-bold text-white transition hover:bg-[#0b3b65] lg:text-base"
      >
        Create free account
      </Link>
    </div>
  </section>
);

export default PrivacyPolicyHero;
