"use client";

import { useMemo } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  createSubscriptionPayment,
  getActivePlans,
  type SubscriptionPlan,
} from "@/lib/auth-api";

const formatPlanPrice = (plan: SubscriptionPlan) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: plan.currency || "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(plan.price));

const PlanCardSkeleton = () => (
  <article aria-hidden="true" className="mx-auto flex h-[397px] w-[310px] animate-pulse flex-col rounded-xl border border-[#e1e6ed] p-6 lg:w-full">
    <div className="mx-auto h-7 w-24 rounded bg-[#e8edf4]" />
    <div className="mx-auto mt-3 h-4 w-48 rounded bg-[#edf1f6]" />
    <div className="mx-auto mt-2 h-4 w-36 rounded bg-[#edf1f6]" />
    <div className="mx-auto mt-8 h-12 w-36 rounded bg-[#e8edf4]" />
    <div className="mt-8 h-[78px] rounded-xl bg-[#eef4fc]" />
    <div className="mx-auto mt-auto h-[38px] w-[166px] rounded-[8px] bg-[#e8edf4]" />
  </article>
);

const PlansError = ({ retry }: { retry: () => void }) => (
  <div role="alert" className="mx-auto mt-8 max-w-xl rounded-xl border border-[#f1c5c5] bg-[#fff7f7] px-6 py-8 text-center">
    <h3 className="text-lg font-bold text-[#8c311e]">Plans could not be loaded</h3>
    <p className="mt-2 text-sm text-[#5d3830]">Please check your connection and try again.</p>
    <button type="button" onClick={retry} className="mt-5 inline-flex h-10 items-center justify-center rounded-[7px] bg-[#104170] px-5 text-sm font-bold text-white transition hover:bg-[#0b3b65] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104170] focus-visible:ring-offset-2">
      Try again
    </button>
  </div>
);

const PlansNotFound = () => (
  <div className="mx-auto mt-8 max-w-xl rounded-xl border border-dashed border-[#b7c9dc] bg-[#f7fbff] px-6 py-8 text-center">
    <h3 className="text-lg font-bold text-[#104170]">No membership plans are available</h3>
    <p className="mt-2 text-sm text-[#38526e]">Please check back soon for active membership options.</p>
  </div>
);

const OurPlan = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const plansQuery = useQuery({
    queryKey: ["subscription", "active-plans"],
    queryFn: getActivePlans,
    staleTime: 5 * 60 * 1000,
  });
  const plans = useMemo(() => plansQuery.data?.data ?? [], [plansQuery.data]);

  const paymentMutation = useMutation({
    mutationKey: ["subscription", "create-payment"],
    mutationFn: (subscribeId: string) => {
      const accessToken = session?.user.accessToken;
      if (!accessToken) throw new Error("Please log in before selecting a plan.");
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

  const selectPlan = (plan: SubscriptionPlan) => {
    if (paymentMutation.isPending) return;

    if (status !== "authenticated") {
      router.push("/sign-up");
      return;
    }

    paymentMutation.mutate(plan.id);
  };

  const actionLabel = (plan: SubscriptionPlan) => {
    if (paymentMutation.isPending && paymentMutation.variables === plan.id) {
      return Number(plan.price) === 0 ? "Activating..." : "Opening checkout...";
    }
    if (status !== "authenticated") {
      return Number(plan.price) === 0 ? "Create Free Account" : "Choose Plan";
    }
    return Number(plan.price) === 0 ? "Activate Free Plan" : "Choose Plan";
  };

  return (
    <section id="pricing" aria-labelledby="pricing-heading" className="bg-white py-8 sm:py-12 lg:py-[60px]">
      <div className="container mx-auto px-4 lg:px-0">
        <header className="text-center">
          <p className="inline-flex h-[30px] items-center rounded-[8px] bg-[#d1e4f6] px-3 text-xs font-medium text-[#104170] lg:text-sm">Our Plan</p>
          <h2 id="pricing-heading" className="mt-6 text-xl font-bold leading-none tracking-[-0.04em] text-[#104170] lg:text-[40px]">Membership Plans</h2>
        </header>

        {plansQuery.isLoading && (
          <div aria-label="Loading membership plans" className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {Array.from({ length: 4 }, (_, index) => <PlanCardSkeleton key={index} />)}
          </div>
        )}

        {plansQuery.isError && <PlansError retry={() => plansQuery.refetch()} />}
        {!plansQuery.isLoading && !plansQuery.isError && plans.length === 0 && <PlansNotFound />}

        {!plansQuery.isLoading && !plansQuery.isError && plans.length > 0 && (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {plans.map((plan) => (
              <article key={plan.id} className="mx-auto flex h-[397px] w-[310px] flex-col rounded-xl border border-[#949494] p-6 text-center lg:w-full">
                <h3 className="text-2xl font-bold leading-none text-[#151515]">{plan.title}</h3>
                <p className="mx-auto mt-1.5 min-h-[34px] max-w-[230px] text-sm font-bold leading-[1.2] text-[#151515]">{plan.subTitle}</p>

                <p className="mt-8 flex items-baseline justify-center font-bold leading-none text-black">
                  <span className="text-5xl tracking-[-0.045em]">{formatPlanPrice(plan)}</span>
                  <span className="ml-1 text-sm">/month</span>
                </p>

                <div className="mt-8 rounded-xl bg-[#f4f8ff] py-3 text-[#104170]">
                  <p className="text-2xl font-bold leading-none">{plan.discount}%</p>
                  <p className="mt-1.5 text-sm font-bold">Lead Discount</p>
                </div>

                <button
                  type="button"
                  onClick={() => selectPlan(plan)}
                  disabled={
                    status === "loading" ||
                    (paymentMutation.isPending &&
                      paymentMutation.variables === plan.id)
                  }
                  className="mt-auto inline-flex h-[38px] w-[166px] items-center justify-center self-center rounded-[8px] bg-[#104170] px-3 text-sm font-bold text-white transition hover:bg-[#0b3b65] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104170] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {actionLabel(plan)}
                </button>
              </article>
            ))}
          </div>
        )}

        <p className="mx-auto mt-8 max-w-[390px] text-center text-sm text-[#111] lg:max-w-none">All memberships are <strong>month-to-month.</strong> Customers can cancel at any time</p>
      </div>
    </section>
  );
};

export default OurPlan;
