import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LogOut, ShieldCheck } from "lucide-react";

type LogoutModalProps = {
  isOpen: boolean;
  isPending?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const LogoutModal = ({
  isOpen,
  isPending = false,
  onClose,
  onConfirm,
}: LogoutModalProps) => {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !isPending) onClose();
      }}
    >
      <DialogContent
        showCloseButton={!isPending}
        className="max-w-[calc(100%-2rem)] rounded-[16px] border border-[#f0d7da] bg-white p-6 sm:max-w-[430px] sm:p-7"
      >
        <DialogHeader className="items-center text-center">
          <div className="grid size-14 place-items-center rounded-full bg-[#fff1f2] text-[#ed2532] ring-8 ring-[#fff8f8]">
            <LogOut aria-hidden="true" size={25} strokeWidth={2} />
          </div>
          <DialogTitle className="mt-4 text-center text-2xl font-bold leading-tight text-[#14263a]">
            Log out of your account?
          </DialogTitle>
          <DialogDescription className="max-w-[330px] text-center text-sm leading-6 text-[#5c6b7a]">
            You&apos;ll be signed out of Foreclosure Gold on this device. You can sign back in anytime.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 flex items-center justify-center gap-2 rounded-[8px] bg-[#f7fbff] px-3 py-2 text-xs text-[#426079]">
          <ShieldCheck aria-hidden="true" size={15} className="shrink-0 text-[#078654]" />
          Your account and saved information will remain secure.
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            disabled={isPending}
            onClick={onClose}
            className="h-11 rounded-[8px] border border-[#aebfce] bg-white px-4 text-sm font-bold text-[#104170] transition hover:bg-[#f4f8ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104170] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Stay signed in
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={onConfirm}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-[8px] bg-[#ed2532] px-4 text-sm font-bold text-white transition hover:bg-[#c91d29] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed2532] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogOut aria-hidden="true" size={17} />
            {isPending ? "Logging out..." : "Log out"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LogoutModal;
