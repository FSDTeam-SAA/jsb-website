"use client";

import { useMutation } from "@tanstack/react-query";
import { AlertCircle, CheckCircle2, ChevronDown, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { FormEvent, useEffect, useState } from "react";

import {
  badLeadReasons,
  submitBadLeadRequest,
  type BadLeadReason,
} from "@/lib/purchased-leads-api";

type RequestLeadReviewModalProps = {
  open: boolean;
  leadId?: string;
  onClose: () => void;
};

const reasonLabels: Record<BadLeadReason, string> = {
  INVALID_PHONE: "Invalid or disconnected phone number",
  INVALID_EMAIL: "Invalid email address",
  INCORRECT_CONTACT: "Incorrect contact person",
  INCORRECT_PROPERTY: "Incorrect property information",
  DUPLICATE_PURCHASE: "Duplicate purchase",
  OUTDATED_DATA: "Outdated lead data",
  OTHER: "Other issue",
};

const RequestLeadReviewModal = ({
  open,
  leadId,
  onClose,
}: RequestLeadReviewModalProps) => {
  const { data: session, status } = useSession();
  const accessToken = session?.user.accessToken;
  const [reason, setReason] = useState<BadLeadReason | "">("");
  const [explanation, setExplanation] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const submitRequest = useMutation({
    mutationFn: () => {
      if (!accessToken || !leadId || !reason) {
        throw new Error("Select a reason before submitting your request.");
      }

      return submitBadLeadRequest(accessToken, {
        leadId,
        reason,
        explanation: explanation.trim() || undefined,
      });
    },
    onSuccess: () => setSubmitted(true),
  });
  const { reset: resetSubmitRequest } = submitRequest;

  useEffect(() => {
    if (!open) return;

    setReason("");
    setExplanation("");
    setSubmitted(false);
    resetSubmitRequest();
  }, [open, leadId, resetSubmitRequest]);

  if (!open) return null;

  const errorMessage =
    submitRequest.error instanceof Error
      ? submitRequest.error.message
      : "We could not submit your request. Please try again.";

  const handleClose = () => {
    resetSubmitRequest();
    onClose();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitRequest.mutate();
  };

  return (
    <div
      className="fixed inset-0 z-[60] grid place-items-center bg-black/40 p-4"
      onClick={handleClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="request-lead-review-title"
        className="w-full max-w-[430px] rounded-xl bg-white p-5 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-[#667085]">Purchased lead review</p>
            <h2
              id="request-lead-review-title"
              className="mt-1 text-base font-bold text-[#104170]"
            >
              Request lead review
            </h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close lead review request"
            className="grid size-8 place-items-center rounded-full text-[#667085] transition hover:bg-[#f2f4f7]"
          >
            <X size={18} />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center">
            <span className="mx-auto grid size-12 place-items-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 size={25} />
            </span>
            <h3 className="mt-4 text-lg font-bold text-[#17212e]">Request submitted</h3>
            <p className="mx-auto mt-2 max-w-[320px] text-sm leading-6 text-[#667085]">
              {submitRequest.data?.message ||
                "Our team will review your bad lead credit request within 24–48 hours."}
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="mt-6 h-10 w-full rounded-xl bg-[#087ce7] text-sm font-semibold text-white transition hover:bg-[#076cc8]"
            >
              Done
            </button>
          </div>
        ) : (
          <form className="mt-5" onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-[#344054]">
              Lead ID
              <input
                value={leadId || ""}
                readOnly
                disabled
                className="mt-1.5 h-10 w-full truncate rounded-xl border border-[#d0d5dd] bg-[#f2f4f7] px-3 text-sm text-[#667085] disabled:cursor-not-allowed"
              />
            </label>

            <label className="mt-4 block text-sm font-medium text-[#344054]">
              Reason <span className="text-[#d92d20]">*</span>
              <span className="relative mt-1.5 block">
                <select
                  value={reason}
                  onChange={(event) => setReason(event.target.value as BadLeadReason)}
                  required
                  className="h-10 w-full appearance-none rounded-xl border border-[#d0d5dd] bg-white px-3 pr-9 text-sm text-[#344054] outline-none transition focus:border-[#087ce7] focus:ring-2 focus:ring-[#dcebfa]"
                >
                  <option value="" disabled>
                    Select the issue with this lead
                  </option>
                  {badLeadReasons.map((option) => (
                    <option key={option} value={option}>
                      {reasonLabels[option]}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  aria-hidden="true"
                  size={16}
                  className="pointer-events-none absolute right-3 top-3 text-[#667085]"
                />
              </span>
            </label>

            <label className="mt-4 block text-sm font-medium text-[#344054]">
              Explanation <span className="font-normal text-[#98a2b3]">(optional)</span>
              <textarea
                value={explanation}
                onChange={(event) => setExplanation(event.target.value)}
                placeholder="Add helpful details so our team can review the issue."
                className="mt-1.5 h-[92px] w-full resize-none rounded-xl border border-[#d0d5dd] p-3 text-sm text-[#344054] outline-none transition placeholder:text-[#98a2b3] focus:border-[#087ce7] focus:ring-2 focus:ring-[#dcebfa]"
              />
            </label>

            {submitRequest.isError && (
              <p
                role="alert"
                className="mt-4 flex gap-2 rounded-lg bg-[#fff1f3] px-3 py-2.5 text-sm text-[#b42318]"
              >
                <AlertCircle size={17} className="mt-0.5 shrink-0" />
                {errorMessage}
              </p>
            )}

            {status !== "authenticated" || !accessToken ? (
              <p className="mt-4 text-sm text-[#b54708]">
                Please sign in before submitting a review request.
              </p>
            ) : null}

            <p className="mt-4 text-xs leading-5 text-[#667085]">
              Requests must be submitted within 7 days of purchase. Our team reviews
              requests within 24–48 hours.
            </p>
            <button
              type="submit"
              disabled={
                !reason ||
                !leadId ||
                status !== "authenticated" ||
                !accessToken ||
                submitRequest.isPending
              }
              className="mt-5 h-10 w-full rounded-xl bg-[#087ce7] text-sm font-semibold text-white transition hover:bg-[#076cc8] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitRequest.isPending ? "Submitting request..." : "Submit review request"}
            </button>
          </form>
        )}
      </section>
    </div>
  );
};

export default RequestLeadReviewModal;
