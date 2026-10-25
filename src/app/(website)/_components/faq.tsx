"use client";

import Link from "next/link";
import { Minus, Plus } from "lucide-react";
import { useId, useState } from "react";

const faqs = [
  {
    question: "What is Foreclosure Gold?",
    answer: "Foreclosure Gold is an online marketplace where real estate investors, agents, mortgage professionals, and other businesses can search for and purchase different types of leads.",
  },
  {
    question: "What types of leads are available?",
    answer: "Browse foreclosure, mortgage, debt settlement, pre-foreclosure, bank-owned, and probate lead opportunities.",
  },
  {
    question: "How do I find leads?",
    answer: "Use the marketplace filters to narrow results by lead type, location, and property criteria.",
  },
  {
    question: "How do I purchase leads?",
    answer: "Choose individual leads or available lead packages, then complete your purchase through your account.",
  },
  {
    question: "What happens after purchasing a lead?",
    answer: "Purchased leads are added to your account, where you can view their details and download them as a CSV file.",
  },
];

const Faq = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const sectionId = useId();

  return (
    <section id="faq" aria-labelledby="faq-heading" className="bg-white py-12 sm:py-16 lg:py-[48px]">
      <div className="container mx-auto px-5 sm:px-8 lg:px-0">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.06fr] lg:gap-16">
          <header className="max-w-[450px]">
            <p className="inline-flex rounded-md bg-[#104a7d] px-2.5 py-1 text-[10px] font-medium text-white">FAQS</p>
            <h2 id="faq-heading" className="mt-6 text-balance text-[clamp(2rem,3.2vw,2.25rem)] font-bold leading-[1.08] tracking-[-0.045em] text-[#0f4779]">
              Common Questions About<br className="hidden lg:block" /> Our Coverage &amp; Services
            </h2>
            <p className="mt-6 max-w-[415px] text-[10px] font-medium leading-[1.35] text-black">
              We&apos;ve answered the most common questions to make choosing and managing your Leads.
            </p>
            <Link
              href="#faq"
              className="mt-6 inline-flex h-9 items-center justify-center rounded-md bg-[#104a7d] px-2.5 text-xs font-bold text-white transition hover:bg-[#0b3b65] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104a7d] focus-visible:ring-offset-2"
            >
              View All FAQS
            </Link>
          </header>

          <div>
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              const panelId = `${sectionId}-panel-${index}`;
              const buttonId = `${sectionId}-button-${index}`;

              return (
                <article key={faq.question} className={isOpen ? "rounded-[10px] bg-[#104a7d] px-6 py-8 text-white sm:px-6" : "px-6 sm:px-6"}>
                  <h3>
                    <button
                      id={buttonId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      className={`flex w-full items-center justify-between gap-5 text-left text-[clamp(1.1rem,1.8vw,1.25rem)] font-medium leading-none tracking-[-0.035em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset ${
                        isOpen ? "text-white focus-visible:ring-white" : "min-h-[73px] text-black focus-visible:ring-[#104a7d]"
                      }`}
                    >
                      <span>{faq.question}</span>
                      {isOpen ? <Minus aria-hidden="true" size={20} strokeWidth={3} /> : <Plus aria-hidden="true" size={20} strokeWidth={3} className="text-[#080826]" />}
                    </button>
                  </h3>
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                  >
                    <div className="overflow-hidden">
                      <p className="mt-4 text-[10px] font-medium leading-[1.35] text-white">{faq.answer}</p>
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
