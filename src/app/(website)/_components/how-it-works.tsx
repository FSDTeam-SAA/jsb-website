import { DollarSign, Filter, LockKeyhole, UserRound, type LucideIcon } from "lucide-react";

type Step = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const steps: Step[] = [
  {
    title: "Create Your Account",
    description: "Sign up for free or choose a paid membership plan to save on every lead.",
    icon: UserRound,
  },
  {
    title: "Find Your Leads",
    description: "Choose your lead type, location, and filters.",
    icon: Filter,
  },
  {
    title: "Purchase Your Leads",
    description: "Cherry-pick individual leads or purchase leads in bulk.",
    icon: DollarSign,
  },
  {
    title: "Access Your Leads",
    description: "Unlock lead details and download your leads as a CSV file.",
    icon: LockKeyhole,
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" aria-labelledby="how-it-works-heading" className="bg-white py-8 sm:py-12 lg:py-[60px]">
      <div className="container mx-auto px-4 lg:px-0">
        <header className="text-center">
          <p className="inline-flex h-[30px] items-center rounded-[8px] bg-[#d1e4f6] px-3 text-xs font-medium text-[#104170] lg:text-sm">
            How It Works
          </p>
          <h2 id="how-it-works-heading" className="mt-6 text-2xl font-bold leading-none tracking-[-0.04em] text-[#104170] lg:text-[40px]">
            Four-Step Explanation
          </h2>
        </header>

        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isFeatured = index === 0;

            return (
              <li
                key={step.title}
                className={`group flex h-[159px] flex-col rounded-xl border p-4 shadow-[0_0_2px_rgba(0,0,0,0.25)] transition-[background-color,border-color,color,box-shadow] duration-200 ease-out hover:border-[#104170] hover:bg-[#104170] hover:text-white hover:shadow-[0_10px_24px_rgba(16,65,112,0.18)] lg:h-[220px] lg:p-6 ${
                  isFeatured ? "border-[#104170] bg-[#104170] text-white" : "border-black/10 bg-white text-[#111]"
                }`}
              >
                <span className="flex size-[42px] items-center justify-center rounded-[10px] border border-white bg-[#d1e4f6] text-[#104170] transition-colors duration-200 group-hover:border-white">
                  <Icon aria-hidden="true" size={20} strokeWidth={2.6} />
                </span>
                <h3 className={`mt-4 text-base font-bold leading-none tracking-[-0.035em] transition-colors duration-200 group-hover:text-white lg:text-xl ${isFeatured ? "text-white" : "text-[#104170]"}`}>
                  {step.title}
                </h3>
                <p className={`mt-2 text-xs font-medium leading-[1.2] transition-colors duration-200 group-hover:text-white lg:text-sm ${isFeatured ? "text-white" : "text-[#111]"}`}>
                  {step.description}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
};

export default HowItWorks;
