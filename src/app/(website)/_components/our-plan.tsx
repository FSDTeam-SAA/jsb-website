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
    <section id="pricing" aria-labelledby="pricing-heading" className="bg-white py-8 sm:py-12 lg:py-[60px]">
      <div className="container mx-auto px-4 lg:px-0">
        <header className="text-center">
          <p className="inline-flex h-[30px] items-center rounded-[8px] bg-[#104170] px-3 text-xs font-medium text-white lg:text-sm">
            Our Plan
          </p>
          <h2 id="pricing-heading" className="mt-6 text-xl font-bold leading-none tracking-[-0.04em] text-[#104170] lg:text-[40px]">
            Membership Plans
          </h2>
        </header>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {plans.map((plan) => (
            <article key={plan.name} className="mx-auto flex h-[397px] w-[310px] flex-col rounded-xl border border-[#949494] p-6 text-center lg:w-full">
              <h3 className="text-2xl font-bold leading-none text-[#151515]">{plan.name}</h3>
              <p className="mx-auto mt-1.5 max-w-[230px] min-h-[34px] text-sm font-bold leading-[1.2] text-[#151515]">
                {plan.description}
              </p>

              <p className="mt-8 flex items-baseline justify-center font-bold leading-none text-black">
                <span className="mr-0.5 text-2xl">$</span>
                <span className="text-5xl tracking-[-0.045em]">{plan.price}</span>
                <span className="ml-1 text-sm">/month</span>
              </p>

              <div className="mt-8 rounded-xl bg-[#f4f8ff] py-3 text-[#104170]">
                <p className="text-2xl font-bold leading-none">{plan.discount}</p>
                <p className="mt-1.5 text-sm font-bold">Lead Discount</p>
              </div>

              <Link
                href="#create-your-book"
                className="mt-auto inline-flex h-[38px] w-[166px] items-center justify-center self-center rounded-[8px] bg-[#104170] px-3 text-sm font-bold text-white transition hover:bg-[#0b3b65] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104170] focus-visible:ring-offset-2"
              >
                {plan.action}
              </Link>
            </article>
          ))}
        </div>

        <p className="mx-auto mt-8 max-w-[390px] text-center text-sm text-[#111] lg:max-w-none">
          All memberships are <strong>month-to-month.</strong> Customers can cancel at any time
        </p>
      </div>
    </section>
  );
};

export default OurPlan;
