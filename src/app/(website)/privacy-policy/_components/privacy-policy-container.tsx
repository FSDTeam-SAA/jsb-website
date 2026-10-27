const sections = [
  [
    "1. Introduction",
    "Foreclosure Gold respects your privacy and is committed to handling your information responsibly. This Privacy Policy explains how we collect, use, protect, and store information when you create an account, manage a membership, purchase leads, or use our platform.",
  ],
  [
    "2. Information We Collect",
    "When you create a Foreclosure Gold account, we gather the information needed to provide the marketplace and manage your account, including your name, email address, account credentials, billing details, and purchase history.",
  ],
  [
    "3. How We Use Your Information",
    "Foreclosure Gold uses your information to operate and support the marketplace, manage your account, process purchases, improve customer support, and communicate important service information.",
  ],
  [
    "4. Payments & Billing Data",
    "Payment information is handled through Stripe. Foreclosure Gold does not directly store raw credit-card information. Billing and transaction records may remain associated with your account where necessary for business and financial recordkeeping.",
  ],
  [
    "5. Lead Preferences",
    "Customers may purchase Shared or Exclusive leads, subject to current availability. Exclusive availability is checked again during checkout.",
  ],
  [
    "6. Data Security",
    "Foreclosure Gold collects account and transaction information necessary to operate the platform, manage purchases, memberships, billing, and customer access.",
  ],
  [
    "7. Data Retention & Account Deletion",
    "Users may request deletion of their Foreclosure Gold account. Certain financial or business records may be retained where required.",
  ],
  [
    "8. Intellectual Property",
    "The Foreclosure Gold platform, marketplace, membership structure, policies, and related materials are protected by applicable intellectual-property laws.",
  ],
  [
    "9. Changes to This Privacy Policy",
    "We may update this Privacy Policy as the platform, marketplace, membership structure, policies, or legal requirements evolve.",
  ],
  [
    "10. Contact Us",
    "If you have questions about this Privacy Policy or how your account information is handled, contact the Foreclosure Gold support team.",
  ],
];

const PrivacyPolicyContainer = () => (
  <section className="bg-white py-10 lg:py-16">
    <div className="container mx-auto grid gap-10 px-4 lg:grid-cols-[375px_minmax(0,1fr)] lg:gap-12 lg:px-0">
      <aside className="lg:sticky lg:top-28 lg:h-fit">
        <h2 className="text-xl font-bold text-[#104170]">Contents</h2>
        <nav
          className="mt-4 border-l-2 border-[#104170] pl-3"
          aria-label="Privacy policy contents"
        >
          <ol className="space-y-4 text-xs font-medium text-[#104170] lg:text-sm">
            {sections.map(([title]) => (
              <li key={title}>
                <a href={`#privacy-${title.split(".")[0]}`}>{title}</a>
              </li>
            ))}
          </ol>
        </nav>
      </aside>
      <div className="space-y-10">
        {sections.map(([title, body]) => (
          <article
            id={`privacy-${title.split(".")[0]}`}
            key={title}
            className="scroll-mt-28"
          >
            <h2 className="text-xl font-bold text-[#104170] lg:text-2xl">
              {title}
            </h2>
            <p className="mt-4 text-sm font-medium leading-[1.35] text-[#161616] lg:text-base">
              {body}
            </p>
            {title.startsWith("2.") && (
              <ul className="mt-3 list-disc space-y-1 pl-6 text-sm font-medium leading-[1.3] text-[#161616] lg:text-base">
                <li>Contact and account information</li>
                <li>Billing and transaction records</li>
                <li>Lead-purchase preferences</li>
              </ul>
            )}
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default PrivacyPolicyContainer;
