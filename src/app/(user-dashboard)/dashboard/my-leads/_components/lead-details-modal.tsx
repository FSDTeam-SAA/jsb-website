"use client";

import { Home, Mail, MapPin, Phone, X } from "lucide-react";

import type { PurchasedLead } from "@/lib/purchased-leads-api";

type LeadDetailsModalProps = {
  lead: PurchasedLead | null;
  open: boolean;
  onClose: () => void;
  onRequestReview: () => void;
};

const formatCurrency = (amount: number | null) =>
  amount === null
    ? "—"
    : new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(amount);

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));

const formatPriceType = (priceType: string) =>
  priceType.charAt(0) + priceType.slice(1).toLowerCase();

const LeadDetailsModal = ({
  lead: purchasedLead,
  open,
  onClose,
  onRequestReview,
}: LeadDetailsModalProps) => {
  if (!open || !purchasedLead) return null;

  const { lead } = purchasedLead;
  const contactName = [lead.firstName, lead.lastName].filter(Boolean).join(" ");
  const location = [lead.city, lead.state, lead.zipcode].filter(Boolean).join(", ");
  const address = [lead.propertyAddress, lead.unitNumber].filter(Boolean).join(", ");
  const isExclusive = purchasedLead.priceType === "EXCLUSIVE";

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4 sm:p-6"
      onClick={onClose}
    >
      <section
        data-lenis-prevent
        role="dialog"
        aria-modal="true"
        aria-labelledby="lead-details-title"
        className="flex max-h-[calc(100dvh-2rem)] w-full max-w-[700px] flex-col overflow-hidden rounded-xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="z-10 flex shrink-0 items-center justify-between border-b border-[#edf1f5] bg-white px-5 py-4">
          <div>
            <p className="text-xs font-medium text-[#667085]">Purchased lead</p>
            <h2 id="lead-details-title" className="mt-0.5 text-base font-bold text-[#17212e]">
              Lead details
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close lead details"
            className="grid size-8 place-items-center rounded-full text-[#667085] transition hover:bg-[#f2f4f7]"
          >
            <X size={18} />
          </button>
        </div>

        <div
          data-lenis-prevent
          className="dashboard-summary-scroll min-h-0 flex-1 overflow-y-auto p-5"
        >
          <div
            className="relative min-h-[170px] overflow-hidden rounded-xl bg-[#173b5c] bg-cover bg-center p-5 text-white"
            style={
              lead.propertyImage
                ? {
                    backgroundImage:
                      "linear-gradient(90deg, rgba(12, 38, 64, 0.92), rgba(12, 38, 64, 0.45)), url(" +
                      lead.propertyImage +
                      ")",
                  }
                : undefined
            }
          >
            <div className="relative flex h-full min-h-[130px] flex-col justify-between">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold backdrop-blur-sm">
                  {lead.category.name}
                </span>
                <span
                  className={
                    isExclusive
                      ? "rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700"
                      : "rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-[#087ce7]"
                  }
                >
                  {formatPriceType(purchasedLead.priceType)} lead
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold">{address || "Property address unavailable"}</h3>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-100">
                  <MapPin size={15} /> {location || "Location unavailable"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <SummaryCard label="Lead ID" value={"FG-LD-" + lead.leadNumber} />
            <SummaryCard label="Price paid" value={formatCurrency(purchasedLead.pricePaid)} />
            <SummaryCard label="Purchased" value={formatDate(purchasedLead.purchasedAt)} />
          </div>

          <DetailsSection title="CONTACT INFORMATION">
            <InfoRow icon={MapPin} label="Contact" value={contactName || "Not available"} />
            <InfoRow
              icon={Phone}
              label="Phone"
              value={lead.phoneNumbers[0] || "Not available"}
            />
            <InfoRow
              icon={Mail}
              label="Email"
              value={lead.emailAddresses[0] || "Not available"}
            />
          </DetailsSection>

          <DetailsSection title="PROPERTY INFORMATION">
            <InfoRow icon={Home} label="Property type" value={lead.propertyType || "—"} />
            <KeyValue label="Estimated value" value={formatCurrency(lead.estValue)} />
            <KeyValue label="Estimated equity" value={formatCurrency(lead.estEquity)} />
            <KeyValue label="Mortgage" value={lead.mortgageInformation || "—"} />
          </DetailsSection>

          <DetailsSection title="LEAD INFORMATION">
            <KeyValue label="Lead type" value={lead.category.name} />
            <KeyValue label="Stage" value={lead.stage || "—"} />
            <KeyValue label="Source" value={lead.source || "—"} />
          </DetailsSection>

          <DetailsSection title="PURCHASE INFORMATION">
            <KeyValue label="Purchased date" value={formatDate(purchasedLead.purchasedAt)} />
            <KeyValue
              label="Access"
              value={formatPriceType(purchasedLead.priceType)}
              accent
            />
            <KeyValue label="Price paid" value={formatCurrency(purchasedLead.pricePaid)} />
            <KeyValue label="Order reference" value={purchasedLead.orderId} compact />
          </DetailsSection>

          <button
            type="button"
            onClick={onRequestReview}
            className="mt-5 h-10 w-full rounded-lg border border-[#104170] text-sm font-semibold text-[#104170] transition hover:bg-[#f0f7ff]"
          >
            Request lead review
          </button>
          <p className="mt-2 text-center text-xs text-[#667085]">
            Need help with this lead? Send a review request to our support team.
          </p>
        </div>
      </section>
    </div>
  );
};

const SummaryCard = ({ label, value }: { label: string; value: string }) => (
  <article className="rounded-lg border border-[#e8eef6] bg-[#fbfdff] px-3 py-3">
    <p className="text-xs text-[#667085]">{label}</p>
    <p className="mt-1 text-sm font-bold text-[#17212e]">{value}</p>
  </article>
);

const DetailsSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section className="border-b border-[#edf1f5] py-4 text-sm">
    <h4 className="mb-3 text-xs font-bold tracking-wide text-[#344054]">{title}</h4>
    <div className="space-y-2.5">{children}</div>
  </section>
);

const InfoRow = ({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Home;
  label: string;
  value: string;
}) => (
  <p className="flex items-center justify-between gap-4">
    <span className="flex items-center gap-2 text-[#667085]">
      <Icon size={15} className="text-[#087ce7]" /> {label}
    </span>
    <span className="text-right font-medium text-[#344054]">{value}</span>
  </p>
);

const KeyValue = ({
  label,
  value,
  accent,
  compact,
}: {
  label: string;
  value: string;
  accent?: boolean;
  compact?: boolean;
}) => (
  <p className="flex items-start justify-between gap-4">
    <span className="text-[#667085]">{label}</span>
    <span
      className={
        accent
          ? "rounded bg-[#ddf9e8] px-2 py-0.5 font-medium text-[#10a44c]"
          : compact
            ? "max-w-[250px] break-all text-right text-xs font-medium text-[#344054]"
            : "text-right font-medium text-[#344054]"
      }
    >
      {value}
    </span>
  </p>
);

export default LeadDetailsModal;
