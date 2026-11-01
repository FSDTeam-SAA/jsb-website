import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  LayoutDashboard,
  ShieldCheck,
} from "lucide-react";

const nextSteps = [
  "Your membership selection is being activated.",
  "Your selected lead discount will apply to eligible purchases.",
  "You can manage your account anytime from the dashboard.",
];

const SuccessContainer = () => {
  return (
    <main className="relative isolate min-h-[calc(100svh-260px)] overflow-hidden bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_58%)] px-4 pb-16 pt-32 sm:pb-20 sm:pt-36 lg:pt-32">
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-10 z-0 size-[420px] -translate-x-1/2 rounded-full bg-[#d9ebfb]/70 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-0 h-52 bg-[radial-gradient(circle_at_1px_1px,rgba(16,65,112,0.1)_1px,transparent_0)] [background-size:18px_18px]" />

      <section aria-labelledby="subscription-success-heading" className="relative z-10 mx-auto w-full max-w-2xl rounded-3xl border border-[#dbe7f4] bg-white p-6 text-center shadow-[0_22px_60px_rgba(16,65,112,0.12)] sm:p-10">
        <div className="mx-auto grid size-[76px] place-items-center rounded-full bg-[#dcf7ea] text-[#078654] ring-8 ring-[#f1fcf6]">
          <Check aria-hidden="true" size={39} strokeWidth={3} />
        </div>

        <p className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-[#edf7ff] px-3 py-1.5 text-xs font-bold text-[#104170]">
          <ShieldCheck aria-hidden="true" size={15} /> Secure checkout complete
        </p>
        <h1 id="subscription-success-heading" className="mt-4 text-3xl font-bold tracking-[-0.04em] text-[#0f2c4f] sm:text-[42px]">
          Welcome to Foreclosure Gold!
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-[#4c6175] sm:text-base">
          Thank you for your membership selection. We&apos;re activating your account benefits now, and they&apos;ll be ready shortly.
        </p>

        <div className="mt-8 rounded-2xl border border-[#dceaf6] bg-[#f8fbff] p-4 text-left sm:p-5">
          <div className="flex items-center gap-2 text-[#104170]">
            <BadgeCheck aria-hidden="true" size={21} />
            <h2 className="font-bold">What happens next</h2>
          </div>
          <ul className="mt-4 space-y-3">
            {nextSteps.map((step) => (
              <li key={step} className="flex items-start gap-3 text-sm leading-5 text-[#324b63]">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[#dff5ea] text-[#078654]"><Check aria-hidden="true" size={13} strokeWidth={3} /></span>
                {step}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/dashboard" className="inline-flex h-12 items-center justify-center gap-2 rounded-[9px] bg-[#104170] px-6 text-sm font-bold text-white transition hover:bg-[#0b3b65] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104170] focus-visible:ring-offset-2">
            <LayoutDashboard aria-hidden="true" size={18} /> Go to dashboard
          </Link>
          <Link href="/dashboard/find-leads" className="inline-flex h-12 items-center justify-center gap-2 rounded-[9px] border border-[#b9ccdd] bg-white px-6 text-sm font-bold text-[#104170] transition hover:bg-[#f4f8ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104170] focus-visible:ring-offset-2">
            Explore leads <ArrowRight aria-hidden="true" size={18} />
          </Link>
        </div>

        <p className="mt-6 text-xs leading-5 text-[#687b8e]">If activation takes a moment, refresh your dashboard shortly. Your checkout reference is safely recorded with your payment provider.</p>
      </section>
    </main>
  );
};

export default SuccessContainer;
