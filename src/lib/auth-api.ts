import { apiRequest, jsonRequest } from "@/lib/api";

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

