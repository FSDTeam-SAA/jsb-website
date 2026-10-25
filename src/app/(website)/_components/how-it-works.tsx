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
    <section id="how-it-works" aria-labelledby="how-it-works-heading" className="bg-white py-12 sm:py-16 lg:py-[49px]">
      <div className="container mx-auto px-5 sm:px-8 lg:px-0">
        <header className="text-center">
          <p className="inline-flex rounded-md bg-[#104a7d] px-2.5 py-1 text-[10px] font-medium text-white">
            How It Works
          </p>
          <h2 id="how-it-works-heading" className="mt-5 text-[clamp(2rem,3.1vw,2.25rem)] font-bold leading-none tracking-[-0.04em] text-[#0f4779]">
            Four-Step Explanation
          </h2>
        </header>

        <ol className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isFeatured = index === 0;

            return (
              <li
                key={step.title}
                className={`min-h-[164px] rounded-[10px] border px-[18px] py-[35px] shadow-[0_1px_3px_rgba(15,37,60,0.08)] ${
                  isFeatured ? "border-[#104a7d] bg-[#104a7d] text-white" : "border-black/10 bg-white text-[#111]"
                }`}
              >
                <span className={`flex size-[31px] items-center justify-center rounded-lg ${isFeatured ? "bg-[#dbeeff] text-[#104a7d]" : "bg-[#dbeeff] text-[#104a7d]"}`}>
                  <Icon aria-hidden="true" size={17} strokeWidth={3} />
                </span>
                <h3 className={`mt-3 text-lg font-bold leading-none tracking-[-0.035em] ${isFeatured ? "text-white" : "text-[#0f4779]"}`}>
                  {step.title}
                </h3>
                <p className={`mt-1 text-[10px] font-medium leading-[1.3] ${isFeatured ? "text-white" : "text-[#111]"}`}>
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
