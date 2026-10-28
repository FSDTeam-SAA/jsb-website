import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

const AuthShell = ({ children }: { children: ReactNode }) => (
  <main className="min-h-screen bg-white">
    <div className="grid min-h-screen w-full overflow-hidden bg-white md:grid-cols-[42%_58%]">
      <aside className="relative min-h-[280px] overflow-hidden bg-[#eaf6ff] md:min-h-full">
        <Image src="/images/auth_bg.png" alt="Modern homes" fill priority className="object-cover object-bottom" sizes="(max-width: 767px) 100vw, 42vw" />
        <div className="absolute inset-0 bg-[#e7f5ff]/15" />
        <Link href="/" aria-label="Foreclosure Gold home" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104170] focus-visible:ring-offset-4">
          <Image src="/images/auth_logo.png" alt="Foreclosure Gold" width={492} height={126} className="h-auto w-[250px] md:w-[310px]" />
        </Link>
      </aside>
      <section className="flex min-h-[520px] items-center justify-center bg-white px-6 py-12 sm:px-10 md:min-h-full md:px-16">{children}</section>
    </div>
  </main>
);

export default AuthShell;
