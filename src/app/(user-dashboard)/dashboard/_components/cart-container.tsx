"use client";

import {
  ArrowRight,
  Check,
  Crown,
  Percent,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

type CartLead = {
  id: string;
  type: string;
  location: string;
  propertyType: string;
  estimatedValue: string;
  estimatedEquity: string;
  added: string;
  quantity: number;
  availability: "Shared" | "Exclusive";
  price: number;
};

const cartLeads: CartLead[] = [
  { id: "lead-1", type: "Foreclosure", location: "Orange County, CA 928xx", propertyType: "Single Family", estimatedValue: "$685,000", estimatedEquity: "$240,000", added: "3 days ago", quantity: 1, availability: "Shared", price: 25 },
  { id: "lead-2", type: "Tax Lien", location: "Orange County, CA 928xx", propertyType: "Single Family", estimatedValue: "$685,000", estimatedEquity: "$240,000", added: "3 days ago", quantity: 1, availability: "Shared", price: 25 },
  { id: "lead-3", type: "Pre-Foreclosure", location: "Los Angeles, CA 900xx", propertyType: "Condo", estimatedValue: "$450,000", estimatedEquity: "$150,000", added: "1 week ago", quantity: 132, availability: "Exclusive", price: 830 },
  { id: "lead-4", type: "Tax Lien", location: "Fresno, CA 937xx", propertyType: "Condo", estimatedValue: "$325,000", estimatedEquity: "$100,000", added: "1 day ago", quantity: 1, availability: "Shared", price: 15 },
  { id: "lead-5", type: "Bankruptcy", location: "Fresno, CA 937xx", propertyType: "Condo", estimatedValue: "$325,000", estimatedEquity: "$100,000", added: "1 day ago", quantity: 231, availability: "Exclusive", price: 15 },
  { id: "lead-6", type: "Pre-Foreclosure", location: "Fresno, CA 937xx", propertyType: "Condo", estimatedValue: "$325,000", estimatedEquity: "$100,000", added: "1 day ago", quantity: 1, availability: "Exclusive", price: 15 },
  { id: "lead-7", type: "REO/Bank-Owned", location: "Irvine, CA 926xx", propertyType: "Single Family", estimatedValue: "$900,000", estimatedEquity: "$400,000", added: "10 days ago", quantity: 1, availability: "Shared", price: 35 },
];

const leadTypeClasses: Record<string, string> = {
  Foreclosure: "bg-[#ffe9ed] text-[#ef4765]",
  "Tax Lien": "bg-[#f3eaff] text-[#a855f7]",
  "Pre-Foreclosure": "bg-[#fff2dd] text-[#b7791f]",
  Bankruptcy: "bg-[#dff8f7] text-[#0c8e88]",
  "REO/Bank-Owned": "bg-[#eee8ff] text-[#6d42d8]",
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);

const CartContainer = () => {
  const [items, setItems] = useState(cartLeads);
  const [selectedIds, setSelectedIds] = useState<string[]>(
    cartLeads.map(({ id }) => id),
  );
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [useCredit, setUseCredit] = useState(false);

  const summary = useMemo(() => {
    const selectedItems = items.filter((item) => selectedIds.includes(item.id));
    const subtotal = selectedItems.reduce((total, item) => total + item.price, 0);
    const promoDiscount = promoApplied ? subtotal * 0.1 : 0;
    const membershipDiscount = (subtotal - promoDiscount) * 0.1;
    const credit = useCredit ? Math.min(425, subtotal - promoDiscount - membershipDiscount) : 0;
    const total = Math.max(0, subtotal - promoDiscount - membershipDiscount - credit);

    return {
      selectedItems,
      totalQuantity: selectedItems.reduce((total, item) => total + item.quantity, 0),
      sharedQuantity: selectedItems
        .filter((item) => item.availability === "Shared")
        .reduce((total, item) => total + item.quantity, 0),
      exclusiveQuantity: selectedItems
        .filter((item) => item.availability === "Exclusive")
        .reduce((total, item) => total + item.quantity, 0),
      subtotal,
      promoDiscount,
      membershipDiscount,
      credit,
      total,
    };
  }, [items, promoApplied, selectedIds, useCredit]);

  const selectedAll = items.length > 0 && selectedIds.length === items.length;

  const toggleLead = (id: string) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((selectedId) => selectedId !== id)
        : [...current, id],
    );
  };

  const removeLead = (id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
    setSelectedIds((current) => current.filter((selectedId) => selectedId !== id));
    toast.success("Lead removed from your cart.");
  };

  const applyPromo = () => {
    if (promoCode.trim().toUpperCase() !== "SAVE10") {
      setPromoApplied(false);
      toast.error("Use SAVE10 to apply the available 10% promo.");
      return;
    }

    setPromoApplied(true);
    toast.success("Promo code applied — 10% saved.");
  };

  const completePurchase = () => {
    if (!summary.selectedItems.length) {
      toast.error("Select at least one lead before continuing.");
      return;
    }

    toast.success("Your purchase summary is ready for checkout.");
  };

  return (
    <main className="min-w-0 flex-1 bg-[#f6f9fd]">
      <div className="mx-auto flex min-h-[calc(100vh-75px)] max-w-[1800px] flex-col xl:flex-row">
        <section className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8" aria-labelledby="cart-heading">
          <div className="mx-auto max-w-[1280px]">
            <h1 id="cart-heading" className="text-[24px] font-bold leading-tight text-[#0e1224]">
              Cart
            </h1>
            <p className="mt-2 text-sm text-[#545454] sm:text-base">
              Review your selected leads, pricing, and discounts before proceeding to checkout.
            </p>

            <div className="mt-6 overflow-hidden rounded-2xl border border-[#f1f4f9] bg-white p-3 shadow-[0_2px_10px_rgba(31,61,96,0.04)] sm:p-4">
              <div className="overflow-x-auto" data-lenis-prevent>
                <table className="w-full min-w-[900px] border-collapse text-left text-[11px]">
                  <thead className="border-b-2 border-[#f1f4f9] bg-[#fafbfd] text-[#676767]">
                    <tr>
                      <th className="w-10 px-3 py-4">
                        <input
                          type="checkbox"
                          checked={selectedAll}
                          onChange={() => setSelectedIds(selectedAll ? [] : items.map(({ id }) => id))}
                          aria-label="Select all cart leads"
                          className="size-3.5 rounded border-[#949494] accent-[#087ce1]"
                        />
                      </th>
                      {[
                        "Lead Type",
                        "Location",
                        "Property Type",
                        "Est. Value",
                        "Est. Equity",
                        "Added",
                        "Quantity",
                        "Availability",
                        "Price",
                        "Action",
                      ].map((heading) => (
                        <th key={heading} className="whitespace-nowrap px-3 py-4 font-medium">
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-[#243047]">
                    {items.map((lead) => {
                      const isSelected = selectedIds.includes(lead.id);
                      return (
                        <tr key={lead.id} className="border-b border-[#f1f4f9] last:border-0 hover:bg-[#fbfdff]">
                          <td className="px-3 py-4">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleLead(lead.id)}
                              aria-label={`Select ${lead.type} lead in ${lead.location}`}
                              className="size-3.5 rounded border-[#949494] accent-[#087ce1]"
                            />
                          </td>
                          <td className="px-3 py-4">
                            <span className={`inline-flex whitespace-nowrap rounded-full px-2 py-1 text-[10px] font-medium ${leadTypeClasses[lead.type]}`}>
                              {lead.type}
                            </span>
                          </td>
                          <td className="max-w-[120px] px-3 py-4 leading-4">{lead.location}</td>
                          <td className="whitespace-nowrap px-3 py-4">{lead.propertyType}</td>
                          <td className="whitespace-nowrap px-3 py-4">{lead.estimatedValue}</td>
                          <td className="whitespace-nowrap px-3 py-4">{lead.estimatedEquity}</td>
                          <td className="whitespace-nowrap px-3 py-4">{lead.added}</td>
                          <td className="px-3 py-4 text-center">{lead.quantity}</td>
                          <td className="px-3 py-4">
                            <span className={`inline-flex rounded-full px-2 py-1 text-[10px] font-medium ${lead.availability === "Exclusive" ? "bg-[#ddf9e8] text-[#10a44c]" : "bg-[#e4f4ff] text-[#087ce7]"}`}>
                              {lead.availability}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4">{formatCurrency(lead.price)}</td>
                          <td className="px-3 py-4">
                            <button
                              type="button"
                              onClick={() => removeLead(lead.id)}
                              className="inline-flex items-center gap-1 rounded-[10px] bg-[#fff0f1] px-2 py-1.5 text-[10px] font-medium text-[#ed2532] transition hover:bg-[#ffe0e3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed2532] focus-visible:ring-offset-2"
                            >
                              <Trash2 size={12} aria-hidden="true" />
                              Remove Lead
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {!items.length && (
                      <tr>
                        <td colSpan={11} className="px-4 py-14 text-center">
                          <ShoppingCart className="mx-auto text-[#8ca1b8]" size={34} strokeWidth={1.5} />
                          <p className="mt-3 text-sm font-semibold text-[#25334a]">Your cart is empty</p>
                          <p className="mt-1 text-xs text-[#6b7280]">Find leads and add them here when you are ready.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <aside
          className="w-full shrink-0 border-t border-[#e6edf5] bg-white xl:sticky xl:top-[75px] xl:flex xl:h-[calc(100vh-75px)] xl:w-[360px] xl:flex-col xl:border-l xl:border-t-0"
          aria-label="Purchase summary"
        >
          <div className="shrink-0 px-4 pt-5 sm:px-6 xl:px-5">
            <div className="flex items-center gap-2 border-b border-[#e6edf5] pb-5">
              <span className="grid size-8 place-items-center rounded-full bg-[#eef5ff] text-[#087ce1]">
                <ShoppingCart size={16} strokeWidth={2} aria-hidden="true" />
              </span>
              <h2 className="text-xl font-bold text-[#0f1839]">Purchase Summary</h2>
            </div>
          </div>

          <div
            data-lenis-prevent
            className="dashboard-summary-scroll scroll-smooth overscroll-y-contain px-4 pb-5 sm:px-6 xl:min-h-0 xl:flex-1 xl:overflow-y-auto xl:px-5"
          >
            <div className="space-y-6 py-5">
              <SummarySection title="Purchase Overview">
                <SummaryRow label="Total Lead Quantity" value={summary.totalQuantity.toString()} />
                <SummaryRow label="Shared Lead Quantity" value={summary.sharedQuantity.toString()} />
                <SummaryRow label="Exclusive Lead Quantity" value={summary.exclusiveQuantity.toString()} />
              </SummarySection>

              <div>
                <div className="flex items-center gap-2 text-base font-medium leading-5 text-[#585858]">
                  <Percent className="text-[#087ce1]" size={19} aria-hidden="true" />
                  Apply Promo Code
                </div>
                <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] items-stretch gap-2">
                  <input
                    value={promoCode}
                    onChange={(event) => {
                      setPromoCode(event.target.value);
                      if (promoApplied) setPromoApplied(false);
                    }}
                    placeholder="Enter promo code"
                    aria-label="Promo code"
                    className="h-12 min-w-0 rounded-[10px] border border-[#949494] px-3 text-sm text-[#202938] outline-none transition placeholder:text-[#949494] focus:border-[#0073df] focus:ring-2 focus:ring-[#0073df]/15"
                  />
                  <button type="button" onClick={applyPromo} className="h-12 rounded-[10px] border border-[#0073df] px-4 text-base font-medium text-[#0073df] transition hover:bg-[#eaf4ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0073df] focus-visible:ring-offset-2">
                    Apply
                  </button>
                </div>
                {promoApplied && (
                  <p className="mt-2 flex items-center gap-1 text-sm font-medium text-[#0c9c67]">
                    <Check size={14} aria-hidden="true" /> SAVE10 applied
                  </p>
                )}
              </div>

              <label className="flex cursor-pointer items-start gap-2 rounded-lg py-1 transition hover:bg-[#fafbfd]">
                <input type="checkbox" checked={useCredit} onChange={(event) => setUseCredit(event.target.checked)} className="mt-[3px] size-4 rounded border-[#949494] accent-[#087ce1]" />
                <span>
                  <span className="block text-base font-medium leading-5 text-[#585858]">Apply Account Credit</span>
                  <span className="mt-0.5 block text-sm leading-4 text-[#878a9b]">Available Balance: $425.00</span>
                </span>
              </label>

              <SummarySection title="Payment Overview">
                <SummaryRow label="Subtotal Price" value={formatCurrency(summary.subtotal)} />
                <SummaryRow label="Applied Balance" value={summary.credit ? `-${formatCurrency(summary.credit)}` : "$0.00"} />
                <SummaryRow label="Membership Discount · Gold 10%" value={`-${formatCurrency(summary.membershipDiscount)}`} />
                <SummaryRow label="Promo Code Discount" value={`-${formatCurrency(summary.promoDiscount)}`} />
                <SummaryRow label="Amount charged to card" value={formatCurrency(summary.total)} />
              </SummarySection>

              <SummarySection title="Payment Method">
                <button type="button" className="flex w-full items-center justify-between rounded-[10px] border border-[#cedcf0] bg-white p-3 text-left transition hover:border-[#8dc7ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0073df]">
                  <span className="flex items-center gap-2 text-base font-medium text-[#334155]">
                    <span className="size-4 rounded-full border-[5px] border-[#087ce1]" aria-hidden="true" />
                    Stripe
                  </span>
                  <span className="text-base font-bold italic tracking-tight text-[#635bff]">stripe</span>
                </button>
                <div className="mt-3 flex items-center justify-between rounded-[10px] border border-[#cedcf0] bg-[#eaf4ff] p-3 shadow-sm">
                  <span className="text-sm font-bold text-[#0e1224]">Total Price</span>
                  <output className="text-xl font-bold text-[#0e1224]" aria-live="polite">{formatCurrency(summary.total)}</output>
                </div>
              </SummarySection>

              <button type="button" onClick={completePurchase} disabled={!summary.selectedItems.length} className="flex h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-[#0073df] px-3 text-base font-medium text-white transition hover:bg-[#0065c5] disabled:cursor-not-allowed disabled:bg-[#aebdce] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0073df] focus-visible:ring-offset-2">
                Complete Purchase
                <ArrowRight size={17} aria-hidden="true" />
              </button>

              <div className="rounded-[10px] border border-[#fde7b5] bg-[#fffaf0] p-3">
                <div className="flex items-start gap-2">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#fff0bd] text-[#b7791f]">
                    <Crown size={15} aria-hidden="true" />
                  </span>
                  <p className="pt-1 text-sm font-semibold leading-5 text-[#343434]">Upgrade to Diamond and save 15% on this order</p>
                </div>
                <div className="mt-3 flex items-end gap-3">
                  <p className="flex-1 text-xs leading-4 text-[#6b7280]">Diamond members get 15% off lead purchases plus exclusive leads and premium features.</p>
                  <button type="button" className="h-9 rounded-[10px] border border-[#0073df] bg-[#eaf4ff] px-3 text-sm font-medium text-[#0073df] transition hover:bg-[#dceeff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0073df] focus-visible:ring-offset-2">Upgrade</button>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
};

const SummarySection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section>
    <h3 className="text-lg font-medium text-[#0f1839]">{title}</h3>
    <div className="mt-3 space-y-3 px-0.5">{children}</div>
  </section>
);

const SummaryRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between gap-4 text-sm">
    <span className="text-[#878a9b]">{label}</span>
    <span className="shrink-0 font-medium text-[#111827]">{value}</span>
  </div>
);

export default CartContainer;
