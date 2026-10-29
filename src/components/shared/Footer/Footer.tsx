import Link from "next/link";
import Image from "next/image";

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
    hrefs: ["/login", "/sign-up"],
  },
];

const Footer = () => {
  return (
    <footer className="bg-white text-black">
      <div className="container mx-auto px-4 pt-9 pb-8 lg:min-h-[318px] lg:px-0 lg:pb-0 lg:pt-10">
        <div className="grid grid-cols-3 gap-x-4 gap-y-6 lg:flex lg:items-start lg:justify-between lg:gap-0">
          <section className="col-span-3 max-w-none lg:col-span-1 lg:max-w-[230px]">
            <Link href="/" aria-label="Foreclosure Gold home" className="inline-flex rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104a7d] focus-visible:ring-offset-2">
              <Image src="/images/footer_logo.png" alt="Foreclosure Gold" width={1092} height={280} className="h-auto w-[273px] lg:w-[228px]" />
            </Link>
            <p className="mt-4 text-base font-medium leading-none text-black lg:mt-2 lg:text-xs">Online marketplace for real estate leads.</p>
          </section>

          {footerGroups.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h2 className="text-base font-bold leading-none tracking-[-0.035em] text-[#104170] lg:text-xl lg:font-medium">{group.title}</h2>
              <ul className="mt-3 space-y-3">
                {group.links.map((link, index) => (
                  <li key={link} className="leading-none">
                    <Link
                      href={group.hrefs?.[index] ?? group.href ?? "#lead-types"}
                      className="text-xs font-medium leading-none text-black transition hover:text-[#104170] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104a7d] focus-visible:ring-offset-2"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <section className="col-span-3 pt-2 text-center lg:col-span-1 lg:pt-0 lg:text-left">
            <h2 className="text-2xl font-bold leading-[1.1] tracking-[-0.045em] text-[#104170] lg:max-w-[245px] lg:text-[32px]">
              Ready to find<span className="hidden lg:inline"><br /></span><span className="lg:hidden"> </span>your next lead?
            </h2>
            <Link
              href="/sign-up"
              className="mt-6 inline-flex h-12 items-center justify-center rounded-[8px] bg-[linear-gradient(270deg,#05976a_0%,#0eb57e_100%)] px-3 text-base font-bold text-white transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104a7d] focus-visible:ring-offset-2 lg:mt-8 lg:h-10 lg:px-4 lg:text-xs"
            >
              Create Free Account
            </Link>
          </section>
        </div>
      </div>

      <div className=" bg-[#104a7d] text-white ">
        <div className="container mx-auto flex flex-col items-center justify-center gap-4 px-16 py-3 text-sm font-medium sm:flex-row sm:justify-center lg:min-h-[35px] lg:px-0 lg:py-0 lg:text-[11px]">
          <p className="whitespace-nowrap text-center text-[15px]">© 2026 Foreclosure Gold. All rights reserved.</p>
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
