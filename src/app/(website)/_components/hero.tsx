import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative h-[573px] bg-white sm:h-[540px] lg:h-[1112px]"
    >
      <div className="absolute inset-x-0 top-0 h-[573px] overflow-hidden rounded-b-[24px] bg-[linear-gradient(180deg,#ffffff_0%,#dbeaf8_41%,#7eafdb_100%)] sm:h-[455px] lg:h-[860px]">
        <Image
          src="/images/hero_bg.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="pointer-events-none object-cover object-top"
        />

        <Image
          src="/images/figma/hero-location.png"
          alt=""
          width={40}
          height={40}
          className="pointer-events-none absolute left-[28px] top-[160px] size-12 lg:left-[15.1%] lg:top-[163px] lg:size-10"
        />
        <Image
          src="/images/figma/hero-user.png"
          alt=""
          width={40}
          height={40}
          className="pointer-events-none absolute right-[40px] top-[154px] size-12 lg:right-[16.7%] lg:top-[195px] lg:size-10"
        />
        <Image
          src="/images/figma/hero-chart.png"
          alt=""
          width={52}
          height={52}
          className="pointer-events-none absolute left-[28px] top-[450px] size-[60px] lg:left-[15.7%] lg:top-[395px] lg:size-[52px]"
        />
        <Image
          src="/images/figma/hero-filter.png"
          alt=""
          width={52}
          height={52}
          className="pointer-events-none absolute right-[15px] top-[450px] size-[60px] lg:right-[16%] lg:top-[467px] lg:size-[52px]"
        />
      </div>

      <div className="container relative z-10 mx-auto px-0">
        <div className="mx-auto flex max-w-[937px] flex-col items-center px-2 pt-[191px] text-center sm:px-4 sm:pt-[164px] lg:pt-[175px]">
          <p className="flex h-9 items-center rounded-[8px] bg-white px-2 text-[11px] font-medium leading-none text-[#080808] shadow-sm lg:h-auto lg:py-2 lg:text-base">
            Trusted Real Estate Lead Generation Since 2008
          </p>
          <h1
            id="hero-heading"
            className="mt-4 max-w-[450px] text-2xl font-bold leading-[1.1] text-[#0f2c4f] sm:max-w-[390px] sm:text-2xl lg:mt-3 lg:max-w-[937px] lg:text-[56px] lg:leading-[1.08]"
          >
            Find Premium Real Estate Leads Before Your Competition
          </h1>
          <p className="mt-4 max-w-[420px] text-xs font-medium leading-[1.2] text-black sm:max-w-[380px] sm:text-xs sm:leading-[1.25] lg:mt-4 lg:max-w-[677px] lg:text-sm">
            Access foreclosure, pre-foreclosure, mortgage, bankruptcy, tax lien,
            REO, and other real estate leads through one powerful marketplace.
          </p>
          <div className="mt-7 flex w-full items-center justify-center gap-2 lg:mt-[23px] lg:w-auto lg:gap-[22px]">
            <Link
              href="/sign-up"
              className="inline-flex h-14 w-[calc(50%-5px)] max-w-[195px] items-center justify-center rounded-[8px] bg-[linear-gradient(270deg,#05976a_0%,#0eb57e_100%)] px-2 text-[13px] font-bold text-white transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104170] focus-visible:ring-offset-2 sm:h-12 sm:w-[170px] sm:px-3 sm:text-xs lg:h-12 lg:w-auto lg:px-3 lg:text-base"
            >
              Create Free Account
            </Link>
            <Link
              href="#lead-types"
              className="inline-flex h-14 w-[calc(50%-5px)] max-w-[195px] items-center justify-center rounded-[8px] bg-white px-2 text-[13px] font-bold text-[#104170] shadow-sm transition hover:bg-[#f4f8ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104170] focus-visible:ring-offset-2 sm:h-12 sm:w-[168px] sm:px-3 sm:text-xs lg:h-12 lg:w-auto lg:px-3 lg:text-base"
            >
              Explore Leads Type
            </Link>
          </div>
        </div>
      </div>

      <Image
        src="/images/figma/hero-dashboard.png"
        alt="Foreclosure Gold marketplace dashboard"
        width={1082}
        height={574}
        priority
        className="pointer-events-none absolute left-1/2 top-[552px] hidden h-auto w-[min(75.2vw,1082px)] -translate-x-1/2 lg:block"
      />
    </section>
  );
};

export default Hero;
