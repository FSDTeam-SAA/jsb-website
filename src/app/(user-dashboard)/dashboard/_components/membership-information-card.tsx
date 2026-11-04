import Link from "next/link";
import { Crown } from "lucide-react";

export type MembershipInformation = {
  plan: string;
  leadDiscount: string;
  memberSince: string;
  nextBillingDate: string;
};

const defaultMembership: MembershipInformation = {
  plan: "Gold",
  leadDiscount: "10%",
  memberSince: "Jan 12, 2025",
  nextBillingDate: "Mar 12, 2026",
};

const MembershipInformationCard = ({
  membership = defaultMembership,
}: {
  membership?: MembershipInformation;
}) => (
  <article className="overflow-hidden rounded-2xl border border-[#ebf4ff] bg-white">
    <div className="flex h-[52px] items-center justify-between border-b-2 border-[#f1f4f9] px-3">
      <div className="flex items-center gap-1">
        <Crown size={24} className="text-[#087ce7]" />
        <h2 className="text-sm font-bold text-black">Membership Information</h2>
      </div>
      <Link href="/dashboard/account" className="text-xs font-semibold text-[#1779fe]">
        View All
      </Link>
    </div>
    <div className="space-y-3 px-3 py-4 text-xs">
      <MembershipRow label="Membership Plan" value={membership.plan} />
      <MembershipRow label="Lead Discount" value={membership.leadDiscount} />
      <MembershipRow label="Member Since" value={membership.memberSince} />
      <MembershipRow label="Next Billing Date" value={membership.nextBillingDate} />
      <Link
        href="/dashboard/account"
        className="mt-2 block rounded-[5px] bg-[#e7f2ff] py-2 text-center text-base font-medium text-[#0073df]"
      >
        Manage Membership
      </Link>
    </div>
  </article>
);

const MembershipRow = ({ label, value }: { label: string; value: string }) => (
  <p className="flex justify-between gap-3 text-[#878a9b]">
    <span>{label}</span>
    <b className="shrink-0 text-black">{value}</b>
  </p>
);

export default MembershipInformationCard;
