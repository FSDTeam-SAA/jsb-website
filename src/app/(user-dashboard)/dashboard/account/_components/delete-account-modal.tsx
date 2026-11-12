"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signOut, useSession } from "next-auth/react";
import { AlertTriangle, Eye, EyeOff, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { deleteCurrentUserAccount } from "@/lib/auth-api";

const DeleteAccountModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [reason, setReason] = useState("");
  const accessToken = session?.user.accessToken;

  const deleteAccountMutation = useMutation({
    mutationKey: ["user", "delete-account"],
    mutationFn: async () => {
      if (!accessToken) throw new Error("Your session has expired. Please sign in again.");
      return deleteCurrentUserAccount(accessToken, {
        password,
        ...(reason.trim() ? { reason: reason.trim() } : {}),
      });
    },
    onSuccess: async ({ data }) => {
      onClose();
      queryClient.clear();
      toast.success(data.message || "Your account has been deleted.");
      await signOut({ callbackUrl: "/" });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to delete your account. Please try again.",
      );
    },
  });

  useEffect(() => {
    if (!open && !deleteAccountMutation.isPending) {
      setPassword("");
      setIsPasswordVisible(false);
      setReason("");
    }
  }, [open, deleteAccountMutation.isPending]);

  const closeModal = () => {
    if (!deleteAccountMutation.isPending) onClose();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!password) {
      toast.error("Enter your current password to continue.");
      return;
    }
    deleteAccountMutation.mutate();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-[#141936]/45 p-4"
      onClick={closeModal}
    >
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-account-title"
        className="max-h-[calc(100dvh-2rem)] w-full max-w-[520px] overflow-y-auto rounded-[12px] bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <header className="flex items-center justify-between border-b border-[#e4eaf8] p-5">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-full bg-[#fff1f2] text-[#ef4444]">
              <AlertTriangle size={21} />
            </span>
            <h2
              id="delete-account-title"
              className="text-xl font-bold text-[#0e1224]"
            >
              Delete Account
            </h2>
          </div>
          <button
            type="button"
            disabled={deleteAccountMutation.isPending}
            onClick={closeModal}
            aria-label="Close dialog"
            className="rounded p-1 text-[#545454] hover:bg-[#f5f7ff] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={22} />
          </button>
        </header>
        <div className="p-5">
          <p className="text-base text-[#545454]">
            This action deletes or deactivates your account and signs you out. It cannot be undone.
          </p>
          <label className="mt-5 block text-base font-medium text-[#104170]">
            Current password <span className="text-[#ef4444]">*</span>
            <div className="relative mt-2">
              <input
                type={isPasswordVisible ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
                disabled={deleteAccountMutation.isPending}
                placeholder="Enter your current password"
                className="h-12 w-full rounded-[12px] border-0 bg-[#f5f7ff] px-4 pr-12 text-base text-[#505050] outline-none ring-[#0073df] placeholder:text-[#8b93a7] focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60"
              />
              <button
                type="button"
                disabled={deleteAccountMutation.isPending}
                onClick={() => setIsPasswordVisible((visible) => !visible)}
                aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-[#667085] transition-colors hover:bg-[#e4eaf8] hover:text-[#104170] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0073df] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPasswordVisible ? (
                  <EyeOff aria-hidden="true" size={19} />
                ) : (
                  <Eye aria-hidden="true" size={19} />
                )}
              </button>
            </div>
          </label>
          <label className="mt-5 block text-base font-medium text-[#104170]">
            Reason <span className="font-normal text-[#6b7280]">(optional)</span>
            <textarea
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              disabled={deleteAccountMutation.isPending}
              placeholder="Tell us why you want to delete your account..."
              className="mt-2 h-32 w-full resize-none rounded-[12px] border-0 bg-[#f5f7ff] p-4 text-base text-[#505050] outline-none ring-[#0073df] placeholder:text-[#8b93a7] focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </label>
        </div>
        <footer className="flex flex-col-reverse gap-3 border-t border-[#e4eaf8] p-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={deleteAccountMutation.isPending}
            onClick={closeModal}
            className="h-12 rounded-[6px] border border-[#d0d5dd] px-5 text-base font-medium text-[#344054] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={deleteAccountMutation.isPending}
            className="h-12 rounded-[6px] bg-[#ef4444] px-5 text-base font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleteAccountMutation.isPending ? "Deleting..." : "Delete Account"}
          </button>
        </footer>
      </form>
    </div>
  );
};

export default DeleteAccountModal;
