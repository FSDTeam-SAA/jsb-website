"use client";

import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";
import { changePassword } from "@/lib/auth-api";
import AccountPanelFrame, { fieldClass } from "./account-panel-frame";
import {
  PasswordErrorContainer,
  PasswordLoadingSkeleton,
  PasswordNotFoundContainer,
  PasswordSessionError,
} from "./password-panel-states";

type PasswordField = "oldPassword" | "newPassword" | "confirmPassword";

const fields: {
  id: PasswordField;
  label: string;
  placeholder: string;
  autoComplete: string;
}[] = [
  {
    id: "oldPassword",
    label: "Current Password",
    placeholder: "********",
    autoComplete: "current-password",
  },
  {
    id: "newPassword",
    label: "New Password",
    placeholder: "********",
    autoComplete: "new-password",
  },
  {
    id: "confirmPassword",
    label: "Confirm New Password",
    placeholder: "********",
    autoComplete: "new-password",
  },
];

const PasswordPanel = () => {
  const { data: session, status } = useSession();
  const accessToken = session?.user.accessToken;
  const [values, setValues] = useState<Record<PasswordField, string>>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [visibleField, setVisibleField] = useState<PasswordField | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const changePasswordMutation = useMutation({
    mutationFn: () =>
      changePassword(accessToken!, values.oldPassword, values.newPassword),
    onSuccess: (response) => {
      setValues({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setFormError(null);
      toast.success(response.message || "Password changed successfully.");
    },
    onError: (error) =>
      setFormError(
        error instanceof Error
          ? error.message
          : "We could not change your password. Please try again.",
      ),
  });

  const submitPasswordChange = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    if (values.newPassword.length < 8) {
      setFormError("Your new password must be at least 8 characters long.");
      return;
    }
    if (values.newPassword !== values.confirmPassword) {
      setFormError("New password and confirmation do not match.");
      return;
    }
    changePasswordMutation.mutate();
  };

  if (status === "loading") return <PasswordLoadingSkeleton />;
  if (status !== "authenticated" || !accessToken)
    return <PasswordSessionError />;
  if (!session.user.id) return <PasswordNotFoundContainer />;

  return (
    <AccountPanelFrame
      title="Change Password"
      footer={
        <button
          type="submit"
          form="change-password-form"
          disabled={changePasswordMutation.isPending}
          className="flex h-12 min-w-[180px] items-center justify-center gap-2 rounded-[6px] bg-[#0073df] px-4 text-base font-medium text-white transition hover:bg-[#0067c7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0073df] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {changePasswordMutation.isPending && (
            <Loader2 className="size-4 animate-spin" />
          )}
          {changePasswordMutation.isPending ? "Updating..." : "Update Password"}
        </button>
      }
    >
      <form
        id="change-password-form"
        onSubmit={submitPasswordChange}
        className="space-y-4"
        noValidate
      >
        {formError && (
          <PasswordErrorContainer
            message={formError}
            onDismiss={() => setFormError(null)}
          />
        )}
        <p className="rounded-lg bg-[#f5f7ff] p-3 text-sm leading-5 text-[#50657a]">
          Use at least 8 characters. Choose a password you do not use on other
          services.
        </p>
        {fields.map(({ id, label, placeholder, autoComplete }) => {
          const visible = visibleField === id;
          return (
            <label
              key={id}
              className="block text-base font-medium text-[#104170]"
            >
              <span>{label}</span>
              <span className="relative mt-2 block">
                <input
                  type={visible ? "text" : "password"}
                  placeholder={placeholder}
                  autoComplete={autoComplete}
                  value={values[id]}
                  onChange={(event) =>
                    setValues((current) => ({
                      ...current,
                      [id]: event.target.value,
                    }))
                  }
                  required
                  className={`${fieldClass} mt-0 pr-12 placeholder:text-[#98a2b3]`}
                />
                <button
                  type="button"
                  onClick={() => setVisibleField(visible ? null : id)}
                  aria-label={`${visible ? "Hide" : "Show"} ${label.toLowerCase()}`}
                  className="absolute right-3 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-md text-[#667085] transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0073df]"
                >
                  {visible ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </span>
            </label>
          );
        })}
      </form>
    </AccountPanelFrame>
  );
};

export default PasswordPanel;
