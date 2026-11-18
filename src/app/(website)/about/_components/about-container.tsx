import Image from "next/image";
import Link from "next/link";

const pillars = [
  {
    icon: "💡",
    title: "Generate",
    description:
      "Our creative team is always developing new channels and proprietary tools — from SMS platforms to advanced targeting algorithms — to generate the highest-quality real estate leads for our clients.",
  },
  {
    icon: "🔗",
    title: "Connect",
    description:
      "We exist to bridge the gap between your sales team and the right customers. Let us handle the strategy and targeting while you focus on building relationships and closing deals.",
  },
  {
    icon: "🏆",
    title: "Convert",
    description:
      "Our leads consistently deliver some of the highest close ratios in the real estate industry. We're confident enough to connect you with existing clients before you commit to us.",
  },
];

const values = [
  {
    number: "01",
    title: "Client-First Mentality",
    description:
      "Every campaign is built to serve your unique needs, not a one-size-fits-all template.",
    height: "lg:h-[155px]",
  },
  {
    number: "02",
    title: "Data Integrity",
    description:
      "We maintain strict quality controls on all sources. You receive only verified, compliant leads.",
    height: "lg:h-[155px]",
  },
  {
    number: "03",
    title: "Transparency",
    description:
      "Full call logging, recording, and reporting so you always know exactly what you're getting.",
    height: "lg:h-[177px]",
  },
  {
    number: "04",
    title: "Continuous Innovation",
    description:
      "We reinvest in technology and new channels so our clients always have access to the best lead sources available.",
    height: "lg:h-[177px]",
  },
];

const SectionEyebrow = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-2">
    <span aria-hidden="true" className="h-[3px] w-[26px] rounded-[2px] bg-[#c8870a]" />
    <p className="text-[11.5px] font-bold uppercase tracking-[2px] text-[#104170]">
      {children}
    </p>
  </div>
);

const AboutContainer = () => {
  return (
    <main>
      <section className="bg-[linear-gradient(135deg,#0a2d52_0%,#104170_60%,#1a5a9e_100%)] pb-[50px] pt-[144px] text-white">
        <div className="container mx-auto px-4 lg:px-0">
          <div className="mx-auto max-w-[1240px] lg:px-6">
            <h1 className="font-barlow text-[40px] font-extrabold uppercase leading-none sm:text-[54px] sm:leading-[54px]">
              About <span className="text-[#c8870a]">Foreclosure Gold</span>
            </h1>
            <nav aria-label="Breadcrumb" className="mt-[14px] text-[13.5px]">
              <ol className="flex items-center gap-2 text-white/70">
                <li>Home</li>
                <li aria-hidden="true" className="text-white/30">
                  ›
                </li>
                <li aria-current="page" className="text-white/60">
                  About Us
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </section>

      <section className="bg-white py-8">
        <div className="container mx-auto px-4 lg:px-0">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
            <div className="pt-[6.5px]">
              <SectionEyebrow>Our Story</SectionEyebrow>
              <h2 className="mt-[13px] font-barlow text-[36px] font-extrabold uppercase leading-none text-[#1c2a3a] sm:text-[44px] sm:leading-[48.4px]">
                We Are <span className="text-[#104170]">Foreclosure Gold</span>
              </h2>
              <p className="mt-2.5 text-[16px] leading-[28.8px] text-[#4a5f74]">
                A well-known, tight-knit, and passionate lead generation company
                headquartered in 438 Main Street, Suite 220, Huntington Beach,
                CA 92648. Founded in 2008, Foreclosure Gold was built on a
                single conviction: that great leads, delivered with integrity
                and precision, change businesses.
              </p>
              <p className="mt-3 text-[15px] leading-[27px] text-[#4a5f74]">
                We entered the real estate data industry with one goal in mind —
                helping our clients get the absolute most out of their marketing
                investment. Over 15 years later, that commitment drives
                everything we do. We&apos;ve grown alongside our partners, adapting
                our technology and strategies as the market evolves.
              </p>
              <div className="mt-[15px] flex flex-wrap gap-4">
                <Link
                  href="/sign-up"
                  className="inline-flex h-12 items-center justify-center rounded-[8px] bg-[#104170] px-3 text-[16px] font-bold text-white transition hover:bg-[#0b355d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104170] focus-visible:ring-offset-2"
                >
                  Get a Free Trial Account
                </Link>
                <Link
                  href="/contact-us"
                  className="inline-flex h-12 items-center justify-center rounded-[5px] border-2 border-[#104170] px-[26px] text-[14px] font-bold text-[#104170] transition hover:bg-[#f4f7fb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104170] focus-visible:ring-offset-2"
                >
                  Contact Us
                </Link>
              </div>
            </div>

            <div className="relative h-[320px] overflow-hidden rounded-[12px] shadow-[0_20px_60px_rgba(16,65,112,0.18)] sm:h-[400px] lg:h-[460px]">
              <Image
                src="/images/figma/about-customers-source.jpeg"
                alt="Foreclosure Gold customers reviewing lead data"
                width={1489}
                height={704}
                className="absolute left-[-36.25%] top-0 h-full w-[172.5%] max-w-none object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f4f7fb] py-8">
        <div className="container mx-auto px-4 lg:px-0">
          <div className="max-w-[1240px] lg:px-6">
            <header className="flex flex-col items-center pt-[6.5px] text-center">
              <SectionEyebrow>What Drives Us</SectionEyebrow>
              <h2 className="mt-[13px] font-barlow text-[36px] font-extrabold uppercase leading-none text-[#1c2a3a] sm:text-[44px] sm:leading-[48.4px]">
                Three Pillars of <span className="text-[#104170]">Our Approach</span>
              </h2>
            </header>

            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {pillars.map(({ icon, title, description }) => (
                <article
                  key={title}
                  className="flex min-h-[228px] flex-col items-center rounded-[10px] border-b-4 border-[#104170] px-[22px] py-7 text-center"
                >
                  <span className="pt-0.5 text-[32px] leading-none">{icon}</span>
                  <h3 className="mt-[9px] text-[20px] font-bold uppercase text-[#104170]">
                    {title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-[22.4px] text-[#4a5f74]">
                    {description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f4f7fb] py-8">
        <div className="container mx-auto px-4 lg:px-0">
          <div className="grid items-center gap-8 lg:grid-cols-[630px_630px] lg:gap-[52px]">
            <div className="pt-[6.5px]">
              <SectionEyebrow>Our Values</SectionEyebrow>
              <h2 className="mt-[13px] font-barlow text-[36px] font-extrabold uppercase leading-none text-[#1c2a3a] sm:text-[44px] sm:leading-[48.4px]">
                What We <span className="text-[#104170]">Stand For</span>
              </h2>
              <p className="mt-3 max-w-[580px] text-[16px] leading-7 text-[#4a5f74]">
                Every decision we make at Foreclosure Gold is guided by a core
                set of values that keep us accountable to our clients, our
                team, and the industry.
              </p>

              <div className="mt-[15px] grid gap-[22px] sm:grid-cols-2">
                {values.map(({ number, title, description, height }) => (
                  <article
                    key={number}
                    className={`flex min-h-[155px] gap-4 rounded-[10px] border-l-4 border-[#c8870a] bg-white p-[22px] ${height}`}
                  >
                    <span className="font-barlow text-[38px] font-extrabold leading-[38px] text-[#104170]/15">
                      {number}
                    </span>
                    <div>
                      <h3 className="text-[15px] font-bold text-[#1c2a3a]">
                        {title}
                      </h3>
                      <p className="mt-1 text-[13.5px] leading-[21.6px] text-[#4a5f74]">
                        {description}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="relative h-[320px] overflow-hidden rounded-[12px] shadow-[0_20px_60px_rgba(16,65,112,0.18)] sm:h-[400px] lg:mt-[39px] lg:h-[460px]">
              <Image
                src="/images/figma/about-team-source.png"
                alt="Foreclosure Gold team members celebrating success"
                fill
                sizes="(max-width: 1023px) 100vw, 630px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutContainer;
