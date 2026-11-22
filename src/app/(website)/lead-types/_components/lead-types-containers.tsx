import Link from "next/link";
import { Phone } from "lucide-react";
import MarketingPageHero from "../../_components/marketing-page-hero";
import { marketingStyles as styles } from "../../_components/marketing-styles";
import OtherLeadTypes from "./other-lead-types";

const leadSections = [
  {
    title: "What Are Foreclosure Leads?",
    paragraphs: [
      "Foreclosure leads are contacts for homeowners who have entered the formal legal foreclosure process — meaning a lender has filed action due to missed mortgage payments. These are among the most time-sensitive and motivated prospects in real estate. Homeowners in foreclosure are actively looking for solutions: a cash sale, short sale arrangement, or loan reinstatement. They need help now, and connecting with them at the right moment is everything.",
      "Foreclosure Gold provides verified, up-to-date foreclosure data sourced from public court records, county filings, and our proprietary aggregation systems. Every record is scrubbed, verified, and delivered ready to work.",
    ],
  },
  {
    title: "Internet Foreclosure Leads",
    paragraphs: [
      "Our internet foreclosure leads are generated through targeted campaigns where prospects actively search for solutions to their foreclosure situation. These are opt-in leads — the homeowner has taken direct action requesting information — resulting in far higher contact rates and conversion potential than cold lists. Internet leads are delivered in real time via email notification and available for immediate download in CSV or Excel format. Leads are shared among multiple buyers. You choose your geography and daily volume.",
    ],
  },
  {
    title: "Call Center Foreclosure Leads",
    paragraphs: [
      "Our 100+ seat Huntington Beach call center identifies, contacts, and pre-qualifies homeowners in foreclosure before transferring them directly to your team. When the call lands on your desk, the prospect already knows who you are and has agreed to speak with you — dramatically improving close rates from the very first conversation. All calls are logged and recorded with a manager review panel included.",
    ],
  },
  {
    title: "Direct Mail Foreclosure Leads",
    paragraphs: [
      "Direct mail remains one of the highest-performing channels for reaching homeowners in financial distress. We provide a full turnkey service — from pulling county records and designing your mailer to printing and mailing. Campaigns are sold on a cost-per-call basis, protecting you from underperforming response rates so you always receive your guaranteed call volume.",
    ],
  },
];

const dataFilters = [
  "State, county, city, or zip code",
  "Filing date range (recent filings vs. aged inventory)",
  "Estimated equity position",
  "Property type (SFR, multi-family, condo, etc.)",
  "Loan type and balance range",
  "Owner-occupied vs. absentee owner",
];

const LeadTypesContainer = ({
  categoryName = "Foreclosure Leads",
}: {
  categoryName?: string;
}) => {
  const accent = categoryName.slice(categoryName.lastIndexOf(" ") + 1);

  return (
    <main>
      <MarketingPageHero
        title={categoryName}
        accent={accent}
        parent={{ label: "Lead Types", href: "/lead-types" }}
      />

      <section className={styles.section}>
        <div className={styles.container}>
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-10">
            <article className="pb-[14px]">
              {leadSections.map(({ title, paragraphs }, index) => (
                <section
                  key={title}
                  className={index === 0 ? "" : "border-t border-[#dde6f0] pt-[37px]"}
                >
                  <h2 className={styles.heading}>
                    {title}
                  </h2>
                  <div className={`mt-3 space-y-3 pb-6 ${styles.body}`}>
                    {paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </section>
              ))}

              <section className="border-t border-[#dde6f0] pt-[37px]">
                <h2 className={styles.heading}>
                  Targeted Foreclosure Data Lists
                </h2>
                <p className={`mt-3 ${styles.body}`}>
                  Our proprietary data warehouse lets you pull foreclosure
                  records filtered by:
                </p>
                <ul className={`mt-3 list-disc space-y-2 pl-5 marker:text-[#104170] ${styles.body}`}>
                  {dataFilters.map((filter) => (
                    <li key={filter}>{filter}</li>
                  ))}
                </ul>
                <p className={`mt-3 ${styles.body}`}>
                  These lists are delivered in CSV or Excel format, ready to
                  load into your dialer or import into any system your team
                  uses, and can be scaled up or down based on your capacity.
                  Call <a href="tel:+19496301858" className="font-bold text-[#4a5f74] underline-offset-2 hover:underline">(949) 630-1858</a> today for
                  pricing and current availability in your target counties.
                </p>
              </section>
            </article>

            <aside className="space-y-5 lg:pb-5">
              <section className={`text-center ${styles.card}`}>
                <h2 className={styles.subheading}>Ready to Get Started?</h2>
                <p className={`mt-2 ${styles.body}`}>
                  Get a custom quote for your market and budget — prompt
                  response during normal business hours.
                </p>
                <Link
                  href="/sign-up"
                  className={`mt-5 w-full ${styles.primaryButton}`}
                >
                  Get a Free Trial Account
                </Link>
                <a
                  href="tel:+19496301858"
                  className="mt-4 inline-flex items-center gap-2 rounded text-sm font-bold text-[#104170] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104170]"
                >
                  <Phone aria-hidden="true" size={18} />
                  (949) 630-1858
                </a>
              </section>

              <OtherLeadTypes />
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
};

export default LeadTypesContainer;
