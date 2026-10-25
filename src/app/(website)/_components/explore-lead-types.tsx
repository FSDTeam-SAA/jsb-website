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
    <section id="lead-types" aria-labelledby="lead-types-heading" className="bg-white py-12 sm:py-16 lg:py-5">
      <div className="container mx-auto px-5 sm:px-8 lg:px-0">
        <header className="text-center">
          <p className="inline-flex rounded-md bg-[#104a7d] px-2.5 py-1 text-[10px] font-medium text-white">
            Categories
          </p>
          <h2 id="lead-types-heading" className="mt-4 text-[clamp(2rem,3.1vw,2.25rem)] font-bold leading-none tracking-[-0.04em] text-[#0f4779]">
            Explore Lead Types
          </h2>
          <p className="mx-auto mt-3 max-w-[410px] text-[10px] font-medium leading-[1.25] text-black">
            Find the right lead opportunities for your business through multiple categories available in the Foreclosure Gold marketplace.
          </p>
        </header>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
          {leadTypes.map((leadType) => {
            const Icon = leadType.icon;

            return (
              <article key={leadType.title} className="flex min-h-[232px] flex-col rounded-xl border border-black/10 px-[30px] py-[30px] shadow-[0_1px_3px_rgba(15,37,60,0.08)]">
                <span className="flex size-[54px] items-center justify-center rounded-[9px] bg-[#dbeeff] text-[#0f4779]">
                  <Icon aria-hidden="true" size={26} strokeWidth={2.4} />
                </span>
                <h3 className="mt-[22px] text-lg font-bold leading-none tracking-[-0.035em] text-[#0f4779]">
                  {leadType.title}
                </h3>
                <p className="mt-1 max-w-[240px] text-[10px] font-medium leading-[1.3] text-black">
                  {leadType.description}
                </p>
                <Link
                  href="#create-your-book"
                  className="mt-auto inline-flex h-7 w-fit items-center justify-center rounded-md bg-[#104a7d] px-3 text-[10px] font-bold text-white transition hover:bg-[#0b3b65] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104a7d] focus-visible:ring-offset-2"
                >
                  Find Leads
                </Link>
              </article>
            );
          })}
        </div>

        <div className="mt-7 text-center">
          <Link
            href="#lead-types"
            className="inline-flex h-7 items-center justify-center rounded-md bg-[#104a7d] px-3 text-[10px] font-bold text-white transition hover:bg-[#0b3b65] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104a7d] focus-visible:ring-offset-2"
          >
            Explore all Leads Type
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ExploreLeadTypes;
