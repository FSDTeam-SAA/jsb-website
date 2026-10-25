import Link from "next/link";

const plans = [
  {
    name: "Free",
    description: "Get started and explore the marketplace.",
    price: "0",
    discount: "0%",
    action: "Create Account",
  },
  {
    name: "Silver",
    description: "Save more on every lead with a Silver membership.",
    price: "49",
    discount: "5%",
    action: "Chose Plan",
  },
  {
    name: "Gold",
    description: "Get a higher discount with a Gold membership.",
    price: "99",
    discount: "10%",
    action: "Chose Plan",
  },
  {
    name: "Diamond",
    description: "Get the highest discount with a Diamond membership.",
    price: "149",
    discount: "15%",
    action: "Chose Plan",
  },
];

const OurPlan = () => {
  return (
    <section id="pricing" aria-labelledby="pricing-heading" className="bg-white py-10 sm:py-14 lg:py-[37px]">
      <div className="container mx-auto px-5 sm:px-8 lg:px-0">
        <header className="text-center">
          <p className="inline-flex rounded-md bg-[#104a7d] px-2.5 py-1 text-[10px] font-medium text-white">
            Our Plan
          </p>
          <h2 id="pricing-heading" className="mt-5 text-[clamp(2rem,3.1vw,2.25rem)] font-bold leading-none tracking-[-0.04em] text-[#0f4779]">
            Membership Plans
          </h2>
        </header>

        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-[17px]">
          {plans.map((plan) => (
            <article key={plan.name} className="flex min-h-[295px] flex-col rounded-[9px] border border-black/25 px-4 py-[19px] text-center">
              <h3 className="text-xl font-bold leading-none text-[#111]">{plan.name}</h3>
              <p className="mx-auto mt-1.5 max-w-[190px] min-h-[32px] text-[10px] font-bold leading-[1.35] text-[#111]">
                {plan.description}
              </p>

              <p className="mt-6 flex items-baseline justify-center font-bold leading-none text-black">
                <span className="mr-0.5 text-base">$</span>
                <span className="text-[34px] tracking-[-0.045em]">{plan.price}</span>
                <span className="ml-1 text-[10px]">/month</span>
              </p>

              <div className="mt-8 rounded-[10px] bg-[#f1f5fd] py-2.5 text-[#0f4779]">
                <p className="text-lg font-bold leading-none">{plan.discount}</p>
                <p className="mt-1.5 text-[10px] font-bold">Lead Discount</p>
              </div>

              <Link
                href="#create-your-book"
                className="mt-6 inline-flex h-7 items-center justify-center self-center rounded-md bg-[#104a7d] px-6 text-[10px] font-bold text-white transition hover:bg-[#0b3b65] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104a7d] focus-visible:ring-offset-2"
              >
                {plan.action}
              </Link>
            </article>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-[#111]">
          All memberships are <strong>month-to-month.</strong> Customers can cancel at any time
        </p>
      </div>
    </section>
  );
};

export default OurPlan;
