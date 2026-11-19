import Link from "next/link";
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
  const lastSpace = categoryName.lastIndexOf(" ");
  const heading = lastSpace === -1 ? categoryName : categoryName.slice(0, lastSpace);
  const accent = lastSpace === -1 ? null : categoryName.slice(lastSpace + 1);


  return (
    <main>
      <section className="bg-[linear-gradient(135deg,#0a2d52_0%,#104170_60%,#1a5a9e_100%)] pb-[50px] pt-[144px] text-white">
        <div className="container mx-auto px-4 lg:px-0">
          <div className="mx-auto max-w-[1240px] lg:px-6">
            <h1 className="font-barlow text-[40px] font-extrabold uppercase leading-none sm:text-[54px] sm:leading-[54px]">
              {heading}
              {accent && <> <span className="text-[#c8870a]">{accent}</span></>}
            </h1>
            <nav aria-label="Breadcrumb" className="mt-[14px] text-[13.5px]">
              <ol className="flex flex-wrap items-center gap-2 text-white/70">
                <li><Link href="/" className="hover:underline">Home</Link></li>
                <li aria-hidden="true" className="text-white/30">›</li>
                <li><Link href="/lead-types" className="hover:underline">Lead Types</Link></li>
                <li aria-hidden="true" className="text-white/30">›</li>
                <li aria-current="page" className="text-white/60">{categoryName}</li>
              </ol>
            </nav>
          </div>
        </div>
      </section>

      <section className="bg-white py-8">
        <div className="container mx-auto px-4 lg:px-0">
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-10">
            <article className="pb-[14px]">
              {leadSections.map(({ title, paragraphs }, index) => (
                <section
                  key={title}
                  className={index === 0 ? "" : "border-t border-[#dde6f0] pt-[37px]"}
                >
                  <h2 className="text-[25px] font-bold uppercase leading-tight text-[#104170] lg:text-[30px]">
                    {title}
                  </h2>
                  <div className="mt-3 space-y-3 pb-6 text-[15px] leading-[27px] text-[#4a5f74]">
                    {paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </section>
              ))}

              <section className="border-t border-[#dde6f0] pt-[37px]">
                <h2 className="text-[25px] font-bold uppercase leading-tight text-[#104170] lg:text-[30px]">
                  Targeted Foreclosure Data Lists
                </h2>
                <p className="mt-3 text-[15px] leading-[27px] text-[#4a5f74]">
                  Our proprietary data warehouse lets you pull foreclosure
                  records filtered by:
                </p>
                <ul className="mt-1 list-disc space-y-[7px] pl-[22px] text-[14.5px] leading-[23.93px] text-[#4a5f74] marker:text-[#4a5f74]">
                  {dataFilters.map((filter) => (
                    <li key={filter}>{filter}</li>
                  ))}
                </ul>
                <p className="mt-2 text-[15px] leading-[27px] text-[#4a5f74]">
                  These lists are delivered in CSV or Excel format, ready to
                  load into your dialer or import into any system your team
                  uses, and can be scaled up or down based on your capacity.
                  Call <a href="tel:+19496301858" className="font-bold text-[#4a5f74] underline-offset-2 hover:underline">(949) 630-1858</a> today for
                  pricing and current availability in your target counties.
                </p>
              </section>
            </article>

            <aside className="space-y-5 lg:pb-5">
              <section className="rounded-[12px] bg-[#104170] px-6 py-7 text-center text-white">
                <h2 className="text-[18.7px] font-bold">Ready to Get Started?</h2>
                <p className="mt-1 text-[14px] leading-[22.4px] text-white/75">
                  Get a custom quote for your market and budget — prompt
                  response during normal business hours.
                </p>
                <Link
                  href="/sign-up"
                  className="mt-5 flex h-12 items-center justify-center rounded-[5px] bg-[#c8870a] px-4 text-[15px] font-bold text-white shadow-[0_4px_10px_rgba(232,160,32,0.35)] transition hover:bg-[#ae7307] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  Get a Free Trial Account
                </Link>
                <a
                  href="tel:+19496301858"
                  className="mt-[14px] inline-flex text-[15px] font-bold text-white/85 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  📞 (949) 630-1858
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
