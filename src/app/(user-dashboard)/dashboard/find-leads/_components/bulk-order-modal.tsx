"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Info, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { bulkAddToCart } from "@/lib/cart-api";

const BulkOrderModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const { data: session, status } = useSession();
  const accessToken = session?.user.accessToken;
  const queryClient = useQueryClient();
  const [priceType, setPriceType] = useState<"SHARED" | "EXCLUSIVE">("SHARED");
  const [quantity, setQuantity] = useState("250");
  const bulkOrderMutation = useMutation({
    mutationFn: ({ requestedQuantity, type }: { requestedQuantity: number; type: "SHARED" | "EXCLUSIVE" }) => {
      if (!accessToken) throw new Error("Please sign in to create a bulk order.");
      return bulkAddToCart(accessToken, { quantity: requestedQuantity, priceType: type });
    },
    onSuccess: (response) => {
      const { addedCount, requestedQuantity } = response.data;
      void queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success(
        `${addedCount} of ${requestedQuantity} eligible lead${addedCount === 1 ? "" : "s"} added to your cart.`,
      );
      onClose();
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to add bulk leads to your cart.",
      );
    },
  });

  if (!open) return null;

  const requestedQuantity = Number(quantity);
  const isValidQuantity =
    Number.isInteger(requestedQuantity) &&
    requestedQuantity >= 1 &&
    requestedQuantity <= 1000;

  const submit = () => {
    if (status !== "authenticated" || !accessToken) {
      toast.error("Your session has expired. Please sign in again.");
      return;
    }
    if (!isValidQuantity) {
      toast.error("Enter a whole-number quantity between 1 and 1,000.");
      return;
    }
    bulkOrderMutation.mutate({ requestedQuantity, type: priceType });
  };

  const displayPriceType = priceType === "SHARED" ? "Shared" : "Exclusive";

  return (
    <div
      className="fixed inset-0 z-50 grid overflow-y-auto bg-black/40 p-4 sm:place-items-center"
      onClick={() => !bulkOrderMutation.isPending && onClose()}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="bulk-order-title"
        className="my-auto w-full max-w-[520px] rounded-[8px] bg-white p-4 shadow-2xl sm:p-5"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 id="bulk-order-title" className="text-[15px] font-bold text-[#104170]">
            Bulk Order
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={bulkOrderMutation.isPending}
            aria-label="Close bulk order"
            className="rounded text-[#667085] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087ce7] disabled:opacity-50"
          >
            <X size={17} />
          </button>
        </div>

        <p className="mt-4 text-[11px] text-[#344054]">Add matching leads</p>
        <p className="text-[11px] text-[#667085]">
          The newest eligible leads will be selected automatically.
        </p>

        <div className="mt-3 grid grid-cols-2 gap-2" role="group" aria-label="Purchase type">
          {(["SHARED", "EXCLUSIVE"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setPriceType(type)}
              disabled={bulkOrderMutation.isPending}
              className={`h-9 rounded-[5px] text-[14px] transition disabled:cursor-not-allowed disabled:opacity-60 ${priceType === type ? "border border-[#104170] bg-[#e7f2ff] text-[#104170]" : "bg-[#fafafa] text-[#858585]"}`}
            >
              {type === "SHARED" ? "Shared" : "Exclusive"}
            </button>
          ))}
        </div>

        <label className="mt-3 block text-[10px] text-[#667085]">
          Quantity
          <input
            type="number"
            min="1"
            max="1000"
            step="1"
            inputMode="numeric"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            disabled={bulkOrderMutation.isPending}
            className="mt-1 h-8 w-full rounded border border-[#98a2b3] px-2 text-[10px] outline-none focus:border-[#087ce7] focus:ring-2 focus:ring-[#087ce7]/20 disabled:cursor-not-allowed disabled:bg-[#f8fafc]"
          />
        </label>

        <div className="mt-3 flex gap-2 rounded-[5px] bg-[#e7f2ff] p-2 text-[9px] text-[#344054]">
          <Info size={14} className="shrink-0 text-[#087ce7]" />
          Previously purchased and unavailable leads are automatically excluded.
          Shared and Exclusive batches remain separate in your cart.
        </div>

        <button
          type="button"
          onClick={submit}
          disabled={bulkOrderMutation.isPending || !isValidQuantity}
          className="mt-3 h-9 w-full rounded-[4px] bg-[#087ce7] text-[10px] font-medium text-white transition hover:bg-[#006fcf] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087ce7] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {bulkOrderMutation.isPending
            ? "Adding Leads to Cart..."
            : `Add ${isValidQuantity ? requestedQuantity : 0} ${displayPriceType} Lead${requestedQuantity === 1 ? "" : "s"} to Cart`}
        </button>
      </section>
    </div>
  );
};

export default BulkOrderModal;
