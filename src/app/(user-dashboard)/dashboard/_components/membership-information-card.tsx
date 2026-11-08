"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Crown } from "lucide-react";
import { useSession } from "next-auth/react";
import { getUserDashboardOverview } from "@/lib/dashboard-api";

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(date));

const MembershipInformationCard = () => {
  const { data: session, status } = useSession();
  const accessToken = session?.user.accessToken;
  const overviewQuery = useQuery({
    queryKey: ["dashboard", "user-overview", accessToken],
    queryFn: () => getUserDashboardOverview(accessToken!),
    enabled: status === "authenticated" && Boolean(accessToken),
    staleTime: 30_000,
  });
  const membership = overviewQuery.data?.data.overviewCards.membership;

  return (
    <article className="overflow-hidden rounded-2xl border border-[#ebf4ff] bg-white">
      <div className="flex h-[52px] items-center justify-between border-b-2 border-[#f1f4f9] px-3">
        <div className="flex items-center gap-1">
          <Crown size={24} className="text-[#087ce7]" />
          <h2 className="text-sm font-bold text-black">Membership Information</h2>
        </div>
        <Link href="/dashboard/account/subscription-plan" className="text-xs font-semibold text-[#1779fe]">View All</Link>
      </div>
      <div className="space-y-3 px-3 py-4 text-xs">
        {status === "loading" || overviewQuery.isLoading ? (
          Array.from({ length: 4 }, (_, index) => <span key={index} className="block h-3 animate-pulse rounded bg-[#edf2f7]" />)
        ) : overviewQuery.isError ? (
          <div role="alert" className="text-[#d92d20]">Membership information could not be loaded. <button type="button" onClick={() => overviewQuery.refetch()} className="font-semibold underline">Try again</button></div>
        ) : membership ? (
          <>
            <MembershipRow label="Membership Plan" value={membership.planName} />
            <MembershipRow label="Lead Discount" value={membership.subTitle} />
            <MembershipRow label="Member Since" value={formatDate(membership.startDate)} />
            <MembershipRow label="Next Billing Date" value={formatDate(membership.endDate)} />
          </>
        ) : (
          <p className="text-[#878a9b]">Membership information is unavailable.</p>
        )}
        <Link href="/dashboard/account/subscription-plan" className="mt-2 block rounded-[5px] bg-[#e7f2ff] py-2 text-center text-base font-medium text-[#0073df]">Manage Membership</Link>
      </div>
    </article>
  );
};

const MembershipRow = ({ label, value }: { label: string; value: string }) => (
  <p className="flex justify-between gap-3 text-[#878a9b]">
    <span>{label}</span>
    <b className="shrink-0 text-black">{value}</b>
  </p>
);

export default MembershipInformationCard;
