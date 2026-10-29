import Link from "next/link";
import { Bell, Bookmark, Crown, SearchCheck } from "lucide-react";

const orders = [["#FG-10482", "25 leads", "Feb 2, 2026", "$625.00"], ["#FG-10481", "50 leads", "Jan 28, 2026", "$1,250.00"], ["#FG-10480", "25 leads", "Jan 16, 2026", "$625.00"]];
const searches = [["California Pre-Foreclosure", "2,847 matches"], ["Texas Tax Liens", "1,156 matches"], ["Florida Foreclosures", "892 matches"]];

const PanelTitle = ({ icon: Icon, title }: { icon: typeof SearchCheck; title: string }) => <div className="flex items-center justify-between border-b border-[#edf1f5] px-3 py-3"><div className="flex items-center gap-2"><Icon size={16} className="text-[#087ce7]" /><h2 className="text-[13px] font-bold text-[#17212e]">{title}</h2></div><Link href="#" className="text-[10px] text-[#0073df]">View All</Link></div>;

const DashboardActivity = () => <section className="mt-4 grid gap-3 xl:grid-cols-[2fr_0.9fr_1fr_1fr]">
  <article className="overflow-hidden rounded-[8px] bg-white"><PanelTitle icon={SearchCheck} title="Recent Orders" /><div className="px-3">{orders.map((order) => <div key={order[0]} className="grid grid-cols-4 border-b border-[#edf1f5] py-4 text-[10px] text-[#667085] last:border-0"><span className="font-semibold text-[#344054]">{order[0]}</span><span>{order[1]}</span><span>{order[2]}</span><span className="text-right text-[#344054]">{order[3]}</span></div>)}</div></article>
  <article className="overflow-hidden rounded-[8px] bg-white"><PanelTitle icon={Bookmark} title="Saved Searches" /><div className="px-3">{searches.map(([name, matches]) => <div key={name} className="flex justify-between border-b border-[#edf1f5] py-4 text-[10px] last:border-0"><span className="text-[#344054]">{name}</span><span className="text-[#98a2b3]">{matches}</span></div>)}</div></article>
  <article className="overflow-hidden rounded-[8px] bg-white"><PanelTitle icon={Bell} title="New Leads Matching Saved Searches" /><div className="px-3">{searches.map(([name], index) => <div key={name} className="flex justify-between border-b border-[#edf1f5] py-4 text-[10px] last:border-0"><span className="text-[#344054]">{name}</span><span className="text-[#00a77a]">+{[124, 67, 43][index]} ›</span></div>)}</div></article>
  <article className="overflow-hidden rounded-[8px] bg-white"><PanelTitle icon={Crown} title="Membership Information" /><div className="space-y-2 px-3 py-3 text-[10px]"><p className="flex justify-between text-[#667085]"><span>Membership Plan</span><b className="text-[#344054]">Gold</b></p><p className="flex justify-between text-[#667085]"><span>Lead Discount</span><b className="text-[#344054]">10%</b></p><p className="flex justify-between text-[#667085]"><span>Member Since</span><b className="text-[#344054]">Jan 12, 2025</b></p><p className="flex justify-between text-[#667085]"><span>Next Billing Date</span><b className="text-[#344054]">Mar 12, 2026</b></p><Link href="#" className="mt-2 block rounded-[5px] bg-[#e7f2ff] py-2 text-center text-[11px] font-medium text-[#0073df]">Manage Membership</Link></div></article>
</section>;

export default DashboardActivity;
