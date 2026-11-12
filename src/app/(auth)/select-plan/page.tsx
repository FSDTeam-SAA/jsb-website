"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import AuthShell from "@/components/auth/auth-shell";
import AuthBackLink from "@/components/auth/auth-back-link";
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
      router.replace("/lead-interests");
      router.refresh();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const selectedPlan = plans.find((plan) => plan.id === selectedPlanId);

  return (
    <AuthShell variant="select-plan">
      <div className="select-plan-layout w-full max-w-[644px] transform-gpu min-[1400px]:translate-x-[34px]">
        <AuthBackLink href="/dashboard" label="Back to dashboard" />

        <div className="mx-auto w-full">
          <h1 className="font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,'Segoe_UI',sans-serif] text-center text-3xl font-bold leading-none text-black sm:text-4xl">
            Select Plan
          </h1>
          <p className="mt-3 font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,'Segoe_UI',sans-serif] text-center text-sm font-medium leading-none text-black sm:text-base">
            Select the plan that fits your needs and save more on every lead you purchase.
          </p>

          {plansQuery.isLoading ? (
            <div className="mt-4 grid grid-cols-1 items-start gap-6 sm:grid-cols-2" aria-label="Loading subscription plans">
              {[1, 2, 3, 4].map((card) => (
                <div key={card} className="h-[329px] animate-pulse rounded-xl bg-[#edf2f7]" />
              ))}
            </div>
          ) : plansQuery.isError ? (
            <section role="alert" className="mt-6 rounded-xl border border-[#fecaca] bg-[#fff7f7] p-5 text-center">
              <h2 className="text-base font-bold text-[#8c311e]">Plans could not be loaded</h2>
              <p className="mt-1 text-sm text-[#5d3830]">Please check your connection and try again.</p>
              <button type="button" onClick={() => plansQuery.refetch()} className="mt-4 rounded-lg bg-[#104170] px-4 py-2 text-sm font-semibold text-white">Try again</button>
            </section>
          ) : plans.length === 0 ? (
            <section className="mt-6 rounded-xl border border-dashed border-[#b7c9dc] bg-[#f7fbff] p-5 text-center">
              <h2 className="text-base font-bold text-[#104170]">No plans are available yet</h2>
              <p className="mt-1 text-sm text-[#38526e]">Please check back later or contact support for help.</p>
            </section>
          ) : (
            <div className="mt-4 grid grid-cols-1 items-start gap-6 sm:grid-cols-2">
              {plans.map((plan) => (
                <button
                  key={plan.id}
                  type="button"
                  aria-pressed={selectedPlanId === plan.id}
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={`flex flex-col items-center gap-8 rounded-xl p-6 text-center font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,'Segoe_UI',sans-serif] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104170] focus-visible:ring-offset-2 ${selectedPlanId === plan.id ? "h-[335px] border-4 border-[#104170]" : "h-[329px] border border-[#949494] hover:border-[#104170]"}`}
                >
                  <div className="w-full">
                    <h2 className="text-2xl font-bold leading-[29px] text-[#151515]">{plan.title}</h2>
                    <p className="mt-1.5 line-clamp-2 h-[36px] text-sm font-bold leading-[18px] text-[#151515]">{plan.subTitle}</p>
                  </div>
                  <p className="flex h-[66px] items-center justify-center font-bold leading-none text-black">
                    <span className="mt-2 text-2xl">$</span>
                    <span className="text-5xl">{price(plan)}</span>
                    <span className="mt-5 text-sm">/month</span>
                  </p>
                  <div className="w-full rounded-xl bg-[#f4f8ff] py-3 text-[#104170]">
                    <b className="block text-2xl font-bold leading-[37px]">{plan.discount}%</b>
                    <p className="text-sm font-bold leading-[17px]">Lead Discount</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => selectedPlanId && paymentMutation.mutate(selectedPlanId)}
            disabled={!selectedPlan || status === "loading" || paymentMutation.isPending}
            className="mt-9 h-12 w-full rounded-lg bg-[#104170] font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,'Segoe_UI',sans-serif] text-base font-bold text-white transition-colors hover:bg-[#0b365f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104170] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {paymentMutation.isPending ? "Preparing checkout..." : "Continue to Payment"}
          </button>
        </div>
      </div>
    </AuthShell>
  );
}
