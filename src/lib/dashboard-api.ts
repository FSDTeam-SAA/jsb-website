import { apiRequest } from "@/lib/api";

export type UserDashboardOverview = {
  overviewCards: {
    membership: {
      planId: string;
      planName: string;
      subTitle: string;
      price: number;
      discountPercentage: number;
      status: string;
      startDate: string;
      endDate: string;
      isFree: boolean;
    };
    leads: {
      totalPurchased: number;
    };
    accountBalance: {
      currentBalance: number;
      currency: string;
    };
  };
};

export const getUserDashboardOverview = (accessToken: string) =>
  apiRequest<UserDashboardOverview>("/dashboard/user-overview", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
