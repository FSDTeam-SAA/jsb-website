import { CircleAlert, RefreshCw, UserSearch } from "lucide-react";
import Link from "next/link";
import AccountPanelFrame from "./account-panel-frame";

const Skeleton = ({ className }: { className: string }) => (
  <div
    aria-hidden="true"
    className={`animate-pulse rounded-lg bg-[#e8eff7] motion-reduce:animate-none ${className}`}
  />
);

export const ProfileLoadingSkeleton = () => (
  <AccountPanelFrame title="Profile">
    <div aria-busy="true" aria-live="polite" className="space-y-5">
      <span className="sr-only">Loading your profile</span>
      <div className="flex items-center gap-4 rounded-xl border border-[#e4eaf8] bg-[#f8fbff] p-4">
        <Skeleton className="size-16 shrink-0 rounded-full" />
        <div className="space-y-2.5"><Skeleton className="h-4 w-28" /><Skeleton className="h-3 w-52 max-w-[60vw]" /><Skeleton className="h-9 w-32" /></div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }, (_, index) => <div key={index} className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-[51px] w-full" /></div>)}
      </div>
    </div>
  </AccountPanelFrame>
);

export const ProfileErrorContainer = ({
  onRetry,
  isRetrying = false,
  actionLabel = "Try again",
  message = "We could not load your profile. Check your connection and try again.",
}: {
  onRetry: () => void;
  isRetrying?: boolean;
  actionLabel?: string;
  message?: string;
}) => (
  <AccountPanelFrame title="Profile">
    <div role="alert" className="flex min-h-[280px] flex-col items-center justify-center rounded-xl border border-[#fecaca] bg-[#fff7f7] px-5 py-8 text-center">
      <span className="grid size-12 place-items-center rounded-full bg-[#fee2e2] text-[#dc2626]"><CircleAlert size={24} /></span>
      <h3 className="mt-4 text-lg font-bold text-[#7f1d1d]">Unable to load profile</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-[#991b1b]">{message}</p>
      <button type="button" onClick={onRetry} disabled={isRetrying} className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#104170] px-4 text-sm font-semibold text-white transition hover:bg-[#0b355d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104170] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70">
        <RefreshCw className={`size-4 ${isRetrying ? "animate-spin" : ""}`} /> {isRetrying ? "Retrying..." : actionLabel}
      </button>
    </div>
  </AccountPanelFrame>
);

export const ProfileNotFoundContainer = () => (
  <AccountPanelFrame title="Profile">
    <div className="flex min-h-[280px] flex-col items-center justify-center rounded-xl border border-dashed border-[#bcd8f2] bg-[#f8fbff] px-5 py-8 text-center">
      <span className="grid size-12 place-items-center rounded-full bg-[#d1e4f6] text-[#104170]"><UserSearch size={24} /></span>
      <h3 className="mt-4 text-lg font-bold text-[#104170]">Profile not found</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-[#50657a]">Your account is signed in, but we could not find a profile record to display.</p>
      <Link href="/dashboard" className="mt-5 inline-flex h-10 items-center justify-center rounded-md border border-[#104170] bg-white px-4 text-sm font-semibold text-[#104170] transition hover:bg-[#edf6ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104170] focus-visible:ring-offset-2">Back to dashboard</Link>
    </div>
  </AccountPanelFrame>
);
