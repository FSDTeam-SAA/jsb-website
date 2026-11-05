"use client";

import { useMutation } from "@tanstack/react-query";
import { Loader2, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { addFunds } from "@/lib/auth-api";

const amounts = [100, 250, 500, 1000];

const AddFundsModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const [amount, setAmount] = useState(100);
  const [customAmount, setCustomAmount] = useState("");
  const { data: session, status } = useSession();
  const accessToken = session?.user.accessToken;

  const addFundsMutation = useMutation({
    mutationKey: ["wallet", "add-funds"],
    mutationFn: (fundingAmount: number) => {
      if (!accessToken) throw new Error("Please sign in to add funds.");
      return addFunds(accessToken, fundingAmount);
    },
    onSuccess: (response) => {
      const { checkoutUrl } = response.data;
      if (!checkoutUrl) {
        toast.error("We could not start checkout. Please try again.");
        return;
      }

      toast.success(response.message || "Redirecting to secure checkout...");
      window.location.assign(checkoutUrl);
    },
    onError: (error) =>
      toast.error(
        error instanceof Error
          ? error.message
          : "We could not start checkout. Please try again.",
      ),
  });

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !addFundsMutation.isPending) onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [addFundsMutation.isPending, onClose, open]);

  if (!open) return null;

  const selectedAmount = customAmount === "" ? amount : Number(customAmount);
  const isValidAmount =
    Number.isFinite(selectedAmount) && selectedAmount > 0 && selectedAmount <= 1_000_000;
  const displayedAmount = isValidAmount ? selectedAmount.toFixed(2) : "0.00";

  const startCheckout = () => {
    if (status !== "authenticated" || !accessToken) {
      toast.error("Your session has expired. Please sign in again.");
      return;
    }
    if (!isValidAmount) {
      toast.error("Enter an amount between $0.01 and $1,000,000.");
      return;
    }
    addFundsMutation.mutate(selectedAmount);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-[#0d1f35]/45 p-4"
      onClick={() => !addFundsMutation.isPending && onClose()}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-funds-title"
        className="max-h-[calc(100dvh-2rem)] w-full max-w-[650px] overflow-y-auto rounded-[14px] bg-white p-4 shadow-2xl sm:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2
            id="add-funds-title"
            className="text-[18px] font-bold text-[#104170]"
          >
            Add Funds
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={addFundsMutation.isPending}
            aria-label="Close add funds"
            className="disabled:cursor-not-allowed disabled:opacity-60"
          >
            <X className="text-[#585858]" />
          </button>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {amounts.map((value) => (
            <button
              key={value}
              type="button"
              disabled={addFundsMutation.isPending}
              onClick={() => {
                setAmount(value);
                setCustomAmount("");
              }}
              className={`h-[62px] rounded-[8px] text-[24px] font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${amount === value && !customAmount ? "border border-[#104170] bg-[#e7f2ff] text-[#104170]" : "bg-[#fafafa] text-[#818181] hover:bg-[#f2f6fa]"}`}
            >
              ${value}
            </button>
          ))}
        </div>
        <label className="mt-4 block text-[12px] font-medium text-[#585858]">
          Custom Amount
          <input
            value={customAmount}
            onChange={(event) => {
              const nextValue = event.target.value;
              if (/^\d*(?:\.\d{0,2})?$/.test(nextValue)) {
                setCustomAmount(nextValue);
              }
            }}
            placeholder="$00.000"
            inputMode="decimal"
            disabled={addFundsMutation.isPending}
            className="mt-2 h-10 w-full rounded-[8px] border border-[#585858] px-2 text-[14px] outline-none focus:border-[#0073df]"
          />
        </label>
        <button
          type="button"
          disabled={addFundsMutation.isPending}
          className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-[6px] bg-[#0073df] text-[16px] font-medium text-white transition hover:bg-[#0568c9] disabled:cursor-not-allowed disabled:opacity-70"
          onClick={startCheckout}
        >
          {addFundsMutation.isPending && <Loader2 className="size-4 animate-spin" />}
          {addFundsMutation.isPending
            ? "Redirecting to checkout..."
            : `Add $${displayedAmount} to the balance`}
        </button>
      </section>
    </div>,
    document.body,
  );
};

export default AddFundsModal;
