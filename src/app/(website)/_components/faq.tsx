"use client";

// import Link from "next/link";
import { Minus, Plus } from "lucide-react";
import { useId, useState } from "react";

const faqs = [
  {
    question: "What is Foreclosure Gold?",
    answer:
      "Foreclosure Gold is an online marketplace where real estate investors, agents, mortgage professionals, and other businesses can search for and purchase different types of leads.",
  },
  {
    question: "What types of leads are available?",
    answer:
      "Browse foreclosure, mortgage, debt settlement, pre-foreclosure, bank-owned, and probate lead opportunities.",
  },
  {
    question: "How do I find leads?",
    answer:
      "Use the marketplace filters to narrow results by lead type, location, and property criteria.",
  },
  {
    question: "How do I purchase leads?",
    answer:
      "Choose individual leads or available lead packages, then complete your purchase through your account.",
  },
  {
    question: "What happens after purchasing a lead?",
    answer:
      "Purchased leads are added to your account, where you can view their details and download them as a CSV file.",
  },
];

const Faq = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const sectionId = useId();

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="bg-white py-8 lg:py-14"
    >
      <div className="container mx-auto px-4 lg:px-0">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.06fr] lg:gap-12">
          <header className="max-w-[500px]">
            <p className="inline-flex h-[30px] items-center rounded-[8px] bg-[#d1e4f6] px-3 text-xs font-medium text-[#104170] lg:text-sm">
              FAQS
            </p>
            <h2
              id="faq-heading"
              className="mt-6 text-balance text-xl font-bold leading-snug tracking-[-0.035em] text-[#104170] md:text-2xl lg:text-[34px]"
            >
              Common Questions About
              <br className="hidden lg:block" /> Our Coverage &amp; Services
            </h2>
            <p className="mt-5 max-w-[450px] text-[11px] font-normal leading-relaxed text-black lg:text-xs">
              We&apos;ve answered the most common questions to make choosing and
              managing your Leads.
            </p>
            {/* <Link
              href="#faq"
              className="mt-8 inline-flex h-12 items-center justify-center rounded-[8px] bg-[#104170] px-3 text-base font-bold text-white transition hover:bg-[#0b3b65] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104a7d] focus-visible:ring-offset-2"
            >
              View All FAQS
            </Link> */}
          </header>

          <div className="space-y-1">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              const panelId = `${sectionId}-panel-${index}`;
              const buttonId = `${sectionId}-button-${index}`;

              return (
                <article
                  key={faq.question}
                  className={`overflow-hidden transition-colors duration-200 ${
                    isOpen
                      ? "rounded-xl bg-[#104170] px-5 py-5 text-white shadow-sm lg:px-6 lg:py-6"
                      : "border-b border-[#104170]/15 px-2 hover:bg-[#f4f8fc]"
                  }`}
                >
                  <h3>
                    <button
                      id={buttonId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      className={`flex w-full items-center justify-between gap-4 text-left text-lg font-medium leading-tight tracking-[-0.025em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset md:text-xl lg:text-[21px] ${
                        isOpen
                          ? "text-white focus-visible:ring-white"
                          : "min-h-[58px] text-black focus-visible:ring-[#104170]"
                      }`}
                    >
                      <span>{faq.question}</span>
                      {isOpen ? (
                        <Minus aria-hidden="true" size={18} strokeWidth={2.5} />
                      ) : (
                        <Plus
                          aria-hidden="true"
                          size={18}
                          strokeWidth={2.5}
                          className="text-[#080826]"
                        />
                      )}
                    </button>
                  </h3>
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                  >
                    <div className="overflow-hidden">
                      <p className="mt-3 max-w-[560px] text-xs font-normal leading-relaxed text-white/90 lg:text-sm">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Faq;
