import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CircleX,
  CreditCard,
  ShieldCheck,
} from "lucide-react";

const reassurances = [
  "No payment was completed for this checkout.",
  "You can choose any active plan whenever you are ready.",
  "All memberships are month-to-month.",
];

const CancelContainer = () => {
  return (
    <main className="relative isolate min-h-[calc(100svh-260px)] overflow-hidden bg-[linear-gradient(180deg,#fffaf4_0%,#ffffff_58%)] px-4 pb-16 pt-32 sm:pb-20 sm:pt-36 lg:pt-32">
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-10 z-0 size-[420px] -translate-x-1/2 rounded-full bg-[#ffe8cb]/65 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-0 h-52 bg-[radial-gradient(circle_at_1px_1px,rgba(140,49,30,0.08)_1px,transparent_0)] [background-size:18px_18px]" />

      <section aria-labelledby="subscription-cancel-heading" className="relative z-10 mx-auto w-full max-w-2xl rounded-3xl border border-[#f0dfcb] bg-white p-6 text-center shadow-[0_22px_60px_rgba(104,70,32,0.1)] sm:p-10">
        <div className="mx-auto grid size-[76px] place-items-center rounded-full bg-[#fff0dc] text-[#b76819] ring-8 ring-[#fff9f1]">
          <CircleX aria-hidden="true" size={39} strokeWidth={2.5} />
        </div>

        <p className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-[#fff5e8] px-3 py-1.5 text-xs font-bold text-[#9a5713]">
          <CreditCard aria-hidden="true" size={15} /> Checkout cancelled
        </p>
        <h1 id="subscription-cancel-heading" className="mt-4 text-3xl font-bold tracking-[-0.04em] text-[#0f2c4f] sm:text-[42px]">
          Your checkout was cancelled
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-[#4c6175] sm:text-base">
          No worries—your payment was not completed, and your current membership has not changed. You can pick a plan whenever it works for you.
        </p>

        <div className="mt-8 rounded-2xl border border-[#f0e3d2] bg-[#fffaf5] p-4 text-left sm:p-5">
          <div className="flex items-center gap-2 text-[#9a5713]">
            <ShieldCheck aria-hidden="true" size={21} />
            <h2 className="font-bold">You&apos;re all set</h2>
          </div>
          <ul className="mt-4 space-y-3">
            {reassurances.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm leading-5 text-[#5f4a35]">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[#ffe9cc] text-[#b76819]">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/#pricing" className="inline-flex h-12 items-center justify-center gap-2 rounded-[9px] bg-[#104170] px-6 text-sm font-bold text-white transition hover:bg-[#0b3b65] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104170] focus-visible:ring-offset-2">
            Choose a plan <ArrowRight aria-hidden="true" size={18} />
          </Link>
          <Link href="/" className="inline-flex h-12 items-center justify-center gap-2 rounded-[9px] border border-[#b9ccdd] bg-white px-6 text-sm font-bold text-[#104170] transition hover:bg-[#f4f8ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104170] focus-visible:ring-offset-2">
            <ArrowLeft aria-hidden="true" size={18} /> Back to home
          </Link>
        </div>
      </section>
    </main>
  );
};

export default CancelContainer;
