import { BadgeDollarSign, Building2, FileSearch, House, HouseHeart, HousePlus, type LucideIcon } from "lucide-react";
import Link from "next/link";

type LeadType = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const leadTypes: LeadType[] = [
  {
    title: "Foreclosure Leads",
    description: "Find foreclosure-related opportunities through the marketplace.",
    icon: Building2,
  },
  {
    title: "Mortgage Leads",
    description: "Explore mortgage-related lead opportunities.",
    icon: HouseHeart,
  },
  {
    title: "Debt Settlement Leads",
    description: "Find debt settlement-related opportunities.",
    icon: BadgeDollarSign,
  },
  {
    title: "Pre- Foreclosure Leads",
    description: "Access pre-foreclosure opportunities before foreclosure proceedings.",
    icon: HousePlus,
  },
  {
    title: "Bank-Owned Leads",
    description: "Explore REO and bank-owned property opportunities.",
    icon: House,
  },
  {
    title: "Probate Leads",
    description: "Access probate-related lead opportunities.",
    icon: FileSearch,
  },
];

const ExploreLeadTypes = () => {
  return (
    <section id="lead-types" aria-labelledby="lead-types-heading" className="bg-white py-8 sm:py-12 lg:py-[60px]">
      <div className="container mx-auto px-4 lg:px-0">
        <header className="text-center">
          <p className="inline-flex h-[30px] items-center rounded-[8px] bg-[#104170] px-3 text-xs font-medium text-white lg:text-sm">
            Categories
          </p>
          <h2 id="lead-types-heading" className="mt-3 text-2xl font-bold leading-none tracking-[-0.04em] text-[#104170] lg:text-[40px]">
            Explore Lead Types
          </h2>
          <p className="mx-auto mt-3 max-w-[524px] text-xs font-normal leading-[1.15] text-black lg:text-sm">
            Find the right lead opportunities for your business through multiple categories available in the Foreclosure Gold marketplace.
          </p>
        </header>

        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-12">
          {leadTypes.map((leadType) => {
            const Icon = leadType.icon;

            return (
              <article key={leadType.title} className="flex h-[220px] flex-col rounded-[18px] border border-black/10 p-4 shadow-[0_0_2px_rgba(0,0,0,0.25)] lg:h-[310px] lg:p-10">
                <span className="flex size-[38px] items-center justify-center rounded-[6px] border border-[#bcd8f2] bg-[#d1e4f6] text-[#104170] lg:size-[72px] lg:rounded-xl">
                  <Icon aria-hidden="true" size={24} strokeWidth={2.4} className="lg:scale-150" />
                </span>
                <h3 className="mt-6 text-base font-bold leading-none tracking-[-0.035em] text-[#104170] lg:text-2xl">
                  {leadType.title}
                </h3>
                <p className="mt-1 max-w-[240px] text-xs font-medium leading-[1.2] text-black lg:text-sm">
                  {leadType.description}
                </p>
                <Link
                  href="#create-your-book"
                  className="mt-auto inline-flex h-9 w-fit items-center justify-center rounded-[8px] bg-[#104170] px-3 text-sm font-bold text-white transition hover:bg-[#0b3b65] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104170] focus-visible:ring-offset-2"
                >
                  Find Leads
                </Link>
              </article>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="#lead-types"
            className="inline-flex h-9 items-center justify-center rounded-[8px] bg-[#104170] px-3 text-sm font-bold text-white transition hover:bg-[#0b3b65] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104170] focus-visible:ring-offset-2"
          >
            Explore all Leads Type
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ExploreLeadTypes;
