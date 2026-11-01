"use client";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useSmoothScroll } from "./SmoothScrollProvider";

const ScrollToTopComponent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollTo } = useSmoothScroll();

  useEffect(() => {
    const updateVisibility = () => setIsVisible(window.scrollY > 420);
    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  if (!isVisible) return null;

  return (
    <button
      type="button"
      onClick={() => scrollTo(0)}
      aria-label="Scroll to top"
      className="fixed bottom-6 right-6 z-[100] grid size-12 place-items-center rounded-full border-2 border-[#104170] bg-white text-[#0073df] shadow-[0_8px_22px_rgba(16,65,112,0.2)] transition hover:-translate-y-0.5 hover:bg-[#f4f8ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104170] focus-visible:ring-offset-2 sm:size-14"
    >
      <ArrowUp className="size-5 sm:size-6" />
    </button>
  );
};

export default ScrollToTopComponent;
