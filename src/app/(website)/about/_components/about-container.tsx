import Image from "next/image";
import Link from "next/link";
import { Lightbulb, Link2, Trophy } from "lucide-react";
import MarketingPageHero from "../../_components/marketing-page-hero";
import { marketingStyles as styles } from "../../_components/marketing-styles";

const pillars = [
  {
    icon: Lightbulb,
    title: "Generate",
    description:
      "Our creative team is always developing new channels and proprietary tools — from SMS platforms to advanced targeting algorithms — to generate the highest-quality real estate leads for our clients.",
  },
  {
    icon: Link2,
    title: "Connect",
    description:
      "We exist to bridge the gap between your sales team and the right customers. Let us handle the strategy and targeting while you focus on building relationships and closing deals.",
  },
  {
    icon: Trophy,
    title: "Convert",
    description:
      "Our leads consistently deliver some of the highest close ratios in the real estate industry. We're confident enough to connect you with existing clients before you commit to us.",
  },
];

const values = [
  {
    title: "Client-First Mentality",
    description:
      "Every campaign is built to serve your unique needs, not a one-size-fits-all template.",
  },
  {
    title: "Data Integrity",
    description:
      "We maintain strict quality controls on all sources. You receive only verified, compliant leads.",
  },
  {
    title: "Transparency",
    description:
      "Full call logging, recording, and reporting so you always know exactly what you're getting.",
  },
  {
    title: "Continuous Innovation",
    description:
      "We reinvest in technology and new channels so our clients always have access to the best lead sources available.",
  },
];

const SectionEyebrow = ({ children }: { children: React.ReactNode }) => (
  <p className={styles.label}>{children}</p>
);

const AboutContainer = () => {
  return (
    <main>
      <MarketingPageHero title="About Foreclosure Gold" accent="Foreclosure Gold" />

      <section className={styles.section}>
        <div className={styles.container}>
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
            <div className="pt-[6.5px]">
              <SectionEyebrow>Our Story</SectionEyebrow>
              <h2 className={`mt-3 ${styles.heading}`}>
                We Are Foreclosure Gold
              </h2>
              <p className={`mt-3 ${styles.body}`}>
                A well-known, tight-knit, and passionate lead generation company
                headquartered in 438 Main Street, Suite 220, Huntington Beach,
                CA 92648. Founded in 2008, Foreclosure Gold was built on a
                single conviction: that great leads, delivered with integrity
                and precision, change businesses.
              </p>
              <p className={`mt-3 ${styles.body}`}>
                We entered the real estate data industry with one goal in mind —
                helping our clients get the absolute most out of their marketing
                investment. Over 15 years later, that commitment drives
                everything we do. We&apos;ve grown alongside our partners, adapting
                our technology and strategies as the market evolves.
              </p>
              <div className="mt-[15px] flex flex-wrap gap-4">
                <Link
                  href="/sign-up"
                  className={styles.primaryButton}
                >
                  Get a Free Trial Account
                </Link>
                <Link
                  href="/contact-us"
                  className="inline-flex h-12 items-center justify-center rounded-[8px] border border-[#bcd8f2] bg-white px-4 text-base font-bold text-[#104170] transition hover:bg-[#f4f7fb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104170] focus-visible:ring-offset-2"
                >
                  Contact Us
                </Link>
              </div>
            </div>

            <div className="relative h-[320px] overflow-hidden rounded-[18px] border border-[#dde6f0] shadow-sm sm:h-[400px] lg:h-[460px]">
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

      <section className="bg-[#f4f8fc] py-10 lg:py-[60px]">
        <div className={styles.container}>
          <div className="mx-auto max-w-[1240px]">
            <header className="flex flex-col items-center pt-[6.5px] text-center">
              <SectionEyebrow>What Drives Us</SectionEyebrow>
              <h2 className={`mt-3 ${styles.heading}`}>
                Three Pillars of Our Approach
              </h2>
            </header>

            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {pillars.map(({ icon: Icon, title, description }) => (
                <article
                  key={title}
                  className={`flex flex-col items-start ${styles.card}`}
                >
                  <span className={styles.icon}><Icon aria-hidden="true" size={22} /></span>
                  <h3 className={`mt-4 ${styles.subheading}`}>
                    {title}
                  </h3>
                  <p className={`mt-2 ${styles.body}`}>
                    {description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f4f8fc] py-10 lg:py-[60px]">
        <div className={styles.container}>
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-10">
            <div className="pt-[6.5px]">
              <SectionEyebrow>Our Values</SectionEyebrow>
              <h2 className={`mt-3 ${styles.heading}`}>
                What We Stand For
              </h2>
              <p className={`mt-3 max-w-[580px] ${styles.body}`}>
                Every decision we make at Foreclosure Gold is guided by a core
                set of values that keep us accountable to our clients, our
                team, and the industry.
              </p>

              <div className="mt-[15px] grid gap-[22px] sm:grid-cols-2">
                {values.map(({ title, description }) => (
                  <article
                    key={title}
                    className={styles.card}
                  >
                    <div>
                      <h3 className={styles.subheading}>
                        {title}
                      </h3>
                      <p className={`mt-2 ${styles.body}`}>
                        {description}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="relative h-[320px] overflow-hidden rounded-[18px] border border-[#dde6f0] shadow-sm sm:h-[400px] lg:mt-[39px] lg:h-[460px]">
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
