"use client";

import { X } from "lucide-react";

const notifications = [
  ["New lead matches available", "37 new pre-foreclosure leads match your Orange county saved search.", "2:00 PM"],
  ["Saved search updated", "Your saved search ‘Riverside Country’ has been updated.", "3:23 PM"],
  ["Order completed", "Your order has been completed successfully.", "Yesterday"],
  ["Credit Request Approved", "Your bad lead credit request has been approved.", "4:34 PM"],
  ["Payment Failed", "Your subscription payment could not be processed.", "5:22 PM"],
];

const DashboardNotificationPanel = ({ onClose }: { onClose: () => void }) => <div className="fixed inset-0 z-40 bg-black/60" onClick={onClose}>
  <aside className="absolute right-0 top-0 h-full w-full max-w-[560px] overflow-y-auto bg-white px-6 py-7 shadow-2xl" onClick={(event) => event.stopPropagation()}>
    <div className="flex items-center justify-between"><h2 className="text-[22px] font-bold text-[#101828]">Notifications</h2><button onClick={onClose} aria-label="Close notifications"><X className="text-[#667085]" /></button></div>
    <div className="mt-5 flex gap-5 border-b border-[#e4e7ec] text-sm"><button className="border-b-2 border-[#087cf0] pb-2 text-[#087cf0]">All</button><button className="pb-2 text-[#98a2b3]">Read</button><button className="pb-2 text-[#98a2b3]">Unread <span className="rounded-full bg-[#ed2532] px-1 text-[9px] text-white">1</span></button></div>
    <p className="mt-5 text-xs font-semibold text-[#667085]">Today</p>{notifications.map(([title, description, time], index) => <div key={title} className="flex gap-3 border-b border-[#e4e7ec] py-5"><span className={`mt-1 size-2 rounded-full ${index === 0 ? "bg-[#0073df]" : "bg-[#8b5cf6]"}`} /><div className="min-w-0 flex-1"><div className="flex justify-between gap-4"><p className="font-semibold text-[#101828]">{title}</p><time className="whitespace-nowrap text-xs text-[#98a2b3]">{time}</time></div><p className="mt-1 text-sm text-[#667085]">{description}</p></div></div>)}
  </aside>
</div>;

export default DashboardNotificationPanel;
