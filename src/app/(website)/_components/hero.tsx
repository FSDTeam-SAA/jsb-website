import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative min-h-[100svh] overflow-hidden bg-[#f8eee8] bg-[url('/images/hero.png')] bg-cover bg-[position:62%_center] sm:bg-[position:60%_center] lg:h-screen lg:bg-center"
    >
      <div className="container relative z-10 mx-auto w-full pt-28 sm:pt-32 lg:px-0 lg:pt-[196px]">
        <div className="max-w-[577px]">
          <h1
            id="hero-heading"
            className="font-fredoka text-[clamp(2.5rem,4.45vw,4rem)] font-medium leading-[1.2]"
          >
            <span className="block text-[#E0A94C]">Their Imagination.</span>
            <span className="block text-primary">Their Adventure.</span>
            <span className="block text-secondary">Their Story.</span>
          </h1>

          <p className="mt-6 max-w-[539px] text-base font-medium leading-[1.38] text-white md:text-[#444] sm:text-lg">
            Create a one-of-a-kind storybook where your child becomes the main
            character in a world made just for them, fully personalised.
          </p>

          <Link
            href="#create-your-book"
            className="mt-6 inline-flex h-14 items-center justify-center rounded-2xl bg-[#e88da0] px-4 text-xl font-medium text-white shadow-[0_8px_18px_rgba(213,113,143,0.24)] transition hover:-translate-y-0.5 hover:bg-[#df7894] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#926daf] focus-visible:ring-offset-2"
          >
            Create Your Book
          </Link>
        </div>
      </div>

      <Image
        src="/images/hero_cloud.png"
        alt=""
        width={187}
        height={174}
        sizes="(max-width: 639px) 118px, (max-width: 1023px) 145px, 187px"
        className="pointer-events-none absolute bottom-[-24px] right-[-26px] z-0 h-auto w-[118px] sm:bottom-[-29px] sm:right-[-30px] sm:w-[145px] lg:bottom-[-35px] lg:right-[-20px] lg:w-[187px]"
      />
    </section>
  );
};

export default Hero;
