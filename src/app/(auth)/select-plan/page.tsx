"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import AuthShell from "@/components/auth/auth-shell";
import {
  createSubscriptionPayment,
  getActivePlans,
  type SubscriptionPlan,
} from "@/lib/auth-api";

const price = (plan: SubscriptionPlan) => Number(plan.price).toFixed(0);

export default function SelectPlanPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [selectedPlanId, setSelectedPlanId] = useState<string>();
  const plansQuery = useQuery({
    queryKey: ["subscription", "active-plans"],
    queryFn: getActivePlans,
  });
  const plans = useMemo(() => plansQuery.data?.data ?? [], [plansQuery.data]);

  useEffect(() => {
    if (!selectedPlanId && plans.length) setSelectedPlanId(plans[0].id);
  }, [plans, selectedPlanId]);

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login?callbackUrl=/select-plan");
  }, [router, status]);

  const paymentMutation = useMutation({
    mutationKey: ["subscription", "create-payment"],
    mutationFn: (subscribeId: string) => {
      const accessToken = session?.user.accessToken;
      if (!accessToken) throw new Error("Please log in to select a plan.");
      return createSubscriptionPayment(accessToken, subscribeId);
    },
    onSuccess: (response) => {
      const { checkoutUrl } = response.data;
      if (checkoutUrl) {
        window.location.assign(checkoutUrl);
        return;
      }

      toast.success(response.message || "Free subscription activated successfully.");
      router.push("/dashboard");
      router.refresh();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const selectedPlan = plans.find((plan) => plan.id === selectedPlanId);

  return (
    <AuthShell>
      <div className="w-full max-w-[640px]">
        <button onClick={() => router.back()} className="mb-8 text-sm text-[#0f2c4f]">← &nbsp; Back</button>
        <h1 className="text-center text-3xl font-bold">Select Plan</h1>
        <p className="mt-2 text-center text-sm">Select the plan that fits your needs and save more on every lead you purchase.</p>

        {plansQuery.isLoading && <p className="mt-8 text-center text-sm">Loading plans...</p>}
        {plansQuery.isError && <p className="mt-8 text-center text-sm text-red-600">Unable to load plans. Please refresh and try again.</p>}
        {!plansQuery.isLoading && !plansQuery.isError && plans.length === 0 && <p className="mt-8 text-center text-sm">No subscription plans are available right now.</p>}

        <div className="mt-4 grid grid-cols-2 gap-4">
          {plans.map((plan) => (
            <button
              key={plan.id}
              type="button"
              onClick={() => setSelectedPlanId(plan.id)}
              className={`h-[215px] rounded-[8px] border p-4 text-center ${selectedPlanId === plan.id ? "border-[3px] border-[#104170]" : "border-[#aaa]"}`}
            >
              <h2 className="text-xl font-bold">{plan.title}</h2>
              <p className="mt-1 min-h-10 text-xs text-[#545454]">{plan.subTitle}</p>
              <p className="mt-2 text-3xl font-bold">${price(plan)}<span className="text-xs">/month</span></p>
              <div className="mt-5 rounded-[8px] bg-[#f3f7ff] py-3 text-[#104170]"><b className="text-xl">{plan.discount}%</b><p className="text-xs font-bold">Lead Discount</p></div>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => selectedPlanId && paymentMutation.mutate(selectedPlanId)}
          disabled={!selectedPlan || status === "loading" || paymentMutation.isPending}
          className="mt-6 h-12 w-full rounded-[8px] bg-[#104170] text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {paymentMutation.isPending
            ? "Preparing checkout..."
            : selectedPlan && Number(selectedPlan.price) === 0
              ? "Activate Free Plan"
              : "Continue to Payment"}
        </button>
      </div>
    </AuthShell>
  );
}
