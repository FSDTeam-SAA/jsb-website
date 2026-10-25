import { Building2, Handshake, House, Landmark, type LucideIcon } from "lucide-react";

type Market = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const markets: Market[] = [
  {
    title: "Real Estate Investors",
    description: "Find foreclosure, pre-foreclosure, probate, tax lien, and distressed property leads.",
    icon: Landmark,
  },
  {
    title: "Real Estate Agent",
    description: "Discover property and homeowner leads in your target markets.",
    icon: House,
  },
  {
    title: "Professionals",
    description: "Access mortgage-related prospects and targeted lead data.",
    icon: Handshake,
  },
  {
    title: "Financial Businesses",
    description: "Build targeted prospect lists around specific markets and lead categories.",
    icon: Building2,
  },
];

const LeadsForTheMarket = () => {
  return (
    <section aria-labelledby="markets-heading" className="bg-white py-8 sm:py-12 lg:py-[60px]">
      <div className="container mx-auto px-4 lg:px-0">
        <header className="text-center">
          <h2 id="markets-heading" className="mx-auto max-w-[420px] text-balance text-2xl font-bold leading-[1.03] tracking-[-0.045em] text-[#104170] lg:text-[40px]">
            Leads for the<br />Markets You Serve
          </h2>
          <p className="mx-auto mt-6 max-w-[700px] text-xs font-normal leading-[1.2] text-black lg:text-sm">
            Whether you&apos;re looking for investment opportunities, mortgage prospects, distressed properties, or targeted property data, Foreclosure Gold provides multiple lead categories from one platform.
          </p>
        </header>

        <div className="mx-auto mt-6 grid max-w-[1280px] gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {markets.map((market) => {
            const Icon = market.icon;

            return (
              <article key={market.title} className="flex min-h-[194px] flex-col gap-[18px] rounded-xl border border-black/10 px-4 py-6 shadow-[0_0_2px_rgba(0,0,0,0.25)] lg:min-h-[270px] lg:gap-7 lg:p-8">
                <span className="flex size-[42px] items-center justify-center rounded-[10px] bg-[#d1e4f6] text-[#104170] lg:size-[60px]">
                  <Icon aria-hidden="true" size={22} strokeWidth={2.3} className="lg:scale-125" />
                </span>
                <div>
                  <h3 className="text-base font-bold leading-none tracking-[-0.035em] text-[#104170] lg:text-xl">{market.title}</h3>
                  <p className="mt-2 max-w-[260px] text-xs font-medium leading-[1.2] text-black lg:text-sm">{market.description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LeadsForTheMarket;
