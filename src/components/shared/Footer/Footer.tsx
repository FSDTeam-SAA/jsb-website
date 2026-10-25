import Link from "next/link";

type FooterGroup = {
  title: string;
  links: string[];
  href?: string;
  hrefs?: string[];
};

const footerGroups: FooterGroup[] = [
  {
    title: "Lead Types",
    links: ["Probate Leads", "Debt Settlement", "REO / Bank-Owned", "Tax Lien Leads", "Bankruptcy Leads", "Mortgage Leads", "Pre-Foreclosure", "Foreclosure Leads"],
    href: "#lead-types",
  },
  {
    title: "Company",
    links: ["Home", "How It Works", "Pricing", "FAQ"],
    hrefs: ["/", "#how-it-works", "#pricing", "#faq"],
  },
  {
    title: "Account",
    links: ["Login", "Create Free Account"],
    hrefs: ["#account", "#create-your-book"],
  },
];

const BrandLogo = () => (
  <svg aria-hidden="true" viewBox="0 0 158 42" className="h-auto w-[205px]" fill="none">
    <path d="M2 25.5 22.5 8 31.5 14.5 45.5 2l12.5 10.5v13H51V16L45.5 11 33 22v12h-7v-12L22.5 19 9 30.5v8H2v-13Z" fill="#104A7D" />
    <text x="64" y="22" fill="#104A7D" fontSize="12" fontWeight="800" fontFamily="Arial, sans-serif">FORECLOSURE GOLD</text>
    <text x="64" y="31" fill="#104A7D" fontSize="4.7" fontWeight="700" fontFamily="Arial, sans-serif" letterSpacing=".25">PREMIUM LEAD SOLUTIONS</text>
  </svg>
);

const Footer = () => {
  return (
    <footer className="bg-white text-black">
      <div className="container mx-auto px-5 py-12 sm:px-8 sm:py-16 lg:min-h-[327px] lg:px-12 lg:pb-[22px] lg:pt-[99px]">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[267px_163px_140px_169px_1fr] lg:gap-0">
          <section className="max-w-[230px]">
            <Link href="/" aria-label="Foreclosure Gold home" className="inline-flex rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104a7d] focus-visible:ring-offset-2">
              <BrandLogo />
            </Link>
            <p className="mt-2 text-xs font-medium leading-none text-black">Online marketplace for real estate leads.</p>
          </section>

          {footerGroups.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h2 className="text-lg font-medium leading-none tracking-[-0.035em] text-[#0f4779]">{group.title}</h2>
              <ul className="mt-3 space-y-3">
                {group.links.map((link, index) => (
                  <li key={link}>
                    <Link
                      href={group.hrefs?.[index] ?? group.href ?? "#lead-types"}
                      className="text-xs font-medium leading-none text-black transition hover:text-[#0f4779] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104a7d] focus-visible:ring-offset-2"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <section className="lg:pl-0">
            <h2 className="max-w-[245px] text-[clamp(1.9rem,3vw,2rem)] font-bold leading-[1.1] tracking-[-0.045em] text-[#0f4779]">
              Ready to find<br />your next lead?
            </h2>
            <Link
              href="#create-your-book"
              className="mt-6 inline-flex h-9 items-center justify-center rounded-md bg-[#06b983] px-2.5 text-xs font-bold text-white transition hover:bg-[#059d70] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104a7d] focus-visible:ring-offset-2"
            >
              Create Free Account
            </Link>
          </section>
        </div>
      </div>

      <div className="bg-[#104a7d] text-white">
        <div className="container mx-auto flex min-h-7 flex-col justify-center gap-2 px-5 py-2 text-[11px] font-medium sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-0 lg:px-12">
          <p>© 2026 Foreclosure Gold. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <Link href="/privacy-policy" className="transition hover:text-white/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">Privacy Policy</Link>
            <span aria-hidden="true">|</span>
            <Link href="/terms-and-conditions" className="transition hover:text-white/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">Terms &amp; Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
