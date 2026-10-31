"use client";

import {
  useState,
  useRef,
  useEffect,
  type KeyboardEvent,
  type ClipboardEvent,
} from "react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  requestPasswordReset,
  resendRegistrationOtp,
  verifyPasswordResetOtp,
  verifyRegistrationOtp,
} from "@/lib/auth-api";

type OtpFlow = "registration" | "password-reset";

export default function OtpForm() {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const flow: OtpFlow =
    searchParams.get("flow") === "registration"
      ? "registration"
      : "password-reset";
  const router = useRouter();

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const verifyMutation = useMutation({
    mutationKey: ["auth", "verify-otp", flow],
    mutationFn: async ({ email, otp }: { email: string; otp: string }) => {
      if (flow === "registration") {
        await verifyRegistrationOtp(email, otp);
        return { resetToken: null };
      }

      const response = await verifyPasswordResetOtp(email, otp);
      return { resetToken: response.data.resetToken };
    },
    onSuccess: ({ resetToken }) => {
      if (flow === "registration") {
        toast.success("Email verified. Please log in to continue.");
        router.replace("/login?callbackUrl=/lead-interests");
        return;
      }

      if (!resetToken) {
        toast.error("Could not start password reset. Please request a new code.");
        return;
      }

      sessionStorage.setItem(`password-reset-token:${email}`, resetToken);
      toast.success("Code verified. Create a new password.");
      router.push(
        `/forgot-password/otp/reset-password?email=${encodeURIComponent(email)}`,
      );
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const resendMutation = useMutation({
    mutationKey: ["auth", "resend-otp", flow],
    mutationFn: (emailToResend: string) =>
      flow === "registration"
        ? resendRegistrationOtp(emailToResend)
        : requestPasswordReset(emailToResend),
    onSuccess: (data) => {
      setOtp(Array(6).fill(""));
      inputRefs.current[0]?.focus();
      toast.success(data.message || "A new code has been sent.");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const nextOtp = [...otp];
    nextOtp[index] = value.slice(0, 1);
    setOtp(nextOtp);

    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (event.key === "ArrowLeft" && index > 0) inputRefs.current[index - 1]?.focus();
    if (event.key === "ArrowRight" && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pastedData = event.clipboardData.getData("text/plain").trim();
    if (!/^\d{6}$/.test(pastedData)) return;

    setOtp(pastedData.split(""));
    inputRefs.current[5]?.focus();
  };

  const handleVerify = () => {
    const value = otp.join("");
    if (!email) return toast.error("Your email is missing. Please start again.");
    if (value.length !== 6) return toast.error("Please enter all 6 digits of the code.");
    verifyMutation.mutate({ email, otp: value });
  };

  const isRegistration = flow === "registration";
  const heading = isRegistration ? "Verify Your Email" : "Verify Reset Code";

  return (
    <div className="w-full max-w-[520px] bg-white">
      <div className="hidden w-full items-center justify-center pb-6">
        <Link href="/">
          <Image src="/assets/images/logo.png" alt="auth logo" width={500} height={500} className="h-[174px] w-[174px] object-contain" />
        </Link>
      </div>

      <h3 className="text-center text-2xl font-bold leading-[120%] text-[#131313] md:text-[32px] lg:text-[40px]">
        {heading}
      </h3>
      <p className="pb-6 pt-2 text-center text-base font-normal leading-[150%] text-[#787878] md:text-lg">
        We sent a 6-digit code to {email || "your email address"}.
      </p>

      <div className="flex w-full justify-center gap-[10px] md:gap-5 lg:gap-6">
        {otp.map((digit, index) => (
          <Input
            key={index}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(event) => handleChange(index, event.target.value)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            onPaste={index === 0 ? handlePaste : undefined}
            ref={(element) => {
              inputRefs.current[index] = element;
            }}
            className={`h-[56px] w-[54px] rounded-[8px] border bg-[#EAEAEA] text-center text-xl font-semibold leading-[120%] text-[#212121] md:h-[60px] md:w-[60px] lg:h-[64px] lg:w-[54px] ${digit ? "border-[#212121]" : "border-black"}`}
            aria-label={`OTP digit ${index + 1}`}
          />
        ))}
      </div>

      <div className="flex items-center justify-between pb-5 pt-5 text-center lg:pb-6 lg:pt-6">
        <span className="text-base font-medium leading-[120%] text-black">Didn&apos;t receive a code?</span>
        <button
          type="button"
          onClick={() => email && resendMutation.mutate(email)}
          disabled={!email || resendMutation.isPending}
          className="text-base font-medium leading-[120%] text-[#8C311E] hover:underline disabled:cursor-not-allowed disabled:opacity-60"
        >
          {resendMutation.isPending ? "Resending..." : "Resend code"}
        </button>
      </div>

      <button
        onClick={handleVerify}
        type="button"
        className="h-[52px] w-full rounded-[8px] bg-primary px-4 py-[15px] text-lg font-semibold leading-[120%] text-[#F4F4F4] disabled:cursor-not-allowed disabled:opacity-60"
        disabled={verifyMutation.isPending || !email}
      >
        {verifyMutation.isPending ? "Verifying..." : "Verify"}
      </button>
    </div>
  );
}
