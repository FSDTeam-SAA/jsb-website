"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

// The provided dashboard artwork is intentionally repeated to create the carousel previews.
const slides = ["/images/figma/lead-carousel-dashboard.png", "/images/figma/lead-carousel-dashboard.png", "/images/figma/lead-carousel-dashboard.png"];

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
    <section aria-labelledby="powerful-lead-heading" className="bg-white py-8 sm:py-12 lg:py-[60px]">
      <div className="container mx-auto px-0">
        <div className="relative h-[464px] overflow-hidden rounded-[21px] border border-[#bcd8f2] bg-[linear-gradient(180deg,rgba(126,175,219,0.3)_0%,rgba(255,255,255,0)_100%)] pt-[73px] lg:h-[620px] lg:pt-20">
          <header className="relative z-10 px-5 text-center">
            <h2 id="powerful-lead-heading" className="mx-auto max-w-[480px] text-balance text-2xl font-bold leading-[1.05] tracking-[-0.04em] text-[#104170] lg:text-[40px]">
              Powerful Lead Search<br />at Your Fingertips
            </h2>
            <p className="mx-auto mt-2 max-w-[520px] text-xs font-normal leading-[1.2] text-black lg:mt-3 lg:text-sm">
              Explore, filter, and manage real estate leads from one easy-to-use dashboard. Find the right opportunities by lead type, location, and key property criteria.
            </p>
          </header>

          <div className="absolute inset-x-0 bottom-0 top-[244px] overflow-hidden lg:top-[270px]">
            <div className="absolute left-1/2 top-0 h-[171px] w-[360px] -translate-x-1/2 overflow-hidden rounded-[11px] bg-white shadow-[-18px_20px_33px_rgba(22,100,181,0.1)] transition-transform duration-500 lg:h-[323px] lg:w-[780px]">
              <Image
                key={activeSlide}
                src={slides[activeSlide]}
                alt="Foreclosure Gold lead dashboard"
                width={413}
                height={171}
                sizes="(max-width: 1023px) 360px, 780px"
                className="h-full w-full object-cover"
                priority
              />
            </div>

            <div aria-hidden="true" className="absolute left-[calc(50%-383px)] top-0 h-[171px] w-[174px] overflow-hidden opacity-90 lg:left-[calc(50%-950px)] lg:h-[323px] lg:w-[390px]">
              <Image src={slides[previousSlide]} alt="" width={413} height={171} className="h-full w-[413px] max-w-none object-cover object-right lg:h-full lg:w-[780px]" />
            </div>
            <div aria-hidden="true" className="absolute right-[calc(50%-383px)] top-0 h-[171px] w-[180px] overflow-hidden opacity-90 lg:right-[calc(50%-950px)] lg:h-[323px] lg:w-[390px]">
              <Image src={slides[nextSlide]} alt="" width={413} height={171} className="h-full w-[413px] max-w-none object-cover object-left lg:h-full lg:w-[780px]" />
            </div>

            <button
              type="button"
              aria-label="Show previous lead dashboard slide"
              onClick={showPrevious}
              className="absolute left-[calc(50%-212px)] top-[74px] z-20 flex size-6 items-center justify-center rounded-full border border-[#111] bg-white text-[#111] transition hover:bg-[#eef5fc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104a7d] lg:left-[calc(50%-450px)] lg:top-[146px]"
            >
              <ChevronLeft aria-hidden="true" size={16} strokeWidth={1.5} />
            </button>
            <button
              type="button"
              aria-label="Show next lead dashboard slide"
              onClick={showNext}
              className="absolute right-[calc(50%-212px)] top-[74px] z-20 flex size-6 items-center justify-center rounded-full border border-[#111] bg-white text-[#111] transition hover:bg-[#eef5fc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104a7d] lg:right-[calc(50%-450px)] lg:top-[146px]"
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
