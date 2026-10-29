"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const slides = [
  "/images/power-lead1.png",
  "/images/power-lead2.png",
  "/images/power-lead3.png",
  "/images/power-lead1.png",
  "/images/power-lead2.png",
  "/images/power-lead3.png",
];

const PowerfulLead = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isAutoScrollPaused, setIsAutoScrollPaused] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const scrollFrame = useRef<number | undefined>(undefined);

  const scrollToSlide = (
    index: number,
    behavior: ScrollBehavior = "smooth",
  ) => {
    const carousel = carouselRef.current;
    const slide = carousel?.querySelector<HTMLElement>(
      `[data-carousel-slide="${index}"]`,
    );

    if (!carousel || !slide) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    carousel.scrollTo({
      left: slide.offsetLeft - (carousel.clientWidth - slide.clientWidth) / 2,
      behavior: prefersReducedMotion ? "auto" : behavior,
    });
  };

  const updateActiveSlide = () => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const carouselCenter = carousel.scrollLeft + carousel.clientWidth / 2;
    const slideElements = Array.from(
      carousel.querySelectorAll<HTMLElement>("[data-carousel-slide]"),
    );
    const closestSlide = slideElements.reduce((closest, slide) => {
      const slideCenter = slide.offsetLeft + slide.clientWidth / 2;
      const closestCenter = closest.offsetLeft + closest.clientWidth / 2;

      return Math.abs(slideCenter - carouselCenter) <
        Math.abs(closestCenter - carouselCenter)
        ? slide
        : closest;
    });

    setActiveSlide(Number(closestSlide.dataset.carouselSlide));
  };

  useEffect(() => {
    const handleResize = () => scrollToSlide(activeSlide, "auto");

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (scrollFrame.current) window.cancelAnimationFrame(scrollFrame.current);
    };
  }, [activeSlide]);

  useEffect(() => {
    if (isAutoScrollPaused) return;

    const autoScrollTimer = window.setInterval(() => {
      scrollToSlide(
        activeSlide === slides.length - 1 ? 0 : activeSlide + 1,
      );
    }, 5000);

    return () => window.clearInterval(autoScrollTimer);
  }, [activeSlide, isAutoScrollPaused]);

  return (
    <section
      aria-labelledby="powerful-lead-heading"
      className="bg-white py-8 sm:py-12 lg:py-[60px]"
    >
      <div className="container mx-auto px-0">
        <div className="relative h-[478px] overflow-hidden rounded-[21px] border border-[#8bbbe7] bg-[linear-gradient(180deg,rgba(126,175,219,0.3)_0%,rgba(255,255,255,0)_100%)] pt-[73px] lg:h-[810px] lg:pt-20">
          <header className="relative z-10 px-5 text-center">
            <h2
              id="powerful-lead-heading"
              className="mx-auto max-w-[480px] text-balance text-2xl font-bold leading-[1.07] tracking-[-0.04em] text-primary lg:text-[40px]"
            >
              Powerful Lead Search
              <br />
              at Your Fingertips
            </h2>
            <p className="mx-auto mt-2 max-w-[520px] text-xs font-normal leading-normal text-black lg:mt-3 lg:text-sm">
              Explore, filter, and manage real estate leads from one easy-to-use
              dashboard. Find the right opportunities by lead type, location,
              and key property criteria.
            </p>
          </header>

          <div
            role="region"
            aria-roledescription="carousel"
            aria-label="Lead dashboard previews"
            tabIndex={0}
            onMouseEnter={() => setIsAutoScrollPaused(true)}
            onMouseLeave={() => setIsAutoScrollPaused(false)}
            onFocusCapture={() => setIsAutoScrollPaused(true)}
            onBlurCapture={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node)) {
                setIsAutoScrollPaused(false);
              }
            }}
            onPointerDown={() => setIsAutoScrollPaused(true)}
            onPointerUp={() => setIsAutoScrollPaused(false)}
            onPointerCancel={() => setIsAutoScrollPaused(false)}
            onKeyDown={(event) => {
              if (event.key === "ArrowLeft" && activeSlide > 0) {
                event.preventDefault();
                scrollToSlide(activeSlide - 1);
              }
              if (
                event.key === "ArrowRight" &&
                activeSlide < slides.length - 1
              ) {
                event.preventDefault();
                scrollToSlide(activeSlide + 1);
              }
            }}
            className="absolute inset-x-0 bottom-0 top-[244px] outline-none lg:top-[315px]"
          >
            <p className="sr-only" aria-live="polite">
              Dashboard slide {activeSlide + 1} of {slides.length}
            </p>
            <div
              ref={carouselRef}
              onScroll={() => {
                if (scrollFrame.current) return;

                scrollFrame.current = window.requestAnimationFrame(() => {
                  updateActiveSlide();
                  scrollFrame.current = undefined;
                });
              }}
              className="h-full overflow-x-auto scroll-smooth snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              <div className="flex min-w-full gap-3 px-[calc(50%-180px)] lg:gap-7 lg:px-[calc(50%-390px)] xl:px-[calc(50%-445px)]">
                {slides.map((slide, index) => (
                <div
                  key={slide}
                  id={`lead-dashboard-slide-${index}`}
                  data-carousel-slide={index}
                  aria-hidden={activeSlide !== index}
                  className="h-[185px] w-[360px] shrink-0 snap-center overflow-hidden rounded-[11px] bg-white shadow-[-18px_20px_33px_rgba(22,100,181,0.1)] lg:h-[460px] lg:w-[780px] xl:w-[890px]"
                >
                  <Image
                    src={slide}
                    alt={
                      activeSlide === index
                        ? "Foreclosure Gold lead dashboard"
                        : ""
                    }
                    width={1818}
                    height={934}
                    sizes="(max-width: 1023px) 360px, (max-width: 1279px) 780px, 890px"
                    className="h-full w-full object-contain"
                    priority={index === 0}
                  />
                </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              aria-label="Show previous lead dashboard slide"
              aria-controls={`lead-dashboard-slide-${activeSlide}`}
              onClick={() => scrollToSlide(activeSlide - 1)}
              disabled={activeSlide === 0}
              className="absolute left-[calc(50%-205px)] top-[76px] z-20 flex size-8 items-center justify-center rounded-full border border-[#111] bg-white text-[#111] transition hover:bg-[#eef5fc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104a7d] disabled:pointer-events-none disabled:opacity-60 lg:left-[calc(50%-430px)] lg:top-[210px] lg:size-10 xl:left-[calc(50%-485px)]"
            >
              <ChevronLeft aria-hidden="true" size={18} strokeWidth={1.5} />
            </button>
            <button
              type="button"
              aria-label="Show next lead dashboard slide"
              aria-controls={`lead-dashboard-slide-${activeSlide}`}
              onClick={() => scrollToSlide(activeSlide + 1)}
              disabled={activeSlide === slides.length - 1}
              className="absolute right-[calc(50%-205px)] top-[76px] z-20 flex size-8 items-center justify-center rounded-full border border-[#111] bg-white text-[#111] transition hover:bg-[#eef5fc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104a7d] disabled:pointer-events-none disabled:opacity-60 lg:right-[calc(50%-430px)] lg:top-[210px] lg:size-10 xl:right-[calc(50%-485px)]"
            >
              <ChevronRight aria-hidden="true" size={18} strokeWidth={1.5} />
            </button>
            <div className="absolute inset-x-0 bottom-3 z-20 flex justify-center gap-2 lg:bottom-5">
              {slides.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  aria-label={`Show dashboard slide ${index + 1}`}
                  aria-current={activeSlide === index ? "true" : undefined}
                  onClick={() => scrollToSlide(index)}
                  className={`h-1.5 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104a7d] focus-visible:ring-offset-2 ${
                    activeSlide === index
                      ? "w-5 bg-[#104170]"
                      : "w-1.5 bg-[#104170]/35 hover:bg-[#104170]/65"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PowerfulLead;
