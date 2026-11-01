"use client";

import { CircleAlert } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSmoothScroll } from "@/components/providers/SmoothScrollProvider";

type LegalSection = {
  id: string;
  title: string;
  paragraphs: string[];
  bulletPoints?: string[];
};

type LegalPageContentsProps = {
  sections: LegalSection[];
  navigationLabel: string;
  summary?: string;
};

/**
 * Shared contents rail for the legal pages. It keeps the Figma layout while
 * making each item a useful in-page navigation control.
 */
const LegalPageContents = ({
  sections,
  navigationLabel,
  summary,
}: LegalPageContentsProps) => {
  const [activeSection, setActiveSection] = useState(sections[0]?.id ?? "");
  const { scrollTo } = useSmoothScroll();

  useEffect(() => {
    const hashTarget = window.location.hash.slice(1);
    if (sections.some(({ id }) => id === hashTarget)) {
      setActiveSection(hashTarget);
    }

    const sectionElements = sections
      .map(({ id }) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    // Intersection ratios fluctuate when two differently sized sections overlap
    // the viewport. Tracking heading positions gives the contents rail one clear,
    // stable hand-off point between items instead.
    const activationOffset = 150;
    let animationFrame: number | null = null;

    const updateActiveSection = () => {
      animationFrame = null;
      let nextActiveSection = sectionElements[0]?.id ?? "";

      for (const section of sectionElements) {
        if (section.getBoundingClientRect().top <= activationOffset) {
          nextActiveSection = section.id;
        } else {
          break;
        }
      }

      setActiveSection((current) =>
        current === nextActiveSection ? current : nextActiveSection,
      );
    };

    const onScroll = () => {
      if (animationFrame === null) {
        animationFrame = window.requestAnimationFrame(updateActiveSection);
      }
    };

    updateActiveSection();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
    };
  }, [sections]);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const section = document.getElementById(id);
    if (section) scrollTo(section);
    window.history.replaceState(null, "", `#${id}`);
  };

  const goToSection = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    scrollToSection(id);
  };

  return (
    <section className="bg-[linear-gradient(180deg,#fff_0%,#f9fcff_38%,#fff_100%)] py-10 sm:py-12 lg:py-16">
      <div className="container mx-auto grid gap-8 px-4 sm:gap-10 sm:px-6 lg:grid-cols-[375px_minmax(0,1fr)] lg:gap-12 lg:px-0">
        <aside className="hidden self-start lg:sticky lg:top-[90px] lg:block">
          <div className="rounded-2xl border border-[#dceaf7] bg-white p-4 shadow-[0_10px_30px_rgba(16,65,112,0.07)] lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
            <h2 className="text-xl font-bold leading-normal text-[#104170]">Contents</h2>
          <nav
            aria-label={navigationLabel}
            className="mt-4 hidden border-l border-[rgba(115,78,166,0.1)] pb-2 pl-px lg:block"
          >
            <ol>
              {sections.map((section, index) => {
                const isActive = activeSection === section.id;

                return (
                  <li key={section.id} className="shrink-0 lg:w-full">
                    <a
                      href={`#${section.id}`}
                      aria-current={isActive ? "location" : undefined}
                      onClick={(event) => goToSection(event, section.id)}
                      className={`relative block overflow-hidden rounded-sm px-4 py-3 text-sm font-medium leading-normal transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104170] focus-visible:ring-offset-2 lg:rounded-none lg:py-4 lg:text-base ${
                        isActive
                          ? "text-[#104170]"
                          : "text-[#161616] hover:bg-[#f7fbff] hover:text-[#104170]"
                      }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId={`legal-active-indicator-${navigationLabel}`}
                          aria-hidden="true"
                          className="absolute inset-0 -ml-px border-l-2 border-[#104170] bg-[#f7fbff]"
                          transition={{ type: "spring", stiffness: 420, damping: 36 }}
                        />
                      )}
                      <span className="relative">{index + 1}. {section.title}</span>
                    </a>
                  </li>
                );
              })}
            </ol>
          </nav>
          </div>
        </aside>

        <div className="min-w-0">
          {summary && (
            <div className="mb-10 flex items-start gap-3 rounded-xl border border-[#f4ae36] bg-[#fffaf0] px-4 py-3.5 text-sm font-medium leading-6 text-[#b66f08] shadow-[0_4px_14px_rgba(245,158,11,0.08)] sm:mb-12 sm:px-5">
              <CircleAlert aria-hidden="true" className="mt-0.5 size-[18px] shrink-0 text-[#f59e0b]" />
              <p>{summary}</p>
            </div>
          )}

          <div className="space-y-10 sm:space-y-12 lg:space-y-16">
            {sections.map((section, index) => (
              <article id={section.id} key={section.id} className="scroll-mt-24 sm:scroll-mt-28">
                <h2 className="text-[21px] font-bold leading-snug tracking-[-0.015em] text-[#104170] sm:text-2xl">
                  {index + 1}. {section.title}
                </h2>
                <div className="mt-3 space-y-3.5 text-[15px] font-medium leading-7 text-[#263442] sm:mt-4 sm:text-base sm:leading-7">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                {section.bulletPoints && (
                  <ul className="mt-4 list-disc space-y-1.5 pl-5 text-[15px] font-medium leading-7 text-[#263442] sm:pl-6 sm:text-base sm:leading-7">
                    {section.bulletPoints.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LegalPageContents;
