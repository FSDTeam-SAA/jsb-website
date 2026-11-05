"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CircleAlert,
  CreditCard,
  FileText,
  Search,
  ShoppingCart,
  WalletCards,
  X,
  type LucideIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import {
  getMyNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  type DashboardNotification,
  type NotificationType,
} from "@/lib/notification-api";

type NotificationGroup = "Today" | "Yesterday" | "Previous";

type DashboardNotificationPanelProps = {
  accessToken?: string;
  unreadCount: number;
  onClose: () => void;
};

const notificationVisuals: Record<
  NotificationType,
  { icon: LucideIcon; iconClass: string }
> = {
  ORDER: { icon: ShoppingCart, iconClass: "text-[#10a44c]" },
  BAD_LEAD_REQUEST: { icon: CreditCard, iconClass: "text-[#7c5cff]" },
  SUPPORT_REPLY: { icon: CircleAlert, iconClass: "text-[#fb5570]" },
  SAVED_SEARCH_ALERT: { icon: Search, iconClass: "text-[#087ce1]" },
  WALLET_TRANSACTION: { icon: WalletCards, iconClass: "text-[#a4b61b]" },
  ACCOUNT_DELETION: { icon: CircleAlert, iconClass: "text-[#fb5570]" },
  SYSTEM: { icon: FileText, iconClass: "text-[#9b5de5]" },
};

const getNotificationGroup = (createdAt: string): NotificationGroup => {
  const created = new Date(createdAt);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (created >= today) return "Today";
  if (created >= yesterday) return "Yesterday";
  return "Previous";
};

const formatNotificationTime = (createdAt: string, group: NotificationGroup) => {
  const created = new Date(createdAt);
  if (group === "Today" || group === "Yesterday") {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
    }).format(created);
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(created);
};

const DashboardNotificationPanel = ({
  accessToken,
  unreadCount,
  onClose,
}: DashboardNotificationPanelProps) => {
  const [activeTab, setActiveTab] = useState<"all" | "read" | "unread">("all");
  const queryClient = useQueryClient();
  const notificationQuery = useQuery({
    queryKey: ["notifications", accessToken],
    queryFn: () => getMyNotifications(accessToken!, { limit: 100 }),
    enabled: Boolean(accessToken),
    staleTime: 30_000,
  });
  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => markNotificationAsRead(accessToken!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", accessToken] });
      queryClient.invalidateQueries({
        queryKey: ["notifications", "unread-count", accessToken],
      });
    },
  });
  const markAllAsReadMutation = useMutation({
    mutationFn: () => markAllNotificationsAsRead(accessToken!),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["notifications", accessToken] });
      queryClient.invalidateQueries({
        queryKey: ["notifications", "unread-count", accessToken],
      });
      toast.success(
        response.data.markedCount
          ? "All notifications marked as read."
          : "You have no unread notifications.",
      );
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Notifications could not be updated. Please try again.",
      );
    },
  });
  const visibleNotifications = useMemo(() => {
    const notifications = notificationQuery.data?.data ?? [];
    return notifications.filter(
      (notification) =>
        activeTab === "all" ||
        (activeTab === "read" ? notification.isRead : !notification.isRead),
    );
  }, [activeTab, notificationQuery.data?.data]);

  const markAsRead = (notification: DashboardNotification) => {
    if (!notification.isRead && !markAsReadMutation.isPending) {
      markAsReadMutation.mutate(notification.id);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/75" onClick={onClose}>
      <aside
        data-lenis-prevent
        className="absolute right-0 top-0 flex h-full w-full max-w-[547px] flex-col bg-white shadow-[-2px_0_3px_rgba(0,0,0,0.1)]"
        onClick={(event) => event.stopPropagation()}
        aria-label="Notifications"
      >
        <div className="px-6 pt-6">
          <div className="flex items-center justify-between gap-5">
            <h2 className="text-[32px] font-bold leading-[38px] text-[#0e1224]">
              Notifications
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close notifications"
              className="grid size-8 place-items-center rounded-md text-[#77839a] transition hover:bg-[#f3f6fa] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0073df]"
            >
              <X size={24} strokeWidth={1.6} />
            </button>
          </div>
          <div className="mt-6 flex items-center justify-between gap-4 border-b border-[#f1f4f9] text-base">
            <div className="flex gap-6">
              {(["all", "read", "unread"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`relative pb-2.5 capitalize transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0073df] ${activeTab === tab ? "border-b border-[#104170] text-[#104170]" : "text-[#a8a8a8] hover:text-[#475467]"}`}
                >
                  {tab}
                  {tab === "unread" && unreadCount > 0 && (
                    <span className="ml-1 inline-grid size-4 place-items-center rounded-full bg-[#c20000] text-[10px] text-white">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </button>
              ))}
            </div>
            {unreadCount > 0 ? (
              <button
                type="button"
                onClick={() => markAllAsReadMutation.mutate()}
                disabled={markAllAsReadMutation.isPending}
                className="mb-2.5 shrink-0 text-xs font-semibold text-[#087ce1] transition hover:text-[#005fb8] disabled:cursor-not-allowed disabled:text-[#aebdce]"
              >
                {markAllAsReadMutation.isPending ? "Updating..." : "Mark all read"}
              </button>
            ) : null}
          </div>
        </div>
        <div
          className="dashboard-summary-scroll min-h-0 flex-1 overflow-y-auto px-6 pb-7 pt-10"
          data-lenis-prevent
        >
          {!accessToken ? (
            <PanelMessage message="Sign in to view your notifications." />
          ) : notificationQuery.isLoading ? (
            <PanelMessage message="Loading notifications..." />
          ) : notificationQuery.isError ? (
            <PanelMessage
              message="Notifications could not be loaded."
              actionLabel="Try again"
              onAction={() => notificationQuery.refetch()}
            />
          ) : visibleNotifications.length === 0 ? (
            <PanelMessage message="No notifications in this view." />
          ) : (
            (["Today", "Yesterday", "Previous"] as const).map((group) => {
              const groupNotifications = visibleNotifications.filter(
                (notification) => getNotificationGroup(notification.createdAt) === group,
              );
              if (!groupNotifications.length) return null;

              return (
                <section key={group} className="mb-4 last:mb-0">
                  <h3 className="text-lg font-medium text-black">{group}</h3>
                  <div className="mt-6 space-y-4">
                    {groupNotifications.map((notification) => {
                      const { icon: Icon, iconClass } = notificationVisuals[notification.type];
                      const isUpdating =
                        markAsReadMutation.isPending &&
                        markAsReadMutation.variables === notification.id;

                      return (
                        <button
                          key={notification.id}
                          type="button"
                          onClick={() => markAsRead(notification)}
                          disabled={isUpdating}
                          className="flex w-full gap-4 border-b border-[#bfbfbf] pb-4 text-left disabled:cursor-wait"
                          aria-label={
                            notification.isRead
                              ? notification.title
                              : `Mark ${notification.title} as read`
                          }
                        >
                          <Icon
                            className={`mt-0.5 shrink-0 ${iconClass}`}
                            size={29}
                            strokeWidth={1.6}
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <h4 className="text-2xl font-medium leading-7 text-black">
                                {notification.title}
                              </h4>
                              <time className="shrink-0 pt-1 text-base text-[#7c7c7c]">
                                {formatNotificationTime(notification.createdAt, group)}
                              </time>
                            </div>
                            <p className="mt-1.5 text-base leading-5 text-[#7c7c7c]">
                              {notification.message}
                            </p>
                            {!notification.isRead ? (
                              <span className="mt-2 block text-xs font-semibold text-[#087ce1]">
                                Unread
                              </span>
                            ) : null}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </section>
              );
            })
          )}
        </div>
      </aside>
    </div>
  );
};

const PanelMessage = ({
  message,
  actionLabel,
  onAction,
}: {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}) => (
  <div className="py-12 text-center">
    <p className="text-sm text-[#667085]">{message}</p>
    {actionLabel && onAction ? (
      <button
        type="button"
        onClick={onAction}
        className="mt-3 text-sm font-semibold text-[#087ce1] hover:text-[#005fb8]"
      >
        {actionLabel}
      </button>
    ) : null}
  </div>
);

export default DashboardNotificationPanel;
