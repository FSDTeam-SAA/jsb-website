import Image from "next/image";
import { Building2, MapPin } from "lucide-react";

type LoaderVariant = "page" | "section" | "inline";

type LoaderProps = {
  variant?: LoaderVariant;
  message?: string;
  className?: string;
};

const variantClasses: Record<LoaderVariant, string> = {
  page: "fixed inset-0 z-[100] min-h-[100svh] bg-[#f8fbff] text-[#0f2c4f]",
  section: "min-h-[360px] w-full bg-white text-[#0f2c4f]",
  inline: "min-h-40 w-full bg-transparent text-[#0f2c4f]",
};

const Loader = ({
  variant = "page",
  message = "Preparing your lead marketplace...",
  className = "",
}: LoaderProps) => {
  const isPage = variant === "page";
  const isInline = variant === "inline";

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={`relative flex items-center justify-center overflow-hidden ${variantClasses[variant]} ${className}`}
    >
      {isPage && (
        <>
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(209,228,246,0.9),transparent_31%),linear-gradient(180deg,#ffffff_0%,#f5faff_100%)]" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[46%] bg-[radial-gradient(circle_at_1px_1px,rgba(16,65,112,0.1)_1px,transparent_0)] [background-size:20px_20px]" />
          <div aria-hidden="true" className="pointer-events-none absolute -left-16 bottom-[-120px] size-72 rounded-full bg-[#d1e4f6]/70 blur-3xl" />
          <div aria-hidden="true" className="pointer-events-none absolute -right-16 top-[28%] size-64 rounded-full bg-[#dbeaf8]/70 blur-3xl" />
        </>
      )}

      <div className={`relative z-10 flex flex-col items-center px-6 text-center ${isInline ? "gap-3" : "gap-5"}`}>
        {isPage && (
          <Image
            src="/images/sm_logo.png"
            alt="Foreclosure Gold"
            width={492}
            height={126}
            priority
            className="h-auto w-[230px] sm:w-[270px]"
          />
        )}

        <div className={`relative grid place-items-center ${isInline ? "size-14" : "size-28"}`} aria-hidden="true">
          <span className={`absolute inset-0 rounded-full border ${isPage ? "border-[#b8d2e9]" : "border-[#d9e6f1]"}`} />
          <span className={`absolute inset-2 animate-[spin_1.35s_linear_infinite] rounded-full border-[3px] border-transparent border-t-[#104170] border-r-[#104170] motion-reduce:animate-none`} />
          <span className={`absolute inset-4 animate-pulse rounded-full bg-[#dcecf9] motion-reduce:animate-none`} />
          <span className={`relative grid place-items-center rounded-full bg-[#104170] text-white shadow-[0_9px_24px_rgba(16,65,112,0.28)] ${isInline ? "size-9" : "size-14"}`}>
            <Building2 size={isInline ? 19 : 27} strokeWidth={1.8} />
          </span>
          {!isInline && <MapPin className="absolute -right-1 top-2 animate-bounce text-[#0b83c9] motion-reduce:animate-none" size={isPage ? 22 : 18} fill="white" />}
        </div>

        <div className="space-y-2">
          <p className={`${isInline ? "text-sm" : "text-base sm:text-lg"} font-bold text-[#104170]`}>
            {message}
          </p>
          {!isInline && (
            <p className="max-w-[280px] text-xs leading-5 text-[#587087] sm:max-w-none sm:text-sm">
              Finding the latest real estate opportunities for you.
            </p>
          )}
        </div>

        {!isInline && (
          <div aria-hidden="true" className="h-1.5 w-40 overflow-hidden rounded-full bg-[#dceaf6]">
            <span className="block h-full w-1/2 animate-[pulse_1.2s_ease-in-out_infinite] rounded-full bg-[#104170] motion-reduce:animate-none" />
          </div>
        )}

        <span className="sr-only">Please wait while Foreclosure Gold loads your content.</span>
      </div>
    </div>
  );
};

export default Loader;
