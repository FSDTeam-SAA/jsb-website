import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  return (
    <section aria-labelledby="hero-heading" className="relative h-[393px] bg-white sm:h-[460px] lg:h-[1112px]">
      <div className="absolute inset-x-0 top-0 h-full overflow-hidden rounded-b-[24px] bg-[linear-gradient(180deg,#ffffff_0%,#dbeaf8_41%,#7eafdb_100%)] lg:h-[860px]">
        <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_2px_2px,#729dcc_1.5px,transparent_2px)] [background-size:21px_21px]" />
        <Image src="/images/figma/hero-map-layer.png" alt="" width={1165} height={384} priority className="pointer-events-none absolute left-1/2 top-[68px] hidden h-auto w-[min(81vw,1165px)] -translate-x-1/2 opacity-20 lg:block" />

        <Image src="/images/figma/hero-location.png" alt="" width={40} height={40} className="pointer-events-none absolute left-[7%] top-[111px] size-10 lg:left-[15.1%] lg:top-[163px]" />
        <Image src="/images/figma/hero-user.png" alt="" width={40} height={40} className="pointer-events-none absolute right-[22%] top-[102px] size-10 lg:right-[16.7%] lg:top-[195px]" />
        <Image src="/images/figma/hero-chart.png" alt="" width={52} height={52} className="pointer-events-none absolute left-[5.2%] top-[309px] size-[52px] lg:left-[15.7%] lg:top-[395px]" />
        <Image src="/images/figma/hero-filter.png" alt="" width={52} height={52} className="pointer-events-none absolute right-[5.2%] top-[309px] size-[52px] lg:right-[16%] lg:top-[467px]" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-[937px] flex-col items-center px-4 pt-[123px] text-center lg:pt-[175px]">
        <p className="rounded-[8px] bg-white px-3 py-2 text-xs font-medium leading-none text-[#080808] shadow-sm lg:text-base">
          Trusted Real Estate Lead Generation Since 2008
        </p>
        <h1 id="hero-heading" className="mt-3 max-w-[937px] text-balance text-2xl font-bold leading-[1.08] tracking-[-0.045em] text-[#0f2c4f] lg:mt-3 lg:text-[56px]">
          Find Premium Real Estate Leads Before Your Competition
        </h1>
        <p className="mt-2 max-w-[677px] text-xs font-medium leading-[1.25] text-black lg:text-sm">
          Access foreclosure, pre-foreclosure, mortgage, bankruptcy, tax lien, REO, and other real estate leads through one powerful marketplace.
        </p>
        <div className="mt-5 flex items-center gap-2 lg:mt-[23px] lg:gap-[22px]">
          <Link href="#account" className="inline-flex h-[38px] items-center justify-center rounded-[8px] bg-[linear-gradient(270deg,#05976a_0%,#0eb57e_100%)] px-4 text-xs font-bold text-white transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104170] focus-visible:ring-offset-2 lg:h-12 lg:px-3 lg:text-base">
            Create Free Account
          </Link>
          <Link href="#lead-types" className="inline-flex h-[38px] items-center justify-center rounded-[8px] bg-white px-4 text-xs font-bold text-[#104170] shadow-sm transition hover:bg-[#f4f8ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104170] focus-visible:ring-offset-2 lg:h-12 lg:px-3 lg:text-base">
            Explore Leads Type
          </Link>
        </div>
      </div>

      <Image src="/images/figma/hero-dashboard.png" alt="Foreclosure Gold marketplace dashboard" width={1082} height={574} priority className="pointer-events-none absolute left-1/2 top-[552px] hidden h-auto w-[min(75.2vw,1082px)] -translate-x-1/2 lg:block" />
    </section>
  );
};

export default Hero;
