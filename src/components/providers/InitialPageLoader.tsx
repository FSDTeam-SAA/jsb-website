"use client";

import { useEffect, useRef, useState } from "react";

import Loader from "@/app/loading";

const MINIMUM_VISIBLE_MS = 650;

const InitialPageLoader = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const startedAt = useRef(Date.now());

  useEffect(() => {
    const finishLoading = () => {
      const remaining = Math.max(0, MINIMUM_VISIBLE_MS - (Date.now() - startedAt.current));
      window.setTimeout(() => setIsLoading(false), remaining);
    };

    if (document.readyState === "complete") {
      finishLoading();
    } else {
      window.addEventListener("load", finishLoading, { once: true });
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("load", finishLoading);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    if (!isLoading) document.body.style.overflow = "";
  }, [isLoading]);

  return (
    <>
      <div
        className={`fixed inset-0 z-[200] transition-opacity duration-300 motion-reduce:transition-none ${isLoading ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
        aria-hidden={!isLoading}
      >
        <Loader message="Preparing your Foreclosure Gold experience..." />
      </div>
      {children}
    </>
  );
};

export default InitialPageLoader;
