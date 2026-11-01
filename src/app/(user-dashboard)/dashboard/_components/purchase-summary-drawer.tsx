"use client";

import { ArrowRight, Crown, Percent, ShoppingCart, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type PurchaseSummaryDrawerProps = {
  open: boolean;
  onClose: () => void;
};

const PurchaseSummaryDrawer = ({ open, onClose }: PurchaseSummaryDrawerProps) => {
  const [promoCode, setPromoCode] = useState("");
  const [creditApplied, setCreditApplied] = useState(true);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose, open]);

  if (!open) return null;

  const applyPromo = () => {
    if (!promoCode.trim()) {
      toast.error("Enter a promo code first.");
      return;
    }
    toast.success("Promo code applied.");
  };

  return (
    <div className="fixed inset-0 z-[70] flex justify-end" aria-hidden={false}>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close purchase summary"
        className="absolute inset-0 cursor-default bg-[#141936]/60"
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="purchase-summary-title"
        className="relative flex h-full w-full max-w-[410px] flex-col bg-white shadow-[-2px_0_3px_rgba(0,0,0,0.1)] motion-safe:animate-in motion-safe:slide-in-from-right"
      >
        <header className="flex h-[75px] shrink-0 items-center justify-between border-b border-[rgba(219,236,255,0.8)] px-4">
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-full bg-[#eef5ff] text-[#087ce1]">
              <ShoppingCart size={16} strokeWidth={2} aria-hidden="true" />
            </span>
            <h2 id="purchase-summary-title" className="text-xl font-bold text-[#0f1839]">
              Purchase Summary
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-9 place-items-center rounded-[10px] text-[#77839a] transition hover:bg-[#f3f6fa] hover:text-[#334155] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0073df]"
            aria-label="Close purchase summary"
          >
            <X size={20} strokeWidth={1.8} />
          </button>
        </header>

        <div data-lenis-prevent className="dashboard-summary-scroll min-h-0 flex-1 overflow-y-auto px-4 py-6">
          <div className="space-y-6">
            <DrawerSection title="Purchase Overview">
              <DrawerRow label="Total Lead Quantity" value="234" />
              <DrawerRow label="Shared Lead Quantity" value="134" />
              <DrawerRow label="Exclusive Lead Quantity" value="89" />
            </DrawerSection>

            <section>
              <div className="flex items-center gap-2 text-sm font-medium leading-5 text-[#585858]">
                <span className="grid size-5 place-items-center rounded-full bg-[#e6fbfa] text-[#06a9a0]">
                  <Percent size={13} strokeWidth={2.4} aria-hidden="true" />
                </span>
                Apply Promo Code
              </div>
              <div className="mt-3 grid grid-cols-[minmax(0,1fr)_76px] items-stretch gap-2">
                <input
                  value={promoCode}
                  onChange={(event) => setPromoCode(event.target.value)}
                  placeholder="Enter promo code"
                  className="h-12 min-w-0 rounded-[10px] border border-[#949494] px-3 text-sm text-[#141936] outline-none transition placeholder:text-[#949494] focus:border-[#0073df] focus:ring-2 focus:ring-[#0073df]/15"
                  aria-label="Enter promo code"
                />
                <button type="button" onClick={applyPromo} className="h-12 rounded-[10px] border border-[#0073df] text-sm font-medium text-[#0073df] transition hover:bg-[#eaf4ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0073df] focus-visible:ring-offset-2">
                  Apply
                </button>
              </div>
            </section>

            <label className="flex cursor-pointer items-start gap-2">
              <input
                type="checkbox"
                checked={creditApplied}
                onChange={(event) => setCreditApplied(event.target.checked)}
                className="mt-[3px] size-4 rounded border-[#949494] accent-[#087ce1]"
              />
              <span>
                <span className="block text-sm font-medium leading-5 text-[#585858]">Apply Account Credit</span>
                <span className="mt-0.5 block text-xs leading-4 text-[#878a9b]">Available Balance : $764</span>
              </span>
            </label>

            <DrawerSection title="Payment Overview">
              <DrawerRow label="Subtotal Price" value="$842" />
              <DrawerRow label="Applied Balance" value={creditApplied ? "-$342" : "$0"} />
              <DrawerRow label="Membership Discount · Gold 10%" value="-$234" />
              <DrawerRow label="Promo Code Discount" value="-$264" />
              <DrawerRow label="Amount charged to card" value="-$175" />
            </DrawerSection>

            <DrawerSection title="Payment Method">
              <button type="button" className="flex h-10 w-full items-center justify-between rounded-[10px] border border-[#cedcf0] px-3 text-left transition hover:border-[#8dc7ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0073df]">
                <span className="flex items-center gap-2 text-sm font-medium text-[#334155]">
                  <span className="size-4 rounded-full border border-[#cbd5e1] bg-white" aria-hidden="true" />
                  Stripe
                </span>
                <span className="text-sm font-bold italic tracking-tight text-[#635bff]">stripe</span>
              </button>
              <div className="mt-3 flex items-center justify-between rounded-[10px] border border-[#cedcf0] bg-[#eaf4ff] p-3 shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
                <span className="text-xs font-bold text-black">Total Price</span>
                <output className="text-lg font-bold text-black">$25.00</output>
              </div>
            </DrawerSection>

            <button type="button" onClick={() => toast.success("Purchase summary is ready for checkout.")} className="flex h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-[#0073df] px-3 text-sm font-medium text-white transition hover:bg-[#0065c5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0073df] focus-visible:ring-offset-2">
              Complete Purchase
              <ArrowRight size={16} aria-hidden="true" />
            </button>

            <section className="rounded-[10px] border border-[#fde2a3] bg-[#fffaf0] p-3">
              <div className="flex items-start gap-3">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#fff0bd] text-[#b7791f]">
                  <Crown size={17} fill="currentColor" aria-hidden="true" />
                </span>
                <p className="pt-1 text-xs font-medium leading-4 text-black">Upgrade to diamond and save $18.00 on this order</p>
              </div>
              <div className="mt-3 flex items-end gap-3">
                <p className="flex-1 text-[10px] leading-[13px] text-[#545454]">Diamond members get 15% off all lead purchases plus exclusive leads and premium features.</p>
                <button type="button" onClick={() => toast.success("Diamond upgrade options opened.")} className="h-8 rounded-[10px] border border-[#0073df] bg-[#eaf4ff] px-3 text-xs font-medium text-[#0073df] transition hover:bg-[#dceeff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0073df] focus-visible:ring-offset-2">Upgrade</button>
              </div>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
};

const DrawerSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section>
    <h3 className="text-base font-medium text-[#0f1839]">{title}</h3>
    <div className="mt-3 space-y-3">{children}</div>
  </section>
);

const DrawerRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between gap-4 text-xs">
    <span className="text-[#878a9b]">{label}</span>
    <span className="shrink-0 font-medium text-black">{value}</span>
  </div>
);

export default PurchaseSummaryDrawer;
