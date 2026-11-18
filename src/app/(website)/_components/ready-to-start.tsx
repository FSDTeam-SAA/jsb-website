import Image from "next/image";
import Link from "next/link";

const ReadyToStart = ({
  variant = "default",
}: {
  variant?: "default" | "about" | "lead-types";
}) => {
  const isFigmaVariant = variant !== "default";

  return (
    <section
      aria-labelledby="ready-to-start-heading"
      className={isFigmaVariant ? "bg-white py-[5px]" : "bg-white py-0 lg:py-[60px]"}
    >
      <div className="container mx-auto px-0">
        <div
          className={`relative isolate flex items-center justify-center overflow-hidden px-4 py-8 text-center ${
            isFigmaVariant
              ? "h-[320px] rounded-[20px] lg:h-[417px]"
              : "h-[260px] lg:h-[320px] lg:rounded-xl"
          }`}
        >
          <Image
            src={
              isFigmaVariant
                ? variant === "lead-types"
                  ? "/images/figma/lead-types-ready-background.png"
                  : "/images/figma/about-ready-background.png"
                : "/images/ready_to_start.png"
            }
            alt="Aerial view of a neighbourhood"
            fill
            sizes="(max-width: 1023px) 100vw, 1312px"
            className="-z-20 object-cover"
          />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[#073d6e]/80" />

          <div className={`flex flex-col items-center ${isFigmaVariant ? "w-full max-w-[652px] gap-6" : "max-w-2xl"}`}>
            <h2
              id="ready-to-start-heading"
              className={`text-balance font-bold leading-[1.1] tracking-[-0.03em] text-white ${
                isFigmaVariant ? "text-3xl lg:text-[48px]" : "text-2xl lg:text-[40px]"
              }`}
            >
              <span className="block">Ready To Start</span>
              <span className="block">Finding Quality Leads?</span>
            </h2>
            <p className={isFigmaVariant ? "text-[18px] text-white" : "mt-6 text-lg leading-[1.2] text-white"}>
              Create your free account and explore available lead opportunities.
            </p>
            <Link
              href="/sign-up"
              className={`${isFigmaVariant ? "mt-0" : "mt-6"} inline-flex h-12 items-center justify-center rounded-[8px] bg-[linear-gradient(270deg,#05976a_0%,#0eb57e_100%)] px-3 text-base font-bold text-white shadow-sm transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a477b]`}
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReadyToStart;
