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
    <section aria-labelledby="markets-heading" className="bg-white py-12 sm:py-16 lg:py-[77px]">
      <div className="container mx-auto px-5 sm:px-8 lg:px-0">
        <header className="text-center">
          <h2 id="markets-heading" className="mx-auto max-w-[350px] text-balance text-[clamp(2rem,3.1vw,2.25rem)] font-bold leading-[1.03] tracking-[-0.045em] text-[#0f4779]">
            Leads for the<br />Markets You Serve
          </h2>
          <p className="mx-auto mt-6 max-w-[565px] text-[10px] font-medium leading-[1.25] text-black">
            Whether you&apos;re looking for investment opportunities, mortgage prospects, distressed properties, or targeted property data, Foreclosure Gold provides multiple lead categories from one platform.
          </p>
        </header>

        <div className="mx-auto mt-4 grid max-w-[1135px] gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          {markets.map((market) => {
            const Icon = market.icon;

            return (
              <article key={market.title} className="min-h-[194px] rounded-[10px] border border-black/10 px-[13px] py-[25px] shadow-[0_1px_3px_rgba(15,37,60,0.08)]">
                <span className="flex size-[48px] items-center justify-center rounded-[14px] bg-[#dbeeff] text-[#0f4779]">
                  <Icon aria-hidden="true" size={25} strokeWidth={2.3} />
                </span>
                <h3 className="mt-[18px] text-lg font-bold leading-none tracking-[-0.035em] text-[#0f4779]">{market.title}</h3>
                <p className="mt-1 max-w-[230px] text-[10px] font-medium leading-[1.25] text-black">{market.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LeadsForTheMarket;
