"use client";

import { BadgePercent, CircleAlert, CreditCard, FileText, Search, ShoppingCart, WalletCards, X } from "lucide-react";
import { useMemo, useState } from "react";

type Notification = { title: string; description: string; time: string; group: "Today" | "Yesterday" | "Previous"; icon: typeof Search; iconClass: string; read: boolean };

const notifications: Notification[] = [
  { title: "New lead matches available", description: "37 new pre-foreclosure leads match your “Orange country” saved search.", time: "2:00 PM", group: "Today", icon: Search, iconClass: "text-[#087ce1]", read: false },
  { title: "Saved search updated", description: "Your saved search “Riverside Country” has been updated.", time: "3:23 PM", group: "Today", icon: FileText, iconClass: "text-[#9b5de5]", read: true },
  { title: "Order completed", description: "Your order has been completed successfully.", time: "2:34 PM", group: "Yesterday", icon: ShoppingCart, iconClass: "text-[#10a44c]", read: true },
  { title: "Credit Request Approved", description: "Your bad lead credit request has been approved.", time: "4:34 PM", group: "Yesterday", icon: CreditCard, iconClass: "text-[#7c5cff]", read: true },
  { title: "Payment Failed", description: "Your subscription payment could not be processed.", time: "5:22 PM", group: "Yesterday", icon: CircleAlert, iconClass: "text-[#fb5570]", read: true },
  { title: "Promo Code Applied", description: "The promo code LEAD10 has been successfully applied to your recent order.", time: "10:00 PM", group: "Yesterday", icon: BadgePercent, iconClass: "text-[#087ce1]", read: true },
  { title: "Account Balance Updated", description: "Your account balance is now $500", time: "11:56 PM", group: "Yesterday", icon: WalletCards, iconClass: "text-[#a4b61b]", read: true },
  { title: "Saved search updated", description: "Your saved search “Riverside Country” has been updated.", time: "27 Sep, 2026", group: "Previous", icon: FileText, iconClass: "text-[#9b5de5]", read: true },
  { title: "Order completed", description: "Your order has been completed successfully.", time: "27 Sep, 2026", group: "Previous", icon: ShoppingCart, iconClass: "text-[#10a44c]", read: true },
];

export const unreadNotificationCount = notifications.filter(
  (notification) => !notification.read,
).length;

const DashboardNotificationPanel = ({ onClose }: { onClose: () => void }) => {
  const [activeTab, setActiveTab] = useState<"all" | "read" | "unread">("all");
  const visibleNotifications = useMemo(() => notifications.filter((notification) => activeTab === "all" || (activeTab === "read" ? notification.read : !notification.read)), [activeTab]);
  const unreadCount = unreadNotificationCount;

  return <div className="fixed inset-0 z-[60] bg-black/75" onClick={onClose}>
    <aside data-lenis-prevent className="absolute right-0 top-0 flex h-full w-full max-w-[547px] flex-col bg-white shadow-[-2px_0_3px_rgba(0,0,0,0.1)]" onClick={(event) => event.stopPropagation()} aria-label="Notifications">
      <div className="px-6 pt-6">
        <div className="flex items-center justify-between gap-5"><h2 className="text-[32px] font-bold leading-[38px] text-[#0e1224]">Notifications</h2><button type="button" onClick={onClose} aria-label="Close notifications" className="grid size-8 place-items-center rounded-md text-[#77839a] transition hover:bg-[#f3f6fa] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0073df]"><X size={24} strokeWidth={1.6} /></button></div>
        <div className="mt-6 flex gap-6 border-b border-[#f1f4f9] text-base">
          {(["all", "read", "unread"] as const).map((tab) => <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={`relative pb-2.5 capitalize transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0073df] ${activeTab === tab ? "border-b border-[#104170] text-[#104170]" : "text-[#a8a8a8] hover:text-[#475467]"}`}>{tab}{tab === "unread" && unreadCount > 0 && <span className="ml-1 inline-grid size-4 place-items-center rounded-full bg-[#c20000] text-[10px] text-white">{unreadCount}</span>}</button>)}
        </div>
      </div>
      <div className="dashboard-summary-scroll min-h-0 flex-1 overflow-y-auto px-6 pb-7 pt-10" data-lenis-prevent>
        {(["Today", "Yesterday", "Previous"] as const).map((group) => {
          const groupNotifications = visibleNotifications.filter((notification) => notification.group === group);
          if (!groupNotifications.length) return null;
          return <section key={group} className="mb-4 last:mb-0"><h3 className="text-lg font-medium text-black">{group}</h3><div className="mt-6 space-y-4">{groupNotifications.map(({ title, description, time, icon: Icon, iconClass }) => <article key={`${title}-${time}`} className="flex gap-4 border-b border-[#bfbfbf] pb-4"><Icon className={`mt-0.5 shrink-0 ${iconClass}`} size={29} strokeWidth={1.6} /><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-3"><h4 className="text-2xl font-medium leading-7 text-black">{title}</h4><time className="shrink-0 pt-1 text-base text-[#7c7c7c]">{time}</time></div><p className="mt-1.5 text-base leading-5 text-[#7c7c7c]">{description}</p></div></article>)}</div></section>;
        })}
      </div>
    </aside>
  </div>;
};

export default DashboardNotificationPanel;
