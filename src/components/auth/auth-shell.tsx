import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

type AuthShellProps = {
  children: ReactNode;
  variant?: "default" | "select-plan";
};

const AuthShell = ({ children, variant = "default" }: AuthShellProps) => {
  const isSelectPlan = variant === "select-plan";

  return (
  <main className="min-h-screen bg-white">
    <div className={`grid min-h-screen w-full overflow-hidden bg-white md:grid-cols-[42%_58%] ${isSelectPlan ? "min-[1400px]:grid-cols-[599px_minmax(0,1fr)]" : ""}`}>
      <aside className="relative min-h-[280px] overflow-hidden bg-[#eaf6ff] md:min-h-full">
        <Image src={isSelectPlan ? "/images/figma/select-plan-background.png" : "/images/auth_bg.png"} alt="Modern homes" fill priority className="object-cover object-bottom" sizes={isSelectPlan ? "(max-width: 767px) 100vw, (min-width: 1400px) 599px, 42vw" : "(max-width: 767px) 100vw, 42vw"} />
        <div className="absolute inset-0 bg-[#e7f5ff]/15" />
        <Link href="/" aria-label="Foreclosure Gold home" className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104170] focus-visible:ring-offset-4 ${isSelectPlan ? "min-[1400px]:left-[82px] min-[1400px]:top-[414px] min-[1400px]:translate-x-0 min-[1400px]:translate-y-0" : ""}`}>
          <Image src={isSelectPlan ? "/images/figma/select-plan-logo.png" : "/images/auth_logo.png"} alt="Foreclosure Gold" width={492} height={126} className={`h-auto w-[250px] md:w-[310px] ${isSelectPlan ? "min-[1400px]:w-[381px]" : ""}`} />
        </Link>
      </aside>
      <section className={`flex min-h-[520px] items-center justify-center bg-white px-6 py-12 sm:px-10 md:min-h-full md:px-16 ${isSelectPlan ? "md:h-[100svh] md:overflow-hidden" : ""}`}>{children}</section>
    </div>
  </main>
  );
};

export default AuthShell;
