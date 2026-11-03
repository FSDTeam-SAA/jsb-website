"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Circle, Info, Lightbulb, X } from "lucide-react";
import { toast } from "sonner";
import { addToCart } from "@/lib/cart-api";
import type { MarketplaceLead } from "@/lib/marketplace-api";

type PriceType = "SHARED" | "EXCLUSIVE";

const formatCurrency = (value: number | null | undefined, currency = "USD") =>
  value === null || value === undefined
    ? "—"
    : new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
      }).format(value);

const age = (createdAt?: string) => {
  if (!createdAt) return "Sample Data";
  const days = Math.max(
    0,
    Math.floor((Date.now() - new Date(createdAt).getTime()) / 86_400_000),
  );
  return days === 0 ? "Today" : days === 1 ? "1 day ago" : `${days} days ago`;
};

const LeadPreview = ({
  open,
  lead,
  onClose,
}: {
  open: boolean;
  lead?: MarketplaceLead | null;
  onClose: () => void;
}) => {
  const { data: session, status } = useSession();
  const accessToken = session?.user.accessToken;
  const queryClient = useQueryClient();
  const addToCartMutation = useMutation({
    mutationFn: (priceType: PriceType) => {
      if (!lead || !accessToken) throw new Error("Please sign in to add a lead to your cart.");
      return addToCart(accessToken, { leadId: lead.id, priceType });
    },
    onSuccess: (response) => {
      void queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success(response.message || "Lead added to cart successfully.");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Unable to add this lead to your cart.");
    },
  });

  if (!open) return null;

  const title = [lead?.city ?? lead?.county, lead?.state, lead?.zipcode]
    .filter(Boolean)
    .join(", ") || "Orange County, CA 928XX";
  const propertyType = lead?.propertyType ?? "Single Family";
  const currency = lead?.currency ?? "USD";
  const canPurchaseShared = !lead || lead.availability !== "EXCLUSIVE";
  const canPurchaseExclusive = !lead || lead.availability !== "SHARED";
  const previewDetails = [
    ["Property Type", propertyType],
    ["Estimated Value", formatCurrency(lead?.estValue, currency)],
    ["Estimated Equity", formatCurrency(lead?.estEquity, currency)],
    ["Foreclosure Stage", lead?.stage ?? "Available after purchase"],
    ["Added", age(lead?.createdAt)],
    ["Street Address", "Hidden Until Purchase"],
    ["Phone", "Hidden Until Purchase"],
    ["Email", "Hidden Until Purchase"],
  ];

  const addLead = (priceType: PriceType) => {
    if (status !== "authenticated" || !accessToken) {
      toast.error("Your session has expired. Please sign in again.");
      return;
    }
    if (!lead) {
      toast.error("Choose a marketplace lead before adding it to your cart.");
      return;
    }
    addToCartMutation.mutate(priceType);
  };

  const PriceOption = ({
    priceType,
    available,
    price,
    description,
    accent = false,
  }: {
    priceType: PriceType;
    available: boolean;
    price: number | null | undefined;
    description: string;
    accent?: boolean;
  }) => {
    if (!available) return null;
    const isPending = addToCartMutation.isPending && addToCartMutation.variables === priceType;
    const label = priceType === "SHARED" ? "Shared Lead" : "Exclusive Lead";

    return (
      <article className={`rounded-2xl border border-[#cedcf0] p-3 shadow-sm ${accent ? "bg-[#eaf4ff]" : "bg-white"}`}>
        <div className="flex gap-3">
          <Circle className={`mt-0.5 shrink-0 ${accent ? "text-[#087ce1]" : "text-[#8ca1b8]"}`} size={20} />
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-black">{label}{priceType === "SHARED" && <span className="font-medium"> • Limited Availability</span>}</p>
                <p className="mt-1 text-xs font-medium text-[#333]">{description}</p>
              </div>
              <b className="text-lg text-black">{formatCurrency(price, currency)}</b>
            </div>
            <button
              type="button"
              onClick={() => addLead(priceType)}
              disabled={addToCartMutation.isPending || !lead}
              className={`mt-3 flex h-9 w-full items-center justify-center rounded-md px-3 text-base font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0073df] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${accent ? "bg-[#0073df] text-white hover:bg-[#0065c5]" : "border border-[#0073df] bg-[#eaf4ff] text-[#0073df] hover:bg-[#dceeff]"}`}
            >
              {isPending ? "Adding to Cart..." : `Add ${label} to Cart`}
            </button>
          </div>
        </div>
        {priceType === "EXCLUSIVE" && (
          <p className="mt-4 flex items-center gap-3 rounded-lg bg-[#faf2e7] p-3 text-xs font-medium leading-5 text-[#734300]">
            <Lightbulb className="shrink-0" size={20} />
            Exclusive prevents future customers from purchasing this lead.
          </p>
        )}
      </article>
    );
  };

  return (
    <aside data-lenis-prevent className="fixed right-0 top-0 z-50 flex h-dvh w-full max-w-[556px] flex-col overflow-hidden border-l border-[#edf2f7] bg-white shadow-[-2px_0_3px_rgba(0,0,0,0.1)]" aria-label="Lead Preview">
      <header className="flex h-[75px] shrink-0 items-center justify-between border-b border-[rgba(219,236,255,0.7)] px-4">
        <h2 className="text-xl font-bold text-[#0f1839]">Lead Preview</h2>
        <button type="button" onClick={onClose} aria-label="Close lead preview" className="grid size-9 place-items-center rounded-md text-[#77839a] transition hover:bg-[#f3f6fa] hover:text-[#334155] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0073df]">
          <X size={20} strokeWidth={1.8} />
        </button>
      </header>

      <div className="dashboard-summary-scroll min-h-0 flex-1 overflow-y-auto pb-6" data-lenis-prevent>
        <section className="px-4 pt-3">
          <div className="flex justify-end"><span className="rounded bg-[#e5eff9] px-2 py-1 text-xs font-medium text-[#177afe]">PROTECTED PREVIEW</span></div>
          <div className="mt-8">
            <div className="flex items-center gap-2"><span className="rounded bg-[#fcdee0] px-2 py-1 text-xs font-medium text-[#8f4d4f]">{lead?.category.name ?? "Foreclosure"}</span><span className="rounded bg-[#d9fae9] px-2 py-1 text-xs font-medium text-[#05976a]">{lead ? lead.availability : "Shared"} Lead</span></div>
            <h3 className="mt-4 text-xl font-bold text-[#0f1839]">{title}</h3>
            <p className="mt-2 text-sm font-medium text-[#878a9b]">{propertyType} Property</p>
          </div>
        </section>

        <section className="mt-4 px-4">
          <div className="relative h-[172px] overflow-hidden rounded-lg bg-[#e6edf5]"><Image src="/images/figma/lead-preview-property.png" alt={`${propertyType} property preview`} fill sizes="556px" className="object-cover" priority /></div>
          <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-3 py-1 text-xs font-medium">
            {previewDetails.map(([label, value]) => <div key={label} className="contents"><dt className="text-[#878a9b]">{label}</dt><dd className="text-black">{value}</dd></div>)}
          </dl>
        </section>

        <section className="mt-4 space-y-4 px-4">
          <div className="rounded-lg border border-[#ebf4ff] bg-[#eaf4ff] p-3"><p className="flex items-center gap-3 text-xs font-medium leading-5 text-[#333]"><Info className="shrink-0 text-[#087ce1]" size={20} />This is a protected preview. Add the lead to your cart to continue purchasing.</p></div>
          <PriceOption priceType="SHARED" available={canPurchaseShared} price={lead?.sharedPrice ?? 25} description="May be purchased by other users" accent />
          <PriceOption priceType="EXCLUSIVE" available={canPurchaseExclusive} price={lead?.exclusivePrice ?? 49} description="Be the only customer to receive this lead" />
        </section>
      </div>
    </aside>
  );
};

export default LeadPreview;
