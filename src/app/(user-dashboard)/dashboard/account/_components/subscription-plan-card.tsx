"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Crown, Info } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";
import { cancelMembership, getMyMembership } from "@/lib/auth-api";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const formatDate = (date: string | null) =>
  date ? new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(new Date(date)) : "—";

const SubscriptionPlanCard = () => {
  const { data: session, status } = useSession();
  const accessToken = session?.user.accessToken;
  const queryClient = useQueryClient();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const membershipQuery = useQuery({
    queryKey: ["subscription", "my-membership", accessToken],
    queryFn: () => getMyMembership(accessToken!),
    enabled: status === "authenticated" && Boolean(accessToken),
    staleTime: 30_000,
  });
  const membership = membershipQuery.data?.data;
  const cancelMutation = useMutation({
    mutationKey: ["subscription", "cancel-membership"],
    mutationFn: () => {
      if (!accessToken) throw new Error("Your session has expired. Please sign in again.");
      return cancelMembership(accessToken);
    },
    onSuccess: async (response) => {
      setCancelDialogOpen(false);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["subscription", "my-membership"] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard", "user-overview"] }),
      ]);
      toast.success(response.data.message || response.message || "Membership cancelled successfully.");
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Unable to cancel membership."),
  });

  if (status === "loading" || membershipQuery.isLoading) {
    return <section aria-label="Loading subscription plan" className="h-[252px] animate-pulse rounded-[12px] border border-[#f5dca5] bg-white" />;
  }

  if (membershipQuery.isError) {
    return <section role="alert" className="rounded-[12px] border border-[#f1c5c5] bg-[#fff7f7] p-4 text-sm text-[#8c311e]">Subscription plan could not be loaded. <button type="button" onClick={() => membershipQuery.refetch()} className="font-semibold underline">Try again</button></section>;
  }

  if (!membership) {
    return <section className="rounded-[12px] border border-dashed border-[#b7c9dc] bg-[#f7fbff] p-4 text-sm text-[#38526e]">Subscription plan information is unavailable.</section>;
  }

  return (
    <>
      <section className="rounded-[12px] border border-[#f5dca5] p-4">
      <div className="flex items-center gap-4">
        <span className="grid size-12 place-items-center rounded-full bg-[#fff2d6] text-[#d79411]"><Crown size={24} /></span>
        <div>
          <p className="text-sm text-[#545454]">Current Membership</p>
          <h3 className="mt-1 text-xl font-bold text-[#0e1224]">{membership.planName}</h3>
          <p className="mt-1 text-sm font-medium text-[#b58400]">{membership.subTitle}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-[#e4eaf8] pt-4 text-sm">
        <p>Membership status <b className="ml-2 text-[#10b981]">{membership.status}</b></p>
        <p>Next Billing Date <b className="ml-2 text-[#141936]">{formatDate(membership.nextBillingDate)}</b></p>
        <button type="button" onClick={() => setCancelDialogOpen(true)} disabled={!membership.canCancel || cancelMutation.isPending} className="rounded-[6px] border border-[#ef4444] px-3 py-2 font-medium text-[#ef4444] disabled:cursor-not-allowed disabled:opacity-50">Cancel Membership</button>
      </div>
      <p className="mt-4 flex gap-2 rounded-[8px] bg-[#f5f7ff] p-3 text-sm text-[#104170]"><Info size={18} className="shrink-0" />{membership.notice}</p>
      </section>
      <Dialog open={cancelDialogOpen} onOpenChange={(open) => !cancelMutation.isPending && setCancelDialogOpen(open)}>
        <DialogContent showCloseButton={!cancelMutation.isPending} className="max-w-[420px] rounded-[12px] bg-white p-6">
          <DialogHeader className="gap-3 text-center">
            <DialogTitle className="text-lg font-bold text-[#17212e]">Cancel membership?</DialogTitle>
            <DialogDescription className="text-sm leading-relaxed text-[#667085]">Your {membership.planName} benefits remain active until {formatDate(membership.endDate)}. After that, your account switches to Free.</DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-2 grid w-full grid-cols-2 gap-3 border-0 bg-transparent p-0">
            <button type="button" disabled={cancelMutation.isPending} onClick={() => setCancelDialogOpen(false)} className="h-10 rounded-[6px] border border-[#cbd5e1] text-sm font-medium text-[#344054] disabled:opacity-60">Keep Membership</button>
            <button type="button" disabled={cancelMutation.isPending} onClick={() => cancelMutation.mutate()} className="h-10 rounded-[6px] bg-[#ed2532] text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60">{cancelMutation.isPending ? "Cancelling..." : "Cancel Membership"}</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SubscriptionPlanCard;
