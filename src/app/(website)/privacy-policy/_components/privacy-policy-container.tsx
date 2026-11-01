import LegalPageContents from "../../_components/legal-page-contents";

const sections = [
  {
    id: "privacy-introduction",
    title: "Introduction",
    paragraphs: [
      "Foreclosure Gold respects your privacy and is committed to handling your information responsibly.",
      "This Privacy Policy explains how information may be collected and used when you create an account, manage a membership, purchase real estate leads, save searches, or otherwise use the Foreclosure Gold platform. By using Foreclosure Gold, you acknowledge the privacy practices described in this policy.",
    ],
  },
  {
    id: "privacy-information",
    title: "Information We Collect",
    paragraphs: [
      "When you create a Foreclosure Gold account, the platform may collect information necessary to create and manage your account. This includes:",
    ],
    bulletPoints: [
      "First name",
      "Last name",
      "Email address",
      "Phone number",
      "Password",
      "Email verification status",
      "Selected membership",
      "Lead interests",
      "States or counties of interest",
    ],
  },
  {
    id: "privacy-use",
    title: "How We Use Your Information",
    paragraphs: [
      "Foreclosure Gold may use account information to operate and support the customer experience. This may include:",
      "The platform is designed around helping customers find, purchase, and access real estate leads efficiently.",
    ],
    bulletPoints: [
      "Creating and maintaining your account",
      "Verifying your email address",
      "Managing your membership",
      "Processing lead purchases",
      "Maintaining order history",
      "Managing account credits",
      "Providing access to purchased leads",
      "Saving marketplace searches",
      "Sending relevant account notifications",
      "Sending daily alerts for new leads matching Saved Searches",
    ],
  },
  {
    id: "privacy-payments",
    title: "Payments & Billing Data",
    paragraphs: [
      "Foreclosure Gold uses Stripe for paid memberships and lead purchases. Payment-related functionality may include:",
    ],
    bulletPoints: [
      "Membership subscriptions",
      "Lead purchases",
      "Saved payment methods",
      "Account funding",
      "Promo or coupon codes",
      "Receipts and invoices",
      "Payment refunds where appropriate",
      "Foreclosure Gold does not directly store raw credit-card information. Payment-card processing is handled through Stripe.",
      "Billing and transaction records may remain associated with your account where necessary for business and financial recordkeeping.",
    ],
  },
  {
    id: "privacy-preferences",
    title: "Lead Preferences",
    paragraphs: [
      "Customers may purchase Shared or Exclusive leads, subject to current availability.",
      "Shared leads may be sold to multiple customers. Exclusive purchases prevent future customers from purchasing that lead, although a lead may have been sold previously as a Shared lead.",
      "Exclusive availability is checked again during checkout. If an Exclusive lead is no longer available, it may be removed from the order before completion.",
    ],
  },
  {
    id: "privacy-security",
    title: "Data Security",
    paragraphs: [
      "Foreclosure Gold collects account and transaction information necessary to operate the platform, manage purchases, memberships, billing, and customer access. Payment processing is handled through Stripe. Foreclosure Gold does not directly store raw credit-card information.",
      "Users may request account deletion. Account deletion requests are reviewed rather than processed as immediate deletion, and certain financial or business records may be retained where required.",
      "Additional information regarding the collection, processing, storage, and use of personal information is explained in this Privacy Policy.",
    ],
  },
  {
    id: "privacy-retention",
    title: "Data Retention & Account Deletion",
    paragraphs: [
      "Users may request deletion of their Foreclosure Gold account. Account deletion is not intended to immediately erase every record associated with the account.",
      "Canceling a paid membership is different from deleting an account. Membership cancellation does not automatically delete the customer account.",
    ],
    bulletPoints: [
      "Financial records",
      "Transaction history",
      "Order records",
      "Business records required for operational or recordkeeping purposes",
    ],
  },
  {
    id: "privacy-property",
    title: "Intellectual Property",
    paragraphs: [
      "The Foreclosure Gold platform, marketplace, membership structure, policies, and related materials are protected by applicable intellectual-property laws.",
    ],
  },
  {
    id: "privacy-changes",
    title: "Changes to This Privacy Policy",
    paragraphs: [
      "We may update this Privacy Policy as the platform, marketplace, membership structure, policies, or legal requirements evolve.",
      "Updated terms are made available through the website or customer account. Continued use of Foreclosure Gold after revised terms become effective may constitute acceptance of those updated terms, subject to applicable law.",
    ],
    bulletPoints: [
      "Membership rules",
      "Marketplace functionality",
      "Lead purchasing policies",
      "Credits and refunds",
      "Account management",
      "Privacy practices",
      "Platform features",
    ],
  },
  {
    id: "privacy-contact",
    title: "Contact Us",
    paragraphs: [
      "If you have questions about this Privacy Policy or how your account information is handled, contact the Foreclosure Gold support team.",
      "Support may assist with questions related to:",
    ],
    bulletPoints: [
      "Personal account information",
      "Billing",
      "Memberships",
      "Account access",
      "Saved searches",
      "Privacy-related requests",
    ],
  },
];

const PrivacyPolicyContainer = () => (
  <LegalPageContents
    sections={sections}
    navigationLabel="Privacy policy contents"
    summary="Summary: By using Foreclosure Gold, you agree to use the platform responsibly, keep your account credentials secure, and understand that lead data may vary in accuracy, completeness, and availability. Your account and payment information are handled securely, with payments processed through Stripe."
  />
);

export default PrivacyPolicyContainer;
