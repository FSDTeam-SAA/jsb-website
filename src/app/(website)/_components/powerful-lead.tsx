"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

// The provided dashboard artwork is intentionally repeated to create the carousel previews.
const slides = ["/images/power-lead.png", "/images/power-lead.png", "/images/power-lead.png"];

const PowerfulLead = () => {
  const [activeSlide, setActiveSlide] = useState(1);

  const showPrevious = () => setActiveSlide((slide) => (slide - 1 + slides.length) % slides.length);
  const showNext = () => setActiveSlide((slide) => (slide + 1) % slides.length);

  useEffect(() => {
    const interval = window.setInterval(showNext, 5000);
    return () => window.clearInterval(interval);
  }, []);

  const previousSlide = (activeSlide - 1 + slides.length) % slides.length;
  const nextSlide = (activeSlide + 1) % slides.length;

  return (
    <section aria-labelledby="powerful-lead-heading" className="bg-white py-10 sm:py-14 lg:py-[41px]">
      <div className="mx-auto max-w-[960px] px-5 sm:px-8 lg:px-0">
        <div className="relative min-h-[450px] overflow-hidden rounded-xl border border-[#9bc7ed] bg-[linear-gradient(180deg,#dcebf8_0%,#eff7fe_55%,#ffffff_100%)] pt-10 sm:min-h-[483px] sm:pt-[43px]">
          <header className="relative z-10 px-5 text-center">
            <h2 id="powerful-lead-heading" className="mx-auto max-w-[390px] text-balance text-[clamp(1.6rem,3vw,2rem)] font-bold leading-[1.03] tracking-[-0.04em] text-[#0f4779]">
              Powerful Lead Search<br />at Your Fingertips
            </h2>
            <p className="mx-auto mt-3 max-w-[430px] text-[9px] font-medium leading-[1.35] text-black sm:text-[10px]">
              Explore, filter, and manage real estate leads from one easy-to-use dashboard. Find the right opportunities by lead type, location, and key property criteria.
            </p>
          </header>

          <div className="absolute inset-x-0 bottom-0 top-[173px] overflow-hidden sm:top-[174px]">
            <div className="absolute left-1/2 top-0 aspect-[490/252] w-[84vw] -translate-x-1/2 overflow-hidden rounded-sm bg-white shadow-[0_12px_24px_rgba(42,80,112,0.14)] transition-transform duration-500 sm:h-[252px] sm:w-[490px]">
              <Image
                key={activeSlide}
                src={slides[activeSlide]}
                alt="Foreclosure Gold lead dashboard"
                width={490}
                height={252}
                sizes="(max-width: 639px) 84vw, 490px"
                className="h-full w-full object-cover"
                priority
              />
            </div>

            <div aria-hidden="true" className="absolute left-[calc(50%-755px)] top-3 hidden h-[205px] w-[400px] overflow-hidden opacity-75 sm:block">
              <Image src={slides[previousSlide]} alt="" width={400} height={205} className="h-full w-full object-cover object-right" />
            </div>
            <div aria-hidden="true" className="absolute right-[calc(50%-755px)] top-3 hidden h-[205px] w-[400px] overflow-hidden opacity-75 sm:block">
              <Image src={slides[nextSlide]} alt="" width={400} height={205} className="h-full w-full object-cover object-left" />
            </div>

            <button
              type="button"
              aria-label="Show previous lead dashboard slide"
              onClick={showPrevious}
              className="absolute left-3 top-[105px] z-20 flex size-[27px] items-center justify-center rounded-full border border-[#111] bg-white text-[#111] transition hover:bg-[#eef5fc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104a7d] sm:left-[calc(50%-276px)]"
            >
              <ChevronLeft aria-hidden="true" size={16} strokeWidth={1.5} />
            </button>
            <button
              type="button"
              aria-label="Show next lead dashboard slide"
              onClick={showNext}
              className="absolute right-3 top-[105px] z-20 flex size-[27px] items-center justify-center rounded-full border border-[#111] bg-white text-[#111] transition hover:bg-[#eef5fc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104a7d] sm:right-[calc(50%-276px)]"
            >
              <ChevronRight aria-hidden="true" size={16} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PowerfulLead;
