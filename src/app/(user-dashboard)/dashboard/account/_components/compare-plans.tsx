"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import {
  createSubscriptionPayment,
  getActivePlans,
  getCurrentUserProfile,
  type SubscriptionPlan,
} from "@/lib/auth-api";

const formatPrice = (plan: SubscriptionPlan) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: plan.currency || "USD",
    maximumFractionDigits: 0,
  }).format(Number(plan.price));

const ComparePlans = () => {
  const { data: session, status } = useSession();
  const accessToken = session?.user.accessToken;
  const queryClient = useQueryClient();
  const plansQuery = useQuery({
    queryKey: ["subscription", "active-plans"],
    queryFn: getActivePlans,
    staleTime: 5 * 60 * 1000,
  });
  const profileQuery = useQuery({
    queryKey: ["user", "profile", accessToken],
    queryFn: () => getCurrentUserProfile(accessToken!),
    enabled: status === "authenticated" && Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
  });
  const plans = plansQuery.data?.data ?? [];
  const activeSubscription =
    profileQuery.data?.data.activeSubscription ??
    profileQuery.data?.data.activeSubscribe;
  const paymentMutation = useMutation({
    mutationKey: ["subscription", "create-payment"],
    mutationFn: (subscribeId: string) => {
      if (!accessToken) throw new Error("Your session has expired. Please sign in again.");
      return createSubscriptionPayment(accessToken, subscribeId);
    },
    onSuccess: async (response) => {
      const { checkoutUrl } = response.data;
      if (checkoutUrl) {
        window.location.assign(checkoutUrl);
        return;
      }

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["dashboard", "user-overview"] }),
        queryClient.invalidateQueries({ queryKey: ["user", "profile"] }),
        queryClient.invalidateQueries({ queryKey: ["subscription", "my-membership"] }),
      ]);
      toast.success(response.message || "Subscription activated successfully.");
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Unable to start subscription checkout."),
  });

  const selectPlan = (plan: SubscriptionPlan) => {
    if (paymentMutation.isPending) return;

    if (status !== "authenticated" || !accessToken) {
      toast.error("Your session has expired. Please sign in again.");
      return;
    }
    paymentMutation.mutate(plan.id);
  };

  if (plansQuery.isLoading) {
    return <section aria-label="Loading membership plans" className="mt-6"><h3 className="text-xl font-bold text-[#0e1224]">Compare Plans</h3><div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <div key={index} className="h-[300px] animate-pulse rounded-[8px] bg-[#edf2f7]" />)}</div></section>;
  }

  if (plansQuery.isError) {
    return <section role="alert" className="mt-6 rounded-[8px] border border-[#f1c5c5] bg-[#fff7f7] p-5 text-center"><h3 className="text-base font-bold text-[#8c311e]">Plans could not be loaded</h3><p className="mt-1 text-sm text-[#5d3830]">Please check your connection and try again.</p><button type="button" onClick={() => plansQuery.refetch()} className="mt-4 rounded-[6px] bg-[#104170] px-4 py-2 text-sm font-semibold text-white">Try again</button></section>;
  }

  if (!plans.length) {
    return <section className="mt-6 rounded-[8px] border border-dashed border-[#b7c9dc] bg-[#f7fbff] p-5 text-center"><h3 className="text-base font-bold text-[#104170]">No plans are available yet</h3><p className="mt-1 text-sm text-[#38526e]">Please check back later or contact support for help.</p></section>;
  }

  return (
    <section className="mt-6">
      <h3 className="text-xl font-bold text-[#0e1224]">Compare Plans</h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {plans.map((plan) => {
          const isPending = paymentMutation.isPending && paymentMutation.variables === plan.id;
          const isFree = Number(plan.price) === 0;
          const isCurrentPlan =
            activeSubscription?.status === "ACTIVE" &&
            activeSubscription.subscribeId === plan.id;

          return (
            <article
              key={plan.id}
              aria-current={isCurrentPlan ? "true" : undefined}
              className={`relative rounded-[8px] border p-4 text-center ${isCurrentPlan ? "border-[#0073df] ring-1 ring-[#0073df]" : "border-[#d9dde5]"}`}
            >
              {isCurrentPlan && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#0073df] px-3 py-1 text-xs font-semibold text-white">
                  Current Plan
                </span>
              )}
              <h4 className="text-xl font-bold">{plan.title}</h4>
              <p className="mt-2 min-h-10 text-sm text-[#545454]">{plan.subTitle}</p>
              <p className="mt-3 text-4xl font-bold">{formatPrice(plan)}<span className="text-sm">/month</span></p>
              <div className="mt-5 rounded-[8px] bg-[#f5f7ff] py-3 text-[#104170]"><b className="text-lg">{plan.discount}%</b><p className="mt-1 text-sm">Lead Discount</p></div>
              <button
                type="button"
                onClick={() => selectPlan(plan)}
                disabled={isPending || isCurrentPlan}
                className="mt-4 h-12 rounded-[6px] bg-[#104170] px-4 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isCurrentPlan
                  ? "Current Plan"
                  : isPending
                    ? (isFree ? "Activating..." : "Opening checkout...")
                    : "Choose Plan"}
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default ComparePlans;
