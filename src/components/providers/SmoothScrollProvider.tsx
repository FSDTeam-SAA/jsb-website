"use client";

import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef } from "react";
import Lenis from "@studio-freight/lenis";

interface Props {
  children: ReactNode;
}

type SmoothScrollOptions = {
  offset?: number;
  duration?: number;
  immediate?: boolean;
};

type SmoothScrollContextValue = {
  scrollTo: (target: number | string | HTMLElement, options?: SmoothScrollOptions) => void;
};

const SmoothScrollContext = createContext<SmoothScrollContextValue>({
  scrollTo: () => undefined,
});

export const useSmoothScroll = () => useContext(SmoothScrollContext);

export default function SmoothScrollProvider({ children }: Props) {
  const lenisRef = useRef<Lenis | null>(null);

  const scrollTo = useCallback(
    (target: number | string | HTMLElement, options: SmoothScrollOptions = {}) => {
      const lenis = lenisRef.current;
      if (lenis) {
        const computedOffset =
          target instanceof HTMLElement
            ? -Number.parseFloat(window.getComputedStyle(target).scrollMarginTop || "0")
            : 0;
        lenis.scrollTo(target, {
          duration: 0.9,
          offset: computedOffset,
          ...options,
        });
        return;
      }

      if (typeof target === "number") {
        window.scrollTo({ top: target, behavior: "auto" });
        return;
      }

      const element = typeof target === "string" ? document.querySelector(target) : target;
      element?.scrollIntoView({ behavior: "auto", block: "start" });
    },
    [],
  );

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: 0.09,
      smoothWheel: true,
      syncTouch: false,
    });
    lenisRef.current = lenis;

    let animationFrame: number;

    function raf(time: number) {
      lenis.raf(time);
      animationFrame = requestAnimationFrame(raf);
    }

    animationFrame = requestAnimationFrame(raf);

    const handleAnchorClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey) return;
      const element = event.target instanceof Element ? event.target.closest('a[href^="#"]') : null;
      const href = element?.getAttribute("href");
      if (!href || href === "#") return;

      const target = document.getElementById(decodeURIComponent(href.slice(1)));
      if (!target) return;

      event.preventDefault();
      scrollTo(target);
      window.history.pushState(null, "", href);
    };

    document.addEventListener("click", handleAnchorClick);

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      window.cancelAnimationFrame(animationFrame);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [scrollTo]);

  const value = useMemo(() => ({ scrollTo }), [scrollTo]);

  return <SmoothScrollContext.Provider value={value}>{children}</SmoothScrollContext.Provider>;
}
