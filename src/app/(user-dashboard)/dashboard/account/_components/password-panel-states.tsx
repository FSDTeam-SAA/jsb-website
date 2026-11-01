import { CircleAlert, KeyRound, RefreshCw } from "lucide-react";
import Link from "next/link";
import AccountPanelFrame from "./account-panel-frame";

const Skeleton = ({ className }: { className: string }) => (
  <div aria-hidden="true" className={`animate-pulse rounded-lg bg-[#e8eff7] motion-reduce:animate-none ${className}`} />
);

export const PasswordLoadingSkeleton = () => (
  <AccountPanelFrame title="Change Password">
    <div aria-busy="true" aria-live="polite" className="space-y-4">
      <span className="sr-only">Loading password settings</span>
      {Array.from({ length: 3 }, (_, index) => <div key={index} className="space-y-2"><Skeleton className="h-4 w-32" /><Skeleton className="h-[51px] w-full" /></div>)}
    </div>
  </AccountPanelFrame>
);

export const PasswordErrorContainer = ({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss?: () => void;
}) => (
  <div role="alert" className="mb-5 flex items-start gap-3 rounded-xl border border-[#fecaca] bg-[#fff7f7] p-4 text-[#991b1b]">
    <CircleAlert className="mt-0.5 size-5 shrink-0 text-[#dc2626]" />
    <div className="min-w-0 flex-1"><p className="font-semibold text-[#7f1d1d]">Password update failed</p><p className="mt-1 text-sm leading-5">{message}</p></div>
    {onDismiss && <button type="button" onClick={onDismiss} className="rounded-md px-2 py-1 text-sm font-medium text-[#991b1b] transition hover:bg-[#fee2e2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626]">Dismiss</button>}
  </div>
);

export const PasswordNotFoundContainer = () => (
  <AccountPanelFrame title="Change Password">
    <div className="flex min-h-[260px] flex-col items-center justify-center rounded-xl border border-dashed border-[#bcd8f2] bg-[#f8fbff] px-5 py-8 text-center">
      <span className="grid size-12 place-items-center rounded-full bg-[#d1e4f6] text-[#104170]"><KeyRound size={24} /></span>
      <h3 className="mt-4 text-lg font-bold text-[#104170]">Password settings unavailable</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-[#50657a]">We could not find an active account for this password change request.</p>
      <Link href="/dashboard" className="mt-5 inline-flex h-10 items-center justify-center rounded-md border border-[#104170] bg-white px-4 text-sm font-semibold text-[#104170] transition hover:bg-[#edf6ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104170] focus-visible:ring-offset-2">Back to dashboard</Link>
    </div>
  </AccountPanelFrame>
);

export const PasswordSessionError = () => (
  <AccountPanelFrame title="Change Password">
    <div role="alert" className="flex min-h-[260px] flex-col items-center justify-center rounded-xl border border-[#fecaca] bg-[#fff7f7] px-5 py-8 text-center">
      <span className="grid size-12 place-items-center rounded-full bg-[#fee2e2] text-[#dc2626]"><RefreshCw size={24} /></span>
      <h3 className="mt-4 text-lg font-bold text-[#7f1d1d]">Your session has expired</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-[#991b1b]">Sign in again before changing your password.</p>
      <Link href="/login" className="mt-5 inline-flex h-10 items-center justify-center rounded-md bg-[#104170] px-4 text-sm font-semibold text-white transition hover:bg-[#0b355d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104170] focus-visible:ring-offset-2">Go to login</Link>
    </div>
  </AccountPanelFrame>
);
