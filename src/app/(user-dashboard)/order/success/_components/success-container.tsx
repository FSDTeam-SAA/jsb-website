import Link from "next/link";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  FileText,
  KeyRound,
  LayoutList,
  ShieldCheck,
} from "lucide-react";

const nextSteps = [
  {
    title: "Purchase confirmed",
    description: "Your payment was completed securely.",
    icon: CheckCircle2,
  },
  {
    title: "Leads unlocked",
    description: "Full lead details are ready in My Leads.",
    icon: KeyRound,
  },
  {
    title: "Receipt saved",
    description: "Your order record is available anytime.",
    icon: FileText,
  },
];

const SuccessContainer = () => {
  return (
    <main className="relative isolate grid min-h-screen place-items-center overflow-hidden bg-[linear-gradient(180deg,#f4faff_0%,#ffffff_68%)] px-4 py-10 sm:px-6 sm:py-14">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[-175px] size-[520px] -translate-x-1/2 rounded-full bg-[#cdeaff]/70 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_1px_1px,rgba(16,65,112,0.09)_1px,transparent_0)] [background-size:20px_20px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-180px] right-[-80px] size-[360px] rounded-full bg-[#dff7eb]/70 blur-3xl"
      />

      <section
        aria-labelledby="order-success-heading"
        className="relative z-10 w-full max-w-3xl overflow-hidden rounded-3xl border border-[#dceaf6] bg-white shadow-[0_24px_70px_rgba(16,65,112,0.14)]"
      >
        <div className="h-1.5 bg-[linear-gradient(90deg,#104170_0%,#087ce7_55%,#23b47e_100%)]" />
        <div className="p-6 text-center sm:p-10">
          <div className="mx-auto grid size-[82px] place-items-center rounded-full bg-[#dcf7ea] text-[#078654] ring-8 ring-[#f2fcf6]">
            <Check aria-hidden="true" size={42} strokeWidth={3} />
          </div>

          <p className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#edf7ff] px-3 py-1.5 text-xs font-bold text-[#104170]">
            <ShieldCheck aria-hidden="true" size={15} />
            Secure payment complete
          </p>
          <h1
            id="order-success-heading"
            className="mt-4 text-3xl font-bold tracking-[-0.045em] text-[#0f2c4f] sm:text-[44px]"
          >
            Your leads are ready
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#4c6175] sm:text-base">
            Thank you for your purchase. Your selected leads have been unlocked, and
            their full contact and property details are now available to you.
          </p>

          <div className="mt-8 grid gap-3 text-left sm:grid-cols-3">
            {nextSteps.map(({ title, description, icon: Icon }) => (
              <article
                key={title}
                className="rounded-2xl border border-[#e1edf7] bg-[#fbfdff] p-4"
              >
                <span className="grid size-9 place-items-center rounded-xl bg-[#e7f4ff] text-[#087ce7]">
                  <Icon aria-hidden="true" size={19} />
                </span>
                <h2 className="mt-3 text-sm font-bold text-[#173b5c]">{title}</h2>
                <p className="mt-1 text-xs leading-5 text-[#667085]">{description}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-[#d8efe3] bg-[#f5fcf8] px-4 py-3 text-left">
            <p className="flex items-start gap-2 text-sm leading-6 text-[#246443]">
              <CheckCircle2 aria-hidden="true" size={18} className="mt-0.5 shrink-0 text-[#10a44c]" />
              Your lead information is available immediately from the My Leads page.
              You can also review your payment and order details at any time.
            </p>
          </div>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/dashboard/my-leads"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#104170] px-6 text-sm font-bold text-white transition hover:bg-[#0b3b65] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104170] focus-visible:ring-offset-2"
            >
              View my leads <ArrowRight aria-hidden="true" size={18} />
            </Link>
            <Link
              href="/dashboard/my-orders"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[#b9ccdd] bg-white px-6 text-sm font-bold text-[#104170] transition hover:bg-[#f4f8ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104170] focus-visible:ring-offset-2"
            >
              <LayoutList aria-hidden="true" size={18} /> View order history
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SuccessContainer;
