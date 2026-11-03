import { apiRequest } from "@/lib/api";

export type WalletBalance = {
  walletBalance: number;
  currency: string;
  formattedBalance: string;
  balanceType: "ACCOUNT_CREDIT" | string;
};

export const getWalletBalance = (accessToken: string) =>
  apiRequest<WalletBalance>("/wallet/balance", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
