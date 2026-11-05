import { apiRequest, jsonRequest } from "@/lib/api";

export type NotificationType =
  | "ORDER"
  | "BAD_LEAD_REQUEST"
  | "SUPPORT_REPLY"
  | "SAVED_SEARCH_ALERT"
  | "WALLET_TRANSACTION"
  | "ACCOUNT_DELETION"
  | "SYSTEM";

export type DashboardNotification = {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  link: string | null;
  isRead: boolean;
  createdAt: string;
};

export type NotificationQuery = {
  page?: number;
  limit?: number;
  type?: NotificationType;
  searchTerm?: string;
};

export type UnreadNotificationCount = {
  unreadCount: number;
};

export const getMyNotifications = (
  accessToken: string,
  query: NotificationQuery = {},
) => {
  const searchParams = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined) searchParams.set(key, String(value));
  });
  const queryString = searchParams.toString();

  return apiRequest<DashboardNotification[]>(
    `/notification${queryString ? `?${queryString}` : ""}`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
};

export const getUnreadNotificationCount = (accessToken: string) =>
  apiRequest<UnreadNotificationCount>("/notification/unread-count", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

export const markNotificationAsRead = (accessToken: string, id: string) =>
  jsonRequest<DashboardNotification>(
    `/notification/${encodeURIComponent(id)}/read`,
    "PATCH",
    {},
    accessToken,
  );

export const markAllNotificationsAsRead = (accessToken: string) =>
  jsonRequest<{ markedCount: number }>(
    "/notification/read-all",
    "PATCH",
    {},
    accessToken,
  );
