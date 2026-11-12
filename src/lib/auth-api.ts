import { apiRequest, jsonRequest, type ApiEnvelope } from "@/lib/api";

export type ActiveSubscription = {
  id: string;
  subscribeId: string;
  title: string;
  planName: string;
  subTitle: string;
  price: number;
  discount: number;
  currency: string;
  status: string;
  startDate: string;
  endDate: string;
};

export type PublicUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  photo: string | null;
  role: string;
  verifiedEmail: boolean;
  leadTypes: string[];
  interestedStates: string[];
  interestedCities: string[];
  permissions?: string[];
  walletBalance?: number;
  activeSubscribe?: ActiveSubscription | null;
  activeSubscription?: ActiveSubscription | null;
  createdAt: string;
  updatedAt: string;
};

export type RegisterInput = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
};

export type ResetTokenResult = {
  message: string;
  resetToken: string;
};

export const registerUser = (input: RegisterInput) =>
  jsonRequest<PublicUser>("/auth", "POST", input);

export const verifyRegistrationOtp = (email: string, otp: string) =>
  jsonRequest<{ user: PublicUser; accessToken: string }>(
    "/auth/verify-registration-otp",
    "POST",
    { email, otp },
  );

export const resendRegistrationOtp = (email: string) =>
  jsonRequest<{ message: string }>("/auth/resend-registration-otp", "POST", {
    email,
  });

export const requestPasswordReset = (email: string) =>
  jsonRequest<{ message: string }>("/auth/forgot-password", "POST", { email });

export const verifyPasswordResetOtp = (email: string, otp: string) =>
  jsonRequest<ResetTokenResult>("/auth/verify-email-otp", "POST", {
    email,
    otp,
  });

export const resetPassword = (
  email: string,
  newPassword: string,
  resetToken: string,
) =>
  jsonRequest<{ message: string }>("/auth/reset-password", "POST", {
    email,
    newPassword,
    resetToken,
  });

export const changePassword = (
  accessToken: string,
  oldPassword: string,
  newPassword: string,
) =>
  jsonRequest<{ message: string }>(
    "/auth/change-password",
    "POST",
    { oldPassword, newPassword },
    accessToken,
  );

export const updateLeadInterests = (
  accessToken: string,
  payload: {
    leadTypes?: string[];
    interestedStates?: string[];
    interestedCities?: string[];
  },
) => jsonRequest<PublicUser>("/user/interests", "PATCH", payload, accessToken);

export type DeleteAccountResult = {
  message: string;
  deleted?: boolean;
  deactivated?: boolean;
};

export const deleteCurrentUserAccount = (
  accessToken: string,
  input: { password: string; reason?: string },
) =>
  jsonRequest<DeleteAccountResult>(
    "/user/account",
    "DELETE",
    input,
    accessToken,
  );

export const getCurrentUserProfile = (accessToken: string) =>
  apiRequest<PublicUser>("/user/profile", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

export type UpdateUserProfileInput = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  photo?: File | null;
};

export const updateCurrentUserProfile = (
  accessToken: string,
  { firstName, lastName, email, phoneNumber, photo }: UpdateUserProfileInput,
) => {
  const formData = new FormData();
  formData.append("firstName", firstName);
  formData.append("lastName", lastName);
  formData.append("email", email);
  formData.append("phoneNumber", phoneNumber);
  if (photo) formData.append("photo", photo);

  return apiRequest<PublicUser>("/user/profile", {
    method: "PATCH",
    headers: { Authorization: `Bearer ${accessToken}` },
    body: formData,
  });
};

export const logoutUser = () => apiRequest("/auth/logout", { method: "POST" });

export type SubscriptionPlan = {
  id: string;
  title: string;
  subTitle: string;
  price: number | string;
  discount: number;
  currency: string;
};

export type SubscriptionPaymentResult = {
  message: string;
  checkoutUrl: string | null;
  paymentId?: string;
  plan: Pick<SubscriptionPlan, "id" | "title" | "discount"> & {
    price?: number;
  };
};

export const getActivePlans = () => apiRequest<SubscriptionPlan[]>("/subscription/active");

export const createSubscriptionPayment = (
  accessToken: string,
  subscribeId: string,
) =>
  jsonRequest<SubscriptionPaymentResult>(
    "/subscription/payment",
    "POST",
    { subscribeId },
    accessToken,
  );

export type SubscriptionCheckoutSession = {
  status: string;
  plan: SubscriptionPlan;
};

export const getSubscriptionCheckoutSession = (
  accessToken: string,
  sessionId: string,
) =>
  apiRequest<SubscriptionCheckoutSession>(
    `/subscription/checkout-session/${encodeURIComponent(sessionId)}`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );

export type CurrentMembership = {
  planName: string;
  planTitle: string;
  planId: string | null;
  subTitle: string;
  discountPercentage: number;
  price: number;
  currency: string;
  status: string;
  startDate: string | null;
  endDate: string | null;
  nextBillingDate: string | null;
  canCancel: boolean;
  isCancelled: boolean;
  isFree: boolean;
  notice: string;
};

export const getMyMembership = (accessToken: string) =>
  apiRequest<CurrentMembership>("/subscription/my-membership", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

export type SubscriptionInvoice = {
  id: string;
  planName: string;
  subTitle: string;
  date: string;
  fullDate: string;
  amount: number;
  currency: string;
  status: string;
  receiptUrl: string | null;
  stripePaymentIntentId: string | null;
};

export type SubscriptionInvoicesMeta = {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
};

export type SubscriptionInvoicesResponse = Omit<
  ApiEnvelope<SubscriptionInvoice[]>,
  "meta"
> & {
  meta?: SubscriptionInvoicesMeta;
};

export const getMyInvoices = (
  accessToken: string,
  { page = 1, limit = 10, sortBy = "createdAt" }: {
    page?: number;
    limit?: number;
    sortBy?: string;
  } = {},
) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    sortBy,
  });

  return apiRequest<SubscriptionInvoice[]>(
    `/subscription/my-invoices?${params.toString()}`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  ) as Promise<SubscriptionInvoicesResponse>;
};

export type CancelMembershipResult = {
  message: string;
  data: {
    status: string;
    endDate: string;
    cancelledAt: string;
    planName: string;
  };
};

export const cancelMembership = (accessToken: string) =>
  apiRequest<CancelMembershipResult>("/subscription/cancel-membership", {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

export type AddFundsResult = {
  requestId: string;
  paymentId: string;
  status: "PENDING" | string;
  amount: number;
  currency: string;
  checkoutUrl: string | null;
};

export const addFunds = (accessToken: string, amount: number) =>
  jsonRequest<AddFundsResult>(
    "/wallet/add-funds",
    "POST",
    { amount },
    accessToken,
  );

export type ContactUsInput = {
  subject: string;
  message: string;
};

export type ContactTicket = {
  id: string;
  name: string;
  email: string;
  phoneNumber: string | null;
  subject: string;
  message: string;
  status: "PENDING" | "IN_PROGRESS" | "RESOLVED" | string;
  adminReply: string | null;
  resolvedAt: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export const submitContactMessage = (
  accessToken: string,
  input: ContactUsInput,
) => jsonRequest<ContactTicket>("/contact-us", "POST", input, accessToken);

export const getMyContactMessages = (accessToken: string) =>
  apiRequest<ContactTicket[]>("/contact-us/my", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

