import Image from "next/image";
import Link from "next/link";

const NotFound = () => {
  return (
    <main className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-[#043ee3] px-4 py-8 text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(89,143,255,0.32)_1px,transparent_1px),linear-gradient(to_bottom,rgba(89,143,255,0.32)_1px,transparent_1px)] [background-size:44px_44px] sm:[background-size:70px_70px] lg:[background-size:88px_88px]"
      />

      <section className="relative z-10 flex w-full flex-col items-center text-center">
        <div className="relative w-[min(94vw,900px)]">
          <Image
            src="/images/404.png"
            alt=""
            aria-hidden="true"
            width={1772}
            height={689}
            priority
            sizes="(max-width: 900px) 94vw, 900px"
            className="h-auto w-full"
          />
          <h1 className="-mt-5 px-1 text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-semibold leading-[120%] tracking-[-0.04em] text-white">
            <span className="block">The page you are looking</span>
            <span className="block">for doesn&apos;t exist</span>
          </h1>
        </div>

        <p className="mt-8 max-w-[90vw] text-sm md:text-base lg:text-lg font-normal leading-[160%] text-[#E5E6E8]">
          Try to use a correct url or go back to homepage to start again
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex h-10 md:h-[46px] items-center justify-center rounded-full bg-primary px-5 text-sm md:text-base lg:text-lg leading-[120%] font-medium text-[#242528] transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#043ee3]"
        >
          Back to Home
        </Link>
      </section>
    </main>
  );
};

export default NotFound;
