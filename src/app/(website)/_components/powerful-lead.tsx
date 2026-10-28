"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// The supplied dashboard artwork is intentionally repeated for the carousel.
const slides = [
  "/images/power-lead1.png",
  "/images/power-lead2.png",
  "/images/power-lead3.png",
  "/images/power-lead1.png",
  "/images/power-lead2.png",
];
const carouselTransitionMs = 700;

const PowerfulLead = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [motion, setMotion] = useState<-1 | 0 | 1>(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const transitionTimer = useRef<number | undefined>(undefined);
  const pointerStartX = useRef<number | null>(null);

  const moveCarousel = (direction: -1 | 1) => {
    if (isAnimating) return;

    setIsAnimating(true);
    setMotion(direction);
    window.clearTimeout(transitionTimer.current);
    transitionTimer.current = window.setTimeout(() => {
      // Moving left sends the center card into the left preview, so the
      // right-hand card becomes the new center (and vice versa).
      setActiveSlide(
        (slide) => (slide - direction + slides.length) % slides.length,
      );
      setMotion(0);
      setIsAnimating(false);
    }, carouselTransitionMs);
  };

  const showPrevious = () => moveCarousel(1);
  const showNext = () => moveCarousel(-1);

  useEffect(() => () => window.clearTimeout(transitionTimer.current), []);

  const previousSlide = (activeSlide - 1 + slides.length) % slides.length;
  const nextSlide = (activeSlide + 1) % slides.length;

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
            onKeyDown={(event) => {
              if (event.key === "ArrowLeft") showPrevious();
              if (event.key === "ArrowRight") showNext();
            }}
            onPointerDown={(event) => {
              pointerStartX.current = event.clientX;
            }}
            onPointerUp={(event) => {
              const startX = pointerStartX.current;
              pointerStartX.current = null;
              if (startX === null || Math.abs(event.clientX - startX) < 48)
                return;
              if (event.clientX < startX) showPrevious();
              if (event.clientX > startX) showNext();
            }}
            onPointerCancel={() => {
              pointerStartX.current = null;
            }}
            className="absolute inset-x-0 bottom-0 top-[244px] touch-pan-y overflow-hidden outline-none lg:top-[315px]"
          >
            <p className="sr-only" aria-live="polite">
              Dashboard slide {activeSlide + 1} of {slides.length}
            </p>
            {[-1, 0, 1].map((slot) => {
              const slideIndex =
                slot === -1
                  ? previousSlide
                  : slot === 1
                    ? nextSlide
                    : activeSlide;
              const position = slot + motion;
              const transform =
                position === -1
                  ? "translateX(calc(-50% - 293px))"
                  : position === 1
                    ? "translateX(calc(-50% + 293px))"
                    : position < -1
                      ? "translateX(calc(-50% - 586px))"
                      : position > 1
                        ? "translateX(calc(-50% + 586px))"
                        : "translateX(-50%)";

              return (
                <div
                  key={slot}
                  aria-hidden={slot !== 0}
                  className="absolute left-1/2 top-0 h-[185px] w-[360px] overflow-hidden rounded-[11px] bg-white shadow-[-18px_20px_33px_rgba(22,100,181,0.1)] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none lg:h-[460px] lg:w-[890px] lg:[--carousel-shift:925px]"
                  style={{
                    transform: transform
                      .replaceAll("293px", "var(--carousel-shift, 293px)")
                      .replaceAll(
                        "586px",
                        "calc(var(--carousel-shift, 293px) * 2)",
                      ),
                  }}
                >
                  <Image
                    src={slides[slideIndex]}
                    alt={slot === 0 ? "Foreclosure Gold lead dashboard" : ""}
                    width={1818}
                    height={934}
                    sizes="(max-width: 1023px) 360px, 780px"
                    className="h-full w-full object-contain"
                    priority={slot === 0}
                  />
                </div>
              );
            })}

            <button
              type="button"
              aria-label="Show previous lead dashboard slide"
              onClick={showPrevious}
              disabled={isAnimating}
              className="absolute left-[calc(50%-212px)] top-[81px] z-20 flex size-8 items-center justify-center rounded-full border border-[#111] bg-white text-[#111] transition hover:bg-[#eef5fc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104a7d] disabled:pointer-events-none disabled:opacity-60 lg:left-[calc(50%-485px)] lg:top-[218px] lg:size-10"
            >
              <ChevronLeft aria-hidden="true" size={18} strokeWidth={1.5} />
            </button>
            <button
              type="button"
              aria-label="Show next lead dashboard slide"
              onClick={showNext}
              disabled={isAnimating}
              className="absolute right-[calc(50%-212px)] top-[81px] z-20 flex size-8 items-center justify-center rounded-full border border-[#111] bg-white text-[#111] transition hover:bg-[#eef5fc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104a7d] disabled:pointer-events-none disabled:opacity-60 lg:right-[calc(50%-485px)] lg:top-[218px] lg:size-10"
            >
              <ChevronRight aria-hidden="true" size={18} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PowerfulLead;
