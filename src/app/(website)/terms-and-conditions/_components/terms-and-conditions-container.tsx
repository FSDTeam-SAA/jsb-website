const sections = [
  [
    "1. Platform Use & Account Responsibility",
    "By using Foreclosure Gold, you agree to use the platform for its intended purpose and maintain responsibility for activity performed through your account. Access to certain marketplace features may require a verified account and an active membership where applicable.",
  ],
  [
    "2. Membership & Subscription Terms",
    "Foreclosure Gold offers Free, Silver, Gold, and Diamond membership options. Paid plans are billed monthly, and customers may upgrade, downgrade, or cancel their membership. After cancellation, the paid plan remains active through the current billing period before converting to Free.",
  ],
  [
    "3. Lead Purchase Rules",
    "Customers may purchase leads individually or in bulk, depending on available inventory.",
  ],
  [
    "4. Credits & Purchase Issues",
    "Foreclosure Gold provides a specific process for qualifying lead and billing issues. Bad leads or credit requests may be submitted within 7 days of purchase, and approved claims are returned as Foreclosure Gold Account Credit.",
  ],
  [
    "5. Lead Availability & Access",
    "Lead availability, pricing, and available information may vary by category and current inventory. Certain identifying details remain hidden before purchase and become accessible after a successful transaction.",
  ],
];

const TermsAndConditionsContainer = () => (
  <section className="bg-white py-10 lg:py-16">
    <div className="container mx-auto grid gap-10 px-4 lg:grid-cols-[375px_minmax(0,1fr)] lg:gap-12 lg:px-0">
      <aside className="lg:sticky lg:top-28 lg:h-fit">
        <h2 className="text-xl font-bold text-[#104170]">Contents</h2>
        <nav
          className="mt-4 border-l-2 border-[#104170] pl-3"
          aria-label="Terms contents"
        >
          <ol className="space-y-4 text-xs font-medium text-[#104170] lg:text-sm">
            {sections.map(([title]) => (
              <li key={title}>
                <a href={`#terms-${title[0]}`}>{title}</a>
              </li>
            ))}
          </ol>
        </nav>
      </aside>
      <div>
        <p className="mb-8 rounded-[4px] border border-[#f4ae36] bg-[#fff7e7] px-4 py-3 text-xs leading-[1.25] text-[#c47c0b] lg:text-sm">
          Summary: By using Foreclosure Gold, you agree to use the platform
          responsibly, keep your account credentials secure, and understand that
          lead data may vary in accuracy, completeness, and availability. Your
          account and payment information are handled securely, with payments
          processed through Stripe.
        </p>
        <div className="space-y-10">
          {sections.map(([title, body]) => (
            <article
              id={`terms-${title[0]}`}
              key={title}
              className="scroll-mt-28"
            >
              <h2 className="text-xl font-bold text-[#104170] lg:text-2xl">
                {title}
              </h2>
              <p className="mt-4 text-sm font-medium leading-[1.35] text-[#161616] lg:text-base">
                {body}
              </p>
              {title.startsWith("3.") && (
                <ul className="mt-3 list-disc space-y-1 pl-6 text-sm font-medium leading-[1.3] text-[#161616] lg:text-base">
                  <li>
                    Shared leads may be purchased by multiple customers until
                    the configured availability limit is reached.
                  </li>
                  <li>
                    Exclusive purchases prevent future customers from purchasing
                    that lead.
                  </li>
                </ul>
              )}
              {title.startsWith("4.") && (
                <ul className="mt-3 list-disc space-y-1 pl-6 text-sm font-medium leading-[1.3] text-[#161616] lg:text-base">
                  <li>
                    Legitimate billing issues such as duplicate charges or
                    payment errors may be handled separately through a Stripe
                    refund.
                  </li>
                </ul>
              )}
            </article>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default TermsAndConditionsContainer;
