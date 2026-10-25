import Image from "next/image";
import { BookOpenCheck } from "lucide-react";

type LoaderVariant = "page" | "section" | "inline";

interface LoaderProps {
  variant?: LoaderVariant;
  message?: string;
  className?: string;
}

const variantClasses: Record<LoaderVariant, string> = {
  page: "fixed inset-0 z-[100] min-h-screen bg-[#003be2] text-white",
  section: "min-h-[360px] w-full bg-white text-[#242528]",
  inline: "min-h-40 w-full bg-transparent text-[#242528]",
};

const Loader = ({
  variant = "page",
  message = "Getting your learning space ready...",
  className = "",
}: LoaderProps) => {
  const isPage = variant === "page";
  const isCompact = variant === "inline";

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={`relative flex items-center justify-center overflow-hidden ${variantClasses[variant]} ${className}`}
    >
      {isPage && (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:60px_60px]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_42%,rgba(216,251,32,0.16),transparent_52%)]"
          />
        </>
      )}

      <div
        className={`relative z-10 flex flex-col items-center px-6 text-center ${isCompact ? "gap-3" : "gap-6"}`}
      >
        {isPage && (
          <Image
            src="/images/logo.png"
            alt="ByteSpace"
            width={202}
            height={41}
            priority
            className="h-auto w-[164px] sm:w-[190px]"
          />
        )}

        <div
          className={`relative flex items-center justify-center ${isCompact ? "h-14 w-14" : "h-24 w-24"}`}
          aria-hidden="true"
        >
          <div
            className={`absolute inset-0 rounded-full border ${isPage ? "border-white/20" : "border-secondary/15"}`}
          />
          <div
            className={`absolute inset-1 animate-[spin_1.6s_cubic-bezier(0.5,0,0.5,1)_infinite] rounded-full border-[3px] border-transparent ${isPage ? "border-t-primary border-r-primary" : "border-t-secondary border-r-primary"} motion-reduce:animate-none`}
          />
          <div
            className={`relative flex items-center justify-center rounded-full ${isPage ? "bg-white/10" : "bg-secondary/5"} ${isCompact ? "h-9 w-9" : "h-14 w-14"}`}
          >
            <BookOpenCheck
              className={`${isPage ? "text-primary" : "text-secondary"} ${isCompact ? "h-5 w-5" : "h-7 w-7"}`}
              strokeWidth={1.8}
            />
          </div>
          <span
            className={`absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 rounded-full ${isPage ? "bg-primary shadow-[0_0_14px_rgba(216,251,32,0.8)]" : "bg-secondary"}`}
          />
        </div>

        <div className="space-y-2">
          <p
            className={`${isCompact ? "text-sm" : "text-base sm:text-lg"} font-semibold ${isPage ? "text-white" : "text-[#242528]"}`}
          >
            {message}
          </p>
          {isPage && (
            <p className="text-xs text-white/70 sm:text-sm">
              Just a moment — your courses are on the way.
            </p>
          )}
        </div>

        {!isCompact && (
          <div className="flex items-center justify-center gap-1.5" aria-hidden="true">
            {[0, 1, 2].map((dot) => (
              <span
                key={dot}
                className={`h-1.5 w-1.5 animate-bounce rounded-full motion-reduce:animate-none ${isPage ? "bg-primary" : "bg-secondary"}`}
                style={{ animationDelay: `${dot * 0.15}s` }}
              />
            ))}
          </div>
        )}

        <span className="sr-only">Please wait while the content loads.</span>
      </div>
    </div>
  );
};

export default Loader;
